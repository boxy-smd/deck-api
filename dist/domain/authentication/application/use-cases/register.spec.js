"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resourcealreadyexistserror = require("../../../../shared/errors/resource-already-exists.error");
const _fakehasher = require("../../../../../test/cryptography/fake-hasher");
const _makeuser = require("../../../../../test/factories/make-user");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _user = require("../../enterprise/entities/user");
const _register = require("./register");
let usersRepository;
let trailsRepository;
let hasher;
let user;
let sut;
describe('register use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        hasher = new _fakehasher.FakeHasher();
        user = await (0, _makeuser.makeUser)();
        sut = new _register.RegisterUseCase(usersRepository, trailsRepository, hasher);
    });
    it('should be able to register a user', async ()=>{
        const result = await sut.execute({
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@alu.ufc.br',
            password: '123456',
            semester: 1,
            trailsIds: []
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(_user.User);
    });
    it('should not be able to register a user with an existing email', async ()=>{
        await usersRepository.create(user);
        const result = await sut.execute({
            name: 'John Doe',
            username: 'johndoe',
            email: user.email.value,
            password: '123456',
            semester: 1,
            trailsIds: []
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcealreadyexistserror.ResourceAlreadyExistsError);
    });
    it('should not be able to register a user with an existing username', async ()=>{
        await usersRepository.create(user);
        const result = await sut.execute({
            name: 'John Doe',
            username: user.username.value,
            email: 'johndoe@alu.ufc.br',
            password: '123456',
            semester: 1,
            trailsIds: []
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcealreadyexistserror.ResourceAlreadyExistsError);
    });
});

//# sourceMappingURL=register.spec.js.map