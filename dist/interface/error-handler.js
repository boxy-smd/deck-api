"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorHandler", {
    enumerable: true,
    get: function() {
        return errorHandler;
    }
});
const _fastifytypeproviderzod = require("fastify-type-provider-zod");
const errorHandler = (error, request, reply)=>{
    request.log.error(request);
    if (error.validation) {
        return reply.status(422).send(new Error('Validation failed.'));
    }
    if (error instanceof _fastifytypeproviderzod.ResponseValidationError) {
        return reply.status(400).send({
            message: 'Response validation failed.',
            details: error.details
        });
    }
    if (error instanceof Error) {
        return reply.status(400).send({
            message: error.message
        });
    }
    return reply.status(500).send({
        message: 'Internal server error!',
        error
    });
};

//# sourceMappingURL=error-handler.js.map