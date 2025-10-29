"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getProjectSchemas", {
    enumerable: true,
    get: function() {
        return getProjectSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const getProjectParamsSchema = _zod.z.object({
    projectId: _zod.z.string({
        description: 'Project id.',
        invalid_type_error: 'Project id must be a string.',
        required_error: 'Project id is required.'
    }).uuid('Invalid project id.')
}, {
    description: 'Project id.'
});
const getProjectResponseSchema = _zod.z.object({
    project: _zod.z.object({
        id: _zod.z.string(),
        title: _zod.z.string(),
        description: _zod.z.string(),
        bannerUrl: _zod.z.string().optional(),
        content: _zod.z.string().optional(),
        publishedYear: _zod.z.number(),
        status: _zod.z.enum([
            'DRAFT',
            'PUBLISHED'
        ]),
        semester: _zod.z.number(),
        allowComments: _zod.z.boolean(),
        authorId: _zod.z.string(),
        author: _zod.z.object({
            name: _zod.z.string(),
            username: _zod.z.string(),
            profileUrl: _zod.z.string().optional()
        }),
        createdAt: _zod.z.date(),
        updatedAt: _zod.z.date().optional(),
        subjectId: _zod.z.string().optional(),
        subject: _zod.z.string().optional(),
        trails: _zod.z.array(_zod.z.string()),
        professors: _zod.z.array(_zod.z.string()).optional(),
        comments: _zod.z.array(_zod.z.object({
            id: _zod.z.string(),
            content: _zod.z.string(),
            createdAt: _zod.z.date(),
            updatedAt: _zod.z.date().optional(),
            author: _zod.z.object({
                name: _zod.z.string(),
                username: _zod.z.string(),
                profileUrl: _zod.z.string().url().optional()
            }),
            authorId: _zod.z.string().uuid()
        }))
    })
}, {
    description: 'Project get successfully.'
});
const getProjectSchemas = {
    summary: 'Get a project',
    tags: [
        'Projects'
    ],
    params: getProjectParamsSchema,
    response: {
        200: getProjectResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=get.schemas.js.map