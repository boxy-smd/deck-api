"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Username", {
    enumerable: true,
    get: function() {
        return Username;
    }
});
const _either = require("../../../../shared/either");
const _valueobject = require("../../../../shared/kernel/value-object");
const _usernamebadformattederror = require("../../application/errors/username-bad-formatted.error");
const _usernameinvalidsizeerror = require("../../application/errors/username-invalid-size.error");
let Username = class Username extends _valueobject.ValueObject {
    get value() {
        return this.props.value;
    }
    static validate(username) {
        const MIN_LENGTH = 3;
        const MAX_LENGTH = 20;
        const regex = /^[a-zA-Z0-9._-]{3,20}$/ // Alphanumeric, underscore, hyphen, and dot
        ;
        const isTooShort = username.length < MIN_LENGTH;
        const isTooLong = username.length > MAX_LENGTH;
        const isBadFormatted = !regex.test(username);
        return [
            isBadFormatted,
            isTooShort,
            isTooLong
        ];
    }
    static create(username) {
        const [isBadFormatted, isTooShort, isTooLong] = Username.validate(username);
        if (isBadFormatted) {
            return (0, _either.left)(new _usernamebadformattederror.UsernameBadFormattedError('O nome de usuário deve conter apenas letras, números, sublinhados, hifens e pontos.'));
        }
        if (isTooShort) {
            return (0, _either.left)(new _usernameinvalidsizeerror.UsernameInvalidSizeError('O nome de usuário deve ter pelo menos 3 caracteres.'));
        }
        if (isTooLong) {
            return (0, _either.left)(new _usernameinvalidsizeerror.UsernameInvalidSizeError('O nome de usuário deve ter no máximo 20 caracteres.'));
        }
        return (0, _either.right)(new Username({
            value: username
        }));
    }
};

//# sourceMappingURL=username.js.map