"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchStudentsSchemas", {
    enumerable: true,
    get: function() {
        return fetchStudentsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const fetchStudentsQuerySchema = _zod.z.object({
    name: _zod.z.string({
        description: 'Student name.'
    }).optional()
});
const fetchStudentsResponseSchema = _zod.z.object({
    students: _zod.z.array(_zod.z.object({
        id: _zod.z.string(),
        name: _zod.z.string(),
        username: _zod.z.string(),
        semester: _zod.z.number(),
        profileUrl: _zod.z.string().nullable(),
        trails: _zod.z.array(_zod.z.string())
    }))
}, {
    description: 'Students fetched successfully.'
});
const fetchStudentsSchemas = {
    summary: 'Fetch students',
    tags: [
        'Students'
    ],
    querystring: fetchStudentsQuerySchema,
    response: {
        200: fetchStudentsResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=fetch.schemas.js.map