"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "User", {
    enumerable: true,
    get: function() {
        return User;
    }
});
const _aggregateroot = require("../../../../shared/kernel/aggregate-root");
const _semester = require("../value-objects/semester");
const _userstatus = require("../value-objects/user-status");
const _studentprofile = require("./student-profile");
let User = class User extends _aggregateroot.AggregateRoot {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new User(props, id);
    }
    static reconstitute(props, id, createdAt, updatedAt) {
        return new User(props, id, createdAt, updatedAt);
    }
    // --- 2. Public methods ---
    updateAbout(about) {
        // TODO: Define a value object for about
        this.props.about = about;
        this.touch();
    }
    changeProfilePicture(profileUrl) {
        this.props.profileUrl = profileUrl;
        this.touch();
    }
    isActive() {
        return this.props.status === _userstatus.UserStatus.ACTIVE;
    }
    activate() {
        this.props.status = _userstatus.UserStatus.ACTIVE;
        this.touch();
    }
    isInactive() {
        return this.props.status === _userstatus.UserStatus.INACTIVE;
    }
    inactivate() {
        this.props.status = _userstatus.UserStatus.INACTIVE;
        this.touch();
    }
    isBanned() {
        return this.props.status === _userstatus.UserStatus.BANNED;
    }
    ban() {
        this.props.status = _userstatus.UserStatus.BANNED;
        this.touch();
    }
    unban() {
        this.props.status = _userstatus.UserStatus.ACTIVE;
        this.touch();
    }
    changeRole(role) {
        this.props.role = role;
        this.touch();
    }
    createProfile(semester) {
        if (this.props.profile) {
            throw new Error('O usuário já possui um perfil de estudante.');
        }
        const validatedSemester = _semester.Semester.create(semester);
        if (validatedSemester.isLeft()) {
            throw validatedSemester.value;
        }
        const studentProfile = _studentprofile.StudentProfile.create({
            semester: validatedSemester.value
        }, this.id);
        this.props.profile = studentProfile;
        this.touch();
    }
    addTrailToProfile(trailId) {
        if (!this.props.profile) {
            throw new Error('O usuário não possui um perfil de estudante.');
        }
        this.props.profile.addTrail(trailId);
        this.touch();
    }
    removeTrailFromProfile(trailId) {
        if (!this.props.profile) {
            throw new Error('O usuário não possui um perfil de estudante.');
        }
        this.props.profile.removeTrail(trailId);
        this.touch();
    }
    // --- 3. Getters ---
    get name() {
        return this.props.name;
    }
    get username() {
        return this.props.username;
    }
    get email() {
        return this.props.email;
    }
    get passwordHash() {
        return this.props.passwordHash;
    }
    get about() {
        return this.props.about;
    }
    get profileUrl() {
        return this.props.profileUrl;
    }
    get role() {
        return this.props.role;
    }
    get status() {
        return this.props.status;
    }
    get profile() {
        return this.props.profile;
    }
};

//# sourceMappingURL=user.js.map