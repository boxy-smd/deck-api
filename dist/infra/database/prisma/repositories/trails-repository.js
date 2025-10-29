"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaTrailsRepository", {
    enumerable: true,
    get: function() {
        return PrismaTrailsRepository;
    }
});
const _client = require("../client");
const _prismatrailmapper = require("../mappers/prisma-trail-mapper");
let PrismaTrailsRepository = class PrismaTrailsRepository {
    async findById(id) {
        const trail = await _client.prisma.trail.findUnique({
            where: {
                id
            }
        });
        if (!trail) return null;
        return _prismatrailmapper.PrismaTrailMapper.toEntity(trail);
    }
    async findByName(name) {
        const trail = await _client.prisma.trail.findFirst({
            where: {
                name
            }
        });
        if (!trail) return null;
        return _prismatrailmapper.PrismaTrailMapper.toEntity(trail);
    }
    async findManyByName(name) {
        const trails = await _client.prisma.trail.findMany({
            where: {
                name: {
                    contains: name
                }
            }
        });
        return trails.map(_prismatrailmapper.PrismaTrailMapper.toEntity);
    }
    async findAll() {
        const trails = await _client.prisma.trail.findMany();
        return trails.map(_prismatrailmapper.PrismaTrailMapper.toEntity);
    }
    async existsById(id) {
        const count = await _client.prisma.trail.count({
            where: {
                id
            }
        });
        return count > 0;
    }
    async create(trail) {
        const data = _prismatrailmapper.PrismaTrailMapper.toPrisma(trail);
        await _client.prisma.trail.create({
            data
        });
    }
    async save(trail) {
        const data = _prismatrailmapper.PrismaTrailMapper.toPrisma(trail);
        await _client.prisma.trail.update({
            where: {
                id: trail.id.toString()
            },
            data
        });
    }
    async delete(trail) {
        await _client.prisma.trail.delete({
            where: {
                id: trail.id.toString()
            }
        });
    }
    async deleteById(id) {
        await _client.prisma.trail.delete({
            where: {
                id
            }
        });
    }
};

//# sourceMappingURL=trails-repository.js.map