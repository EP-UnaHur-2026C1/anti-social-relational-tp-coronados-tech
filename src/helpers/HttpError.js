class HttpError extends Error {
  constructor(status, messageKey, params = {}) {
    super(messageKey);
    this.name = "HttpError";
    this.status = status;
    this.messageKey = messageKey;
    this.params = params;
  }
}

module.exports = HttpError;
