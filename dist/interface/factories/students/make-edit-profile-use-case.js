"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeEditProfileUseCase", {
    enumerable: true,
    get: function() {
        return makeEditProfileUseCase;
    }
});
const _editprofile = require("../../../domain/authentication/application/use-cases/edit-profile");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
const _trailsrepository = require("../../../infra/database/prisma/repositories/trails-repository");
function makeEditProfileUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
    const editProfileUseCase = new _editprofile.EditProfileUseCase(studentsRepository, trailsRepository);
    return editProfileUseCase;
}

//# sourceMappingURL=make-edit-profile-use-case.js.map