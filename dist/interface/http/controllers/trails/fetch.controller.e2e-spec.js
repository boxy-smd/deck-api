"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _trail = require("../../../../domain/projects/enterprise/entities/trail");
const _trailsrepository = require("../../../../infra/database/prisma/repositories/trails-repository");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('fetch trails controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to fetch trails', async ()=>{
        const trailRepository = new _trailsrepository.PrismaTrailsRepository();
        const trail1 = _trail.Trail.create({
            name: 'Sistemas'
        });
        const trail2 = _trail.Trail.create({
            name: 'Design'
        });
        await trailRepository.create(trail1);
        await trailRepository.create(trail2);
        const response = await (0, _supertest.default)(_app.app.server).get('/trails');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            trails: [
                {
                    id: trail1.id.toString(),
                    name: trail1.name
                },
                {
                    id: trail2.id.toString(),
                    name: trail2.name
                }
            ]
        });
    });
});

//# sourceMappingURL=fetch.controller.e2e-spec.js.map