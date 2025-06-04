import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {Store} from "../../services/models/store";
import {StoreService} from "../../store.service";

@Component({
  selector: 'app-store-template',
  imports: [
    NgStyle,
    NgOptimizedImage,
    NgIf
  ],
  standalone: true,
  templateUrl: './store-template.component.html',
  styleUrl: './store-template.component.scss'
})
export class StoreTemplateComponent /*implements OnChanges*/ {


  @Input() storeData: any;

  ngOnChanges(changes: SimpleChanges) {
    console.log('🔄 Changement détecté dans StoreTemplateComponent :', changes);
    if (changes['storeData'] && changes['storeData'].currentValue) {
      console.log('✅ Nouvelle valeur de storeData :', changes['storeData'].currentValue);
    } else {
      console.error('⚠️ storeData est toujours undefined');
    }
  }
}
