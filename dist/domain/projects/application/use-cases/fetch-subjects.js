"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FetchSubjectsUseCase", {
    enumerable: true,
    get: function() {
        return FetchSubjectsUseCase;
    }
});
let FetchSubjectsUseCase = class FetchSubjectsUseCase {
    async execute({ name }) {
        if (name) {
            return await this.subjectsRepository.findManyByName(name);
        }
        return await this.subjectsRepository.findAll();
    }
    constructor(subjectsRepository){
        this.subjectsRepository = subjectsRepository;
    }
};

//# sourceMappingURL=fetch-subjects.js.map