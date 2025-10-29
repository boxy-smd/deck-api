"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "EditDraftUseCase", {
    enumerable: true,
    get: function() {
        return EditDraftUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let EditDraftUseCase = class EditDraftUseCase {
    async execute({ authorId, draftId, title, description, bannerUrl, content, publishedYear, semester, allowComments, subjectId, trailsIds, professorsIds }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('You must be logged in to edit a draft.'));
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
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('You are not allowed to edit this draft.'));
        }
        draft.editInfo({
            title,
            description,
            bannerUrl,
            content,
            publishedYear,
            semester,
            allowComments
        });
        if (subjectId) {
            const subject = await this.subjectsRepository.findById(subjectId);
            if (!subject) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Subject not found.'));
            }
            draft.editInfo({
                subjectId: subject.id
            });
        }
        const trails = await Promise.all(trailsIds ? trailsIds.map(async (trailId)=>{
            const trail = await this.trailsRepository.findById(trailId);
            return trail;
        }) : []);
        if (trails.some((trail)=>!trail)) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Some trails were not found.'));
        }
        draft.defineTrails(trails.filter((trail)=>trail !== null).map((trail)=>trail.id));
        const professors = await Promise.all(professorsIds ? professorsIds.map(async (professorId)=>{
            const professor = await this.professorsRepository.findById(professorId);
            return professor;
        }) : []);
        if (professors.some((professor)=>!professor)) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Some professors were not found.'));
        }
        draft.defineProfessors(professors.filter((professor)=>professor !== null).map((professor)=>professor.id));
        await this.projectsRepository.save(draft);
        return (0, _either.right)(draft);
    }
    constructor(projectsRepository, studentsRepository, subjectsRepository, trailsRepository, professorsRepository){
        this.projectsRepository = projectsRepository;
        this.studentsRepository = studentsRepository;
        this.subjectsRepository = subjectsRepository;
        this.trailsRepository = trailsRepository;
        this.professorsRepository = professorsRepository;
    }
};

//# sourceMappingURL=edit-draft.js.map