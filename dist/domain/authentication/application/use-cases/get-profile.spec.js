"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeuser = require("../../../../../test/factories/make-user");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _user = require("../../enterprise/entities/user");
const _getprofile = require("./get-profile");
let usersRepository;
let student;
let sut;
describe('get profile use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        student = await (0, _makeuser.makeUser)();
        sut = new _getprofile.GetProfileUseCase(usersRepository);
    });
    it('should be able to get a student profile', async ()=>{
        await usersRepository.create(student);
        const result = await sut.execute({
            username: student.username.value
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(_user.User);
    });
    it('should not be able to get a student with no id', async ()=>{
        const result = await sut.execute({
            username: ''
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to get a student with no student', async ()=>{
        const result = await sut.execute({
            username: 'invalid-id'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
});

//# sourceMappingURL=get-profile.spec.js.map