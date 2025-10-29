"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeGetStudentDetailsUseCase", {
    enumerable: true,
    get: function() {
        return makeGetStudentDetailsUseCase;
    }
});
const _getprofile = require("../../../domain/authentication/application/use-cases/get-profile");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeGetStudentDetailsUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const getProfileUseCase = new _getprofile.GetProfileUseCase(studentsRepository);
    return getProfileUseCase;
}

//# sourceMappingURL=make-get-student-details-use-case.js.map