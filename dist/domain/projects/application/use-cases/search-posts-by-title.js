"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchPostsByTitleUseCase", {
    enumerable: true,
    get: function() {
        return SearchPostsByTitleUseCase;
    }
});
let SearchPostsByTitleUseCase = class SearchPostsByTitleUseCase {
    async execute({ title }) {
        return await this.projectsRepository.findManyPostsByTitle(title);
    }
    constructor(projectsRepository){
        this.projectsRepository = projectsRepository;
    }
};

//# sourceMappingURL=search-posts-by-title.js.map