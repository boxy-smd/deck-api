"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _trailsrepository = require("../../../../infra/database/prisma/repositories/trails-repository");
const _maketrail = require("../../../../../test/factories/make-trail");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('authenticate controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to authenticate a user', async ()=>{
        const trail = (0, _maketrail.makeTrail)();
        const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
        await trailsRepository.create(trail);
        await (0, _supertest.default)(_app.app.server).post('/students').send({
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@alu.ufc.br',
            password: '123456',
            semester: 1,
            trailsIds: [
                trail.id.toString()
            ]
        });
        const response = await (0, _supertest.default)(_app.app.server).post('/sessions').send({
            email: 'johndoe@alu.ufc.br',
            password: '123456'
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            token: expect.any(String)
        });
    });
});

//# sourceMappingURL=login.controller.e2e-spec.js.map