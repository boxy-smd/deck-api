"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaReportsRepository", {
    enumerable: true,
    get: function() {
        return PrismaReportsRepository;
    }
});
const _client = require("../client");
const _prismareportmapper = require("../mappers/prisma-report-mapper");
let PrismaReportsRepository = class PrismaReportsRepository {
    async findById(id) {
        const data = await _client.prisma.report.findUnique({
            where: {
                id
            }
        });
        if (!data) return null;
        return _prismareportmapper.PrismaReportMapper.toEntity(data);
    }
    async findAll() {
        const data = await _client.prisma.report.findMany();
        return data.map(_prismareportmapper.PrismaReportMapper.toEntity);
    }
    async create(report) {
        await _client.prisma.report.create({
            data: _prismareportmapper.PrismaReportMapper.toPrisma(report)
        });
    }
    async save(report) {
        await _client.prisma.report.upsert({
            where: {
                id: report.id.toString()
            },
            update: _prismareportmapper.PrismaReportMapper.toPrisma(report),
            create: _prismareportmapper.PrismaReportMapper.toPrisma(report)
        });
    }
    async delete(id) {
        await _client.prisma.report.delete({
            where: {
                id
            }
        });
    }
    async deleteManyByCommentId(commentId) {
        await _client.prisma.report.deleteMany({
            where: {
                commentId
            }
        });
    }
};

//# sourceMappingURL=reports-repository.js.map