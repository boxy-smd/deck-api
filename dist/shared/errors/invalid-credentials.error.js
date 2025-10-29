"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "InvalidCredentialsError", {
    enumerable: true,
    get: function() {
        return InvalidCredentialsError;
    }
});
let InvalidCredentialsError = class InvalidCredentialsError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'Credenciais inválidas.', statusCode = 400){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=invalid-credentials.error.js.map