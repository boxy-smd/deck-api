"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentPresenter", {
    enumerable: true,
    get: function() {
        return CommentPresenter;
    }
});
let CommentPresenter = class CommentPresenter {
    static toHTTP(comment) {
        return {
            id: comment.commentId.toString(),
            content: comment.content,
            created_at: comment.createdAt,
            updated_at: comment.updatedAt,
            project_id: comment.projectId.toString(),
            author: {
                id: comment.authorId.toString(),
                name: comment.authorName,
                username: comment.authorUsername,
                profile_url: comment.authorProfileUrl
            }
        };
    }
};

//# sourceMappingURL=comment.js.map