"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeSearchPostsByTitleUseCase", {
    enumerable: true,
    get: function() {
        return makeSearchPostsByTitleUseCase;
    }
});
const _searchpostsbytitle = require("../../../domain/projects/application/use-cases/search-posts-by-title");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeSearchPostsByTitleUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const searchPostsByTitleUseCase = new _searchpostsbytitle.SearchPostsByTitleUseCase(projectsRepository);
    return searchPostsByTitleUseCase;
}

//# sourceMappingURL=make-search-posts-by-title-use-case.js.map