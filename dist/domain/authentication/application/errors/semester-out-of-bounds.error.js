"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SemesterOutOfBoundsError", {
    enumerable: true,
    get: function() {
        return SemesterOutOfBoundsError;
    }
});
let SemesterOutOfBoundsError = class SemesterOutOfBoundsError extends Error {
    get message() {
        return this.props.message;
    }
    get statusCode() {
        return this.props.statusCode;
    }
    constructor(message = 'O semestre deve ser um número entre 1 e 12.', statusCode = 400){
        super(message);
        this.props = {
            message,
            statusCode
        };
    }
};

//# sourceMappingURL=semester-out-of-bounds.error.js.map