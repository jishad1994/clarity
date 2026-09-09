import { Component, inject, input } from "@angular/core";
import { CommentForm, CommentSubmission } from "../comment-form/comment-form";
import { CommentItem } from "../comment-item/comment-item";
import { CommentStore } from "../../../core/state/comment.store";

@Component({
    selector: "app-comment-list",
    imports: [CommentForm, CommentItem],
    templateUrl: "./comment-list.html",
    styleUrl: "./comment-list.css",
})
export class CommentList {
    private readonly commentStore = inject(CommentStore);

    readonly taskId = input.required<string>();

    protected get comments() {
        return this.commentStore.getCommentsForTask(this.taskId());
    }

    protected get commentCount() {
        return this.commentStore.getCommentCount(this.taskId());
    }

    protected onNewComment(submission: CommentSubmission): void {
        this.commentStore.addComment({
            taskId: this.taskId(),
            author: submission.author,
            content: submission.content,
            parentId: null,
        });
    }

    protected onReply(event: { parentId: string; submission: CommentSubmission }): void {
        this.commentStore.addComment({
            taskId: this.taskId(),
            author: event.submission.author,
            content: event.submission.content,
            parentId: event.parentId,
        });
    }
}
