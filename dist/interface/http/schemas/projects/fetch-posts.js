"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetchPostsSchemas", {
    enumerable: true,
    get: function() {
        return fetchPostsSchemas;
    }
});
const _zod = require("zod");
const _commonschemas = require("../common.schemas");
const fetchPostsResponseSchema = _zod.z.object({
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
    description: 'Posts fetched successfully.'
});
const fetchPostsSchemas = {
    summary: 'Fetch posts',
    tags: [
        'Projects'
    ],
    response: {
        200: fetchPostsResponseSchema,
        400: _commonschemas.zodErrorSchema,
        404: _commonschemas.errorResponseSchema
    }
};

//# sourceMappingURL=fetch-posts.js.map