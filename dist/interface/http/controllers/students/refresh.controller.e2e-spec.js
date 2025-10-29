"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _createandauthenticatestudents = require("../../../../../test/e2e/create-and-authenticate-students");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('refresh controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to refresh a token', async ()=>{
        const { cookies } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        if (!cookies) {
            throw new Error('No cookies found');
        }
        const response = await (0, _supertest.default)(_app.app.server).patch('/token/refresh').set('Cookie', cookies).send();
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            token: expect.any(String)
        });
        expect(response.get('Set-Cookie')).toEqual([
            expect.stringContaining('refreshToken=')
        ]);
    });
});

//# sourceMappingURL=refresh.controller.e2e-spec.js.map