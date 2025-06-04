import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaintenanceControllerService} from "../../../services/services/maintenance-controller.service";
import {Maintenance} from "../../../services/models/maintenance";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-form-maintenance',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './form-maintenance.component.html',
  styleUrl: './form-maintenance.component.scss',
  standalone :  true ,
})
export class FormMaintenanceComponent {

  maintenanceForm!: FormGroup;
  successMessage: string = '';
  constructor(private fb: FormBuilder, private maintenanceService: MaintenanceControllerService) {}

  ngOnInit(): void {
    this.maintenanceForm = this.fb.group({
      id: [null],
      maintenanceType: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      estimatedCompletionTime: [''],
      technicianName: ['', Validators.required],
      cost: [null, [Validators.min(0)]],
      status: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.maintenanceForm.valid) {
      const maintenanceData: Maintenance = this.maintenanceForm.value;

      this.maintenanceService.addMaintenance({ body: maintenanceData }).subscribe({
        next: (response) => {
          console.log('Maintenance ajoutée avec succès:', response);
          this.successMessage = 'Maintenance ajoutée avec succès !';
          this.maintenanceForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout:', error);
        }
      });
    }
  }


}
