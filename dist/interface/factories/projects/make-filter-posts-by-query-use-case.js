"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeFilterPostsByQueryUseCase", {
    enumerable: true,
    get: function() {
        return makeFilterPostsByQueryUseCase;
    }
});
const _filterpostsbyquery = require("../../../domain/projects/application/use-cases/filter-posts-by-query");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeFilterPostsByQueryUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const filterPostsByQueryUseCase = new _filterpostsbyquery.FilterPostsByQueryUseCase(projectsRepository);
    return filterPostsByQueryUseCase;
}

//# sourceMappingURL=make-filter-posts-by-query-use-case.js.map