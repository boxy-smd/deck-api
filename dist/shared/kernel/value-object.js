"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ValueObject", {
    enumerable: true,
    get: function() {
        return ValueObject;
    }
});
let ValueObject = class ValueObject {
    equals(vo) {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (vo.props === undefined) {
            return false;
        }
        return JSON.stringify(vo.props) === JSON.stringify(this.props);
    }
    constructor(props){
        this.props = props;
    }
};

//# sourceMappingURL=value-object.js.map