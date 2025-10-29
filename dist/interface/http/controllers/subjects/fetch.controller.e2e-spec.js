"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _subjectsrepository = require("../../../../infra/database/prisma/repositories/subjects-repository");
const _makesubject = require("../../../../../test/factories/make-subject");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('fetch subjects controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to fetch subjects', async ()=>{
        const subjectRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const ihc = (0, _makesubject.makeSubject)({
            code: 'SMD0108',
            name: 'Interação Humano-Computador I'
        });
        const de = (0, _makesubject.makeSubject)({
            code: 'SMD0130',
            name: 'Design Emocional'
        });
        await subjectRepository.create(ihc);
        await subjectRepository.create(de);
        const response = await (0, _supertest.default)(_app.app.server).get('/subjects');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            subjects: [
                {
                    id: de.id.toString(),
                    name: de.name
                },
                {
                    id: ihc.id.toString(),
                    name: ihc.name
                }
            ]
        });
    });
    it('should be able to fetch subjects by name', async ()=>{
        const subjectRepository = new _subjectsrepository.PrismaSubjectsRepository();
        const am = (0, _makesubject.makeSubject)({
            code: 'SMD0088',
            name: 'Autoração Multimídia I'
        });
        const pw = (0, _makesubject.makeSubject)({
            code: 'SMD0052',
            name: 'Programação para Web I'
        });
        await subjectRepository.create(am);
        await subjectRepository.create(pw);
        const response = await (0, _supertest.default)(_app.app.server).get('/subjects').query({
            name: 'Web'
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            subjects: [
                {
                    id: pw.id.toString(),
                    name: pw.name
                }
            ]
        });
    });
});

//# sourceMappingURL=fetch.controller.e2e-spec.js.map