"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeGetProfileUseCase", {
    enumerable: true,
    get: function() {
        return makeGetProfileUseCase;
    }
});
const _getprofile = require("../../../domain/authentication/application/use-cases/get-profile");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeGetProfileUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const getProfileUseCase = new _getprofile.GetProfileUseCase(studentsRepository);
    return getProfileUseCase;
}

//# sourceMappingURL=make-get-profile-use-case.js.map