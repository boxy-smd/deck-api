"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _studentsrepository = require("../../../../infra/database/prisma/repositories/students-repository");
const _makeuser = require("../../../../../test/factories/make-user");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('get profile controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to get profile', async ()=>{
        const studentsRepository = new _studentsrepository.PrismaStudentsRepository();
        const student = await (0, _makeuser.makeUser)();
        await studentsRepository.create(student);
        const response = await (0, _supertest.default)(_app.app.server).get(`/profiles/${student.username.value}`);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            profile: {
                id: student.id.toString(),
                name: student.name,
                username: student.username.value,
                about: student.about,
                semester: student.profile?.semester.value,
                profileUrl: student.profileUrl,
                trails: [],
                posts: []
            }
        });
    });
});

//# sourceMappingURL=get-profile.controller.e2e-spec.js.map