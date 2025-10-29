"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaTrailMapper", {
    enumerable: true,
    get: function() {
        return PrismaTrailMapper;
    }
});
const _trail = require("../../../../domain/projects/enterprise/entities/trail");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaTrailMapper = class PrismaTrailMapper {
    static toEntity(raw) {
        return _trail.Trail.create({
            name: raw.name,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new _uniqueentityid.UniqueEntityID(raw.id));
    }
    static toPrisma(trail) {
        return {
            id: trail.id.toString(),
            name: trail.name,
            createdAt: trail.createdAt,
            updatedAt: trail.updatedAt ?? undefined
        };
    }
};

//# sourceMappingURL=prisma-trail-mapper.js.map