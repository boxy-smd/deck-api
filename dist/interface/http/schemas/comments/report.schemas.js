"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "reportCommentSchemas", {
    enumerable: true,
    get: function() {
        return reportCommentSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const reportCommentParamsSchema = _zod.z.object({
    commentId: _zod.z.string({
        description: 'The comment id.',
        invalid_type_error: 'Comment id must be a string.',
        required_error: 'Comment id is required.'
    }).uuid('Invalid comment id.')
});
const reportCommentBodySchema = _zod.z.object({
    content: _zod.z.string({
        description: 'The report content.',
        required_error: 'Content is required.'
    }),
    projectId: _zod.z.string({
        description: 'The project id.',
        required_error: 'Project id is required.'
    }).uuid('Invalid project id.')
}, {
    description: 'Report comment body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.'
});
const reportCommentResponseSchema = _zod.z.object({
    message: _zod.z.string()
}, {
    description: 'Comment reported successfully.'
});
const reportCommentSchemas = {
    summary: 'Report comment',
    tags: [
        'Comments',
        'Reports'
    ],
    params: reportCommentParamsSchema,
    body: reportCommentBodySchema,
    response: {
        201: reportCommentResponseSchema,
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.errorResponseSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=report.schemas.js.map