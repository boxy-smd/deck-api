"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeSearchPostsByProfessorNameUseCase", {
    enumerable: true,
    get: function() {
        return makeSearchPostsByProfessorNameUseCase;
    }
});
const _searchpostsbyprofessorname = require("../../../domain/projects/application/use-cases/search-posts-by-professor-name");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeSearchPostsByProfessorNameUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const searchPostsByProfessorNameUseCase = new _searchpostsbyprofessorname.SearchPostsByProfessorUseCase(projectsRepository);
    return searchPostsByProfessorNameUseCase;
}

//# sourceMappingURL=make-search-posts-by-professor-name-use-case.js.map