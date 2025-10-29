"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchProfessorsSchemas", {
    enumerable: true,
    get: function() {
        return fetchProfessorsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const fetchProfessorsQuerySchema = _zod.z.object({
    name: _zod.z.string({
        description: 'Professor name.',
        invalid_type_error: 'Professor name must be a string.'
    }).min(1, 'Name must have at least 1 character.').optional()
});
const fetchProfessorsResponseSchema = _zod.z.object({
    professors: _zod.z.array(_zod.z.object({
        id: _zod.z.string(),
        name: _zod.z.string()
    }))
}, {
    description: 'Professors fetched.'
});
const fetchProfessorsSchemas = {
    summary: 'Fetch  professors',
    tags: [
        'Professors'
    ],
    querystring: fetchProfessorsQuerySchema,
    response: {
        200: fetchProfessorsResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=fetch.schemas.js.map