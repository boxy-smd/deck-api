"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Entity", {
    enumerable: true,
    get: function() {
        return Entity;
    }
});
const _uniqueentityid = require("./unique-entity-id");
let Entity = class Entity {
    get id() {
        return this._id;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(value) {
        this._createdAt = value;
    }
    get updatedAt() {
        return this._updatedAt;
    }
    set updatedAt(value) {
        this._updatedAt = value;
    }
    equals(entity) {
        if (entity === this) {
            return true;
        }
        if (entity.id === this._id) {
            return true;
        }
        return false;
    }
    touch() {
        this._updatedAt = new Date();
    }
    constructor(props, id, createdAt, updatedAt){
        this._id = id ?? new _uniqueentityid.UniqueEntityID();
        this.props = props;
        this._createdAt = createdAt ?? new Date();
        this._updatedAt = updatedAt ?? new Date();
    }
};

//# sourceMappingURL=entity.js.map