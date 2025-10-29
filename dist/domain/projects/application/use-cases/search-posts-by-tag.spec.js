"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _studentprofile = require("../../../authentication/enterprise/entities/student-profile");
const _semester = require("../../../authentication/enterprise/value-objects/semester");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _makeproject = require("../../../../../test/factories/make-project");
const _makesubject = require("../../../../../test/factories/make-subject");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _subjectsrepository = require("../../../../../test/repositories/subjects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _searchpostsbytag = require("./search-posts-by-tag");
let projectsRepository;
let studentsRepository;
let trailsRepository;
let subjectsRepository;
let author;
let trail;
let project;
let sut;
describe('search posts by tag use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        subjectsRepository = new _subjectsrepository.InMemorySubjectsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, subjectsRepository, trailsRepository, undefined);
        const id = _uniqueentityid.UniqueEntityID.create();
        author = await (0, _makeuser.makeUser)({
            profile: _studentprofile.StudentProfile.create({
                semester: _semester.Semester.create(1).value
            }, id)
        }, id);
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
        sut = new _searchpostsbytag.SearchPostsByTagUseCase(projectsRepository);
    });
    it('should be able to search posts by trail tag', async ()=>{
        const result = await sut.execute({
            tag: 'Design'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by subject tag', async ()=>{
        const result = await sut.execute({
            tag: 'Comunicação'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by year tag', async ()=>{
        const result = await sut.execute({
            tag: '2024'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by semester (digit) tag', async ()=>{
        const result = await sut.execute({
            tag: '3'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by semester (ordinal) tag', async ()=>{
        const result = await sut.execute({
            tag: '3º'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by semester (word) tag', async ()=>{
        const result = await sut.execute({
            tag: 'terceiro'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should not return any post when tag does not match', async ()=>{
        const result = await sut.execute({
            tag: 'Not found'
        });
        expect(result).length(0);
    });
});

//# sourceMappingURL=search-posts-by-tag.spec.js.map