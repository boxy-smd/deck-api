"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "searchPostsSchemas", {
    enumerable: true,
    get: function() {
        return searchPostsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const searchPostsQuerySchema = _zod.z.object({
    professorName: _zod.z.string({
        description: 'Name of the professor to search posts.',
        invalid_type_error: 'Professor name must be a string.'
    }).min(1, 'Professor name must have at least 1 character.').optional(),
    tag: _zod.z.string({
        description: 'Tag to search posts.',
        invalid_type_error: 'Tag must be a string.'
    }).min(1, 'Tag must have at least 1 character.').optional(),
    title: _zod.z.string({
        description: 'Title to search posts.',
        invalid_type_error: 'Title must be a string.'
    }).min(1, 'Title must have at least 1 character.').optional()
}, {
    description: 'Query to search posts.'
});
const searchPostsResponseSchema = _zod.z.object({
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
    description: 'Posts searched successfully.'
});
const searchPostsSchemas = {
    summary: 'Fetch posts',
    tags: [
        'Projects'
    ],
    querystring: searchPostsQuerySchema,
    response: {
        200: searchPostsResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=search-posts.schemas.js.map