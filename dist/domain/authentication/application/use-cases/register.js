"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "RegisterUseCase", {
    enumerable: true,
    get: function() {
        return RegisterUseCase;
    }
});
const _either = require("../../../../shared/either");
const _resourcealreadyexistserror = require("../../../../shared/errors/resource-already-exists.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _user = require("../../enterprise/entities/user");
const _email = require("../../enterprise/value-objects/email");
const _userrole = require("../../enterprise/value-objects/user-role");
const _userstatus = require("../../enterprise/value-objects/user-status");
const _username = require("../../enterprise/value-objects/username");
const _emailbadformattederror = require("../errors/email-bad-formatted.error");
let RegisterUseCase = class RegisterUseCase {
    async execute(request) {
        const isUsernameTaken = await this.usersRepository.findByUsername(request.username);
        if (isUsernameTaken) {
            return (0, _either.left)(new _resourcealreadyexistserror.ResourceAlreadyExistsError('O nome de usuário já está em uso'));
        }
        const isEmailTaken = await this.usersRepository.findByEmail(request.email);
        if (isEmailTaken) {
            return (0, _either.left)(new _resourcealreadyexistserror.ResourceAlreadyExistsError('Este e-mail já está em uso'));
        }
        const passwordHash = await this.hasher.hash(request.password);
        let validatedEmail;
        try {
            validatedEmail = _email.Email.create(request.email);
        } catch (error) {
            if (error instanceof _emailbadformattederror.EmailBadFormattedError) {
                return (0, _either.left)(error);
            }
            return (0, _either.left)(new _emailbadformattederror.EmailBadFormattedError());
        }
        const validatedUsername = _username.Username.create(request.username);
        if (validatedUsername.isLeft()) {
            return (0, _either.left)(validatedUsername.value);
        }
        const username = validatedUsername.value;
        const user = _user.User.create({
            name: request.name,
            username,
            email: validatedEmail,
            passwordHash,
            about: request.about,
            profileUrl: request.profileUrl,
            role: _userrole.UserRole.STUDENT,
            status: _userstatus.UserStatus.ACTIVE
        });
        user.createProfile(request.semester);
        for (const trailId of request.trailsIds){
            const trail = await this.trailsRepository.findById(trailId);
            if (!trail) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Trilha não encontrada'));
            }
            user.addTrailToProfile(trail.id);
        }
        await this.usersRepository.create(user);
        return (0, _either.right)(user);
    }
    constructor(usersRepository, trailsRepository, hasher){
        this.usersRepository = usersRepository;
        this.trailsRepository = trailsRepository;
        this.hasher = hasher;
    }
};

//# sourceMappingURL=register.js.map