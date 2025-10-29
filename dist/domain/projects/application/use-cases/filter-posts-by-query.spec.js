"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _makeproject = require("../../../../../test/factories/make-project");
const _makesubject = require("../../../../../test/factories/make-subject");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _filterpostsbyquery = require("./filter-posts-by-query");
let projectsRepository;
let studentsRepository;
let subjectsRepository;
let trailsRepository;
let author;
let trail;
let project;
let sut;
describe('filter posts by query use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, subjectsRepository, trailsRepository, undefined);
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)({
            name: 'Design'
        });
        const subject = (0, _makesubject.makeSubject)({
            name: 'Comunicação Visual I'
        });
        project = (0, _makeproject.makeProject)({
            title: 'Awesome project',
            authorId: author.id,
            trails: new Set([
                trail.id
            ]),
            subjectId: subject.id,
            publishedYear: 2024,
            semester: 3
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await subjectsRepository.create(subject);
        await projectsRepository.create(project);
        sut = new _filterpostsbyquery.FilterPostsByQueryUseCase(projectsRepository);
    });
    it('should be able to filter posts by trails ids', async ()=>{
        const result = await sut.execute({
            trailsIds: [
                trail.id.toString()
            ]
        });
        expect(result).length(1);
        expect(result[0].id).toBe(project.id.toString());
    });
    it('should be able to filter posts by semester', async ()=>{
        const result = await sut.execute({
            semester: 3
        });
        expect(result).length(1);
        expect(result[0].id).toBe(project.id.toString());
    });
    it('should be able to filter posts by subject id', async ()=>{
        const result = await sut.execute({
            subjectId: project.subjectId?.toString()
        });
        expect(result).length(1);
        expect(result[0].id).toBe(project.id.toString());
    });
    it('should be able to filter posts by published year', async ()=>{
        const result = await sut.execute({
            publishedYear: 2024
        });
        expect(result).length(1);
        expect(result[0].id).toBe(project.id.toString());
    });
    it('should be able to filter posts by all queries', async ()=>{
        const result = await sut.execute({
            trailsIds: [
                trail.id.toString()
            ],
            semester: 3,
            subjectId: project.subjectId?.toString(),
            publishedYear: 2024
        });
        expect(result).length(1);
        expect(result[0].id).toBe(project.id.toString());
    });
    it('should return an empty array if no posts are found', async ()=>{
        const result = await sut.execute({
            trailsIds: [
                'invalid-id'
            ]
        });
        expect(result).length(0);
    });
});

//# sourceMappingURL=filter-posts-by-query.spec.js.map