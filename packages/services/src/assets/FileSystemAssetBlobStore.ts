import {
    access,
    mkdir,
    readFile,
    rename,
    rm,
    writeFile,
} from "node:fs/promises";

import {
    dirname,
    join,
    resolve,
} from "node:path";

import type {
    AssetBlobStore,
} from "./AssetBlobStore.js";

export class FileSystemAssetBlobStore
implements AssetBlobStore {
    private readonly rootDirectory:
        string;

    constructor(
        rootDirectory: string,
    ) {
        if (
            rootDirectory.trim().length === 0
        ) {
            throw new Error(
                "Asset storage directory cannot be empty.",
            );
        }

        this.rootDirectory =
            resolve(rootDirectory);
    }

    async save(
        assetId: string,
        data: Uint8Array,
    ): Promise<void> {
        const filePath =
            this.getFilePath(assetId);

        const directory =
            dirname(filePath);

        await mkdir(directory, {
            recursive: true,
        });

        /*
         * Write to a temporary file first, then rename it.
         * This reduces the chance of leaving a partially
         * written asset if the process stops unexpectedly.
         */
        const temporaryPath =
            `${filePath}.${process.pid}.${Date.now()}.tmp`;

        try {
            await writeFile(
                temporaryPath,
                data,
            );

            await rename(
                temporaryPath,
                filePath,
            );
        } catch (error: unknown) {
            await rm(
                temporaryPath,
                {
                    force: true,
                },
            );

            throw error;
        }
    }

    async get(
        assetId: string,
    ): Promise<Uint8Array | undefined> {
        const filePath =
            this.getFilePath(assetId);

        try {
            const data =
                await readFile(filePath);

            /*
             * Return a separate Uint8Array so callers do not
             * retain a mutable reference to the Node Buffer.
             */
            return new Uint8Array(
                data,
            );
        } catch (error: unknown) {
            if (isFileNotFoundError(error)) {
                return undefined;
            }

            throw error;
        }
    }

    async has(
        assetId: string,
    ): Promise<boolean> {
        const filePath =
            this.getFilePath(assetId);

        try {
            await access(filePath);

            return true;
        } catch (error: unknown) {
            if (isFileNotFoundError(error)) {
                return false;
            }

            throw error;
        }
    }

    async delete(
        assetId: string,
    ): Promise<boolean> {
        const filePath =
            this.getFilePath(assetId);

        try {
            await rm(filePath);

            return true;
        } catch (error: unknown) {
            if (isFileNotFoundError(error)) {
                return false;
            }

            throw error;
        }
    }

    private getFilePath(
        assetId: string,
    ): string {
        const safeAssetId =
            validateAssetId(assetId);

        /*
         * Split files between subdirectories using the first
         * two characters of the asset ID.
         *
         * Example:
         * storage/assets/12/12345678-abcd...
         */
        const directoryPrefix =
            safeAssetId
                .slice(0, 2)
                .toLowerCase();

        return join(
            this.rootDirectory,
            directoryPrefix,
            safeAssetId,
        );
    }
}

function validateAssetId(
    assetId: string,
): string {
    const trimmed =
        assetId.trim();

    if (trimmed.length === 0) {
        throw new Error(
            "Asset ID cannot be empty.",
        );
    }

    /*
     * UUIDs and normal generated identifiers are supported.
     * Restricting the characters prevents directory traversal.
     */
    if (
        !/^[a-zA-Z0-9_-]+$/.test(
            trimmed,
        )
    ) {
        throw new Error(
            "Asset ID contains invalid characters.",
        );
    }

    return trimmed;
}

function isFileNotFoundError(
    error: unknown,
): boolean {
    return (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
    );
}