"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DeleteProjectUseCase", {
    enumerable: true,
    get: function() {
        return DeleteProjectUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let DeleteProjectUseCase = class DeleteProjectUseCase {
    async execute({ studentId, projectId }) {
        const project = await this.projectRepository.findById(projectId);
        if (!project) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Projeto não encontrado.'));
        }
        if (project.authorId.toString() !== studentId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('Você não tem permissão para deletar este projeto.'));
        }
        await this.projectRepository.delete(project);
        return (0, _either.right)(undefined);
    }
    constructor(projectRepository){
        this.projectRepository = projectRepository;
    }
};

//# sourceMappingURL=delete-project.js.map