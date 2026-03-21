import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonSearchbar, IonTabBar, IonTabButton, IonLabel, IonList, IonItem, IonAvatar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notifications, notificationsOutline, qrCode, shieldCheckmark, location, calendar, home, search, person, chevronForward } from 'ionicons/icons';
import { HistoryService, HistoryItem } from '../services/history.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
    IonSearchbar, IonTabBar, IonTabButton, IonLabel, IonList, IonItem, IonAvatar,
    CommonModule, FormsModule, RouterModule
  ],
})
export class HomePage {
  searchKeyword: string = '';
  history: HistoryItem[] = [];

  constructor(public router: Router, private historyService: HistoryService) {
    addIcons({ notifications, notificationsOutline, qrCode, shieldCheckmark, location, calendar, home, search, person, chevronForward });
  }

  ionViewWillEnter() {
    this.history = this.historyService.getHistory();
  }

  onSearch() {
    console.log('Searching for:', this.searchKeyword);
    // Implement search logic
  }

  goToScanQR() {
    this.router.navigate(['/scan-qr']);
  }

  openDetail(id: string) {
    if (!id) return;
    this.router.navigate(['/trace', id]);
  }
}
