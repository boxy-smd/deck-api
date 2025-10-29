"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaProjectsRepository", {
    enumerable: true,
    get: function() {
        return PrismaProjectsRepository;
    }
});
const _client = require("../client");
const _prismaprojectmapper = require("../mappers/prisma-project-mapper");
let PrismaProjectsRepository = class PrismaProjectsRepository {
    async findManyByTitle(title) {
        const data = await _client.prisma.project.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            }
        });
        return data.map(_prismaprojectmapper.PrismaProjectMapper.toEntity);
    }
    async findManyByProfessorName(name) {
        const data = await _client.prisma.project.findMany({
            where: {
                professors: {
                    some: {
                        professor: {
                            name: {
                                contains: name,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            }
        });
        return data.map(_prismaprojectmapper.PrismaProjectMapper.toEntity);
    }
    async findManyByQuery(_query) {
        return new Promise((_resolve, _reject)=>{
            throw new Error('Method not implemented.');
        });
    }
    async findManyByAuthorId(authorId) {
        const data = await _client.prisma.project.findMany({
            where: {
                authorId: authorId.toString()
            }
        });
        return data.map(_prismaprojectmapper.PrismaProjectMapper.toEntity);
    }
    async findManyByStudentId(studentId) {
        const data = await _client.prisma.project.findMany({
            where: {
                authorId: studentId.toString()
            }
        });
        return data.map(_prismaprojectmapper.PrismaProjectMapper.toEntity);
    }
    async findManyByTag(tag) {
        const data = await _client.prisma.project.findMany({
            where: {
                trails: {
                    some: {
                        trail: {
                            name: {
                                contains: tag,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            }
        });
        return data.map(_prismaprojectmapper.PrismaProjectMapper.toEntity);
    }
    async findById(id) {
        const data = await _client.prisma.project.findUnique({
            where: {
                id: id.toString()
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                comments: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        updatedAt: true,
                        author: {
                            select: {
                                name: true,
                                username: true,
                                profileUrl: true
                            }
                        },
                        authorId: true
                    }
                }
            }
        });
        if (!data) return null;
        const project = _prismaprojectmapper.PrismaProjectMapper.toEntity({
            ...data,
            trails: data.trails.map((t)=>({
                    id: t.trail.id
                })),
            professors: data.professors.map((p)=>({
                    id: p.professor.id
                }))
        });
        project.__author = data.author;
        project.__subject = data.subject?.name;
        project.__trails = data.trails.map((t)=>t.trail.name);
        project.__professors = data.professors.map((p)=>p.professor.name);
        project.__comments = data.comments;
        return project;
    }
    async findManyPostsByTitle(title) {
        const data = await _client.prisma.project.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive'
                }
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async findManyPostsByProfessorName(name) {
        const data = await _client.prisma.project.findMany({
            where: {
                professors: {
                    some: {
                        professor: {
                            name: {
                                contains: name,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async findManyDraftsByStudentId(studentId) {
        const data = await _client.prisma.project.findMany({
            where: {
                authorId: studentId,
                status: 'DRAFT'
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async findManyPostsByQuery({ semester, publishedYear, subjectId, trailsIds }) {
        const data = await _client.prisma.project.findMany({
            where: {
                AND: [
                    {
                        status: 'PUBLISHED'
                    },
                    publishedYear ? {
                        publishedYear: {
                            equals: publishedYear
                        }
                    } : {},
                    semester ? {
                        semester: {
                            equals: semester
                        }
                    } : {},
                    subjectId ? {
                        subjectId: {
                            equals: subjectId
                        }
                    } : {},
                    trailsIds?.length ? {
                        trails: {
                            some: {
                                trailId: {
                                    in: trailsIds
                                }
                            }
                        }
                    } : {}
                ]
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                publishedYear: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async findManyPostsByTag(tag) {
        const semesterVariants = {
            1: [
                '1',
                'primeiro',
                '1º'
            ],
            2: [
                '2',
                'segundo',
                '2º'
            ],
            3: [
                '3',
                'terceiro',
                '3º'
            ],
            4: [
                '4',
                'quarto',
                '4º'
            ],
            5: [
                '5',
                'quinto',
                '5º'
            ],
            6: [
                '6',
                'sexto',
                '6º'
            ],
            7: [
                '7',
                'sétimo',
                'setimo',
                '7º'
            ],
            8: [
                '8',
                'oitavo',
                '8º'
            ],
            9: [
                '9',
                'nono',
                '9º'
            ],
            10: [
                '10',
                'décimo',
                'decimo',
                '10º'
            ],
            11: [
                '11',
                'décimo primeiro',
                'decimo primeiro',
                'décimo-primeiro',
                'decimo-primeiro',
                '11º'
            ],
            12: [
                '12',
                'décimo segundo',
                'decimo segundo',
                'décimo-segundo',
                'decimo-segundo',
                '12º'
            ]
        };
        let searchedSemester = undefined;
        for(const key in semesterVariants){
            const variants = semesterVariants[key];
            if (variants.includes(tag.toLowerCase())) {
                searchedSemester = Number.parseInt(key);
                break;
            }
        }
        const data = await _client.prisma.project.findMany({
            where: {
                OR: [
                    {
                        trails: {
                            some: {
                                trail: {
                                    name: {
                                        contains: tag,
                                        mode: 'insensitive'
                                    }
                                }
                            }
                        }
                    },
                    {
                        subject: {
                            name: {
                                contains: tag,
                                mode: 'insensitive'
                            }
                        }
                    },
                    Number.parseInt(tag) ? {
                        publishedYear: {
                            equals: Number.parseInt(tag)
                        }
                    } : {},
                    searchedSemester ? {
                        semester: {
                            equals: searchedSemester
                        }
                    } : {}
                ]
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                publishedYear: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async findManyPostsByStudentId(studentId) {
        const data = await _client.prisma.project.findMany({
            where: {
                authorId: studentId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async findAll() {
        const data = await _client.prisma.project.findMany();
        return data.map(_prismaprojectmapper.PrismaProjectMapper.toEntity);
    }
    async findAllPosts() {
        const data = await _client.prisma.project.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                },
                professors: {
                    select: {
                        professor: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                subject: {
                    select: {
                        name: true
                    }
                },
                trails: {
                    select: {
                        trail: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                status: 'PUBLISHED'
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return data.map((d)=>_prismaprojectmapper.PrismaProjectMapper.toEntityPost(d));
    }
    async create(project) {
        const data = _prismaprojectmapper.PrismaProjectMapper.toPrisma(project);
        await _client.prisma.project.create({
            data
        });
    }
    async save(project) {
        const data = _prismaprojectmapper.PrismaProjectMapper.toPrisma(project);
        await _client.prisma.project.update({
            where: {
                id: data.id
            },
            data
        });
    }
    async delete(project) {
        await _client.prisma.project.delete({
            where: {
                id: project.id.toString()
            }
        });
    }
    async deleteById(id) {
        await _client.prisma.project.delete({
            where: {
                id: id.toString()
            }
        });
    }
    async existsById(id) {
        const data = await _client.prisma.project.findUnique({
            where: {
                id: id.toString()
            },
            select: {
                id: true
            }
        });
        return !!data;
    }
};

//# sourceMappingURL=projects-repository.js.map