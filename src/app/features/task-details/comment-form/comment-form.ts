import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

export interface CommentSubmission {
    author: string;
    content: string;
}

@Component({
    selector: "app-comment-form",
    imports: [ReactiveFormsModule],
    templateUrl: "./comment-form.html",
    styleUrl: "./comment-form.css",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentForm {
    private readonly fb = inject(FormBuilder);

    readonly placeholder = input("Write a comment…");
    readonly submitLabel = input("Comment");
    readonly showCancel = input(false);

    readonly submitted = output<CommentSubmission>();
    readonly cancelRequested = output<void>();

    protected readonly form = this.fb.nonNullable.group({
        author: ["", [Validators.required]],
        content: ["", [Validators.required]],
    });

    protected onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        this.submitted.emit(this.form.getRawValue());
        this.form.reset({ author: this.form.getRawValue().author, content: "" });
    }
}
