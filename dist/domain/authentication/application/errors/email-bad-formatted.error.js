"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EmailBadFormattedError", {
    enumerable: true,
    get: function() {
        return EmailBadFormattedError;
    }
});
let EmailBadFormattedError = class EmailBadFormattedError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'E-mail inválido.', statusCode = 400){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=email-bad-formatted.error.js.map