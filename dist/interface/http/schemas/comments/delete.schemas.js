"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deleteCommentSchemas", {
    enumerable: true,
    get: function() {
        return deleteCommentSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const deleteCommentParamsSchemas = _zod.z.object({
    commentId: _zod.z.string({
        description: 'Comment id.',
        required_error: 'Comment id is required.',
        message: 'Invalid comment id.'
    }),
    projectId: _zod.z.string({
        description: 'Project id.',
        required_error: 'Project id is required.',
        message: 'Invalid project id.'
    })
});
const deleteCommentSchemas = {
    summary: 'Delete a comment',
    tags: [
        'Comments'
    ],
    params: deleteCommentParamsSchemas,
    response: {
        204: _zod.z.object({}),
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.errorResponseSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=delete.schemas.js.map