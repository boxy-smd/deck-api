"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _studentprofile = require("../../enterprise/entities/student-profile");
const _user = require("../../enterprise/entities/user");
const _semester = require("../../enterprise/value-objects/semester");
const _editprofile = require("./edit-profile");
let usersRepository;
let trailsRepository;
let student;
let trail;
let sut;
describe('edit profile use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        const id = _uniqueentityid.UniqueEntityID.create();
        student = await (0, _makeuser.makeUser)({
            profile: _studentprofile.StudentProfile.create({
                semester: _semester.Semester.create(2).value
            }, id)
        }, id);
        trail = (0, _maketrail.makeTrail)();
        student.addTrailToProfile(trail.id);
        await trailsRepository.create(trail);
        await usersRepository.create(student);
        sut = new _editprofile.EditProfileUseCase(usersRepository, trailsRepository);
    });
    it('should be able to edit student profile', async ()=>{
        const result = await sut.execute({
            studentId: student.id.toString(),
            semester: 4
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(_user.User);
    });
    it('should be able to edit student trails', async ()=>{
        const newTrail = (0, _maketrail.makeTrail)({
            name: 'Design'
        });
        await trailsRepository.create(newTrail);
        const result = await sut.execute({
            studentId: student.id.toString(),
            trailsIds: [
                newTrail.id.toString()
            ]
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(_user.User);
    });
    it('should not be able to edit student profile if student does not exist', async ()=>{
        const result = await sut.execute({
            studentId: 'invalid-id',
            semester: 4
        });
        expect(result.isLeft()).toBe(true);
    });
    it('should not be able to edit student trails if trail does not exist', async ()=>{
        const result = await sut.execute({
            studentId: student.id.toString(),
            trailsIds: [
                'invalid-id'
            ]
        });
        expect(result.isLeft()).toBe(true);
    });
});

//# sourceMappingURL=edit-profile.spec.js.map