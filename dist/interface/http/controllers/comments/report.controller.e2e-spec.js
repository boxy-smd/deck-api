"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _commentsrepository = require("../../../../infra/database/prisma/repositories/comments-repository");
const _projectsrepository = require("../../../../infra/database/prisma/repositories/projects-repository");
const _reportsrepository = require("../../../../infra/database/prisma/repositories/reports-repository");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _createandauthenticatestudents = require("../../../../../test/e2e/create-and-authenticate-students");
const _makecomment = require("../../../../../test/factories/make-comment");
const _makeproject = require("../../../../../test/factories/make-project");
const _makesubject = require("../../../../../test/factories/make-subject");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('report comment (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to report a comment', async ()=>{
        const { studentId, token, trail } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
        const reportsRepository = new _reportsrepository.PrismaReportsRepository();
        const commentsRepository = new _commentsrepository.PrismaCommentsRepository(reportsRepository);
        const subject = (0, _makesubject.makeSubject)();
        const project = (0, _makeproject.makeProject)({
            authorId: new _uniqueentityid.UniqueEntityID(studentId),
            subjectId: subject.id,
            trails: new Set([
                trail.id
            ])
        });
        const comment = (0, _makecomment.makeComment)({
            authorId: new _uniqueentityid.UniqueEntityID(studentId),
            projectId: project.id
        });
        await subjectsRepository.create(subject);
        await projectsRepository.create(project);
        await commentsRepository.create(comment);
        const result = await (0, _supertest.default)(_app.app.server).post(`/reports/${comment.id.toString()}`).set('Authorization', `Bearer ${token}`).send({
            content: 'This comment is offensive',
            projectId: project.id.toString()
        });
        expect(result.status).toBe(201);
        expect(result.body).toEqual({
            message: 'Comment reported successfully.'
        });
    });
});

//# sourceMappingURL=report.controller.e2e-spec.js.map