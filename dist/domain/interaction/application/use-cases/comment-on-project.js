"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CommentOnProjectUseCase", {
    enumerable: true,
    get: function() {
        return CommentOnProjectUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let CommentOnProjectUseCase = class CommentOnProjectUseCase {
    async execute({ authorId, projectId, content }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('Você deve estar logado para comentar em um projeto.'));
        }
        const author = await this.usersRepository.findById(authorId);
        if (!author) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Autor não encontrado.'));
        }
        const project = await this.projectsRepository.findById(projectId);
        if (!project) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Projeto não encontrado.'));
        }
        const comment = project.comment(content, new _uniqueentityid.UniqueEntityID(authorId));
        await this.commentsRepository.create(comment);
        return (0, _either.right)({
            commentId: comment.id.toString()
        });
    }
    constructor(projectsRepository, usersRepository, commentsRepository){
        this.projectsRepository = projectsRepository;
        this.usersRepository = usersRepository;
        this.commentsRepository = commentsRepository;
    }
};

//# sourceMappingURL=comment-on-project.js.map