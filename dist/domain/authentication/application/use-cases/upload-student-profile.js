"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadStudentProfileUseCase", {
    enumerable: true,
    get: function() {
        return UploadStudentProfileUseCase;
    }
});
const _either = require("../../../../shared/either");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let UploadStudentProfileUseCase = class UploadStudentProfileUseCase {
    async execute({ filename, image, username }) {
        const student = await this.studentsRepository.findByUsername(username);
        if (!student) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Student not found.'));
        }
        const { downloadUrl } = await this.profilesUploader.upload(image, filename);
        student.changeProfilePicture(downloadUrl);
        await this.studentsRepository.save(student);
        return (0, _either.right)(undefined);
    }
    constructor(studentsRepository, profilesUploader){
        this.studentsRepository = studentsRepository;
        this.profilesUploader = profilesUploader;
    }
};

//# sourceMappingURL=upload-student-profile.js.map