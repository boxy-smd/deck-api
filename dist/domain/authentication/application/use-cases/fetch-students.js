"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FetchStudentsUseCase", {
    enumerable: true,
    get: function() {
        return FetchStudentsUseCase;
    }
});
let FetchStudentsUseCase = class FetchStudentsUseCase {
    async execute({ name }) {
        if (name) {
            return (await this.usersRepository.findManyByName(name)).filter((user)=>user.profile);
        }
        return (await this.usersRepository.findAll()).filter((user)=>user.profile);
    }
    constructor(usersRepository){
        this.usersRepository = usersRepository;
    }
};

//# sourceMappingURL=fetch-students.js.map