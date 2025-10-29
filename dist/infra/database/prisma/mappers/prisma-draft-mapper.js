"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaDraftMapper", {
    enumerable: true,
    get: function() {
        return PrismaDraftMapper;
    }
});
const _project = require("../../../../domain/projects/enterprise/entities/project");
const _projectstatus = require("../../../../domain/projects/enterprise/value-objects/project-status");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaDraftMapper = class PrismaDraftMapper {
    static toEntity(raw) {
        return _project.Project.create({
            title: raw.title,
            description: raw.description ?? undefined,
            content: raw.content ?? undefined,
            semester: raw.semester ?? undefined,
            publishedYear: raw.publishedYear ?? undefined,
            allowComments: raw.allowComments ?? true,
            bannerUrl: raw.bannerUrl ?? undefined,
            status: _projectstatus.ProjectStatus.DRAFT,
            authorId: _uniqueentityid.UniqueEntityID.create(raw.authorId),
            subjectId: raw.subjectId ? _uniqueentityid.UniqueEntityID.create(raw.subjectId) : undefined,
            trails: new Set(raw.trails.map((trail)=>_uniqueentityid.UniqueEntityID.create(trail.id))),
            professors: new Set(raw.professors.map((professor)=>_uniqueentityid.UniqueEntityID.create(professor.id)))
        }, _uniqueentityid.UniqueEntityID.create(raw.id));
    }
    static toPrisma(draft) {
        return {
            id: draft.id.toString(),
            title: draft.title,
            description: draft.description,
            content: draft.content ?? undefined,
            semester: draft.semester,
            publishedYear: draft.publishedYear,
            allowComments: draft.allowComments,
            bannerUrl: draft.bannerUrl ?? undefined,
            createdAt: draft.createdAt,
            updatedAt: draft.updatedAt ?? undefined,
            authorId: draft.authorId.toString(),
            trails: {
                connect: Array.from(draft.trails).map((trailId)=>({
                        id: trailId.toString()
                    }))
            },
            subjectId: draft.subjectId?.toString(),
            professors: {
                connect: Array.from(draft.professors).map((professorId)=>({
                        id: professorId.toString()
                    }))
            }
        };
    }
    static toPrismaUpdate(draft) {
        return {
            title: draft.title,
            description: draft.description,
            content: draft.content ?? undefined,
            semester: draft.semester,
            publishedYear: draft.publishedYear,
            allowComments: draft.allowComments,
            bannerUrl: draft.bannerUrl ?? undefined,
            updatedAt: draft.updatedAt,
            authorId: draft.authorId.toString(),
            trails: {
                set: Array.from(draft.trails).map((trailId)=>({
                        id: trailId.toString()
                    }))
            },
            subjectId: draft.subjectId?.toString(),
            professors: {
                set: Array.from(draft.professors).map((professorId)=>({
                        id: professorId.toString()
                    }))
            }
        };
    }
};

//# sourceMappingURL=prisma-draft-mapper.js.map