"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteCommentUseCase", {
    enumerable: true,
    get: function() {
        return DeleteCommentUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let DeleteCommentUseCase = class DeleteCommentUseCase {
    async execute({ authorId, projectId, commentId }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('Você deve estar logado para deletar um comentário.'));
        }
        const author = await this.usersRepository.findById(authorId);
        if (!author) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Autor não encontrado.'));
        }
        const comment = await this.commentsRepository.findById(commentId);
        if (!comment) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Comentário não encontrado.'));
        }
        if (comment.projectId.toString() !== projectId) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Comentário não encontrado neste projeto.'));
        }
        if (comment.authorId.toString() !== authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('Você não tem permissão para deletar este comentário.'));
        }
        await this.commentsRepository.delete(comment);
        return (0, _either.right)(undefined);
    }
    constructor(commentsRepository, usersRepository){
        this.commentsRepository = commentsRepository;
        this.usersRepository = usersRepository;
    }
};

//# sourceMappingURL=delete-comment.js.map