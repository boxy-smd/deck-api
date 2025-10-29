"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaSubjectsRepository", {
    enumerable: true,
    get: function() {
        return PrismaSubjectsRepository;
    }
});
const _client = require("../client");
const _prismasubjectmapper = require("../mappers/prisma-subject-mapper");
let PrismaSubjectsRepository = class PrismaSubjectsRepository {
    async findById(id) {
        const subject = await _client.prisma.subject.findUnique({
            where: {
                id: id.toString()
            }
        });
        if (!subject) return null;
        return _prismasubjectmapper.PrismaSubjectMapper.toEntity(subject);
    }
    async findByName(name) {
        const subject = await _client.prisma.subject.findFirst({
            where: {
                name
            }
        });
        if (!subject) return null;
        return _prismasubjectmapper.PrismaSubjectMapper.toEntity(subject);
    }
    async findManyByName(name) {
        const subjects = await _client.prisma.subject.findMany({
            where: {
                name: {
                    contains: name
                }
            },
            orderBy: {
                name: 'asc'
            }
        });
        return subjects.map(_prismasubjectmapper.PrismaSubjectMapper.toEntity);
    }
    async findAll() {
        const subjects = await _client.prisma.subject.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return subjects.map(_prismasubjectmapper.PrismaSubjectMapper.toEntity);
    }
    async existsById(id) {
        const count = await _client.prisma.subject.count({
            where: {
                id: id.toString()
            }
        });
        return count > 0;
    }
    async create(subject) {
        const data = _prismasubjectmapper.PrismaSubjectMapper.toPrisma(subject);
        await _client.prisma.subject.create({
            data
        });
    }
    async save(subject) {
        const data = _prismasubjectmapper.PrismaSubjectMapper.toPrisma(subject);
        await _client.prisma.subject.update({
            where: {
                id: subject.id.toString()
            },
            data
        });
    }
    async delete(subject) {
        await _client.prisma.subject.delete({
            where: {
                id: subject.id.toString()
            }
        });
    }
    async deleteById(id) {
        await _client.prisma.subject.delete({
            where: {
                id: id.toString()
            }
        });
    }
};

//# sourceMappingURL=subjects-repository.js.map