"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "uploadBanner", {
    enumerable: true,
    get: function() {
        return uploadBanner;
    }
});
const _makeuploadprojectbannerusecase = require("../../../factories/projects/make-upload-project-banner-use-case");
async function uploadBanner(request, reply) {
    const { projectId } = request.params;
    const bannerImage = await request.file();
    if (!bannerImage) {
        return reply.code(400).send({
            error: 'No image provided.'
        });
    }
    const uploadProjectBannerUseCase = (0, _makeuploadprojectbannerusecase.makeUploadProjectBannerUseCase)();
    const { mimetype } = bannerImage;
    const image = await bannerImage.toBuffer();
    await uploadProjectBannerUseCase.execute({
        filename: `${projectId}.${mimetype.split('/')[1]}`,
        image,
        projectId
    });
    return reply.code(201).send({
        message: 'Banner uploaded successfully.'
    });
}

//# sourceMappingURL=upload-banner.js.map