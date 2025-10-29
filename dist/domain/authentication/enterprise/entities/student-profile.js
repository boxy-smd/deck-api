"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StudentProfile", {
    enumerable: true,
    get: function() {
        return StudentProfile;
    }
});
const _entity = require("../../../../shared/kernel/entity");
let StudentProfile = class StudentProfile extends _entity.Entity {
    static create(props, studentId) {
        return new StudentProfile({
            ...props,
            trailsIds: new Set()
        }, studentId);
    }
    static reconstitute(props, studentId, createdAt, updatedAt) {
        return new StudentProfile(props, studentId, createdAt, updatedAt);
    }
    updateSemester(semester) {
        this.props.semester = semester;
    }
    addTrail(trailId) {
        this.props.trailsIds.add(trailId);
    }
    removeTrail(trailId) {
        this.props.trailsIds.delete(trailId);
    }
    // --- 3. Getters ---
    get semester() {
        return this.props.semester;
    }
    get trailsIds() {
        // Return a copy to prevent external mutation
        return [
            ...this.props.trailsIds
        ];
    }
};

//# sourceMappingURL=student-profile.js.map