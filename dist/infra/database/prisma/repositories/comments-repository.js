"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaCommentsRepository", {
    enumerable: true,
    get: function() {
        return PrismaCommentsRepository;
    }
});
const _client = require("../client");
const _prismacommentmapper = require("../mappers/prisma-comment-mapper");
let PrismaCommentsRepository = class PrismaCommentsRepository {
    async findById(id) {
        const data = await _client.prisma.comment.findUnique({
            where: {
                id
            }
        });
        if (!data) return null;
        return _prismacommentmapper.PrismaCommentMapper.toEntity(data);
    }
    async findByProjectId(projectId) {
        const data = await _client.prisma.comment.findMany({
            where: {
                projectId
            }
        });
        return data.map(_prismacommentmapper.PrismaCommentMapper.toEntity);
    }
    async findManyByProjectIdWithAuthors(projectId) {
        const data = await _client.prisma.comment.findMany({
            where: {
                projectId
            },
            include: {
                author: {
                    select: {
                        name: true,
                        username: true,
                        profileUrl: true
                    }
                }
            }
        });
        return data.map(_prismacommentmapper.PrismaCommentMapper.toEntityWithAuthor);
    }
    async findAll() {
        const data = await _client.prisma.comment.findMany();
        return data.map(_prismacommentmapper.PrismaCommentMapper.toEntity);
    }
    async existsById(id) {
        const count = await _client.prisma.comment.count({
            where: {
                id
            }
        });
        return count > 0;
    }
    async create(comment) {
        const data = _prismacommentmapper.PrismaCommentMapper.toPrisma(comment);
        await _client.prisma.comment.create({
            data
        });
    }
    async save(comment) {
        const data = _prismacommentmapper.PrismaCommentMapper.toPrisma(comment);
        await _client.prisma.comment.update({
            where: {
                id: data.id
            },
            data
        });
    }
    async delete(comment) {
        await this.reportsRepository.deleteManyByCommentId(comment.id.toString());
        await _client.prisma.comment.delete({
            where: {
                id: comment.id.toString()
            }
        });
    }
    async deleteById(id) {
        await _client.prisma.comment.delete({
            where: {
                id
            }
        });
    }
    async deleteManyByProjectId(projectId) {
        await _client.prisma.comment.deleteMany({
            where: {
                projectId
            }
        });
    }
    constructor(reportsRepository){
        this.reportsRepository = reportsRepository;
    }
};

//# sourceMappingURL=comments-repository.js.map