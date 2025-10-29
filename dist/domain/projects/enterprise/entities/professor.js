"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Professor", {
    enumerable: true,
    get: function() {
        return Professor;
    }
});
const _entity = require("../../../../shared/kernel/entity");
let Professor = class Professor extends _entity.Entity {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new Professor(props, id);
    }
    reconstitute(props, id, createdAt, updatedAt) {
        return new Professor(props, id, createdAt, updatedAt);
    }
    // --- 3. Getters ---
    get name() {
        return this.props.name;
    }
};

//# sourceMappingURL=professor.js.map