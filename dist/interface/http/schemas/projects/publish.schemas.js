"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "publishProjectSchemas", {
    enumerable: true,
    get: function() {
        return publishProjectSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const publishProjectBodySchema = _zod.z.object({
    title: _zod.z.string({
        description: 'Project title.',
        message: 'Title is required.'
    }).min(3, {
        message: 'Title must have at least 3 characters.'
    }),
    description: _zod.z.string({
        description: 'Project description.',
        message: 'Description is required.'
    }),
    bannerUrl: _zod.z.string({
        description: 'Project banner url.'
    }).url().optional(),
    content: _zod.z.string({
        description: 'Project content.'
    }).optional(),
    publishedYear: _zod.z.number({
        description: 'Project published year.',
        message: 'Published year is required.'
    }).min(2000).max(new Date().getFullYear()),
    semester: _zod.z.number({
        description: 'Project semester.',
        message: 'Semester is required.'
    }).min(1, {
        message: 'Semester must be between 1 and 12.'
    }).max(12, {
        message: 'Semester must be between 1 and 12.'
    }),
    allowComments: _zod.z.boolean({
        description: 'Project allow comments.'
    }),
    subjectId: _zod.z.string({
        description: 'Project subject id.'
    }).optional(),
    trailsIds: _zod.z.array(_zod.z.string({
        description: 'Project trails ids.',
        message: 'Trail id is required.'
    }).uuid('Invalid trail id.')),
    professorsIds: _zod.z.array(_zod.z.string({
        description: 'Project professors ids.'
    }).uuid('Invalid professor id.')).optional(),
    draftId: _zod.z.string({
        description: 'Project draft id.'
    }).uuid().optional()
}, {
    description: 'Project publish body.',
    required_error: 'Body is required.',
    invalid_type_error: 'Body must be an object.'
});
const publishProjectResponseSchema = _zod.z.object({
    project_id: _zod.z.string().uuid()
}, {
    description: 'Project published successfully.'
});
const publishProjectSchemas = {
    summary: 'Publish a project',
    tags: [
        'Projects'
    ],
    body: publishProjectBodySchema,
    response: {
        201: publishProjectResponseSchema,
        400: _commonschemas.zodErrorSchema,
        403: _commonschemas.errorResponseSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=publish.schemas.js.map