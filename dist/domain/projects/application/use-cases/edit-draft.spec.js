"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeproject = require("../../../../../test/factories/make-project");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _professorsrepository = require("../../../../../test/repositories/professors-repository");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _editdraft = require("./edit-draft");
let projectsRepository;
let studentsRepository;
let subjectsRepository;
let trailsRepository;
let professorsRepository;
let author;
let trail;
let draft;
let sut;
describe('edit draft use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        professorsRepository = new _professorsrepository.InMemoryProfessorsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, subjectsRepository, trailsRepository, professorsRepository);
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        draft = (0, _makeproject.makeProject)({
            title: 'Draft Title',
            authorId: author.id
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await projectsRepository.create(draft);
        sut = new _editdraft.EditDraftUseCase(projectsRepository, studentsRepository, subjectsRepository, trailsRepository, professorsRepository);
    });
    it('should be able to edit a draft', async ()=>{
        const result = await sut.execute({
            authorId: author.id.toString(),
            draftId: draft.id.toString(),
            title: 'New Draft Title'
        });
        expect(result.isRight()).toBe(true);
        expect(result.isRight() && result.value.title).toBe('New Draft Title');
    });
    it('should not be able to edit a draft without being logged in', async ()=>{
        const result = await sut.execute({
            authorId: '',
            draftId: draft.id.toString(),
            title: 'New Draft Title'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.isLeft() && result.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
    it('should not be able to edit a draft that does not exist', async ()=>{
        const result = await sut.execute({
            authorId: author.id.toString(),
            draftId: 'invalid-id',
            title: 'New Draft Title'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.isLeft() && result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to edit a draft from another author', async ()=>{
        const anotherAuthor = await (0, _makeuser.makeUser)();
        await studentsRepository.create(anotherAuthor);
        const result = await sut.execute({
            authorId: anotherAuthor.id.toString(),
            draftId: draft.id.toString(),
            title: 'New Draft Title'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.isLeft() && result.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
});

//# sourceMappingURL=edit-draft.spec.js.map