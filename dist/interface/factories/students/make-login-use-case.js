"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeLoginUseCase", {
    enumerable: true,
    get: function() {
        return makeLoginUseCase;
    }
});
const _login = require("../../../domain/authentication/application/use-cases/login");
const _bcrypthasher = require("../../../infra/cryptography/bcrypt-hasher");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeLoginUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const bcryptEncrypter = new _bcrypthasher.BcryptHasher();
    const loginUseCase = new _login.LoginUseCase(studentsRepository, bcryptEncrypter);
    return loginUseCase;
}

//# sourceMappingURL=make-login-use-case.js.map