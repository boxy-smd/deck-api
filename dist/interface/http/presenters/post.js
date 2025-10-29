"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PostPresenter", {
    enumerable: true,
    get: function() {
        return PostPresenter;
    }
});
let PostPresenter = class PostPresenter {
    static toHTTP(post) {
        return {
            id: post.id.toString(),
            title: post.title,
            description: post.description,
            bannerUrl: post.bannerUrl,
            content: post.content,
            publishedYear: post.publishedYear,
            status: post.status,
            semester: post.semester,
            authorId: post.authorId.toString(),
            author: post.author,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            subjectId: post.subjectId?.toString(),
            subject: post.subject,
            trails: post.trails,
            professors: post.professors
        };
    }
};

//# sourceMappingURL=post.js.map