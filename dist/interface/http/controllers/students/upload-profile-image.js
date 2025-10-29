"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "uploadProfileImage", {
    enumerable: true,
    get: function() {
        return uploadProfileImage;
    }
});
const _makeuploadprofileimageusecase = require("../../../factories/students/make-upload-profile-image-use-case");
async function uploadProfileImage(request, reply) {
    const { username } = request.params;
    const profileImage = await request.file();
    if (!profileImage) {
        return reply.code(400).send({
            error: 'No image provided.'
        });
    }
    const uploadStudentProfileUseCase = (0, _makeuploadprofileimageusecase.makeUploadProfileImageUseCase)();
    const { mimetype } = profileImage;
    const image = await profileImage.toBuffer();
    const result = await uploadStudentProfileUseCase.execute({
        filename: `${username}.${mimetype.split('/')[1]}`,
        image,
        username
    });
    if (result.isLeft()) {
        const error = result.value;
        return reply.code(error.statusCode).send({
            message: error.message
        });
    }
    return reply.code(201).send({
        message: 'Profile image uploaded successfully.'
    });
}

//# sourceMappingURL=upload-profile-image.js.map