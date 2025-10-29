"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Subject", {
    enumerable: true,
    get: function() {
        return Subject;
    }
});
const _entity = require("../../../../shared/kernel/entity");
let Subject = class Subject extends _entity.Entity {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new Subject(props, id);
    }
    reconstitute(props, id, createdAt, updatedAt) {
        return new Subject(props, id, createdAt, updatedAt);
    }
    // --- 3. Getters ---
    get name() {
        return this.props.name;
    }
    get code() {
        return this.props.code;
    }
    get workload() {
        return this.props.workload;
    }
    get semester() {
        return this.props.semester;
    }
    get type() {
        return this.props.type;
    }
};

//# sourceMappingURL=subject.js.map