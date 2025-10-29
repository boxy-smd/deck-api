"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _projectsrepository = require("../../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../../infra/database/prisma/repositories/students-repository");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _trailsrepository = require("../../../../infra/database/prisma/repositories/trails-repository");
const _makeproject = require("../../../../../test/factories/make-project");
const _makeuser = require("../../../../../test/factories/make-user");
const _makesubject = require("../../../../../test/factories/make-subject");
const _maketrail = require("../../../../../test/factories/make-trail");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('get project (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to get a project', async ()=>{
        const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
        const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
        const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
        const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const author = await (0, _makeuser.makeUser)();
        const trail = (0, _maketrail.makeTrail)();
        const subject = (0, _makesubject.makeSubject)();
        const project = (0, _makeproject.makeProject)({
            authorId: author.id,
            subjectId: subject.id,
            trails: new Set([
                trail.id
            ])
        });
        await studentsRepository.create(author);
        await trailsRepository.create(trail);
        await subjectsRepository.create(subject);
        await projectsRepository.create(project);
        const result = await (0, _supertest.default)(_app.app.server).get(`/projects/${project.id.toString()}`);
        expect(result.status).toBe(200);
        expect(result.body.project).toMatchObject({
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            bannerUrl: project.bannerUrl,
            publishedYear: project.publishedYear,
            status: project.status,
            semester: project.semester,
            allowComments: project.allowComments,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            authorId: project.authorId.toString(),
            author: {
                name: author.name,
                username: author.username.value,
                profileUrl: author.profileUrl
            },
            subjectId: project.subjectId?.toString(),
            subject: subject.name,
            professors: [],
            comments: []
        });
        expect(result.body.project.trails).toContain(trail.name);
    });
});

//# sourceMappingURL=get.controller.e2e-spec.js.map