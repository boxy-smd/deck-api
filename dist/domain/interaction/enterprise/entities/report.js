"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Report", {
    enumerable: true,
    get: function() {
        return Report;
    }
});
const _entity = require("../../../../shared/kernel/entity");
let Report = class Report extends _entity.Entity {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new Report({
            ...props,
            isResolved: false
        }, id);
    }
    static reconstitute(props, id, createdAt, updatedAt) {
        return new Report(props, id, createdAt, updatedAt);
    }
    // --- 2. Methods ---
    resolve() {
        this.props.isResolved = true;
        this.touch();
    }
    // --- 3. Getters ---
    get content() {
        return this.props.content;
    }
    get isResolved() {
        return this.props.isResolved;
    }
    get authorId() {
        return this.props.authorId;
    }
    get commentId() {
        return this.props.commentId;
    }
};

//# sourceMappingURL=report.js.map