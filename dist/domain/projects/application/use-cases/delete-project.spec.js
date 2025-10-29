"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _makeproject = require("../../../../../test/factories/make-project");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _deleteproject = require("./delete-project");
let usersRepository;
let projectsRepository;
let trailsRepository;
let author;
let trail;
let project;
let sut;
describe('delete project use case', ()=>{
    beforeEach(async ()=>{
        usersRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository();
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        project = (0, _makeproject.makeProject)({
            authorId: author.id,
            trails: new Set([
                trail.id
            ])
        });
        await usersRepository.save(author);
        await projectsRepository.save(project);
        await trailsRepository.save(trail);
        sut = new _deleteproject.DeleteProjectUseCase(projectsRepository);
    });
    it('should be able to delete a project', async ()=>{
        const response = await sut.execute({
            studentId: author.id.toString(),
            projectId: project.id.toString()
        });
        expect(response.isRight()).toBe(true);
        expect(await projectsRepository.findById(project.id.toString())).toBe(null);
    });
    it('should not be able to delete a project that does not exist', async ()=>{
        const response = await sut.execute({
            studentId: author.id.toString(),
            projectId: 'invalid-id'
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_resourcenotfounderror.ResourceNotFoundError);
    });
    it('should not be able to delete a project that does not belong to the student', async ()=>{
        const otherAuthor = await (0, _makeuser.makeUser)();
        await usersRepository.save(otherAuthor);
        const response = await sut.execute({
            studentId: otherAuthor.id.toString(),
            projectId: project.id.toString()
        });
        expect(response.isLeft()).toBe(true);
        expect(response.value).toBeInstanceOf(_forbiddenerror.ForbiddenError);
    });
});

//# sourceMappingURL=delete-project.spec.js.map