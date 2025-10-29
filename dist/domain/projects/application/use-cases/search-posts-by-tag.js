"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchPostsByTagUseCase", {
    enumerable: true,
    get: function() {
        return SearchPostsByTagUseCase;
    }
});
let SearchPostsByTagUseCase = class SearchPostsByTagUseCase {
    async execute({ tag }) {
        return await this.projectsRepository.findManyPostsByTag(tag);
    }
    constructor(projectsRepository){
        this.projectsRepository = projectsRepository;
    }
};

//# sourceMappingURL=search-posts-by-tag.js.map