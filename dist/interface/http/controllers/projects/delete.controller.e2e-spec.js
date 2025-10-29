"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _professorsrepository = require("../../../../infra/database/prisma/repositories/professors-repository");
const _projectsrepository = require("../../../../infra/database/prisma/repositories/projects-repository");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _createandauthenticatestudents = require("../../../../../test/e2e/create-and-authenticate-students");
const _makeprofessor = require("../../../../../test/factories/make-professor");
const _makeproject = require("../../../../../test/factories/make-project");
const _makesubject = require("../../../../../test/factories/make-subject");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('delete project (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to delete a project', async ()=>{
        const { studentId, token, trail } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        const professorsRepository = new _professorsrepository.PrismaProfessorsRepository();
        const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
        const professor = (0, _makeprofessor.makeProfessor)({
            name: 'Ticianne de Gois Ribeiro Darin'
        });
        const subject = (0, _makesubject.makeSubject)({
            name: 'Interação Humano-Computador I'
        });
        const project = (0, _makeproject.makeProject)({
            authorId: new _uniqueentityid.UniqueEntityID(studentId),
            subjectId: subject.id,
            trails: new Set([
                trail.id
            ])
        });
        await professorsRepository.create(professor);
        await subjectsRepository.create(subject);
        await projectsRepository.create(project);
        const response = await (0, _supertest.default)(_app.app.server).delete(`/projects/${project.id.toString()}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(204);
    });
});

//# sourceMappingURL=delete.controller.e2e-spec.js.map