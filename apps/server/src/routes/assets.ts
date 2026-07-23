import {
    type NextFunction,
    type Request,
    type Response,
    Router,
} from "express";

import multer, {
    MulterError,
} from "multer";

import type {
    AssetKind,
} from "@nexustable/shared";

import {
    AssetServiceToken,
} from "@nexustable/services";

import {
    services,
} from "../services";

const MAX_UPLOAD_SIZE_BYTES =
    25 * 1024 * 1024;

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        files: 1,
        fileSize: MAX_UPLOAD_SIZE_BYTES,
        fields: 10,
    },
});

export const assetsRouter =
    Router();

const assetService =
    services.resolve(
        AssetServiceToken,
    );

/**
 * Upload an asset using multipart/form-data.
 *
 * Fields:
 * file       required
 * kind       required
 * tags       optional comma-separated list
 * width      optional positive integer
 * height     optional positive integer
 * createdBy  optional user ID
 */
assetsRouter.post(
    "/",
    upload.single("file"),
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const file =
                req.file;

            if (!file) {
                res.status(400).json({
                    error: "file-required",
                    message:
                        "Provide a file using the multipart field named 'file'.",
                });

                return;
            }

            const kind =
                parseAssetKind(
                    req.body.kind,
                );

            if (!kind) {
                res.status(400).json({
                    error:
                        "invalid-asset-kind",
                    message:
                        "Kind must be map, token, portrait, handout, or other.",
                });

                return;
            }

            const width =
                parseOptionalPositiveInteger(
                    req.body.width,
                );

            if (
                req.body.width !==
                    undefined &&
                width === undefined
            ) {
                res.status(400).json({
                    error: "invalid-width",
                    message:
                        "Width must be a positive whole number.",
                });

                return;
            }

            const height =
                parseOptionalPositiveInteger(
                    req.body.height,
                );

            if (
                req.body.height !==
                    undefined &&
                height === undefined
            ) {
                res.status(400).json({
                    error: "invalid-height",
                    message:
                        "Height must be a positive whole number.",
                });

                return;
            }

            const asset =
                await assetService.upload({
                    name:
                        file.originalname,

                    kind,

                    mimeType:
                        file.mimetype,

                    sizeBytes:
                        file.size,

                    data:
                        new Uint8Array(
                            file.buffer,
                        ),

                    tags:
                        parseTags(
                            req.body.tags,
                        ),

                    width,
                    height,

                    createdBy:
                        parseOptionalString(
                            req.body.createdBy,
                        ),
                });

            res.status(201).json(
                asset,
            );
        } catch (error: unknown) {
            next(error);
        }
    },
);

/**
 * Return all asset metadata.
 */
assetsRouter.get(
    "/",
    async (
        _req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const assets =
                await assetService.getAll();

            res.json(assets);
        } catch (error: unknown) {
            next(error);
        }
    },
);

/**
 * Return one asset's binary content.
 */
assetsRouter.get(
    "/:id/content",
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const assetId =
                getRouteParameter(
                    req.params.id,
                );

            if (!assetId) {
                res.status(400).json({
                    error:
                        "invalid-asset-id",
                });

                return;
            }

            const asset =
                await assetService.getById(
                    assetId,
                );

            if (!asset) {
                res.status(404).json({
                    error:
                        "asset-not-found",
                });

                return;
            }

            const content =
                await assetService.getContent(
                    assetId,
                );

            if (!content) {
                res.status(404).json({
                    error:
                        "asset-content-not-found",
                });

                return;
            }

            res.setHeader(
                "Content-Type",
                asset.mimeType,
            );

            res.setHeader(
                "Content-Length",
                content.byteLength.toString(),
            );

            res.setHeader(
                "Content-Disposition",
                createContentDisposition(
                    asset.name,
                ),
            );

            res.send(
                Buffer.from(content),
            );
        } catch (error: unknown) {
            next(error);
        }
    },
);

/**
 * Return one asset's metadata.
 */
assetsRouter.get(
    "/:id",
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const assetId =
                getRouteParameter(
                    req.params.id,
                );

            if (!assetId) {
                res.status(400).json({
                    error:
                        "invalid-asset-id",
                });

                return;
            }

            const asset =
                await assetService.getById(
                    assetId,
                );

            if (!asset) {
                res.status(404).json({
                    error:
                        "asset-not-found",
                });

                return;
            }

            res.json(asset);
        } catch (error: unknown) {
            next(error);
        }
    },
);

/**
 * Delete an asset and its stored binary content.
 */
assetsRouter.delete(
    "/:id",
    async (
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> => {
        try {
            const assetId =
                getRouteParameter(
                    req.params.id,
                );

            if (!assetId) {
                res.status(400).json({
                    error:
                        "invalid-asset-id",
                });

                return;
            }

            const existing =
                await assetService.getById(
                    assetId,
                );

            if (!existing) {
                res.status(404).json({
                    error:
                        "asset-not-found",
                });

                return;
            }

            const deleted =
                await assetService.delete(
                    assetId,
                );

            if (!deleted) {
                res.status(500).json({
                    error:
                        "asset-delete-failed",
                });

                return;
            }

            res.status(204).send();
        } catch (error: unknown) {
            next(error);
        }
    },
);

/**
 * Convert Multer and asset errors into JSON responses.
 *
 * This middleware must remain after the routes.
 */
assetsRouter.use(
    (
        error: unknown,
        _req: Request,
        res: Response,
        next: NextFunction,
    ): void => {
        if (
            error instanceof
            MulterError
        ) {
            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {
                res.status(413).json({
                    error:
                        "file-too-large",
                    message:
                        "The maximum upload size is 25 MB.",
                });

                return;
            }

            res.status(400).json({
                error:
                    "multipart-upload-error",
                code: error.code,
                message: error.message,
            });

            return;
        }

        if (
            error instanceof Error
        ) {
            res.status(400).json({
                error:
                    "asset-request-failed",
                message:
                    error.message,
            });

            return;
        }

        next(error);
    },
);

function parseAssetKind(
    value: unknown,
): AssetKind | undefined {
    if (
        value === "map" ||
        value === "token" ||
        value === "portrait" ||
        value === "handout" ||
        value === "other"
    ) {
        return value;
    }

    return undefined;
}

function parseTags(
    value: unknown,
): readonly string[] {
    if (
        typeof value !== "string"
    ) {
        return [];
    }

    return value
        .split(",")
        .map(
            (tag) =>
                tag.trim(),
        )
        .filter(
            (tag) =>
                tag.length > 0,
        );
}

function parseOptionalString(
    value: unknown,
): string | undefined {
    if (
        typeof value !== "string"
    ) {
        return undefined;
    }

    const trimmed =
        value.trim();

    if (
        trimmed.length === 0
    ) {
        return undefined;
    }

    return trimmed;
}

function parseOptionalPositiveInteger(
    value: unknown,
): number | undefined {
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return undefined;
    }

    if (
        typeof value !== "string"
    ) {
        return undefined;
    }

    const parsed =
        Number(value);

    if (
        !Number.isSafeInteger(
            parsed,
        ) ||
        parsed <= 0
    ) {
        return undefined;
    }

    return parsed;
}

function getRouteParameter(
    value:
        | string
        | string[]
        | undefined,
): string | undefined {
    if (
        Array.isArray(value)
    ) {
        return value[0];
    }

    return value;
}

function createContentDisposition(
    filename: string,
): string {
    const safeFilename =
        filename.replace(
            /[\r\n"]/g,
            "_",
        );

    return `inline; filename="${safeFilename}"`;
}
