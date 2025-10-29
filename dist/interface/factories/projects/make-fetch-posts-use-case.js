"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeFetchPostsUseCase", {
    enumerable: true,
    get: function() {
        return makeFetchPostsUseCase;
    }
});
const _fetchposts = require("../../../domain/projects/application/use-cases/fetch-posts");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeFetchPostsUseCase() {
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const fetchPostsUseCase = new _fetchposts.FetchPostsUseCase(projectsRepository);
    return fetchPostsUseCase;
}

//# sourceMappingURL=make-fetch-posts-use-case.js.map