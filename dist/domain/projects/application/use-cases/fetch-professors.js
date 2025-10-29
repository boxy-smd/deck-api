"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FetchProfessorsUseCase", {
    enumerable: true,
    get: function() {
        return FetchProfessorsUseCase;
    }
});
let FetchProfessorsUseCase = class FetchProfessorsUseCase {
    async execute({ name }) {
        if (name) {
            return await this.professorsRepository.findManyByName(name);
        }
        return await this.professorsRepository.findAll();
    }
    constructor(professorsRepository){
        this.professorsRepository = professorsRepository;
    }
};

//# sourceMappingURL=fetch-professors.js.map