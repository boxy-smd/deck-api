"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeFetchStudentsUseCase", {
    enumerable: true,
    get: function() {
        return makeFetchStudentsUseCase;
    }
});
const _fetchstudents = require("../../../domain/authentication/application/use-cases/fetch-students");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeFetchStudentsUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const fetchStudentsUseCase = new _fetchstudents.FetchStudentsUseCase(studentsRepository);
    return fetchStudentsUseCase;
}

//# sourceMappingURL=make-fetch-students-use-case.js.map