"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeprofessor = require("../../../../../test/factories/make-professor");
const _makesubject = require("../../../../../test/factories/make-subject");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _professorsrepository = require("../../../../../test/repositories/professors-repository");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _publishproject = require("./publish-project");
let projectsRepository;
let studentsRepository;
let subjectsRepository;
let trailsRepository;
let professorsRepository;
let author;
let trail;
let sut;
describe('publish project use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        professorsRepository = new _professorsrepository.InMemoryProfessorsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, subjectsRepository, trailsRepository, professorsRepository);
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        sut = new _publishproject.PublishProjectUseCase(projectsRepository, studentsRepository, subjectsRepository, trailsRepository, professorsRepository);
    });
    it('should be able to publish a project', async ()=>{
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        const result = await sut.execute({
            title: 'Project Title',
            description: 'Project Description',
            bannerUrl: 'https://banner-url.com',
            publishedYear: 2021,
            semester: 1,
            allowComments: true,
            authorId: author.id.toString(),
            trailsIds: [
                trail.id.toString()
            ]
        });
        expect(result.isRight()).toBe(true);
        expect(result.isRight() && result.value).toMatchObject({
            projectId: expect.any(String)
        });
    });
    it('should be able to publish a project with a subject', async ()=>{
        const subject = (0, _makesubject.makeSubject)();
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await subjectsRepository.create(subject);
        const result = await sut.execute({
            title: 'Project Title',
            description: 'Project Description',
            bannerUrl: 'https://banner-url.com',
            publishedYear: 2021,
            semester: 1,
            allowComments: true,
            authorId: author.id.toString(),
            trailsIds: [
                trail.id.toString()
            ],
            subjectId: subject.id.toString()
        });
        expect(result.isRight()).toBe(true);
        expect(result.isRight() && result.value).toMatchObject({
            projectId: expect.any(String)
        });
    });
    it('should be able to publish a project with professors', async ()=>{
        const professor = (0, _makeprofessor.makeProfessor)();
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await professorsRepository.create(professor);
        const result = await sut.execute({
            title: 'Project Title',
            description: 'Project Description',
            bannerUrl: 'https://banner-url.com',
            publishedYear: 2021,
            semester: 1,
            allowComments: true,
            authorId: author.id.toString(),
            trailsIds: [
                trail.id.toString()
            ],
            professorsIds: [
                professor.id.toString()
            ]
        });
        expect(result.isRight()).toBe(true);
        expect(result.isRight() && result.value).toMatchObject({
            projectId: expect.any(String)
        });
    });
    it('should not be able to publish a project with a non-existing student', async ()=>{
        await trailsRepository.create(trail);
        const result = await sut.execute({
            title: 'Project Title',
            description: 'Project Description',
            bannerUrl: 'https://banner-url.com',
            publishedYear: 2021,
            semester: 1,
            allowComments: true,
            authorId: 'non-existing-student-id',
            trailsIds: [
                trail.id.toString()
            ]
        });
        expect(result.isLeft()).toBe(true);
        expect(result.isLeft() && result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to publish a project with a non-existing trail', async ()=>{
        await studentsRepository.create(author);
        const result = await sut.execute({
            title: 'Project Title',
            description: 'Project Description',
            bannerUrl: 'https://banner-url.com',
            publishedYear: 2021,
            semester: 1,
            allowComments: true,
            authorId: author.id.toString(),
            trailsIds: [
                'non-existing-trail-id'
            ]
        });
        expect(result.isLeft()).toBe(true);
        expect(result.isLeft() && result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to publish a project with a non-existing subject', async ()=>{
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        const result = await sut.execute({
            title: 'Project Title',
            description: 'Project Description',
            bannerUrl: 'https://banner-url.com',
            publishedYear: 2021,
            semester: 1,
            allowComments: true,
            authorId: author.id.toString(),
            trailsIds: [
                trail.id.toString()
            ],
            subjectId: 'non-existing-subject-id'
        });
        expect(result.isLeft()).toBe(true);
        expect(result.isLeft() && result.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
});

//# sourceMappingURL=publish-project.spec.js.map