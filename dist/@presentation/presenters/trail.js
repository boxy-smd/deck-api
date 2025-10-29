"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "TrailPresenter", {
    enumerable: true,
    get: function() {
        return TrailPresenter;
    }
});
let TrailPresenter = class TrailPresenter {
    static toHTTP(trail) {
        return {
            id: trail.id.toString(),
            name: trail.name
        };
    }
};

//# sourceMappingURL=trail.js.map