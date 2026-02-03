import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList,
  IonItem, IonLabel, IonAvatar, IonTabBar, IonTabButton, AlertController 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, heart, time, settings, logOut, chevronForward, helpCircle, home, search, qrCode, add } from 'ionicons/icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonList,
    IonItem, IonLabel, IonAvatar, IonTabBar, IonTabButton,
    CommonModule, FormsModule, RouterModule
  ]
})
export class ProfilePage implements OnInit {
  user: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {
    addIcons({ person, heart, time, settings, logOut, chevronForward, helpCircle, home, search, qrCode, add });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  async confirmLogout() {
    const alert = await this.alertController.create({
      header: 'Đăng xuất',
      message: 'Bạn có chắc muốn đăng xuất?',
      buttons: [
        {
          text: 'Hủy',
          role: 'cancel'
        },
        {
          text: 'Đăng xuất',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
