import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaintenanceControllerService} from "../../../../services/services/maintenance-controller.service";
import {Maintenance} from "../../../../services/models/maintenance";
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
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-form-maintenance',
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
  templateUrl: './form-maintenance.component.html',
  styleUrl: './form-maintenance.component.scss',
  standalone :  true ,
})
export class FormMaintenanceComponent implements OnInit{

  maintenanceForm!: FormGroup;
  successMessage: string = '';

  @ViewChild('leftsidenav') sidenav!: MatSidenav;
  isOver = false;  // Variable utilisée dans le template pour `mat-sidenav`

  constructor(private fb: FormBuilder, private maintenanceService: MaintenanceControllerService,private breakpointObserver: BreakpointObserver,private router : Router) {}

  ngOnInit(): void {
    this.maintenanceForm = this.fb.group({
      id: [null],
      maintenanceType: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      estimatedCompletionTime: [''],
      technicianName: ['', Validators.required],
      cost: [null, [Validators.min(0)]],
      status: ['', Validators.required],
      emailTechnician : ['',Validators.email]
    });
    // Détecter si l'écran est mobile et ajuster la sidebar
    this.breakpointObserver.observe('(max-width: 768px)').subscribe(result => {
      this.isOver = result.matches;
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
          this.router.navigate(['/maintenanceVehicleList']);

        },
        error: (error) => {
          console.error('Erreur lors de l’ajout:', error);
        }
      });
    }
  }
  // Gestion de la barre latérale
  onSidenavOpenedChange(isOpened: boolean) {
    console.log("Sidenav Opened:", isOpened);
  }

  onSidenavClosedStart() {
    console.log("Sidenav Closed");
  }
  onCancel(): void {
    this.router.navigate(['/maintenanceVehicleList']);
  }




}
