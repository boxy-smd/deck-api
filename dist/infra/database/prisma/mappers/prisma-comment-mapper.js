"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaCommentMapper", {
    enumerable: true,
    get: function() {
        return PrismaCommentMapper;
    }
});
const _comment = require("../../../../domain/interaction/enterprise/entities/comment");
const _commentwithauthor = require("../../../../domain/interaction/enterprise/entities/value-objects/comment-with-author");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaCommentMapper = class PrismaCommentMapper {
    static toEntity(raw) {
        return _comment.Comment.create({
            content: raw.content,
            authorId: _uniqueentityid.UniqueEntityID.create(raw.authorId),
            projectId: _uniqueentityid.UniqueEntityID.create(raw.projectId)
        }, _uniqueentityid.UniqueEntityID.create(raw.id));
    }
    static toEntityWithAuthor(raw) {
        return _commentwithauthor.CommentWithAuthor.create({
            commentId: _uniqueentityid.UniqueEntityID.create(raw.id),
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            authorId: _uniqueentityid.UniqueEntityID.create(raw.authorId),
            authorName: raw.author.name,
            authorUsername: raw.author.username,
            authorProfileUrl: raw.author.profileUrl,
            projectId: _uniqueentityid.UniqueEntityID.create(raw.projectId)
        });
    }
    static toPrisma(comment) {
        return {
            id: comment.id.toString(),
            content: comment.content,
            authorId: comment.authorId.toString(),
            projectId: comment.projectId.toString()
        };
    }
};

//# sourceMappingURL=prisma-comment-mapper.js.map