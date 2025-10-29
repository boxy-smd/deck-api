"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "makeUploadProjectBannerUseCase", {
    enumerable: true,
    get: function() {
        return makeUploadProjectBannerUseCase;
    }
});
const _uploadprojectbanner = require("../../../domain/projects/application/use-cases/upload-project-banner");
const _banneruploader = require("../../../infra/database/firebase/banner-uploader");
const _projectsrepository = require("../../../infra/database/prisma/repositories/projects-repository");
function makeUploadProjectBannerUseCase() {
    const firebaseBannerUploader = new _banneruploader.FirebaseBannerUploader();
    const projectsRepository = new _projectsrepository.PrismaProjectsRepository();
    const uploadProjectBannerUseCase = new _uploadprojectbanner.UploadProjectBannerUseCase(projectsRepository, firebaseBannerUploader);
    return uploadProjectBannerUseCase;
}

//# sourceMappingURL=make-upload-project-banner-use-case.js.map