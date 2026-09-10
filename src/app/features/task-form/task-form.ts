import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
// import { QuillEditorComponent } from "ngx-quill";
import { TaskStore } from "../../core/state/task.store";
import { TASK_STATUSES } from "../../core/models/tasl.model";
import { deadlineNotInPastValidator } from "../../core/utils/deadline.validator";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Underline, List } from "ckeditor5";
@Component({
    selector: "app-task-form",
    imports: [ReactiveFormsModule, CKEditorModule, RouterLink],
    templateUrl: "./task-form.html",
    styleUrl: "./task-form.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly taskStore = inject(TaskStore);

    protected readonly statuses = TASK_STATUSES;
    protected readonly Editor = ClassicEditor;

    protected readonly editorConfig = {
    licenseKey: "GPL",
    plugins: [Essentials, Paragraph, Bold, Italic, Underline, List],
    toolbar: ["undo", "redo", "|", "bold", "italic", "underline", "|", "bulletedList", "numberedList"],
};

    private readonly taskId = signal<string | null>(this.route.snapshot.paramMap.get("id"));
    protected readonly isEditMode = computed(() => this.taskId() !== null);

    private readonly existingTask = computed(() => {
        const id = this.taskId();
        return id ? this.taskStore.getTaskById(id)() : undefined;
    });

    protected readonly taskFound = computed(() => !this.isEditMode() || this.existingTask() !== undefined);

    protected readonly form = this.fb.nonNullable.group({
        title: [this.existingTask()?.title ?? "", [Validators.required]],
        description: [this.existingTask()?.description ?? "", [Validators.required]],
        deadline: [this.existingTask()?.deadline ?? "", [Validators.required, deadlineNotInPastValidator()]],
        status: [this.existingTask()?.status ?? "Pending", [Validators.required]],
    });

    protected isInvalid(controlName: string, errorKey?: string): boolean {
        const control = this.form.get(controlName);
        if (!control || !control.touched) {
            return false;
        }
        return errorKey ? control.hasError(errorKey) : control.invalid;
    }

    protected onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const id = this.taskId();

        if (id) {
            this.taskStore.updateTask(id, value);
            this.router.navigate(["/tasks", id]);
        } else {
            const created = this.taskStore.addTask(value);
            this.router.navigate(["/tasks", created.id]);
        }
    }
}
