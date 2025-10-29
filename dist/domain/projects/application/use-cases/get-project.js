"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GetProjectUseCase", {
    enumerable: true,
    get: function() {
        return GetProjectUseCase;
    }
});
const _either = require("../../../../shared/either");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let GetProjectUseCase = class GetProjectUseCase {
    async execute({ projectId }) {
        const project = await this.projectsRepository.findById(projectId);
        if (!project) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Project not found.'));
        }
        return (0, _either.right)(project);
    }
    constructor(projectsRepository){
        this.projectsRepository = projectsRepository;
    }
};

//# sourceMappingURL=get-project.js.map