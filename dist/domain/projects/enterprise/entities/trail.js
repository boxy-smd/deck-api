"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Trail", {
    enumerable: true,
    get: function() {
        return Trail;
    }
});
const _entity = require("../../../../shared/kernel/entity");
let Trail = class Trail extends _entity.Entity {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new Trail(props, id);
    }
    reconstitute(props, id, createdAt, updatedAt) {
        return new Trail(props, id, createdAt, updatedAt);
    }
    // --- 3. Getters ---
    get name() {
        return this.props.name;
    }
};

//# sourceMappingURL=trail.js.map