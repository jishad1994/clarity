import { Routes } from "@angular/router";
import { tasksLoadedResolver } from "./core/state/task-loaded.resolver";

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "tasks" },
    {
        path: "tasks",
        resolve: { tasksLoaded: tasksLoadedResolver },
        loadComponent: () => import("./features/task-list/task-list.component.ts/task-list").then((m) => m.TaskList),
    },
    {
        path: "tasks/new",
        resolve: { tasksLoaded: tasksLoadedResolver },
        loadComponent: () => import("./features/task-form/task-form").then((m) => m.TaskForm),
    },
    {
        path: "tasks/:id",
        resolve: { tasksLoaded: tasksLoadedResolver },
        loadComponent: () =>
            import("./features/task-details/task-details-component/task-details").then((m) => m.TaskDetails),
    },
    {
        path: "tasks/:id/edit",
        resolve: { tasksLoaded: tasksLoadedResolver },
        loadComponent: () => import("./features/task-form/task-form").then((m) => m.TaskForm),
    },
    {
        path: "calendar",
        resolve: { tasksLoaded: tasksLoadedResolver },
        loadComponent: () =>
            import("./features/calendar-view/calendar-view-component").then((m) => m.CalendarViewComponent),
    },
    { path: "**", redirectTo: "tasks" },
];
