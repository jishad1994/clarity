import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/*  Rejects a date control whose value is strictly earlier than today. */

export function deadlineNotInPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value as string | null;
        if (!value) {
            return null; // let `required` handle the empty case
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const deadline = new Date(value);
        deadline.setHours(0, 0, 0, 0);

        return deadline.getTime() < today.getTime() ? { deadlineInPast: true } : null;
    };
}
