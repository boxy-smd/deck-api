"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "editProfileSchemas", {
    enumerable: true,
    get: function() {
        return editProfileSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const editProfileParamsSchema = _zod.z.object({
    studentId: _zod.z.string({
        description: 'Student id.',
        invalid_type_error: 'Student id must be a string.',
        message: 'Student id is required.'
    }).uuid('Invalid id.')
});
const editProfileBodySchema = _zod.z.object({
    about: _zod.z.string({
        description: 'Student about.',
        invalid_type_error: 'About must be a string.'
    }).optional(),
    semester: _zod.z.number({
        description: 'Student semester.',
        invalid_type_error: 'Semester must be a number.'
    }).optional(),
    profileUrl: _zod.z.string({
        description: 'Student profile url.',
        invalid_type_error: 'Profile url must be a string.'
    }).url('Invalid url.').optional(),
    trailsIds: _zod.z.array(_zod.z.string({
        description: 'Trail id.'
    })).optional()
}, {
    description: 'Student edit profile body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.'
});
const editProfileResponseSchema = _zod.z.object({
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
    description: 'Student profile updated successfully.'
});
const editProfileSchemas = {
    summary: 'Edit profile',
    tags: [
        'Students'
    ],
    body: editProfileBodySchema,
    params: editProfileParamsSchema,
    response: {
        200: editProfileResponseSchema,
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.errorResponseSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=edit-profile.schemas.js.map