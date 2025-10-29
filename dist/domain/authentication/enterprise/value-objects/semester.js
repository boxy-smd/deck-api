"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Semester", {
    enumerable: true,
    get: function() {
        return Semester;
    }
});
const _either = require("../../../../shared/either");
const _valueobject = require("../../../../shared/kernel/value-object");
const _semesteroutofboundserror = require("../../application/errors/semester-out-of-bounds.error");
let Semester = class Semester extends _valueobject.ValueObject {
    get value() {
        return this.props.value;
    }
    static validate(semester) {
        return semester < 1 || semester > 12;
    }
    static create(semester) {
        if (Semester.validate(semester)) {
            return (0, _either.left)(new _semesteroutofboundserror.SemesterOutOfBoundsError('O semestre deve ser um número entre 1 e 12.'));
        }
        return (0, _either.right)(new Semester({
            value: semester
        }));
    }
    increment() {
        if (this.props.value === 12) {
            throw new Error('O semestre não pode ser maior que 12.');
        }
        this.props.value++;
    }
    update(semester) {
        if (Semester.validate(semester)) {
            throw new Error('O semestre deve ser um número entre 1 e 12.');
        }
        this.props.value = semester;
    }
};

//# sourceMappingURL=semester.js.map