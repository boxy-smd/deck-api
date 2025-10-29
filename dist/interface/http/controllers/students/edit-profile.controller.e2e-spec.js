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
describe('edit profile controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to edit profile', async ()=>{
        const { studentId, token } = await (0, _createandauthenticatestudents.createAndAuthenticateStudent)();
        const response = await (0, _supertest.default)(_app.app.server).put(`/profiles/${studentId}`).set('Authorization', `Bearer ${token}`).send({
            semester: 8
        });
        expect(response.status).toBe(200);
        expect(response.body.profile.semester).toBe(8);
    });
});

//# sourceMappingURL=edit-profile.controller.e2e-spec.js.map