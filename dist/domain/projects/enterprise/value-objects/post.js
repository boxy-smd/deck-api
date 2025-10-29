"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Post", {
    enumerable: true,
    get: function() {
        return Post;
    }
});
let Post = class Post {
    get id() {
        return this._props.id;
    }
    get title() {
        return this._props.title;
    }
    get description() {
        return this._props.description;
    }
    get bannerUrl() {
        return this._props.bannerUrl;
    }
    get content() {
        return this._props.content;
    }
    get publishedYear() {
        return this._props.publishedYear;
    }
    get status() {
        return this._props.status;
    }
    get semester() {
        return this._props.semester;
    }
    get createdAt() {
        return this._props.createdAt;
    }
    get updatedAt() {
        return this._props.updatedAt;
    }
    get authorId() {
        return this._props.authorId;
    }
    get author() {
        return this._props.author;
    }
    get subjectId() {
        return this._props.subjectId;
    }
    get subject() {
        return this._props.subject;
    }
    get trails() {
        return this._props.trails;
    }
    get professors() {
        return this._props.professors;
    }
    constructor(props){
        this._props = props;
    }
};

//# sourceMappingURL=post.js.map