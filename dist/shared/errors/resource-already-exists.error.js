"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ResourceAlreadyExistsError", {
    enumerable: true,
    get: function() {
        return ResourceAlreadyExistsError;
    }
});
let ResourceAlreadyExistsError = class ResourceAlreadyExistsError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'Recurso já existe.', statusCode = 409){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=resource-already-exists.error.js.map