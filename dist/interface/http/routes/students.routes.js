"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "studentsRoutes", {
    enumerable: true,
    get: function() {
        return studentsRoutes;
    }
});
const _editprofilecontroller = require("../controllers/students/edit-profile.controller");
const _fetchcontroller = require("../controllers/students/fetch.controller");
const _getprofilecontroller = require("../controllers/students/get-profile.controller");
const _getstudentdetailscontroller = require("../controllers/students/get-student-details.controller");
const _logincontroller = require("../controllers/students/login.controller");
const _refreshcontroller = require("../controllers/students/refresh.controller");
const _registercontroller = require("../controllers/students/register.controller");
const _uploadprofileimage = require("../controllers/students/upload-profile-image");
const _verifyjwt = require("../middlewares/verify-jwt");
const _editprofileschemas = require("../schemas/students/edit-profile.schemas");
const _fetchschemas = require("../schemas/students/fetch.schemas");
const _getprofileschemas = require("../schemas/students/get-profile.schemas");
const _getstudentdetailsschemas = require("../schemas/students/get-student-details.schemas");
const _loginschemas = require("../schemas/students/login.schemas");
const _refreshschemas = require("../schemas/students/refresh.schemas");
const _registerschemas = require("../schemas/students/register.schemas");
const _uploadprofileimageschemas = require("../schemas/students/upload-profile-image.schemas");
async function studentsRoutes(app) {
    app.withTypeProvider().post('/profile-images/:username', {
        schema: _uploadprofileimageschemas.uploadProfileImageSchemas
    }, _uploadprofileimage.uploadProfileImage);
    app.withTypeProvider().post('/students', {
        schema: _registerschemas.registerSchemas
    }, _registercontroller.register);
    app.withTypeProvider().post('/sessions', {
        schema: _loginschemas.loginSchemas
    }, _logincontroller.login);
    app.withTypeProvider().patch('/token/refresh', {
        schema: _refreshschemas.refreshSchemas
    }, _refreshcontroller.refresh);
    app.withTypeProvider().get('/profiles/:username', {
        schema: _getprofileschemas.getProfileSchemas
    }, _getprofilecontroller.getProfile);
    app.withTypeProvider().put('/profiles/:studentId', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _editprofileschemas.editProfileSchemas
    }, _editprofilecontroller.editProfile);
    app.withTypeProvider().get('/students', {
        schema: _fetchschemas.fetchStudentsSchemas
    }, _fetchcontroller.fetchStudents);
    app.withTypeProvider().get('/students/me', {
        preHandler: _verifyjwt.verifyJWT,
        schema: _getstudentdetailsschemas.getStudentDetailsSchemas
    }, _getstudentdetailscontroller.getStudentDetails);
}

//# sourceMappingURL=students.routes.js.map