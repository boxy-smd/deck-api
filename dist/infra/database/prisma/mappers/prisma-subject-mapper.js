"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaSubjectMapper", {
    enumerable: true,
    get: function() {
        return PrismaSubjectMapper;
    }
});
const _subject = require("../../../../domain/projects/enterprise/entities/subject");
const _subjecttype = require("../../../../domain/projects/enterprise/value-objects/subject-type");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaSubjectMapper = class PrismaSubjectMapper {
    static toEntity(raw) {
        return _subject.Subject.create({
            name: raw.name,
            code: raw.code,
            semester: raw.semester,
            type: _subjecttype.SubjectType[raw.type],
            workload: raw.workload,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new _uniqueentityid.UniqueEntityID(raw.id));
    }
    static toPrisma(subject) {
        return {
            id: subject.id.toString(),
            name: subject.name,
            code: subject.code,
            workload: subject.workload,
            semester: subject.semester,
            type: _subjecttype.SubjectType[subject.type],
            createdAt: subject.createdAt,
            updatedAt: subject.updatedAt ?? undefined
        };
    }
};

//# sourceMappingURL=prisma-subject-mapper.js.map