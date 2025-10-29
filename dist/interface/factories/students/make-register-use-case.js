"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeRegisterUseCase", {
    enumerable: true,
    get: function() {
        return makeRegisterUseCase;
    }
});
const _register = require("../../../domain/authentication/application/use-cases/register");
const _bcrypthasher = require("../../../infra/cryptography/bcrypt-hasher");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
const _trailsrepository = require("../../../infra/database/prisma/repositories/trails-repository");
function makeRegisterUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
    const bcryptHasher = new _bcrypthasher.BcryptHasher();
    const registerUseCase = new _register.RegisterUseCase(studentsRepository, trailsRepository, bcryptHasher);
    return registerUseCase;
}

//# sourceMappingURL=make-register-use-case.js.map