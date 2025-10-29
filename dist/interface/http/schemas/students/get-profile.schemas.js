"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getProfileSchemas", {
    enumerable: true,
    get: function() {
        return getProfileSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const getProfileParamsSchema = _zod.z.object({
    username: _zod.z.string({
        description: 'Student username.',
        invalid_type_error: 'Student username must be a string.',
        required_error: 'Student username is required.'
    })
});
const getProfileResponseSchema = _zod.z.object({
    profile: _zod.z.object({
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
            updatedAt: _zod.z.date(),
            subject: _zod.z.string().optional(),
            trails: _zod.z.array(_zod.z.string()),
            professors: _zod.z.array(_zod.z.string())
        }))
    })
}, {
    description: 'Student profile get successfully.'
});
const getProfileSchemas = {
    summary: 'Get profile',
    tags: [
        'Students'
    ],
    params: getProfileParamsSchema,
    response: {
        200: getProfileResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=get-profile.schemas.js.map