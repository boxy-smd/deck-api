"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "StudentProfileWithDetails", {
    enumerable: true,
    get: function() {
        return StudentProfileWithDetails;
    }
});
let StudentProfileWithDetails = class StudentProfileWithDetails {
    get student() {
        return this._props.student;
    }
    get id() {
        return this._props.student.id.toString();
    }
    get name() {
        return this._props.student.name;
    }
    get username() {
        return this._props.student.username.value;
    }
    get email() {
        return this._props.student.email.value;
    }
    get about() {
        return this._props.student.about;
    }
    get profileUrl() {
        return this._props.student.profileUrl;
    }
    get semester() {
        return this._props.student.profile?.semester.value || 1;
    }
    get role() {
        return this._props.student.role;
    }
    get status() {
        return this._props.student.status;
    }
    get trails() {
        return this._props.trails;
    }
    get posts() {
        return this._props.posts;
    }
    static create(props) {
        return new StudentProfileWithDetails(props);
    }
    constructor(props){
        this._props = props;
    }
};

//# sourceMappingURL=student-profile-with-details.js.map