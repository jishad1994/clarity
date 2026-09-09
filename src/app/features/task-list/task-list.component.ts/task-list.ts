import { Component, computed, inject, signal } from "@angular/core";
import { TaskCard } from "../task-card/task-card";
import { ConfirmDialog } from "../../../shared/components/confirm-dialog/confirm-dialog";
import { TASK_STATUSES, TaskStatus } from "../../../core/models/tasl.model";
import { Router } from "@angular/router";
import { TaskStore } from "../../../core/state/task.store";
type StatusFilter = TaskStatus | "All";
@Component({
    selector: "app-task-list",
    imports: [TaskCard, ConfirmDialog],
    templateUrl: "./task-list.html",
    styleUrl: "./task-list.css",
})
export class TaskList {
    protected readonly taskStore = inject(TaskStore);
    protected readonly router = inject(Router);

    protected readonly statusFilters: StatusFilter[] = ["All", ...TASK_STATUSES];
    protected readonly activeFilter = signal<StatusFilter>("All");
    protected readonly pendingDeleteId = signal<string | null>(null);

    protected readonly filteredTasks = computed(() => {
        const filter = this.activeFilter();
        const tasks = this.taskStore.tasksByDeadline();
        return filter === "All" ? tasks : tasks.filter((task) => task.status === filter);
    });

    protected confirmDelete(id: string): void {
        this.taskStore.deleteTask(id);
        this.pendingDeleteId.set(null);
    }
}
