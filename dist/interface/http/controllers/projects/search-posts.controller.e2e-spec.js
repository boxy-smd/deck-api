"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _projectstatus = require("../../../../domain/projects/enterprise/value-objects/project-status");
const _professorsrepository = require("../../../../infra/database/prisma/repositories/professors-repository");
const _projectsrepository = require("../../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../../infra/database/prisma/repositories/students-repository");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _trailsrepository = require("../../../../infra/database/prisma/repositories/trails-repository");
const _makeprofessor = require("../../../../../test/factories/make-professor");
const _makeproject = require("../../../../../test/factories/make-project");
const _makesubject = require("../../../../../test/factories/make-subject");
const _maketrail = require("../../../../../test/factories/make-trail");
const _makeuser = require("../../../../../test/factories/make-user");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let author;
let subject;
let trail;
let professor;
let project;
describe('search posts (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
        const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
        const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
        const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
        const professorsRepository = new _professorsrepository.PrismaProfessorsRepository();
        const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
        author = await (0, _makeuser.makeUser)();
        trail = (0, _maketrail.makeTrail)();
        subject = (0, _makesubject.makeSubject)();
        professor = (0, _makeprofessor.makeProfessor)();
        project = (0, _makeproject.makeProject)({
            status: _projectstatus.ProjectStatus.PUBLISHED,
            authorId: author.id,
            subjectId: subject.id,
            professors: new Set([
                professor.id
            ]),
            trails: new Set([
                trail.id
            ])
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await subjectsRepository.create(subject);
        await professorsRepository.create(professor);
        await projectsRepository.create(project);
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to search posts by title', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            title: project.title
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by professor name', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            professorName: professor.name
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by subject name', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            tag: subject.name.toLowerCase()
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by trail name', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            tag: trail.name.toLowerCase()
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by publish year', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            tag: project.publishedYear
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by semester (unit)', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            tag: project.semester
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by semester (ordinal)', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            tag: project.semester
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
    it('should be able to search posts by semester (word)', async ()=>{
        const result = await (0, _supertest.default)(_app.app.server).get('/projects/search').query({
            tag: 'primeiro'
        });
        expect(result.status).toBe(200);
        expect(result.body.posts).length(1);
    });
});

//# sourceMappingURL=search-posts.controller.e2e-spec.js.map