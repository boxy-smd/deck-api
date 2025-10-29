"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "LoginUseCase", {
    enumerable: true,
    get: function() {
        return LoginUseCase;
    }
});
const _either = require("../../../../shared/either");
const _invalidcredentialserror = require("../../../../shared/errors/invalid-credentials.error");
let LoginUseCase = class LoginUseCase {
    async execute({ email, password }) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            return (0, _either.left)(new _invalidcredentialserror.InvalidCredentialsError());
        }
        const isPasswordValid = await this.hashComparer.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return (0, _either.left)(new _invalidcredentialserror.InvalidCredentialsError());
        }
        return (0, _either.right)({
            id: user.id.toString()
        });
    }
    constructor(usersRepository, hashComparer){
        this.usersRepository = usersRepository;
        this.hashComparer = hashComparer;
    }
};

//# sourceMappingURL=login.js.map