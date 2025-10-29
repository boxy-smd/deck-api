"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _makeproject = require("../../../../../test/factories/make-project");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _searchpostsbytitle = require("./search-posts-by-title");
let projectsRepository;
let studentsRepository;
let trailsRepository;
let author;
let trail;
let project;
let sut;
describe('search posts by title use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, undefined, trailsRepository, undefined);
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        project = (0, _makeproject.makeProject)({
            title: 'Awesome project',
            authorId: author.id,
            trails: new Set([
                trail.id
            ])
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await projectsRepository.create(project);
        sut = new _searchpostsbytitle.SearchPostsByTitleUseCase(projectsRepository);
    });
    it('should be able to search posts by title', async ()=>{
        const result = await sut.execute({
            title: 'Awesome'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by title case insensitive', async ()=>{
        const result = await sut.execute({
            title: 'awesome'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by title with partial match', async ()=>{
        const result = await sut.execute({
            title: 'some'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should not return any post when title does not match', async ()=>{
        const result = await sut.execute({
            title: 'Not found'
        });
        expect(result).length(0);
    });
});

//# sourceMappingURL=search-posts-by-title.spec.js.map