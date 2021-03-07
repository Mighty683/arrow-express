/**
 * Error related to arrow-express configuration.
 */
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ConfigurationError.prototype);
  }
}