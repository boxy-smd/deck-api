"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getStudentDetailsSchemas", {
    enumerable: true,
    get: function() {
        return getStudentDetailsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const getStudentDetailsResponseSchema = _zod.z.object({
    details: _zod.z.object({
        id: _zod.z.string(),
        name: _zod.z.string(),
        username: _zod.z.string(),
        semester: _zod.z.number(),
        about: _zod.z.string().optional(),
        profileUrl: _zod.z.string().optional(),
        trails: _zod.z.array(_zod.z.string()),
        posts: _zod.z.array(_zod.z.object({
            id: _zod.z.string(),
            title: _zod.z.string(),
            description: _zod.z.string(),
            bannerUrl: _zod.z.string().optional(),
            content: _zod.z.string(),
            publishedYear: _zod.z.number(),
            semester: _zod.z.number(),
            createdAt: _zod.z.date(),
            updatedAt: _zod.z.date().optional(),
            subject: _zod.z.string().optional(),
            trails: _zod.z.array(_zod.z.string()),
            professors: _zod.z.array(_zod.z.string())
        }))
    })
}, {
    description: 'Student details get successfully.'
});
const getStudentDetailsSchemas = {
    summary: 'Get student details',
    tags: [
        'Students'
    ],
    response: {
        200: getStudentDetailsResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=get-student-details.schemas.js.map