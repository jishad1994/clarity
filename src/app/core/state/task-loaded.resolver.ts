import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { TaskStore } from "./task.store";
import { map, of } from "rxjs";

// resolver function Ensures the task collection has been fetched from assets/tasks.json before accessing task related routes

export const tasksLoadedResolver: ResolveFn<boolean> = () => {
    const taskStore = inject(TaskStore);

    if (taskStore.loaded()) {
        return of(true);
    }

    return taskStore.loadTasks().pipe(map(() => true));
};
