"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StudentPresenter", {
    enumerable: true,
    get: function() {
        return StudentPresenter;
    }
});
let StudentPresenter = class StudentPresenter {
    static toHTTP(student) {
        return {
            id: student.id.toString(),
            name: student.name,
            username: student.username.value,
            semester: student.profile?.semester.value || 1,
            profileUrl: student.profileUrl || '',
            trails: student.profile?.trailsIds ? Array.from(student.profile.trailsIds).map((id)=>id.toString()) : []
        };
    }
};

//# sourceMappingURL=student.js.map