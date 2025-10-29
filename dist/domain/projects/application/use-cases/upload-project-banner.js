"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "UploadProjectBannerUseCase", {
    enumerable: true,
    get: function() {
        return UploadProjectBannerUseCase;
    }
});
const _either = require("../../../../shared/either");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let UploadProjectBannerUseCase = class UploadProjectBannerUseCase {
    async execute({ filename, image, projectId }) {
        const project = await this.projectsRepository.findById(_uniqueentityid.UniqueEntityID.create(projectId));
        if (!project) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Project not found.'));
        }
        const { downloadUrl } = await this.bannersUploader.upload(image, filename);
        project.editInfo({
            bannerUrl: downloadUrl
        });
        await this.projectsRepository.save(project);
        return (0, _either.right)(undefined);
    }
    constructor(projectsRepository, bannersUploader){
        this.projectsRepository = projectsRepository;
        this.bannersUploader = bannersUploader;
    }
};

//# sourceMappingURL=upload-project-banner.js.map