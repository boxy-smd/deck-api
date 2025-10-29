"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makePublishProjectUseCase", {
    enumerable: true,
    get: function() {
        return makePublishProjectUseCase;
    }
});
const _publishproject = require("../../../domain/projects/application/use-cases/publish-project");
const _professorsrepository = require("../../../infra/database/prisma/repositories/professors-repository");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
const _subjectsrepository = require("../../../infra/database/prisma/repositories/subjects-repository");
const _trailsrepository = require("../../../infra/database/prisma/repositories/trails-repository");
function makePublishProjectUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const professorsRepository = new _professorsrepository.PrismaProfessorsRepository();
    const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
    const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
    const publishProjectUseCase = new _publishproject.PublishProjectUseCase(projectsRepository, studentsRepository, subjectsRepository, trailsRepository, professorsRepository);
    return publishProjectUseCase;
}

//# sourceMappingURL=make-publish-project-use-case.js.map