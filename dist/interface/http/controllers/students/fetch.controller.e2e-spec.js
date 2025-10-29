"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const _supertest = /*#__PURE__*/ _interop_require_default(require("supertest"));
const _app = require("../../../../app");
const _email = require("../../../../domain/authentication/enterprise/value-objects/email");
const _username = require("../../../../domain/authentication/enterprise/value-objects/username");
const _studentsrepository = require("../../../../infra/database/prisma/repositories/students-repository");
const _makeuser = require("../../../../../test/factories/make-user");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
describe('fetch students controller (e2e)', ()=>{
    beforeAll(async ()=>{
        await _app.app.ready();
    });
    afterAll(async ()=>{
        await _app.app.close();
    });
    it('should be able to fetch students', async ()=>{
        const studentsRepository = new _studentsrepository.PrismaStudentsRepository();
        const student = await (0, _makeuser.makeUser)();
        await studentsRepository.create(student);
        const response = await (0, _supertest.default)(_app.app.server).get('/students');
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            students: [
                {
                    id: student.id.toString(),
                    name: student.name,
                    username: student.username.value,
                    semester: student.profile?.semester.value,
                    profileUrl: student.profileUrl,
                    trails: []
                }
            ]
        });
    });
    it('should be able to fetch students by name', async ()=>{
        const studentsRepository = new _studentsrepository.PrismaStudentsRepository();
        const amandaUsername = _username.Username.create('amanda.coelho');
        if (amandaUsername.isLeft()) throw amandaUsername.value;
        const amanda = await (0, _makeuser.makeUser)({
            name: 'Amanda Coelho',
            username: amandaUsername.value,
            email: _email.Email.create('amanda@alu.ufc.br')
        });
        const leviUsername = _username.Username.create('levi.brito');
        if (leviUsername.isLeft()) throw leviUsername.value;
        const levi = await (0, _makeuser.makeUser)({
            name: 'Levi de Brito',
            username: leviUsername.value,
            email: _email.Email.create('levi@alu.ufc.br')
        });
        await studentsRepository.create(amanda);
        await studentsRepository.create(levi);
        const response = await (0, _supertest.default)(_app.app.server).get('/students').query({
            name: 'Amanda'
        });
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            students: [
                {
                    id: amanda.id.toString(),
                    name: amanda.name,
                    username: amanda.username.value,
                    semester: amanda.profile?.semester.value,
                    profileUrl: amanda.profileUrl,
                    trails: []
                }
            ]
        });
    });
});

//# sourceMappingURL=fetch.controller.e2e-spec.js.map