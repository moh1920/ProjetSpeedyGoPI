import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TaxiControllerService} from "../../services/services/taxi-controller.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-form-taxi',
  imports: [
    ReactiveFormsModule,
   // NgIf
  ],
  templateUrl: './form-taxi.component.html',
  standalone: true,
  styleUrl: './form-taxi.component.scss'
})
export class FormTaxiComponent {

  taxiForm: FormGroup;

  constructor(private fb: FormBuilder,private taxiService:TaxiControllerService) {
    this.taxiForm = this.fb.group({
      available: [false], // Optional, default is false
      licensePlate: ['', [Validators.required]], // Optional
      model: ['', Validators.required], // Optional
      typeTaxi: ['STANDARD', Validators.required], // Default is 'STANDARD'
    });
  }

  onSubmit(): void {
    if (this.taxiForm.valid) {
      this.taxiService.addTaxi({body:this.taxiForm.value}).subscribe(()=>{
        console.log('Form Submitted:', this.taxiForm.value);

      });
      // Call your service to handle the form submission
    } else {
      console.log('Form is invalid');
    }
  }

}
