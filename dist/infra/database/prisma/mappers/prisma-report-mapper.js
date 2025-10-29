"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaReportMapper", {
    enumerable: true,
    get: function() {
        return PrismaReportMapper;
    }
});
const _report = require("../../../../domain/interaction/enterprise/entities/report");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaReportMapper = class PrismaReportMapper {
    static toEntity(raw) {
        return _report.Report.create({
            content: raw.content,
            isResolved: raw.isResolved,
            authorId: _uniqueentityid.UniqueEntityID.create(raw.authorId),
            commentId: _uniqueentityid.UniqueEntityID.create(raw.commentId)
        }, _uniqueentityid.UniqueEntityID.create(raw.id));
    }
    static toPrisma(report) {
        return {
            id: report.id.toString(),
            content: report.content,
            isResolved: report.isResolved,
            createdAt: report.createdAt,
            updatedAt: report.updatedAt ?? undefined,
            authorId: report.authorId.toString(),
            commentId: report.commentId.toString()
        };
    }
};

//# sourceMappingURL=prisma-report-mapper.js.map