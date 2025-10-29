"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FetchTrailsUseCase", {
    enumerable: true,
    get: function() {
        return FetchTrailsUseCase;
    }
});
let FetchTrailsUseCase = class FetchTrailsUseCase {
    async execute() {
        return await this.trailsRepository.findAll();
    }
    constructor(trailsRepository){
        this.trailsRepository = trailsRepository;
    }
};

//# sourceMappingURL=fetch-trails.js.map