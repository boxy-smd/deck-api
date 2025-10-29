"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeUploadProfileImageUseCase", {
    enumerable: true,
    get: function() {
        return makeUploadProfileImageUseCase;
    }
});
const _uploadstudentprofile = require("../../../domain/authentication/application/use-cases/upload-student-profile");
const _profileuploader = require("../../../infra/database/firebase/profile-uploader");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
const _studentsrepository = require("../../../infra/database/prisma/repositories/students-repository");
function makeUploadProfileImageUseCase() {
    const firebaseBannerUploader = new _profileuploader.FirebaseProfileUploader();
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const studentsRepository = new _studentsrepository.PrismaStudentsRepository(projectsRepository);
    const uploadStudentProfileUseCase = new _uploadstudentprofile.UploadStudentProfileUseCase(studentsRepository, firebaseBannerUploader);
    return uploadStudentProfileUseCase;
}

//# sourceMappingURL=make-upload-profile-image-use-case.js.map