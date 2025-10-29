"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BcryptHasher", {
    enumerable: true,
    get: function() {
        return BcryptHasher;
    }
});
const _bcrypt = require("bcrypt");
let BcryptHasher = class BcryptHasher {
    hash(plain) {
        return (0, _bcrypt.hash)(plain, this.HASH_SALT_LENGTH);
    }
    compare(plain, hash) {
        return (0, _bcrypt.compare)(plain, hash);
    }
    constructor(){
        this.HASH_SALT_LENGTH = 8;
    }
};

//# sourceMappingURL=bcrypt-hasher.js.map