import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {TaxiControllerService} from "../../services/services/taxi-controller.service";

@Component({
    selector: 'app-taxi-form',
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './taxi-form.component.html',
    standalone: true,
    styleUrl: './taxi-form.component.scss'
})
export class TaxiFormComponent {
  taxiForm: FormGroup;
  isFormOpen: boolean = false;
  isOtherModelSelected: boolean = false;
  currentDateTime: string = '2025-03-01 17:05:00';

   constructor(private fb: FormBuilder,private taxiService:TaxiControllerService) {
     this.taxiForm = this.fb.group({
       available: [false], // Optional, default is false
       licensePlate: ['', [Validators.required]], // Optional
       model: ['', Validators.required], // Optional
       otherModel: [''], // Field for custom model (if selected "Other")

       typeTaxi: ['STANDARD', Validators.required], // Default is 'STANDARD'
     });
   }

    // Open the form popup
  openForm(): void {
    this.isFormOpen = true;
  }

  // Close the form popup
  closeForm(): void {
    this.isFormOpen = false;
  }
    // Handle the change in model selection
    onModelChange(): void {
      const selectedModel = this.taxiForm.get('model')?.value;
      if (selectedModel === 'Other') {
        this.isOtherModelSelected = true; // Show the "Other" model input field
        this.taxiForm.get('otherModel')?.setValidators([Validators.required]); // Make the "Other" model field required
      } else {
        this.isOtherModelSelected = false; // Hide the "Other" model input field
        this.taxiForm.get('otherModel')?.clearValidators(); // Remove the required validator from "Other" model
        this.taxiForm.get('otherModel')?.reset(); // Reset the "Other" model field
      }
    }


   onSubmit(): void {
     // If "Other" is selected, update the model field to the value of otherModel
     if (this.taxiForm.get('model')?.value === 'Other') {
      this.taxiForm.get('model')?.setValue(this.taxiForm.get('otherModel')?.value);
    }
     if (this.taxiForm.valid) {
       this.taxiService.addTaxi({body:this.taxiForm.value}).subscribe(()=>{
         console.log('Form Submitted:', this.taxiForm.value);

       });
       // Call your service to handle the form submission
     } else {
       console.log('Form is invalid');
     }
   }
 // date for the page
 ngOnInit() {
  this.updateDateTime();
  // Met à jour la date toutes les secondes
  setInterval(() => this.updateDateTime(), 1000);
}

private updateDateTime() {
  const now = new Date();
  this.currentDateTime = now.toISOString().slice(0, 19).replace('T', ' ');
}
 }
