"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "deleteProjectSchemas", {
    enumerable: true,
    get: function() {
        return deleteProjectSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const deleteProjectParamsSchemas = _zod.z.object({
    projectId: _zod.z.string({
        description: 'Project id.',
        required_error: 'Project id is required.',
        message: 'Invalid project id.'
    })
});
const deleteProjectSchemas = {
    summary: 'Delete a project',
    tags: [
        'Projects'
    ],
    params: deleteProjectParamsSchemas,
    response: {
        204: _zod.z.object({}),
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.errorResponseSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=delete.schemas.js.map