import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    // main layout wraps all normal pages
    path: '',
    loadComponent: () =>
      import('./components/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home').then((m) => m.Home),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./products/products').then((m) => m.Products),
      },
      {
        path: 'store',
        loadComponent: () =>
          import('./components/store-desc/store-desc').then(
            (m) => m.StoreDesc,
          ),
      },
    ],
  },
  {
    // auth pages use AuthLayout which has the second header
    path: '',
    loadComponent: () =>
      import('./components/login-layout/login-layout').then(
        (m) => m.LoginLayout,
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./components/login/login').then((m) => m.Login),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/signup-layout/signup-layout').then(
        (m) => m.SignupLayout,
      ),
    children: [
      {
        path: 'signup',
        loadComponent: () =>
          import('./components/signup/signup').then((m) => m.Signup),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => 
      import('./components/profile-layout/profile-layout').then(
        (m) => m.ProfileLayout,
      ),
      children: [
        {
          path: 'profile',
          loadComponent: () => 
            import('./components/profile/profile').then(
              (m) => m.Profile
            )
        }
      ]
  },
  {
    path: 'admin',
    loadComponent: () => 
      import('./components/admin/admin').then(
        (m) => m.Admin
      ),
      children: [
        {
          path: 'dashboard',
          loadComponent: () => 
            import('./components/admin-co/dashboard/dashboard').then(
              (m) => m.Dashboard
            )
        },
        {
          path: 'inventory',
          loadComponent: () => 
            import('./components/admin-co/inventory/inventory').then(
              (m) => m.Inventory
            )
        },
        {
          path: 'inventory/search',
          loadComponent: () => 
            import('./components/admin-co/inventory-search/inventory-search').then(
              (m) => m.InventorySearchComponent
            )
        },
        
      ]
  }
];
