"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeproject = require("../../../../../test/factories/make-project");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _getdraft = require("./get-draft");
let projectsRepository;
let studentsRepository;
let student;
let draft;
let sut;
describe('get draft use case', ()=>{
    beforeEach(async ()=>{
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository();
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        student = await (0, _makeuser.makeUser)();
        draft = (0, _makeproject.makeProject)({
            title: 'Design de Interação',
            authorId: student.id
        });
        await studentsRepository.create(student);
        await projectsRepository.create(draft);
        sut = new _getdraft.GetDraftUseCase(projectsRepository, studentsRepository);
    });
    it('should be able to get a draft', async ()=>{
        const response = await sut.execute({
            draftId: draft.id.toString(),
            authorId: student.id.toString()
        });
        expect(response.isRight()).toBe(true);
        expect(response.value).toEqual(draft);
    });
    it('should not be able to get a draft without an author', async ()=>{
        const response = await sut.execute({
            draftId: draft.id.toString(),
            authorId: ''
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
    it('should not be able to get a draft with an invalid author', async ()=>{
        const response = await sut.execute({
            draftId: draft.id.toString(),
            authorId: 'invalid-author-id'
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to get a draft with an invalid draft id', async ()=>{
        const response = await sut.execute({
            draftId: 'invalid-draft-id',
            authorId: student.id.toString()
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to get a draft of another author', async ()=>{
        const anotherStudent = await (0, _makeuser.makeUser)();
        await studentsRepository.create(anotherStudent);
        const response = await sut.execute({
            draftId: draft.id.toString(),
            authorId: anotherStudent.id.toString()
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
});

//# sourceMappingURL=get-draft.spec.js.map