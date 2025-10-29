"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _projectsrepository = require("../../../../infra/database/prisma/repositories/projects-repository");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _createandauthenticatestudents = require("../../../../../test/e2e/create-and-authenticate-students");
const _makeproject = require("../../../../../test/factories/make-project");
const _makesubject = require("../../../../../test/factories/make-subject");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('comment on project (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to comment on project', async ()=>{
        const { studentId, token, trail } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
        const subject = (0, _makesubject.makeSubject)();
        const project = (0, _makeproject.makeProject)({
            authorId: new _uniqueentityid.UniqueEntityID(studentId),
            subjectId: subject.id,
            trails: new Set([
                trail.id
            ])
        });
        await subjectsRepository.create(subject);
        await projectsRepository.create(project);
        const result = await (0, _supertest.default)(_app.app.server).post(`/projects/${project.id.toString()}/comments`).set('Authorization', `Bearer ${token}`).send({
            content: 'This is a comment.'
        });
        expect(result.status).toBe(201);
        expect(result.body).toEqual({
            comment_id: expect.any(String)
        });
    });
});

//# sourceMappingURL=comment-on-project.controller.e2e-spec.js.map