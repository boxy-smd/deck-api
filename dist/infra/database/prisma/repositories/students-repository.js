"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaStudentsRepository", {
    enumerable: true,
    get: function() {
        return PrismaStudentsRepository;
    }
});
const _client = require("../client");
const _prismastudentmapper = require("../mappers/prisma-student-mapper");
let PrismaStudentsRepository = class PrismaStudentsRepository {
    async findById(id) {
        const student = await _client.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                trail: {
                    include: {
                        trail: true
                    }
                },
                studentProfile: true
            }
        });
        if (!student) return null;
        return _prismastudentmapper.PrismaStudentMapper.toEntity(student);
    }
    async findByName(name) {
        const student = await _client.prisma.user.findFirst({
            where: {
                name
            },
            include: {
                trail: {
                    include: {
                        trail: true
                    }
                },
                studentProfile: true
            }
        });
        if (!student) return null;
        return _prismastudentmapper.PrismaStudentMapper.toEntity(student);
    }
    async findByEmail(email) {
        const student = await _client.prisma.user.findFirst({
            where: {
                email
            },
            include: {
                trail: {
                    include: {
                        trail: true
                    }
                },
                studentProfile: true
            }
        });
        if (!student) return null;
        return _prismastudentmapper.PrismaStudentMapper.toEntity(student);
    }
    async findByUsername(username) {
        const student = await _client.prisma.user.findFirst({
            where: {
                username
            },
            include: {
                trail: {
                    include: {
                        trail: true
                    }
                },
                studentProfile: true
            }
        });
        if (!student) return null;
        return _prismastudentmapper.PrismaStudentMapper.toEntity(student);
    }
    async findManyByName(name) {
        const students = await _client.prisma.user.findMany({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                },
                username: name.startsWith('@') ? {
                    contains: name.slice(1),
                    mode: 'insensitive'
                } : undefined
            },
            include: {
                trail: {
                    include: {
                        trail: true
                    }
                },
                studentProfile: true
            }
        });
        return students.map((s)=>_prismastudentmapper.PrismaStudentMapper.toEntity(s));
    }
    async findAll() {
        const students = await _client.prisma.user.findMany({
            include: {
                trail: {
                    include: {
                        trail: true
                    }
                },
                studentProfile: true
            }
        });
        return students.map((s)=>_prismastudentmapper.PrismaStudentMapper.toEntity(s));
    }
    async existsById(id) {
        const count = await _client.prisma.user.count({
            where: {
                id
            }
        });
        return count > 0;
    }
    async create(student) {
        const data = _prismastudentmapper.PrismaStudentMapper.toPrisma(student);
        await _client.prisma.user.create({
            data
        });
    }
    async save(student) {
        const data = _prismastudentmapper.PrismaStudentMapper.toPrismaUpdate(student);
        await _client.prisma.user.update({
            where: {
                id: student.id.toString()
            },
            data
        });
    }
    async delete(student) {
        await _client.prisma.user.delete({
            where: {
                id: student.id.toString()
            }
        });
    }
    async deleteById(id) {
        await _client.prisma.user.delete({
            where: {
                id
            }
        });
    }
};

//# sourceMappingURL=students-repository.js.map