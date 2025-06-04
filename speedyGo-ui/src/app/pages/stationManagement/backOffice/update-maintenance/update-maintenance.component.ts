import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaintenanceControllerService} from "../../../../services/services/maintenance-controller.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {AppTopstripComponent} from "../../../../layouts/full/top-strip/topstrip.component";
import {Dir} from "@angular/cdk/bidi";
import {HeaderComponent} from "../../../../layouts/full/header/header.component";
import {MatIcon} from "@angular/material/icon";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {NgScrollbarModule} from "ngx-scrollbar";
import {SidebarComponent} from "../../../../layouts/full/sidebar/sidebar.component";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-update-maintenance',
  imports: [
    ReactiveFormsModule,
    NgIf,
    AppTopstripComponent,
    Dir,
    HeaderComponent,
    MatIcon,
    MatListItem,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    NgScrollbarModule,
    SidebarComponent,
    RouterLink
  ],
  templateUrl: './update-maintenance.component.html',
  styleUrl: './update-maintenance.component.scss',
  standalone : true ,
})
export class UpdateMaintenanceComponent implements OnInit{
  maintenanceForm!: FormGroup;
  maintenanceId!: number;
  successMessage: string = '';

  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`


  constructor(
    private maintenanceService: MaintenanceControllerService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private breakpointObserver: BreakpointObserver
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
      status: ['', Validators.required],
      emailTechnician : ['', Validators.email],
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

    this.maintenanceService.updateMaintenance({  idMaintenance : this.maintenanceId ,body: updatedMaintenance }).subscribe({
      next: () => {
        this.successMessage = 'Maintenance mise à jour avec succès !';
        this.router.navigate(['/maintenanceVehicleList']);  // Rediriger vers la liste après mise à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour de la maintenance:', error);
        alert('Erreur lors de la mise à jour de la maintenance');
      }
    });
  }


  onCancel() {
    this.router.navigate(['/maintenanceVehicleList']);
  }
}
