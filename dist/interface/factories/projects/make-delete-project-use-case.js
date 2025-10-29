"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeDeleteProjectUseCase", {
    enumerable: true,
    get: function() {
        return makeDeleteProjectUseCase;
    }
});
const _deleteproject = require("../../../domain/projects/application/use-cases/delete-project");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeDeleteProjectUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const deleteProjectUseCase = new _deleteproject.DeleteProjectUseCase(projectsRepository);
    return deleteProjectUseCase;
}

//# sourceMappingURL=make-delete-project-use-case.js.map