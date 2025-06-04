import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaintenanceControllerService} from "../../../services/services/maintenance-controller.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-update-maintenance',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './update-maintenance.component.html',
  styleUrl: './update-maintenance.component.scss',
  standalone : true ,
})
export class UpdateMaintenanceComponent implements OnInit{
  maintenanceForm!: FormGroup;
  maintenanceId!: number;
  successMessage: string = '';


  constructor(
    private maintenanceService: MaintenanceControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}
  ngOnInit(): void {
    this.maintenanceId = +this.route.snapshot.params['id'];  // Récupération de l'ID de la maintenance
    this.createForm();
    this.getMaintenance();
  }

  // Initialiser le formulaire réactif
  createForm(): void {
    this.maintenanceForm = this.fb.group({
      maintenanceType: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      estimatedCompletionTime: [''],
      technicianName: ['', Validators.required],
      cost: [null, [Validators.min(0)]],
      status: ['', Validators.required]
    });
  }

  // Charger les données de la maintenance à modifier
  getMaintenance(): void {
    this.maintenanceService.getByIdMaintenance({id: this.maintenanceId}).subscribe({
      next: (data) => {
        this.maintenanceForm.patchValue(data);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération de la maintenance:', error);
        alert('Erreur lors de la récupération des données de la maintenance');
      }
    });
  }

  updateMaintenance(): void {
    if (this.maintenanceForm.invalid) {
      return;
    }

    const updatedMaintenance = this.maintenanceForm.value;

    this.maintenanceService.updateMaintenance({  body: updatedMaintenance }).subscribe({
      next: () => {
        this.successMessage = 'Maintenance mise à jour avec succès !';
        this.router.navigate(['/listMaintenance']);  // Rediriger vers la liste après mise à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la maintenance:', error);
        alert('Erreur lors de la mise à jour de la maintenance');
      }
    });
  }
}
