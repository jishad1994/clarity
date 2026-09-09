// export type TaskStatus = "Pending" | "In Progress" | "Completed";

// export const TASK_STATUSES: readonly TaskStatus[] = ["Pending", "In Progress", "Completed"];

export const TASK_STATUSES = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
} as const;

export type TaskStatus = typeof TASK_STATUSES[keyof typeof TASK_STATUSES];

export interface Task {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: TaskStatus;
}

///Shape used by the task form before an id has been assigned
export type TaskDraft = Omit<Task, "id">;
