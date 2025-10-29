"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FetchPostsUseCase", {
    enumerable: true,
    get: function() {
        return FetchPostsUseCase;
    }
});
let FetchPostsUseCase = class FetchPostsUseCase {
    async execute() {
        return await this.projectsRepository.findAllPosts();
    }
    constructor(projectsRepository){
        this.projectsRepository = projectsRepository;
    }
};

//# sourceMappingURL=fetch-posts.js.map