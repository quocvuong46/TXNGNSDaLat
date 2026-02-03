import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { FarmerGuard } from './guards/farmer.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'farmer-dashboard',
    loadComponent: () => import('./pages/farmer-dashboard/farmer-dashboard.page').then( m => m.FarmerDashboardPage),
    canActivate: [FarmerGuard]
  },
  {
    path: 'add-product',
    loadComponent: () => import('./pages/add-product/add-product.page').then( m => m.AddProductPage),
    canActivate: [FarmerGuard]
  },
  {
    path: 'scan-qr',
    loadComponent: () => import('./pages/scan-qr/scan-qr.page').then( m => m.ScanQrPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'trace/:product_code',
    loadComponent: () => import('./pages/trace-info/trace-info.page').then( m => m.TraceInfoPage)
  },
  {
    path: 'product-detail/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.page').then( m => m.ProductDetailPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage),
    canActivate: [AuthGuard]
  },
];
