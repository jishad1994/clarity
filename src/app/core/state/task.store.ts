import { computed, inject, Injectable, signal } from "@angular/core";
import { Task, TaskDraft, TaskStatus } from "../models/tasl.model";
import { TaskService } from "../services/task-service/task-service";
import { Observable, tap } from "rxjs";
import { generateId } from "../utils/id-generator.util";

@Injectable({ providedIn: "root" })
export class TaskStore {
    private readonly taskService = inject(TaskService);

    private readonly tasksSignal = signal<Task[]>([]);
    private readonly loadedSignal = signal(false);
    private readonly loadingSignal = signal(false);
    private readonly errorSignal = signal<string | null>(null);

    /** Read-only view of the full task collection */
    readonly tasks = this.tasksSignal.asReadonly();
    readonly loaded = this.loadedSignal.asReadonly();
    readonly loading = this.loadingSignal.asReadonly();
    readonly error = this.errorSignal.asReadonly();

    /** Tasks sorted by nearest deadline first - reused by list and calendar views */
    readonly tasksByDeadline = computed(() =>
        [...this.tasksSignal()].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()),
    );

    readonly totalCount = computed(() => this.tasksSignal().length);

    readonly countByStatus = computed<Record<TaskStatus, number>>(() => {
        const counts: Record<TaskStatus, number> = { Pending: 0, "In Progress": 0, Completed: 0 };
        for (const task of this.tasksSignal()) {
            counts[task.status]++;
        }
        return counts;
    });

    /** Loads the seed data exactly once; safe to call from every route that needs tasks */
    loadTasks(): Observable<Task[]> {
        this.loadingSignal.set(true);
        this.errorSignal.set(null);

        return this.taskService.fetchTasks().pipe(
            tap({
                next: (tasks) => {
                    this.tasksSignal.set(tasks);
                    this.loadedSignal.set(true);
                    this.loadingSignal.set(false);
                },
                error: () => {
                    this.errorSignal.set("Unable to load tasks from assets/tasks.json.");
                    this.loadingSignal.set(false);
                },
            }),
        );
    }

    getTaskById(id: string) {
        return computed(() => this.tasksSignal().find((task) => task.id === id));
    }

    addTask(draft: TaskDraft): Task {
        const task: Task = { ...draft, id: generateId("task") };
        this.tasksSignal.update((tasks) => [task, ...tasks]);
        return task;
    }

    updateTask(id: string, changes: TaskDraft): void {
        this.tasksSignal.update((tasks) => tasks.map((task) => (task.id === id ? { ...task, ...changes, id } : task)));
    }

    deleteTask(id: string): void {
        this.tasksSignal.update((tasks) => tasks.filter((task) => task.id !== id));
    }
}
