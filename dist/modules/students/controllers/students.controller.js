"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StudentsController", {
    enumerable: true,
    get: function() {
        return StudentsController;
    }
});
const _makeeditprofileusecase = require("../../../interface/factories/students/make-edit-profile-use-case");
const _makefetchstudentsusecase = require("../../../interface/factories/students/make-fetch-students-use-case");
const _makegetprofileusecase = require("../../../interface/factories/students/make-get-profile-use-case");
const _makegetstudentdetailsusecase = require("../../../interface/factories/students/make-get-student-details-use-case");
const _makeloginusecase = require("../../../interface/factories/students/make-login-use-case");
const _makeregisterusecase = require("../../../interface/factories/students/make-register-use-case");
const _makeuploadprofileimageusecase = require("../../../interface/factories/students/make-upload-profile-image-use-case");
const _student = require("../../../interface/http/presenters/student");
const _studentprofile = require("../../../interface/http/presenters/student-profile");
const _jwtauthguard = require("../../auth/guards/jwt-auth.guard");
const _common = require("@nestjs/common");
const _jwt = require("@nestjs/jwt");
const _platformexpress = require("@nestjs/platform-express");
const _swagger = require("@nestjs/swagger");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
function _ts_param(paramIndex, decorator) {
    return function(target, key) {
        decorator(target, key, paramIndex);
    };
}
let StudentsController = class StudentsController {
    async register(registerDto) {
        const registerUseCase = (0, _makeregisterusecase.makeRegisterUseCase)();
        const result = await registerUseCase.execute({
            name: registerDto.name,
            username: registerDto.username,
            email: registerDto.email,
            password: registerDto.password,
            semester: registerDto.semester,
            about: registerDto.about,
            profileUrl: registerDto.profileUrl,
            trailsIds: registerDto.trailsIds
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 409) {
                throw new _common.ConflictException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            user_id: result.value.id.toString()
        };
    }
    async login(loginDto) {
        const loginUseCase = (0, _makeloginusecase.makeLoginUseCase)();
        const result = await loginUseCase.execute({
            email: loginDto.email,
            password: loginDto.password
        });
        if (result.isLeft()) {
            const error = result.value;
            throw new _common.UnauthorizedException(error.message);
        }
        const token = this.jwtService.sign({
            sub: result.value.id,
            role: 'student'
        });
        return {
            token
        };
    }
    async getProfile(username) {
        const getProfileUseCase = (0, _makegetprofileusecase.makeGetProfileUseCase)();
        const result = await getProfileUseCase.execute({
            username
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return _studentprofile.StudentProfilePresenter.toHTTP(result.value);
    }
    async editProfile(studentId, editDto, req) {
        if (studentId !== req.user.userId) {
            throw new _common.ForbiddenException('Forbidden.');
        }
        const editProfileUseCase = (0, _makeeditprofileusecase.makeEditProfileUseCase)();
        const result = await editProfileUseCase.execute({
            studentId,
            profileUrl: editDto.profileUrl,
            semester: editDto.semester,
            trailsIds: editDto.trailsIds,
            about: editDto.about
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            profile: _studentprofile.StudentProfilePresenter.toHTTP(result.value)
        };
    }
    async fetchStudents(query) {
        const fetchStudentsUseCase = (0, _makefetchstudentsusecase.makeFetchStudentsUseCase)();
        const result = await fetchStudentsUseCase.execute({
            name: query.name
        });
        return {
            students: result.map(_student.StudentPresenter.toHTTP)
        };
    }
    async getStudentDetails(studentId) {
        const getStudentDetailsUseCase = (0, _makegetstudentdetailsusecase.makeGetStudentDetailsUseCase)();
        const result = await getStudentDetailsUseCase.execute({
            username: studentId
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return _studentprofile.StudentProfilePresenter.toHTTP(result.value);
    }
    async uploadProfileImage(username, file) {
        if (!file) {
            throw new _common.BadRequestException('File is required');
        }
        const uploadUseCase = (0, _makeuploadprofileimageusecase.makeUploadProfileImageUseCase)();
        const result = await uploadUseCase.execute({
            username,
            filename: file.originalname,
            image: file.buffer
        });
        if (result.isLeft()) {
            const error = result.value;
            if (error.statusCode === 404) {
                throw new _common.NotFoundException(error.message);
            }
            throw new _common.BadRequestException(error.message);
        }
        return {
            message: 'Profile image uploaded successfully'
        };
    }
    async refreshToken(req) {
        const token = this.jwtService.sign({
            sub: req.user.userId,
            role: 'student'
        });
        return {
            token
        };
    }
    constructor(jwtService){
        this.jwtService = jwtService;
    }
};
_ts_decorate([
    (0, _common.Post)('students'),
    (0, _swagger.ApiOperation)({
        summary: 'Register a new student'
    }),
    (0, _swagger.ApiResponse)({
        status: 201,
        description: 'Student registered successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 400,
        description: 'Bad request'
    }),
    (0, _swagger.ApiResponse)({
        status: 409,
        description: 'Student already exists'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof RegisterStudentDto === "undefined" ? Object : RegisterStudentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "register", null);
_ts_decorate([
    (0, _common.Post)('sessions'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _swagger.ApiOperation)({
        summary: 'Login student'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Login successful'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Invalid credentials'
    }),
    _ts_param(0, (0, _common.Body)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof LoginStudentDto === "undefined" ? Object : LoginStudentDto
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "login", null);
_ts_decorate([
    (0, _common.Get)('profiles/:username'),
    (0, _swagger.ApiOperation)({
        summary: 'Get student profile by username'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Profile retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    _ts_param(0, (0, _common.Param)('username')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "getProfile", null);
_ts_decorate([
    (0, _common.Put)('profiles/:studentId'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Edit student profile'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Profile updated successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 403,
        description: 'Forbidden'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    _ts_param(0, (0, _common.Param)('studentId')),
    _ts_param(1, (0, _common.Body)()),
    _ts_param(2, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof EditProfileDto === "undefined" ? Object : EditProfileDto,
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "editProfile", null);
_ts_decorate([
    (0, _common.Get)('students'),
    (0, _swagger.ApiOperation)({
        summary: 'Fetch students'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Students retrieved successfully'
    }),
    _ts_param(0, (0, _common.Query)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof FetchStudentsDto === "undefined" ? Object : FetchStudentsDto
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "fetchStudents", null);
_ts_decorate([
    (0, _common.Get)('students/:studentId'),
    (0, _swagger.ApiOperation)({
        summary: 'Get student details'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Student details retrieved successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    _ts_param(0, (0, _common.Param)('studentId')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "getStudentDetails", null);
_ts_decorate([
    (0, _common.Post)('profile-images/:username'),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _common.UseInterceptors)((0, _platformexpress.FileInterceptor)('file')),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiConsumes)('multipart/form-data'),
    (0, _swagger.ApiOperation)({
        summary: 'Upload student profile image'
    }),
    (0, _swagger.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Profile image uploaded successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 404,
        description: 'Student not found'
    }),
    _ts_param(0, (0, _common.Param)('username')),
    _ts_param(1, (0, _common.UploadedFile)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof Express === "undefined" || typeof Express.Multer === "undefined" || typeof Express.Multer.File === "undefined" ? Object : Express.Multer.File
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "uploadProfileImage", null);
_ts_decorate([
    (0, _common.Patch)('token/refresh'),
    (0, _common.HttpCode)(_common.HttpStatus.OK),
    (0, _common.UseGuards)(_jwtauthguard.JwtAuthGuard),
    (0, _swagger.ApiBearerAuth)(),
    (0, _swagger.ApiOperation)({
        summary: 'Refresh JWT token'
    }),
    (0, _swagger.ApiResponse)({
        status: 200,
        description: 'Token refreshed successfully'
    }),
    (0, _swagger.ApiResponse)({
        status: 401,
        description: 'Unauthorized'
    }),
    _ts_param(0, (0, _common.Request)()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        Object
    ]),
    _ts_metadata("design:returntype", Promise)
], StudentsController.prototype, "refreshToken", null);
StudentsController = _ts_decorate([
    (0, _swagger.ApiTags)('Students'),
    (0, _common.Controller)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _jwt.JwtService === "undefined" ? Object : _jwt.JwtService
    ])
], StudentsController);

//# sourceMappingURL=students.controller.js.map