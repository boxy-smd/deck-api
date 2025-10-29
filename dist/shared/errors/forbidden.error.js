"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ForbiddenError", {
    enumerable: true,
    get: function() {
        return ForbiddenError;
    }
});
let ForbiddenError = class ForbiddenError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'Ação proibida.', statusCode = 403){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=forbidden.error.js.map