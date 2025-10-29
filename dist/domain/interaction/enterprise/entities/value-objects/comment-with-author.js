"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentWithAuthor", {
    enumerable: true,
    get: function() {
        return CommentWithAuthor;
    }
});
let CommentWithAuthor = class CommentWithAuthor {
    static create(props) {
        return new CommentWithAuthor(props);
    }
    constructor(props){
        this.commentId = props.commentId;
        this.content = props.content;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.authorId = props.authorId;
        this.authorName = props.authorName;
        this.authorUsername = props.authorUsername;
        this.authorProfileUrl = props.authorProfileUrl;
        this.projectId = props.projectId;
    }
};

//# sourceMappingURL=comment-with-author.js.map