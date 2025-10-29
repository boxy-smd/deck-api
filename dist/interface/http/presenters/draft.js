"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "DraftPresenter", {
    enumerable: true,
    get: function() {
        return DraftPresenter;
    }
});
let DraftPresenter = class DraftPresenter {
    static toHTTP(draft) {
        return {
            id: draft.id.toString(),
            title: draft.title,
            description: draft.description,
            bannerUrl: draft.bannerUrl,
            content: draft.content,
            publishedYear: draft.publishedYear,
            semester: draft.semester,
            allowComments: draft.allowComments,
            status: draft.status,
            authorId: draft.authorId.toString(),
            subjectId: draft.subjectId?.toString(),
            trailsIds: Array.from(draft.trails).map((trailId)=>trailId.toString()),
            professorsIds: Array.from(draft.professors).map((professorId)=>professorId.toString())
        };
    }
};

//# sourceMappingURL=draft.js.map