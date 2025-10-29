"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaProjectMapper", {
    enumerable: true,
    get: function() {
        return PrismaProjectMapper;
    }
});
const _project = require("../../../../domain/projects/enterprise/entities/project");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaProjectMapper = class PrismaProjectMapper {
    static toEntity(raw) {
        return _project.Project.create({
            title: raw.title,
            description: raw.description,
            content: raw.content ?? undefined,
            semester: raw.semester,
            publishedYear: raw.publishedYear,
            status: raw.status,
            allowComments: raw.allowComments,
            bannerUrl: raw.bannerUrl ?? undefined,
            authorId: _uniqueentityid.UniqueEntityID.create(raw.authorId),
            subjectId: raw.subjectId ? _uniqueentityid.UniqueEntityID.create(raw.subjectId) : undefined,
            trails: new Set((raw.trails ?? []).map((t)=>_uniqueentityid.UniqueEntityID.create(t.id))),
            professors: new Set((raw.professors ?? []).map((p)=>_uniqueentityid.UniqueEntityID.create(p.id)))
        }, _uniqueentityid.UniqueEntityID.create(raw.id));
    }
    static toPrisma(project) {
        return {
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            content: project.content,
            semester: project.semester,
            publishedYear: project.publishedYear,
            status: project.status,
            allowComments: project.allowComments,
            bannerUrl: project.bannerUrl,
            author: {
                connect: {
                    id: project.authorId.toString()
                }
            },
            subject: project.subjectId ? {
                connect: {
                    id: project.subjectId.toString()
                }
            } : undefined,
            trails: {
                create: Array.from(project.trails).map((trailId)=>({
                        trail: {
                            connect: {
                                id: trailId.toString()
                            }
                        }
                    }))
            },
            professors: {
                create: Array.from(project.professors).map((professorId)=>({
                        professor: {
                            connect: {
                                id: professorId.toString()
                            }
                        }
                    }))
            }
        };
    }
    static toEntityPost(raw) {
        const project = this.toEntity(raw);
        return {
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            content: project.content,
            semester: project.semester,
            publishedYear: project.publishedYear,
            status: project.status,
            allowComments: project.allowComments,
            bannerUrl: project.bannerUrl,
            authorId: project.authorId.toString(),
            subjectId: project.subjectId?.toString(),
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            author: raw.author,
            subject: raw.subject,
            trails: raw.trails?.map((t)=>t.trail) || [],
            professors: raw.professors?.map((p)=>p.professor) || []
        };
    }
    static toEntityDetails(raw) {
        const project = this.toEntity(raw);
        return {
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            content: project.content,
            semester: project.semester,
            publishedYear: project.publishedYear,
            status: project.status,
            allowComments: project.allowComments,
            bannerUrl: project.bannerUrl,
            authorId: project.authorId.toString(),
            subjectId: project.subjectId?.toString(),
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            author: raw.author,
            subject: raw.subject,
            trails: raw.trails?.map((t)=>t.trail) || [],
            professors: raw.professors?.map((p)=>p.professor) || [],
            comments: raw.comments || []
        };
    }
};

//# sourceMappingURL=prisma-project-mapper.js.map