"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "CreateDraftUseCase", {
    enumerable: true,
    get: function() {
        return CreateDraftUseCase;
    }
});
const _either = require("../../../../shared/either");
const _forbiddenerror = require("../../../../shared/errors/forbidden.error");
const _resourcenotfounderror = require("../../../../shared/errors/resource-not-found.error");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
const _project = require("../../enterprise/entities/project");
const _projectstatus = require("../../enterprise/value-objects/project-status");
let CreateDraftUseCase = class CreateDraftUseCase {
    async execute({ title, description, bannerUrl, content, publishedYear, semester, allowComments, authorId, subjectId, trailsIds, professorsIds }) {
        if (!authorId) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('Você deve estar logado para criar um rascunho.'));
        }
        if (!title) {
            return (0, _either.left)(new _forbiddenerror.ForbiddenError('Você deve fornecer um título para o rascunho.'));
        }
        const student = await this.usersRepository.findById(authorId);
        if (!student) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Estudante não encontrado.'));
        }
        if (!this.subjectsRepository.existsById(new _uniqueentityid.UniqueEntityID(subjectId))) {
            return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Disciplina não encontrada.'));
        }
        for (const trailId of trailsIds ?? []){
            if (!await this.trailsRepository.existsById(new _uniqueentityid.UniqueEntityID(trailId))) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Trilha não encontrada.'));
            }
        }
        for (const professorId of professorsIds ?? []){
            if (!await this.professorsRepository.existsById(new _uniqueentityid.UniqueEntityID(professorId))) {
                return (0, _either.left)(new _resourcenotfounderror.ResourceNotFoundError('Professor não encontrado.'));
            }
        }
        const draft = _project.Project.create({
            title,
            description,
            bannerUrl,
            content,
            publishedYear,
            semester,
            allowComments: allowComments ?? false,
            authorId: student.id,
            subjectId: new _uniqueentityid.UniqueEntityID(subjectId),
            status: _projectstatus.ProjectStatus.DRAFT
        });
        draft.defineTrails(trailsIds?.map((trailId)=>new _uniqueentityid.UniqueEntityID(trailId)) ?? []);
        draft.defineProfessors(professorsIds?.map((professorId)=>new _uniqueentityid.UniqueEntityID(professorId)) ?? []);
        await this.projectsRepository.create(draft);
        return (0, _either.right)({
            draftId: draft.id.toString()
        });
    }
    constructor(projectsRepository, usersRepository, subjectsRepository, trailsRepository, professorsRepository){
        this.projectsRepository = projectsRepository;
        this.usersRepository = usersRepository;
        this.subjectsRepository = subjectsRepository;
        this.trailsRepository = trailsRepository;
        this.professorsRepository = professorsRepository;
    }
};

//# sourceMappingURL=create-draft.js.map