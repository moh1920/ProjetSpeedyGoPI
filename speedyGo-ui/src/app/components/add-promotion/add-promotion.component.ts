import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import {CommonModule, NgFor} from '@angular/common';
import {FormGroup, FormsModule} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import {FullComponent} from "../../layouts/full/full.component";
import {PromotionAndEventService} from "../../services/services/promotion-and-event.service";
import {EventPromotion} from "../../services/models/event-promotion";
import {User} from "../../services/models/user";
import {Product} from "../../services/models/product";
import {CreatePromotion$Params} from "../../services/fn/promotion-and-event/create-promotion";
import {ProductControllerService} from "../../services/services/product-controller.service";
import {UpdatePromotion$Params} from "../../services/fn/promotion-and-event/update-promotion";
import {DeletePromotion$Params} from "../../services/fn/promotion-and-event/delete-promotion";
import {DatePicker} from "primeng/datepicker";

interface Column {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-add-promotion',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    ConfirmDialogModule,
    FullComponent,
    NgFor,
    DatePicker
  ],
 // providers: [MessageService,  ConfirmationService],
  templateUrl:'add-promotion.component.html',
})
export class AddPromotionComponent implements OnInit {
  productDialog: boolean = false;

  products = signal<any[]>([]);

  product!: any;

  selectedProducts!: any[] | null;
  selectedPromotions!: EventPromotion[] | null;


  submitted: boolean = false;

  statuses!: any[];
  productId!:number;
  productsByOwner :Product[]=[];
  promotions:EventPromotion[]=[];
  dates: Date[] | undefined;


  @ViewChild('dt') dt!: Table;

  exportColumns!: ExportColumn[];

  cols!: Column[];

  pv: EventPromotion = {
    description: '',
    discount: 0,
    endDate: '',
    imageUrl: '',
    startDate: '',
    status: 'ACTIVE',
    typeEV_ep: 'EVENT'
  };

  constructor(

    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private pvService:PromotionAndEventService,
    private productService:ProductControllerService
  ) {}
  countries: any[] | undefined;

  selectedCountry: Product;



  exportCSV() {
    this.dt.exportCSV();
  }

  ngOnInit() {
    this.loadDemoData();
    this.getProductByOwner();
    this.getAllPromotion();
    this.countries = this.productsByOwner;
  }

  loadDemoData() {


    this.statuses = [
      { label: 'ACTIVE', value: 'active' },
      { label: 'EXPIRED', value: 'expired' },
      { label: 'UPCOMING', value: 'upcoming' }
    ];


    this.cols = [
      { field: 'description', header: 'Description' },
      { field: 'discount', header: 'Discount' },
      { field: 'startDate', header: 'Start Date' },
      { field: 'endDate', header: 'End Date' },
      { field: 'status', header: 'Status' },
      { field: 'typeEV_ep', header: 'Type' }
    ];

    this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
  }

  editPromotion(promotion: EventPromotion) {
    const params: UpdatePromotion$Params = {
      pvId: promotion.id as number,
      body: this.pv
    };
    this.pvService.updatePromotion(params).subscribe({
      next:()=>{
        console.log("updated ");
        this.getAllPromotion();
      }
    });
    this.productDialog = true;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => !this.selectedProducts?.includes(val)));
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  deleteProduct(product: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.products.set(this.products().filter((val) => val.id !== product.id));
        this.product = {};
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.products().length; i++) {
      if (this.products()[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warn';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  saveProduct() {
    this.submitted = true;

    if (this.product.name?.trim()) {
      if (this.submitted) {
        this.addPV();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000
        });
      } else {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000
        });
      }

      this.productDialog = false;
      this.product = {};
    }
  }


  addPV() {
    const params: CreatePromotion$Params = {
      productId: this.selectedCountry.id as number,
      body: this.pv
    };
    if (this.dates && this.dates.length >= 2) {
      this.pv.startDate = this.dates[0].toISOString();
      this.pv.endDate = this.dates[1].toISOString();
    }
    this.pvService.createPromotion(params).subscribe({
      next: () => {
        console.log('Added promotion successfully');
        this.getAllPromotion();
      }
    });
  }

  getProductByOwner(){
   /* this.productService.getProductByOwner().subscribe({
      next:(data)=>{
          this.productsByOwner=data;
      }
    });*/
  }

  getAllPromotion(){
    this.pvService.getAllPromotions()
      .subscribe((data)=>{
          this.promotions=data;
        console.log(this.promotions);

      })
  }

  deleteSelectedPromotions() {

  }

  deletePromotion(promotion:EventPromotion) {
    const param:DeletePromotion$Params={
      pvId:promotion.id as number
    }
      this.pvService.deletePromotion(param)
        .subscribe({
          next:()=>{
            console.log("Promotion deleted");
            this.getAllPromotion();
          }
        });
  }
}
