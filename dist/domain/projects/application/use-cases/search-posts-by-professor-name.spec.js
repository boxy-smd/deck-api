"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _studentprofile = require("../../../authentication/enterprise/entities/student-profile");
const _semester = require("../../../authentication/enterprise/value-objects/semester");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _makeprofessor = require("../../../../../test/factories/make-professor");
const _makeproject = require("../../../../../test/factories/make-project");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
const _professorsrepository = require("../../../../../test/repositories/professors-repository");
const _projectsrepository = require("../../../../../test/repositories/projects-repository");
const _trailsrepository = require("../../../../../test/repositories/trails-repository");
const _usersrepository = require("../../../../../test/repositories/users-repository");
const _searchpostsbyprofessorname = require("./search-posts-by-professor-name");
let projectsRepository;
let studentsRepository;
let trailsRepository;
let professorsRepository;
let author;
let trail;
let professor;
let project;
let sut;
describe('search posts by professor name use case', ()=>{
    beforeEach(async ()=>{
        studentsRepository = new _usersrepository.InMemoryUsersRepository();
        trailsRepository = new _trailsrepository.InMemoryTrailsRepository();
        professorsRepository = new _professorsrepository.InMemoryProfessorsRepository();
        projectsRepository = new _projectsrepository.InMemoryProjectsRepository(studentsRepository, undefined, trailsRepository, professorsRepository);
        const id = _uniqueentityid.UniqueEntityID.create();
        author = await (0, _makeuser.makeUser)({
            profile: _studentprofile.StudentProfile.create({
                semester: _semester.Semester.create(1).value
            }, id)
        }, id);
        trail = (0, _maketrail.makeTrail)();
        professor = (0, _makeprofessor.makeProfessor)({
            name: 'Dio Brando'
        });
        project = (0, _makeproject.makeProject)({
            title: 'Awesome project',
            authorId: author.id,
            trails: new Set([
                trail.id
            ]),
            professors: new Set([
                professor.id
            ])
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await professorsRepository.create(professor);
        await projectsRepository.create(project);
        sut = new _searchpostsbyprofessorname.SearchPostsByProfessorUseCase(projectsRepository);
    });
    it('should be able to search posts by professor name', async ()=>{
        const result = await sut.execute({
            name: 'Dio'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by professor name case insensitive', async ()=>{
        const result = await sut.execute({
            name: 'dio'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should be able to search posts by professor name with partial match', async ()=>{
        const result = await sut.execute({
            name: 'Di'
        });
        expect(result).length(1);
        expect(result[0].title).toBe(project.title);
    });
    it('should not return any post when professor name does not match', async ()=>{
        const result = await sut.execute({
            name: 'Not found'
        });
        expect(result).length(0);
    });
});

//# sourceMappingURL=search-posts-by-professor-name.spec.js.map