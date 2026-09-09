import { Component, computed, inject } from "@angular/core";
import {
    CalendarDatePipe,
    CalendarEvent,
    CalendarMonthViewComponent,
    CalendarNextViewDirective,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarView,
    DateAdapter,
    provideCalendar,
} from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { Task, TaskStatus } from "../../core/models/tasl.model";
import { TaskStore } from "../../core/state/task.store";
import { Router } from "@angular/router";

/** Extra data we stash on each calendar event so a click can route back to the task */
interface TaskEventMeta {
    taskId: string;
}

type TaskCalendarEvent = CalendarEvent<TaskEventMeta>;

interface MonthViewEventClicked {
    event: TaskCalendarEvent;
    sourceEvent: MouseEvent | KeyboardEvent;
}

const STATUS_COLORS: Record<TaskStatus, { primary: string; secondary: string }> = {
    Pending: { primary: "#d97706", secondary: "#fef3c7" }, // amber
    "In Progress": { primary: "#0284c7", secondary: "#e0f2fe" }, // sky
    Completed: { primary: "#059669", secondary: "#d1fae5" }, // emerald
};
@Component({
    selector: "app-calendar-view-component",
    imports: [
        CalendarDatePipe,
        CalendarMonthViewComponent,
        CalendarPreviousViewDirective,
        CalendarTodayDirective,
        CalendarNextViewDirective,
    ],
    providers: [
        provideCalendar({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ],
    templateUrl: "./calendar-view-component.html",
    styleUrl: "./calendar-view-component.css",
})
export class CalendarViewComponent {
    private readonly taskStore = inject(TaskStore);
    private readonly router = inject(Router);

    protected readonly calendarView = CalendarView.Month;
    protected readonly statusOrder: TaskStatus[] = ["Pending", "In Progress", "Completed"];
    protected readonly statusColors = STATUS_COLORS;

    /** Plain (non-signal) property: required so `angular-calendar`'s directives can two-way bind to it */
    protected viewDate: Date = new Date();

    protected readonly events = computed<TaskCalendarEvent[]>(() =>
        this.taskStore.tasks().map((task) => this.toCalendarEvent(task)),
    );

    private toCalendarEvent(task: Task): TaskCalendarEvent {
        return {
            start: new Date(task.deadline),
            title: task.title,
            color: this.statusColors[task.status],
            allDay: true,
            meta: { taskId: task.id },
        };
    }

    protected onEventClicked({ event }: MonthViewEventClicked): void {
        this.router.navigate(["/tasks", event.meta?.taskId]);
    }
}
