"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _invalidcredentialserror = require("../../../../shared/errors/invalid-credentials.error");
const _fakehasher = require("../../../../../test/cryptography/fake-hasher");
const _makeuser = require("../../../../../test/factories/make-user");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _login = require("./login");
let usersRepository;
let hasher;
let user;
let sut;
describe('login use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        hasher = new _fakehasher.FakeHasher();
        user = await (0, _makeuser.makeUser)();
        await usersRepository.create(user);
        sut = new _login.LoginUseCase(usersRepository, hasher);
    });
    it('should be able to login a user', async ()=>{
        const result = await sut.execute({
            email: user.email.value,
            password: '123456'
        });
        expect(result.isRight()).toBe(true);
        expect(result.isRight() && result.value).toMatchObject({
            id: user.id.toString()
        });
    });
    it('should not be able to login an unregistered user', async ()=>{
        const result = await sut.execute({
            email: 'janedoe@alu.ufc.br',
            password: '123456'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_invalidcredentialserror.InvalidCredentialsError);
    });
    it('should not be able to login a user with wrong password', async ()=>{
        await usersRepository.create(user);
        const result = await sut.execute({
            email: user.email.value,
            password: '654321'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_invalidcredentialserror.InvalidCredentialsError);
    });
});

//# sourceMappingURL=login.spec.js.map