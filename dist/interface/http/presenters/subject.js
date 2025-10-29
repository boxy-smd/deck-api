"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "SubjectPresenter", {
    enumerable: true,
    get: function() {
        return SubjectPresenter;
    }
});
let SubjectPresenter = class SubjectPresenter {
    static toHTTP(subject) {
        return {
            id: subject.id.toString(),
            name: subject.name,
            code: subject.code,
            workload: subject.workload,
            semester: subject.semester,
            type: subject.type
        };
    }
};

//# sourceMappingURL=subject.js.map