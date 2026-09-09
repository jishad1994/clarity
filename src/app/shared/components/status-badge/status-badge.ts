import { Component, computed, input } from "@angular/core";
import { TaskStatus } from "../../../core/models/tasl.model";

const STATUS_CLASSES: Record<TaskStatus, string> = {
    Pending: "bg-amber-100 text-amber-800",
    "In Progress": "bg-sky-100 text-sky-800",
    Completed: "bg-emerald-100 text-emerald-800",
};

@Component({
    selector: "app-status-badge",
    imports: [],
    templateUrl: "./status-badge.html",
    styleUrl: "./status-badge.css",
})
export class StatusBadge {
    readonly status = input.required<TaskStatus>();
    readonly classes = computed(() => STATUS_CLASSES[this.status()]);
}
