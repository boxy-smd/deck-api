"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _professorsrepository = require("../../../../infra/database/prisma/repositories/professors-repository");
const _makeprofessor = require("../../../../../test/factories/make-professor");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('fetch professors controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to fetch professors', async ()=>{
        const professorRepository = new _professorsrepository.PrismaProfessorsRepository();
        const tici = (0, _makeprofessor.makeProfessor)({
            name: 'Ticianne Darin'
        });
        const inga = (0, _makeprofessor.makeProfessor)({
            name: 'Inga Saboia'
        });
        await professorRepository.create(tici);
        await professorRepository.create(inga);
        const response = await (0, _supertest.default)(_app.app.server).get('/professors');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            professors: [
                {
                    id: inga.id.toString(),
                    name: inga.name
                },
                {
                    id: tici.id.toString(),
                    name: tici.name
                }
            ]
        });
    });
    it('should be able to fetch professors by name', async ()=>{
        const professorRepository = new _professorsrepository.PrismaProfessorsRepository();
        const pequeno = (0, _makeprofessor.makeProfessor)({
            name: 'Henrique Pequeno'
        });
        const mara = (0, _makeprofessor.makeProfessor)({
            name: 'Mara Bonates'
        });
        await professorRepository.create(pequeno);
        await professorRepository.create(mara);
        const response = await (0, _supertest.default)(_app.app.server).get('/professors').query({
            name: 'Pequeno'
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            professors: [
                {
                    id: pequeno.id.toString(),
                    name: pequeno.name
                }
            ]
        });
    });
});

//# sourceMappingURL=fetch.controller.e2e-spec.js.map