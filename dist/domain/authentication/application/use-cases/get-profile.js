"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GetProfileUseCase", {
    enumerable: true,
    get: function() {
        return GetProfileUseCase;
    }
});
const _either = require("../../../../shared/either");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let GetProfileUseCase = class GetProfileUseCase {
    async execute({ username }) {
        const profile = await this.usersRepository.findByUsername(username);
        if (!profile) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Student not found.'));
        }
        return (0, _either.right)(profile);
    }
    constructor(usersRepository){
        this.usersRepository = usersRepository;
    }
};

//# sourceMappingURL=get-profile.js.map