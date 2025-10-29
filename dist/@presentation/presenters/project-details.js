"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ProjectDetailsPresenter", {
    enumerable: true,
    get: function() {
        return ProjectDetailsPresenter;
    }
});
let ProjectDetailsPresenter = class ProjectDetailsPresenter {
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
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            authorId: project.authorId.toString(),
            author: project.metadata?.author,
            subjectId: project.subjectId?.toString(),
            subject: project.metadata?.subject,
            trails: project.metadata?.trails || [],
            professors: project.metadata?.professors || [],
            comments: project.metadata?.comments || []
        };
    }
};

//# sourceMappingURL=project-details.js.map