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
const _fetchposts = require("./fetch-posts");
let projectsRepository;
let studentsRepository;
let subjectsRepository;
let trailsRepository;
let author;
let trail;
let project;
let sut;
describe('fetch posts use case', ()=>{
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
        await projectsRepository.create(project);
        sut = new _fetchposts.FetchPostsUseCase(projectsRepository);
    });
    it('should be able to fetch posts', async ()=>{
        const result = await sut.execute();
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
});

//# sourceMappingURL=fetch-posts.spec.js.map