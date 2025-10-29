"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "filterPostsSchemas", {
    enumerable: true,
    get: function() {
        return filterPostsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const filterPostsQuerySchema = _zod.z.object({
    trailsIds: _zod.z.string({
        description: 'Trail id to filter posts (comma-separated for multiple).',
        message: 'Invalid trail id.',
        invalid_type_error: 'Trail id must be a string.'
    }).optional(),
    semester: _zod.z.coerce.number({
        description: 'Semester to filter posts.',
        message: 'Invalid semester.',
        invalid_type_error: 'Semester must be a number.'
    }).optional(),
    subjectId: _zod.z.string({
        description: 'Subject id to filter posts.',
        message: 'Invalid subject id.',
        invalid_type_error: 'Subject id must be a string.'
    }).uuid('Invalid subject id.').optional(),
    publishedYear: _zod.z.coerce.number({
        description: 'Published year to filter posts.',
        message: 'Invalid published year.',
        invalid_type_error: 'Published year must be a number.'
    }).optional()
}, {
    description: 'Query to filter posts.'
});
const filterPostsResponseSchema = _zod.z.object({
    posts: _zod.z.array(_zod.z.object({
        id: _zod.z.string().uuid(),
        title: _zod.z.string(),
        description: _zod.z.string(),
        bannerUrl: _zod.z.string().optional(),
        content: _zod.z.string().optional(),
        publishedYear: _zod.z.number(),
        status: _zod.z.enum([
            'DRAFT',
            'PUBLISHED',
            'ARCHIVED'
        ]),
        semester: _zod.z.number(),
        createdAt: _zod.z.date(),
        updatedAt: _zod.z.date().optional(),
        authorId: _zod.z.string(),
        author: _zod.z.object({
            name: _zod.z.string(),
            username: _zod.z.string(),
            profileUrl: _zod.z.string().optional()
        }),
        subjectId: _zod.z.string().uuid().optional(),
        subject: _zod.z.object({
            name: _zod.z.string()
        }).optional(),
        trails: _zod.z.array(_zod.z.object({
            name: _zod.z.string()
        })),
        professors: _zod.z.array(_zod.z.object({
            name: _zod.z.string()
        })).optional()
    })).optional()
}, {
    description: 'Posts filtered successfully.'
});
const filterPostsSchemas = {
    summary: 'Filter posts',
    tags: [
        'Projects'
    ],
    querystring: filterPostsQuerySchema,
    response: {
        200: filterPostsResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=filter-posts.schemas.js.map