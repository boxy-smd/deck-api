"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaProfessorMapper", {
    enumerable: true,
    get: function() {
        return PrismaProfessorMapper;
    }
});
const _professor = require("../../../../domain/projects/enterprise/entities/professor");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaProfessorMapper = class PrismaProfessorMapper {
    static toEntity(raw) {
        return _professor.Professor.create({
            name: raw.name,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new _uniqueentityid.UniqueEntityID(raw.id));
    }
    static toPrisma(professor) {
        return {
            id: professor.id.toString(),
            name: professor.name,
            createdAt: professor.createdAt,
            updatedAt: professor.updatedAt ?? undefined
        };
    }
};

//# sourceMappingURL=prisma-professor-mapper.js.map