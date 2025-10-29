"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UsernameBadFormattedError", {
    enumerable: true,
    get: function() {
        return UsernameBadFormattedError;
    }
});
let UsernameBadFormattedError = class UsernameBadFormattedError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'Nome de usuário inválido.', statusCode = 400){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=username-bad-formatted.error.js.map