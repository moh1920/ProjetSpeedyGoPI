import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {PromotionAndEventService} from "../../services/services/promotion-and-event.service";
import {CreatePromotion$Params} from "../../services/fn/promotion-and-event/create-promotion";
import {Product} from "../../services/models/product";
import {CommonModule} from "@angular/common";
import {ProductControllerService} from "../../services/services/product-controller.service";
import {DropdownModule} from "primeng/dropdown";
import {PostService} from "../../services/services/post.service";
import {endDateValidator, startDateValidator} from "./pvValidateur";
import {ToastrModule, ToastrService} from "ngx-toastr";
import {UploadPostCoverPicture$Params} from "../../services/fn/promotion-and-event/upload-post-cover-picture";

@Component({
  selector: 'app-promotion-event-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule],
  templateUrl: './promotion-event-form.component.html',
  standalone: true,
  styleUrl: './promotion-event-form.component.scss'
})
export class PromotionEventFormComponent implements OnInit{

  pvForm: FormGroup;
  pvId: number | null = null;
  submitted = false;
  selectedProduct: Product | null = null;
  productsByOwner :Product[]=[];
  selectedPVCover: any;
  selectedPicture: string;
  private existingImageUrl: string | undefined ='';


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private pvService: PromotionAndEventService,
    private productService:ProductControllerService,
    private toastService:ToastrService,
    private postService:PostService) {

  }
  ngOnInit(): void {
    this.getProductByOwner();
    const id = this.route.snapshot.paramMap.get('id');
    if (id){
      this.pvId= +id;
      this.loadPvData(this.pvId);
    }
    this.pvForm = this.initForm();
  }


   imageUrls: string;
  loadPvData(id: number) {
    this.pvService.getPromotionById({ 'pvId': id }).subscribe({
      next: (pv) => {
        if (pv) {

          if (pv.imageUrl) {
            this.postService.getImage(pv.imageUrl).subscribe(
              (imageBlob) => {
                console.log('Image blob:', imageBlob);
                const imageUrl = URL.createObjectURL(imageBlob);
                this.imageUrls = imageUrl;
              },
              (error) => {
                console.error('Error fetching image:', error);
              }
            );
          }





          // Format dates as needed
          const formattedStartDate = this.formatDateFromDDMMYYYY(pv.startDate!);
          const formattedEndDate = this.formatDateFromDDMMYYYY(pv.endDate!);
          console.log("===============>>>>>>",pv)
          this.productsByOwner.forEach(product => {
            if (product.id === pv.productId) {
              pv.products = product;
            }
          });
          if (pv.imageUrl) {
            this.postService.getImage(pv.imageUrl).subscribe(
              (imageBlob) => {
                console.log('Image blob:', imageBlob);
                const imageUrl = URL.createObjectURL(imageBlob);
                this.imageUrls = imageUrl;
              },
              (error) => {
                console.error('Error fetching image:', error);
              }
            );
          }

          // Patch form WITHOUT the imageUrl field
          this.pvForm.patchValue({
            id: pv.id,
            typeEV_ep: pv.typeEV_ep,
            description: pv.description,
            discount: pv.discount,
            // imageUrl is removed from here
            imageUrl: this.imageUrls,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            status: pv.status,
            products: pv.products?.name
          });

          console.log("tets",pv);
          // Instead, store the imageUrl in a property to display it separately
          this.existingImageUrl = pv.imageUrl;

          if (pv.products) {
            // Find the matching product in your products list
            const selectedProduct = this.productsByOwner.find(p => p.id === pv.products?.id || p.id === pv.products?.id);
            if (selectedProduct) {
              this.pvForm.get('products')?.setValue(selectedProduct);
            }
          }
        }
      },
      error: (error) => {
        console.error('Error loading promotion:', error);
        this.toastService.error("Failed to load promotion", "Error");
      }
    });
  }
  private reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

  private formatDateToInputFormat(dateString: string): string {
    // If the date is already in YYYY-MM-DD format, no need to convert
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Otherwise, parse and format the date
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }


  onSave() {
    this.submitted = true;

    if ( this.selectedProduct) {
      const pvData = this.pvForm.value;
      console.log("1111111111111111111111111",this.selectedProduct);

      if (this.pvId) {
        this.pvService.updatePromotion({ pvId: this.pvId as number, body: pvData }).subscribe({
          next: (event) => {
            this.toastService.success("Promotion updated successfully", "Success");
            const newPvId = event.id;

            if (newPvId && this.selectedPVCover) {
              const params:UploadPostCoverPicture$Params= {
                'pv-id': newPvId,
                body: {
                  'file': this.selectedPVCover
                }
              }
              this.pvService.uploadPostCoverPicture(params).subscribe({
                next: () => {
                  console.log("Cover picture uploaded successfully");
                },
                error: (error) => {
                  console.error("Error uploading cover picture:", error);
                }
              });
            }
            this.router.navigate(['/pv']);

          },
          error: (error) => {
            console.error('Error updating promotion:', error);
            this.toastService.error("Failed to update promotion", "Oops!");
          }
        });
      } else {
        console.log("Product ID => " + pvData.products);


        this.pvService.createPromotion({ productId: pvData.products.id as number, body: pvData }).subscribe({
          next: (response) => {
            console.log("Promotion added successfully");
            console.log(this.selectedProduct)
            this.toastService.success("PV Added successfully", "Good");
            this.selectedProduct=null;

            const newPvId = response;

             if (newPvId && this.selectedPVCover) {
                const params:UploadPostCoverPicture$Params= {
               'pv-id': newPvId,
               body: {
                 'file': this.selectedPVCover
               }
             }
           this.pvService.uploadPostCoverPicture(params).subscribe({
               next: () => {
                 console.log("Cover picture uploaded successfully");
               },
               error: (error) => {
                 console.error("Error uploading cover picture:", error);
               }
             });
           }

            this.router.navigate(['/pv']);
          },
          error: (error) => {
            console.error('Error creating promotion:', error);
            this.toastService.error("Failed to create promotion", "Oops!");
          }
        });
      }
    }
  }


  onCancel(): void {
    this.router.navigate(['/pv']);
  }

  private initForm(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      discount: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      imageUrl: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      typeEV_ep: ['EVENT', Validators.required],
      startDate: ['', [Validators.required, startDateValidator]],
      endDate: ['', [Validators.required]],
      products: [null,[Validators.required]]
    }, {
      validators: [endDateValidator]
    });
  }
  getProductByOwner(){
   this.productService.getProductsByOwner().subscribe({
      next:(data)=>{
        this.productsByOwner=data;
        console.log(this.productsByOwner);
        if (this.productsByOwner.length > 0) {
          this.selectedProduct = this.productsByOwner[0];
          this.pvForm.patchValue({ products: this.selectedProduct });
        }
      }
    });
  }

  private formatDateFromDDMMYYYY(dateStr: string): string {
    if (!dateStr) return '';

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('-');
      return `${year}-${month}-${day}`;
    }

    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Failed to parse date:', dateStr);
    }

    return dateStr;
  }

  removeImage() {
   // this.selectedPicture = null;
    this.selectedPVCover = null;
    // Clear the file input by creating a new reference if needed
    const fileInput = document.getElementById('imageUrl') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onFileSelected(event: any) {
    this.selectedPVCover = event.target.files[0];
    console.log(this.selectedPVCover);

    if (this.selectedPVCover) {

      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedPVCover);
    }
  }


}
