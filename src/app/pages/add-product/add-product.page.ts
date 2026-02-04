import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonItem, 
  IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonSpinner,
  IonButtons, ToastController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, cloudUpload, save } from 'ionicons/icons';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonItem,
    IonInput, IonTextarea, IonSelect, IonSelectOption, IonLabel, IonSpinner,
    IonButtons, CommonModule, FormsModule, RouterModule
  ]
})
export class AddProductPage implements OnInit {
  productData = {
    name: '',
    description: '',
    category_id: null as number | null,
    price: null as number | null,
    quantity: null as number | null,
    unit: '',
    origin: 'Đà Lạt',
    harvest_date: new Date().toISOString().split('T')[0]
  };
  
  categories: any[] = [];
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  loading = false;

  constructor(
    private productService: ProductService,
    public router: Router,
    private toastController: ToastController
  ) {
    addIcons({ arrowBack, cloudUpload, save });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data || [];
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (!this.productData.name || !this.productData.price || !this.productData.category_id) {
      this.showToast('Vui lòng nhập đầy đủ thông tin bắt buộc');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.productData.name);
    formData.append('description', this.productData.description);
    formData.append('category_id', this.productData.category_id.toString());
    formData.append('price', this.productData.price.toString());
    formData.append('quantity', (this.productData.quantity || 0).toString());
    formData.append('unit', this.productData.unit);
    formData.append('origin', this.productData.origin);
    formData.append('harvest_date', this.productData.harvest_date);
    
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.productService.createProduct(formData).subscribe({
      next: async (response) => {
        this.loading = false;
        if (response.success) {
          await this.showToast('Thêm sản phẩm thành công!');
          this.router.navigate(['/farmer-dashboard']);
        }
      },
      error: async (error) => {
        this.loading = false;
        await this.showToast(error.error?.message || 'Có lỗi xảy ra');
      }
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
