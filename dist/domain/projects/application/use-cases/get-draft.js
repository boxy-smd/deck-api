"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "GetDraftUseCase", {
    enumerable: true,
    get: function() {
        return GetDraftUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let GetDraftUseCase = class GetDraftUseCase {
    async execute({ draftId, authorId }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('You are not allowed to access this resource.'));
        }
        const student = await this.studentsRepository.findById(authorId);
        if (!student) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Student not found.'));
        }
        const draft = await this.projectsRepository.findById(draftId);
        if (!draft) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Draft not found.'));
        }
        if (draft.authorId.toString() !== authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('You are not allowed to access this resource.'));
        }
        return (0, _either.right)(draft);
    }
    constructor(projectsRepository, studentsRepository){
        this.projectsRepository = projectsRepository;
        this.studentsRepository = studentsRepository;
    }
};

//# sourceMappingURL=get-draft.js.map