"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _professorsrepository = require("../../../../infra/database/prisma/repositories/professors-repository");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _createandauthenticatestudents = require("../../../../../test/e2e/create-and-authenticate-students");
const _makeprofessor = require("../../../../../test/factories/make-professor");
const _makesubject = require("../../../../../test/factories/make-subject");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('publish project (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to publish a project', async ()=>{
        const { token, trail } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        const professorsRepository = new _professorsrepository.PrismaProfessorsRepository();
        const subjectsRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const professor = (0, _makeprofessor.makeProfessor)({
            name: 'Ticianne de Gois Ribeiro Darin'
        });
        const subject = (0, _makesubject.makeSubject)({
            name: 'Interação Humano-Computador I'
        });
        await professorsRepository.create(professor);
        await subjectsRepository.create(subject);
        const response = await (0, _supertest.default)(_app.app.server).post('/projects').set('Authorization', `Bearer ${token}`).send({
            title: 'Design de Interação',
            description: 'Projeto de Design de Interação',
            bannerUrl: 'https://example.com/banner.jpg',
            content: 'Conteúdo do projeto',
            publishedYear: 2021,
            semester: 3,
            allowComments: true,
            subjectId: subject.id.toString(),
            trailsIds: [
                trail.id.toString()
            ],
            professorsIds: [
                professor.id.toString()
            ]
        });
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            project_id: expect.any(String)
        });
    });
});

//# sourceMappingURL=publish.controller.e2e-spec.js.map