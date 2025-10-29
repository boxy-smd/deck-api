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
describe('register controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to register a user', async ()=>{
        const trail = (0, _maketrail.makeTrail)();
        const trailsRepository = new _trailsrepository.PrismaTrailsRepository();
        await trailsRepository.create(trail);
        const response = await (0, _supertest.default)(_app.app.server).post('/students').send({
            name: 'John Doe',
            username: 'johndoe',
            email: 'johndoe@alu.ufc.br',
            password: '123456',
            semester: 1,
            trailsIds: [
                trail.id.toString()
            ]
        });
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            user_id: expect.any(String)
        });
    });
});

//# sourceMappingURL=register.controller.e2e-spec.js.map