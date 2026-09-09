import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { StatusBadge } from "../../../shared/components/status-badge/status-badge";
import { Task } from "../../../core/models/tasl.model";
import { StripHtmlPipe } from "../../../shared/pipes/strip-html-pipe";
@Component({
    selector: "app-task-card",
    imports: [DatePipe, StripHtmlPipe, StatusBadge],
    templateUrl: "./task-card.html",
    styleUrl: "./task-card.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCard {
    readonly task = input.required<Task>();

    readonly view = output<void>();
    readonly edit = output<void>();
    readonly delete = output<void>();
}
