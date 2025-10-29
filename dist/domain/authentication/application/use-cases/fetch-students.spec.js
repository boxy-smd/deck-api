"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _makeuser = require("../../../../../test/factories/make-user");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _studentprofile = require("../../enterprise/entities/student-profile");
const _semester = require("../../enterprise/value-objects/semester");
const _username = require("../../enterprise/value-objects/username");
const _fetchstudents = require("./fetch-students");
let usersRepository;
let student;
let sut;
describe('fetch students use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        const id = _uniqueentityid.UniqueEntityID.create();
        student = await (0, _makeuser.makeUser)({
            profile: _studentprofile.StudentProfile.create({
                semester: _semester.Semester.create(1).value
            }, id)
        }, id);
        sut = new _fetchstudents.FetchStudentsUseCase(usersRepository);
    });
    it('should be able to fetch students', async ()=>{
        await usersRepository.create(student);
        const result = await sut.execute({});
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
    });
    it('should be able to fetch students with name', async ()=>{
        const otherStudent = await (0, _makeuser.makeUser)({
            name: 'Other Student'
        });
        await usersRepository.create(otherStudent);
        await usersRepository.create(student);
        const result = await sut.execute({
            name: student.name
        });
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0].name).toEqual(student.name);
    });
    it('should be able to fetch students with username', async ()=>{
        const otherId = _uniqueentityid.UniqueEntityID.create();
        const otherStudent = await (0, _makeuser.makeUser)({
            username: _username.Username.create('other_student').value,
            profile: _studentprofile.StudentProfile.create({
                semester: _semester.Semester.create(2).value
            }, otherId)
        }, otherId);
        await usersRepository.create(otherStudent);
        await usersRepository.create(student);
        const result = await sut.execute({
            name: student.username.value
        });
        expect(result).toBeInstanceOf(Array);
        expect(result).toHaveLength(1);
        expect(result[0].username).toEqual(student.username);
    });
    it('should be able to fetch students with empty array', async ()=>{
        const result = await sut.execute({});
        expect(result).toEqual([]);
    });
});

//# sourceMappingURL=fetch-students.spec.js.map