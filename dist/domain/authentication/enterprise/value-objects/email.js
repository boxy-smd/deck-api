"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Email", {
    enumerable: true,
    get: function() {
        return Email;
    }
});
const _valueobject = require("../../../../shared/kernel/value-object");
const _emailbadformattederror = require("../../application/errors/email-bad-formatted.error");
let Email = class Email extends _valueobject.ValueObject {
    get value() {
        return this.props.value;
    }
    static validate(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const institutionEmailRegex = /@alu.ufc.br$/;
        return [
            !emailRegex.test(email),
            !institutionEmailRegex.test(email)
        ];
    }
    static create(email) {
        const [isEmailBadFormatted, isNotInstitutionEmail] = Email.validate(email);
        if (isEmailBadFormatted) throw new _emailbadformattederror.EmailBadFormattedError('O e-mail é inválido.');
        if (isNotInstitutionEmail) throw new _emailbadformattederror.EmailBadFormattedError('O e-mail deve ser institucional.');
        return new Email({
            value: email
        });
    }
};

//# sourceMappingURL=email.js.map