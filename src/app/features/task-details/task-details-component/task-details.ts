import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { TaskStore } from "../../../core/state/task.store";
import { DatePipe } from "@angular/common";
import { StatusBadge } from "../../../shared/components/status-badge/status-badge";
import { CommentList } from "../comment-list/comment-list";

@Component({
    selector: "app-task-details",
    imports: [RouterLink, DatePipe, StatusBadge, CommentList],
    templateUrl: "./task-details.html",
    styleUrl: "./task-details.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetails {
    private readonly route = inject(ActivatedRoute);
    private readonly taskStore = inject(TaskStore);

    private readonly id = this.route.snapshot.paramMap.get("id") ?? "";
    protected readonly task = this.taskStore.getTaskById(this.id);
}
