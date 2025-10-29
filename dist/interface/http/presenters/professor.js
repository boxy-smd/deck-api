"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProfessorPresenter", {
    enumerable: true,
    get: function() {
        return ProfessorPresenter;
    }
});
let ProfessorPresenter = class ProfessorPresenter {
    static toHTTP(professor) {
        return {
            id: professor.id.toString(),
            name: professor.name
        };
    }
};

//# sourceMappingURL=professor.js.map