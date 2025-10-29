"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PublishProjectUseCase", {
    enumerable: true,
    get: function() {
        return PublishProjectUseCase;
    }
});
const _project = require("../../enterprise/entities/project");
const _projectstatus = require("../../enterprise/value-objects/project-status");
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
let PublishProjectUseCase = class PublishProjectUseCase {
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: This logic will be refactored soon.
    async execute({ title, description, bannerUrl, content, publishedYear, semester, allowComments, authorId, subjectId, trailsIds, professorsIds, draftId }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('You must be logged in to publish a project.'));
        }
        const student = await this.studentsRepository.findById(authorId);
        if (!student) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Student not found.'));
        }
        let subject = null;
        if (subjectId) {
            subject = await this.subjectsRepository.findById(subjectId);
            if (!subject) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Subject not found.'));
            }
        }
        const trails = await Promise.all(trailsIds.map(async (trailId)=>{
            const trail = await this.trailsRepository.findById(trailId);
            return trail;
        }));
        if (trails.some((trail)=>!trail)) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Trail not found.'));
        }
        const professors = await Promise.all(professorsIds ? professorsIds.map(async (professorId)=>{
            const professor = await this.professorsRepository.findById(professorId);
            return professor;
        }) : []);
        if (professorsIds && professors.some((professor)=>!professor)) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Professor not found.'));
        }
        let createdProjectId = '';
        if (draftId) {
            const draft = await this.projectsRepository.findById(draftId);
            if (!draft) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Draft not found.'));
            }
            if (draft.authorId.toString() !== authorId) {
                return (0, _either.left)(new _forbiddenerror.ForbiddenError('You are not allowed to publish this draft.'));
            }
            draft.post();
            draft.editInfo({
                title,
                description,
                bannerUrl,
                content,
                publishedYear,
                semester,
                allowComments,
                subjectId: subject ? subject.id : undefined
            });
            if (trails.length > 0) {
                draft.defineTrails(trails.filter((trail)=>trail !== null).map((trail)=>trail.id));
            }
            if (professors.length > 0) {
                draft.defineProfessors(professors.filter((professor)=>professor !== null).map((professor)=>professor.id));
            }
            await this.projectsRepository.save(draft);
            createdProjectId = draft.id.toString();
        } else {
            const project = _project.Project.create({
                title,
                description,
                bannerUrl,
                content: content || '',
                publishedYear,
                semester,
                allowComments,
                status: _projectstatus.ProjectStatus.PUBLISHED,
                authorId: student.id,
                subjectId: subject ? subject.id : undefined,
                trails: new Set(trails.filter((trail)=>trail !== null).map((trail)=>trail.id)),
                professors: new Set(professors.filter((professor)=>professor !== null).map((professor)=>professor.id))
            });
            await this.projectsRepository.create(project);
            createdProjectId = project.id.toString();
        }
        return (0, _either.right)({
            projectId: createdProjectId
        });
    }
    constructor(projectsRepository, studentsRepository, subjectsRepository, trailsRepository, professorsRepository){
        this.projectsRepository = projectsRepository;
        this.studentsRepository = studentsRepository;
        this.subjectsRepository = subjectsRepository;
        this.trailsRepository = trailsRepository;
        this.professorsRepository = professorsRepository;
    }
};

//# sourceMappingURL=publish-project.js.map