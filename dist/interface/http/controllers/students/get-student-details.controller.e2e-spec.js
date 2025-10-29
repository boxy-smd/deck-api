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
describe('get student details controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to get student details', async ()=>{
        const { studentId, token } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        const response = await (0, _supertest.default)(_app.app.server).get('/students/me').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.details.id).toBe(studentId);
    });
});

//# sourceMappingURL=get-student-details.controller.e2e-spec.js.map