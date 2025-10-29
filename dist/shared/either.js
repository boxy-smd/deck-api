"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get Left () {
        return Left;
    },
    get Right () {
        return Right;
    },
    get left () {
        return left;
    },
    get right () {
        return right;
    }
});
let Left = class Left {
    isLeft() {
        return true;
    }
    isRight() {
        return false;
    }
    constructor(value){
        this.value = value;
    }
};
let Right = class Right {
    isLeft() {
        return false;
    }
    isRight() {
        return true;
    }
    constructor(value){
        this.value = value;
    }
};
function left(l) {
    return new Left(l);
}
function right(r) {
    return new Right(r);
}

//# sourceMappingURL=either.js.map