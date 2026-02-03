import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonSearchbar, IonTabBar, IonTabButton, IonLabel, IonList, IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, notificationsOutline, qrCode, shieldCheckmark, location, calendar, home, search, person, chevronForward } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonTabBar, IonTabButton, IonLabel, IonList, IonItem,
    CommonModule, FormsModule, RouterModule
  ],
})
export class HomePage {
  searchKeyword: string = '';

  constructor(public router: Router) {
    addIcons({ notifications, notificationsOutline, qrCode, shieldCheckmark, location, calendar, home, search, person, chevronForward });
  }

  onSearch() {
    console.log('Searching for:', this.searchKeyword);
    // Implement search logic
  }

  goToScanQR() {
    this.router.navigate(['/scan-qr']);
  }
}
