"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Comment", {
    enumerable: true,
    get: function() {
        return Comment;
    }
});
const _entity = require("../../../../shared/kernel/entity");
const _report = require("./report");
let Comment = class Comment extends _entity.Entity {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new Comment({
            ...props,
            reports: new Set()
        }, id);
    }
    static reconstitute(props, id, createdAt, updatedAt) {
        return new Comment(props, id, createdAt, updatedAt);
    }
    // --- 2. Methods ---
    updateContent(newContent) {
        this.props.content = newContent;
    }
    report(content, authorId) {
        const report = _report.Report.create({
            content: content,
            authorId: authorId,
            commentId: this.id
        });
        this.props.reports.add(report);
        this.touch();
    }
    // --- 3. Getters ---
    get content() {
        return this.props.content;
    }
    get authorId() {
        return this.props.authorId;
    }
    get projectId() {
        return this.props.projectId;
    }
    get reports() {
        return [
            ...this.props.reports
        ];
    }
};

//# sourceMappingURL=comment.js.map