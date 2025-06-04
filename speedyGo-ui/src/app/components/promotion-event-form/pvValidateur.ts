import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function startDateValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = new Date(control.value);
  const currentDate = new Date();
  if (startDate <= currentDate) {
    return { startDateInvalid: 'Start date must be in the future.' };
  }
  return null;
}

export function endDateValidator(formGroup: AbstractControl): ValidationErrors | null {
  const startDate = formGroup.get('startDate')?.value;
  const endDate = formGroup.get('endDate')?.value;

  if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
    return { endDateInvalid: 'End date must be greater than start date.' };
  }
  return null;
}
