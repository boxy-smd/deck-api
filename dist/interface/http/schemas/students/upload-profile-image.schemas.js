"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "uploadProfileImageSchemas", {
    enumerable: true,
    get: function() {
        return uploadProfileImageSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const uploadProfileImageParamsSchema = _zod.z.object({
    username: _zod.z.string({
        description: 'Student username.',
        required_error: 'Username is required.'
    }).min(3, 'Username must have at least 3 characters.')
});
const uploadProfileImageResponseSchema = _zod.z.object({
    message: _zod.z.string()
}, {
    description: 'Profile image uploaded successfully.'
});
const uploadProfileImageSchemas = {
    summary: 'Upload profile image',
    tags: [
        'Students'
    ],
    params: uploadProfileImageParamsSchema,
    response: {
        200: uploadProfileImageResponseSchema,
        400: _commonschemas.zodErrorSchema
    }
};

//# sourceMappingURL=upload-profile-image.schemas.js.map