"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectPresenter", {
    enumerable: true,
    get: function() {
        return ProjectPresenter;
    }
});
let ProjectPresenter = class ProjectPresenter {
    static toHTTP(project) {
        return {
            id: project.id.toString(),
            title: project.title,
            description: project.description,
            bannerUrl: project.bannerUrl,
            content: project.content,
            publishedYear: project.publishedYear,
            status: project.status,
            semester: project.semester,
            allowComments: project.allowComments,
            authorId: project.authorId.toString(),
            subjectId: project.subjectId?.toString(),
            trailsIds: project.trails.map((trail)=>trail.id.toString()),
            professorsIds: project.professors?.map((professor)=>professor.id.toString())
        };
    }
};

//# sourceMappingURL=project.js.map