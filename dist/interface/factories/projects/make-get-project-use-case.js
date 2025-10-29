"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeGetProjectUseCase", {
    enumerable: true,
    get: function() {
        return makeGetProjectUseCase;
    }
});
const _getproject = require("../../../domain/projects/application/use-cases/get-project");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeGetProjectUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const getProjectUseCase = new _getproject.GetProjectUseCase(projectsRepository);
    return getProjectUseCase;
}

//# sourceMappingURL=make-get-project-use-case.js.map