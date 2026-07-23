export class AssetValidationError extends Error {
  constructor(
    message: string
  ) {
    super(message);

    this.name =
      "AssetValidationError";
  }
}