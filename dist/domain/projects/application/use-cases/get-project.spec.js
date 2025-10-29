"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _makeproject = require("../../../../../test/factories/make-project");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _project = require("../../enterprise/entities/project");
const _getproject = require("./get-project");
let studentsRepository;
let subjectsRepository;
let trailsRepository;
let projectsRepository;
let author;
let trail;
let project;
let sut;
describe('get project use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, subjectsRepository, trailsRepository);
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        project = (0, _makeproject.makeProject)({
            authorId: author.id,
            trails: new Set([
                trail.id
            ])
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        sut = new _getproject.GetProjectUseCase(projectsRepository);
    });
    it('should be able to get a project', async ()=>{
        await projectsRepository.create(project);
        const result = await sut.execute({
            projectId: project.id.toString()
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toBeInstanceOf(_project.Project);
    });
});

//# sourceMappingURL=get-project.spec.js.map