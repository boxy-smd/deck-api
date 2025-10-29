"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResourceNotFoundError", {
    enumerable: true,
    get: function() {
        return ResourceNotFoundError;
    }
});
let ResourceNotFoundError = class ResourceNotFoundError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'Recurso não encontrado.', statusCode = 404){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=resource-not-found.error.js.map