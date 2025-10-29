"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PrismaStudentMapper", {
    enumerable: true,
    get: function() {
        return PrismaStudentMapper;
    }
});
const _studentprofile = require("../../../../domain/authentication/enterprise/entities/student-profile");
const _user = require("../../../../domain/authentication/enterprise/entities/user");
const _email = require("../../../../domain/authentication/enterprise/value-objects/email");
const _semester = require("../../../../domain/authentication/enterprise/value-objects/semester");
const _username = require("../../../../domain/authentication/enterprise/value-objects/username");
const _uniqueentityid = require("../../../../shared/kernel/unique-entity-id");
let PrismaStudentMapper = class PrismaStudentMapper {
    static toEntity(raw) {
        const usernameResult = _username.Username.create(raw.username);
        if (usernameResult.isLeft()) {
            throw usernameResult.value;
        }
        const email = _email.Email.create(raw.email);
        let profile;
        if (raw.studentProfile) {
            const semesterResult = _semester.Semester.create(raw.studentProfile.semester);
            if (semesterResult.isLeft()) {
                throw semesterResult.value;
            }
            profile = _studentprofile.StudentProfile.create({
                semester: semesterResult.value,
                trailsIds: new Set(raw.trail?.map((t)=>_uniqueentityid.UniqueEntityID.create(t.trail.id)) || [])
            }, _uniqueentityid.UniqueEntityID.create(raw.id));
        }
        return _user.User.create({
            name: raw.name,
            username: usernameResult.value,
            email,
            passwordHash: raw.passwordHash,
            about: raw.about ?? undefined,
            profileUrl: raw.profileUrl ?? undefined,
            role: raw.role,
            status: raw.status,
            profile
        }, _uniqueentityid.UniqueEntityID.create(raw.id));
    }
    static toPrisma(user) {
        return {
            id: user.id.toString(),
            name: user.name,
            username: user.username.value,
            email: user.email.value,
            passwordHash: user.passwordHash,
            about: user.about ?? undefined,
            profileUrl: user.profileUrl ?? undefined,
            role: user.role,
            status: user.status,
            studentProfile: user.profile ? {
                create: {
                    semester: user.profile.semester.value
                }
            } : undefined,
            trail: user.profile && user.profile.trailsIds.length > 0 ? {
                create: user.profile.trailsIds.filter((trailId)=>trailId != null).map((trailId)=>({
                        trailId: trailId.toString()
                    }))
            } : undefined
        };
    }
    static toPrismaUpdate(user) {
        return {
            name: user.name,
            username: user.username.value,
            email: user.email.value,
            passwordHash: user.passwordHash,
            about: user.about ?? undefined,
            profileUrl: user.profileUrl ?? undefined,
            role: user.role,
            status: user.status
        };
    }
};

//# sourceMappingURL=prisma-student-mapper.js.map