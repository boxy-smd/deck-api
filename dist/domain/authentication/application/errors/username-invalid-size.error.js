"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsernameInvalidSizeError", {
    enumerable: true,
    get: function() {
        return UsernameInvalidSizeError;
    }
});
let UsernameInvalidSizeError = class UsernameInvalidSizeError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'Nome de usuário deve ter entre 3 e 20 caracteres.', statusCode = 400){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=username-invalid-size.error.js.map