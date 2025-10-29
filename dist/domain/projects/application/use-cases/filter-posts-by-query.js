"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FilterPostsByQueryUseCase", {
    enumerable: true,
    get: function() {
        return FilterPostsByQueryUseCase;
    }
});
let FilterPostsByQueryUseCase = class FilterPostsByQueryUseCase {
    async execute({ trailsIds, semester, subjectId, publishedYear }) {
        return await this.projectsRepository.findManyPostsByQuery({
            trailsIds,
            semester,
            subjectId,
            publishedYear
        });
    }
    constructor(projectsRepository){
        this.projectsRepository = projectsRepository;
    }
};

//# sourceMappingURL=filter-posts-by-query.js.map