"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchSubjectsSchemas", {
    enumerable: true,
    get: function() {
        return fetchSubjectsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const fetchSubjectsQuerySchema = _zod.z.object({
    name: _zod.z.string({
        description: 'Subject name.',
        invalid_type_error: 'Subject name must be a string.'
    }).min(1, 'Name must have at least 1 character.').optional()
});
const fetchSubjectsResponseSchema = _zod.z.object({
    subjects: _zod.z.array(_zod.z.object({
        id: _zod.z.string(),
        name: _zod.z.string()
    }))
}, {
    description: 'Subjects fetched.'
});
const fetchSubjectsSchemas = {
    summary: 'Fetch subjects',
    tags: [
        'Subjects'
    ],
    querystring: fetchSubjectsQuerySchema,
    response: {
        200: fetchSubjectsResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=fetch.schemas.js.map