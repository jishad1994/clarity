import { ChangeDetectionStrategy, Component, input, output, signal } from "@angular/core";
import { CommentForm, CommentSubmission } from "../comment-form/comment-form";
import { DatePipe } from "@angular/common";
import { Comment } from "../../../core/models/comment.model";

@Component({
    selector: "app-comment-item",
    imports: [CommentForm, CommentItem,DatePipe],
    templateUrl: "./comment-item.html",
    styleUrl: "./comment-item.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentItem {
    readonly comment = input.required<Comment>();

    /** Bubbles a reply request up to the top-level comment list, tagged with the target parent id */
    readonly reply = output<{ parentId: string; submission: CommentSubmission }>();

    protected readonly replying = signal(false);

    protected onReply(submission: CommentSubmission): void {
        this.reply.emit({ parentId: this.comment().id, submission });
        this.replying.set(false);
    }

    /** Re-bubbles a reply event coming from a deeper (grand-child) comment */
    protected onNestedReply(event: { parentId: string; submission: CommentSubmission }): void {
        this.reply.emit(event);
    }
}
