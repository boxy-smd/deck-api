"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "commentOnProjectSchemas", {
    enumerable: true,
    get: function() {
        return commentOnProjectSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const commentOnProjectParamsSchema = _zod.z.object({
    projectId: _zod.z.string({
        description: 'The project id',
        invalid_type_error: 'Project id must be a string',
        required_error: 'Project id is required'
    }).uuid('Invalid project id')
});
const commentOnProjectBodySchema = _zod.z.object({
    content: _zod.z.string({
        description: 'The comment content',
        required_error: 'Content is required'
    })
}, {
    description: 'Comment on project body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.'
});
const commentOnProjectResponseSchema = _zod.z.object({
    comment_id: _zod.z.string().uuid()
}, {
    description: 'Comment created successfully.'
});
const commentOnProjectSchemas = {
    summary: 'Comment on project',
    tags: [
        'Comments',
        'Projects'
    ],
    params: commentOnProjectParamsSchema,
    body: commentOnProjectBodySchema,
    response: {
        201: commentOnProjectResponseSchema,
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.errorResponseSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=comment-on-project.schemas.js.map