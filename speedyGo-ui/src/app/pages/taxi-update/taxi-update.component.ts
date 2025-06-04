import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateTaxi$Params } from 'src/app/services/fn/taxi-controller/update-taxi';
import {TaxiStateService} from "../../services/services/taxi-state.service";
import {TaxiControllerService} from "../../services/services/taxi-controller.service";


@Component({
  selector: 'app-taxi-update',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './taxi-update.component.html',
  standalone: true,
  styleUrl: './taxi-update.component.scss'
})
export class TaxiUpdateComponent {
  @Input() taxi: any; // This will receive the taxi data to update
  taxiForm: FormGroup;
  isFormOpen = false;
  isOtherModelSelected = false;

  constructor(private fb: FormBuilder, private taxiService: TaxiControllerService, private taxiStateService: TaxiStateService) {
    this.taxiForm = this.fb.group({
      available: [false],
      licensePlate: ['', [Validators.required]],
      model: ['', Validators.required],
      otherModel: [''],
      typeTaxi: ['STANDARD', Validators.required],
    });
  }

  // When we receive the taxi data, populate the form
  ngOnChanges() {
    if (this.taxi) {
      this.taxiForm.patchValue({
        available: this.taxi.available,
        licensePlate: this.taxi.licensePlate,
        model: this.taxi.model,
        typeTaxi: this.taxi.typeTaxi
      });

      // Check if the model is in the predefined list
      const predefinedModels = ['Toyota Camry', 'Honda Accord', 'Tesla Model 3', 'Mercedes E-Class', 'BMW 5 Series'];
      if (!predefinedModels.includes(this.taxi.model)) {
        this.isOtherModelSelected = true;
        this.taxiForm.patchValue({
          model: 'Other',
          otherModel: this.taxi.model
        });
      }
    }
  }

  openForm(): void {
    this.isFormOpen = true;
   // document.body.style.overflow = 'hidden'; // Empêche le scroll du body
  }

  closeForm(): void {
    this.isFormOpen = false;
   // document.body.style.overflow = 'auto'; // Réactive le scroll du body
  }

  onModelChange(): void {
    const selectedModel = this.taxiForm.get('model')?.value;
    if (selectedModel === 'Other') {
      this.isOtherModelSelected = true;
      this.taxiForm.get('otherModel')?.setValidators([Validators.required]);
    } else {
      this.isOtherModelSelected = false;
      this.taxiForm.get('otherModel')?.clearValidators();
      this.taxiForm.get('otherModel')?.reset();
    }
    this.taxiForm.get('otherModel')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.taxiForm.get('model')?.value === 'Other') {
      this.taxiForm.get('model')?.setValue(this.taxiForm.get('otherModel')?.value);
    }

    if (this.taxiForm.valid) {
      // Créer l'objet params correct pour updateTaxi
      const params: UpdateTaxi$Params = {
        id: this.taxi.id,
        body: this.taxiForm.value
      };

      this.taxiService.updateTaxi(params).subscribe(() => {
        // Créer l'objet taxi mis à jour
        const updatedTaxi = {
          ...this.taxi,
          ...this.taxiForm.value
        };

        // Notifier la mise à jour
        this.taxiStateService.notifyTaxiUpdate(updatedTaxi);
        console.log('Taxi Updated:', updatedTaxi);
        this.closeForm();
      });
    }
  }
}
