"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _professorsrepository = require("../../../../../test/repositories/professors-repository");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _createdraft = require("./create-draft");
let projectsRepository;
let usersRepository;
let subjectsRepository;
let trailsRepository;
let professorsRepository;
let author;
let trail;
let sut;
describe('create draft use case', ()=>{
    beforeEach(async ()=>{
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository();
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        professorsRepository = new _professorsrepository.InMemoryProfessorsRepository();
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        sut = new _createdraft.CreateDraftUseCase(projectsRepository, usersRepository, subjectsRepository, trailsRepository, professorsRepository);
    });
    it('should be able to create a draft', async ()=>{
        await usersRepository.create(author);
        await trailsRepository.create(trail);
        const result = await sut.execute({
            title: 'Título do rascunho',
            authorId: author.id.toString()
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toMatchObject({
            draftId: expect.any(String)
        });
    });
    it('should not be able to create a draft without a title', async ()=>{
        await usersRepository.create(author);
        const result = await sut.execute({
            title: '',
            authorId: author.id.toString()
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
    it('should not be able to create a draft with an invalid author', async ()=>{
        await trailsRepository.create(trail);
        const result = await sut.execute({
            title: 'Título do rascunho',
            authorId: 'invalid-author-id'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to create a draft with an invalid trail', async ()=>{
        await usersRepository.create(author);
        const result = await sut.execute({
            title: 'Título do rascunho',
            authorId: author.id.toString(),
            trailsIds: [
                'invalid-trail-id'
            ]
        });
        expect(result.isLeft()).toBe(true);
        expect(result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
});

//# sourceMappingURL=create-draft.spec.js.map