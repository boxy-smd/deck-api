"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SearchPostsByProfessorUseCase", {
    enumerable: true,
    get: function() {
        return SearchPostsByProfessorUseCase;
    }
});
let SearchPostsByProfessorUseCase = class SearchPostsByProfessorUseCase {
    async execute({ name }) {
        return await this.projectsRepository.findManyPostsByProfessorName(name);
    }
    constructor(projectsRepository){
        this.projectsRepository = projectsRepository;
    }
};

//# sourceMappingURL=search-posts-by-professor-name.js.map