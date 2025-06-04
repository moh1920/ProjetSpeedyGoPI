import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StoreService } from "../../store.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
})
export class StoreFormComponent {
  storeForm: FormGroup;
  logoFile: File | null = null;
  backgroundImageFile: File | null = null;

  constructor(private fb: FormBuilder, private storeService: StoreService, private router: Router) {
    this.storeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      contact: ['', Validators.required],
      address: ['', Validators.required],
      type: ['', Validators.required],
      logoUrl: [null],
      backgroundImageUrl: [null],
    });
  }

  onLogoFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.logoFile = file;
      console.log('Logo file selected:', file);
    }
  }

  onBackgroundFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.backgroundImageFile = file;
      console.log('Background image file selected:', file);
    }
  }

  onSubmit() {
    if (this.storeForm.valid) {
      const storeData = this.storeForm.value;
      const formData = new FormData();
      formData.append('name', storeData.name);
      formData.append('description', storeData.description);
      formData.append('contact', storeData.contact);
      formData.append('address', storeData.address);
      formData.append('type', storeData.type.toUpperCase());

      if (this.logoFile) {
        formData.append('logoUrl', this.logoFile, this.logoFile.name);
      }
      if (this.backgroundImageFile) {
        formData.append('backgroundImageUrl', this.backgroundImageFile, this.backgroundImageFile.name);
      }

      this.storeService.createStore(formData).subscribe({
        next: (response) => {
          console.log('✅ Store créé :', response);
          this.router.navigate([`/store/${response.id}`]);
        },
        error: (err) => {
          console.error('❌ Erreur lors de la création du store :', err);
        }
      });
    }
  }
}
