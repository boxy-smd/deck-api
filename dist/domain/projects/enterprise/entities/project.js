"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Project", {
    enumerable: true,
    get: function() {
        return Project;
    }
});
const _aggregateroot = require("../../../../shared/kernel/aggregate-root");
const _comment = require("../../../interaction/enterprise/entities/comment");
const _projectstatus = require("../value-objects/project-status");
let Project = class Project extends _aggregateroot.AggregateRoot {
    // --- 1. Factory methods ---
    static create(props, id) {
        return new Project({
            ...props,
            trails: props.trails ?? new Set(),
            professors: props.professors ?? new Set(),
            comments: props.comments ?? new Set()
        }, id);
    }
    static reconstitute(props, id, createdAt, updatedAt) {
        return new Project(props, id, createdAt, updatedAt);
    }
    // -- 2. Public methods ---
    addToDrafts() {
        this.props.status = _projectstatus.ProjectStatus.DRAFT;
        this.touch();
    }
    post() {
        this.props.status = _projectstatus.ProjectStatus.PUBLISHED;
        this.touch();
    }
    archive() {
        this.props.status = _projectstatus.ProjectStatus.ARCHIVED;
        this.touch();
    }
    unarchive() {
        this.props.status = _projectstatus.ProjectStatus.PUBLISHED;
        this.touch();
    }
    editInfo({ title, description, bannerUrl, content, publishedYear, semester, allowComments, subjectId }) {
        if (title) {
            this.props.title = title;
        }
        if (description) {
            this.props.description = description;
        }
        if (bannerUrl) {
            this.props.bannerUrl = bannerUrl;
        }
        if (content) {
            this.props.content = content;
        }
        if (publishedYear) {
            this.props.publishedYear = publishedYear;
        }
        if (semester) {
            this.props.semester = semester;
        }
        if (allowComments) {
            this.props.allowComments = allowComments;
        }
        if (subjectId) {
            this.props.subjectId = subjectId;
        }
        this.touch();
    }
    defineTrails(trails) {
        this.props.trails = new Set(trails);
        this.touch();
    }
    defineProfessors(professors) {
        this.props.professors = new Set(professors);
        this.touch();
    }
    comment(content, authorId) {
        const comment = _comment.Comment.create({
            content,
            authorId,
            projectId: this.id
        });
        this.props.comments.add(comment);
        this.touch();
        return comment;
    }
    removeComment(comment) {
        this.props.comments.delete(comment);
        this.touch();
    }
    // --- 3. Getters ---
    get title() {
        return this.props.title;
    }
    get description() {
        return this.props.description;
    }
    get bannerUrl() {
        return this.props.bannerUrl;
    }
    get content() {
        return this.props.content || '';
    }
    get publishedYear() {
        return this.props.publishedYear;
    }
    get status() {
        return this.props.status;
    }
    get semester() {
        return this.props.semester;
    }
    get allowComments() {
        return this.props.allowComments;
    }
    get authorId() {
        return this.props.authorId;
    }
    get subjectId() {
        return this.props.subjectId;
    }
    get trails() {
        return [
            ...this.props.trails
        ];
    }
    get professors() {
        return [
            ...this.props.professors
        ];
    }
    get comments() {
        return [
            ...this.props.comments
        ];
    }
};

//# sourceMappingURL=project.js.map