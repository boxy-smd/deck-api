"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "uploadBannerSchemas", {
    enumerable: true,
    get: function() {
        return uploadBannerSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const uploadBannerParamsSchema = _zod.z.object({
    projectId: _zod.z.string({
        description: 'Project id.',
        required_error: 'Project id is required.'
    }).uuid('Invalid project id.')
});
const uploadBannerResponseSchema = _zod.z.object({
    message: _zod.z.string()
}, {
    description: 'Banner image uploaded successfully.'
});
const uploadBannerSchemas = {
    summary: 'Upload banner',
    tags: [
        'Projects'
    ],
    params: uploadBannerParamsSchema,
    response: {
        200: uploadBannerResponseSchema,
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=upload-banner.schemas.js.map