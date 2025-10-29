"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeSearchPostsByTagUseCase", {
    enumerable: true,
    get: function() {
        return makeSearchPostsByTagUseCase;
    }
});
const _searchpostsbytag = require("../../../domain/projects/application/use-cases/search-posts-by-tag");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeSearchPostsByTagUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const searchPostsByTagUseCase = new _searchpostsbytag.SearchPostsByTagUseCase(projectsRepository);
    return searchPostsByTagUseCase;
}

//# sourceMappingURL=make-search-posts-by-tag-use-case.js.map