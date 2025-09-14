import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '', // La ruta vacía es un buen reemplazo para '/' en rutas hijas
    loadComponent: () =>
      import('./components/layout-admin/layout-admin.component').then(
        (m) => m.LayoutAdminComponent
      ),
    children: [
      {
        path: 'inicio',
        loadComponent: () =>
          import('../admin/inicio-admin/inicio-admin.component').then(
            (m) => m.InicioAdminComponent
          ),
      },
      {
        path: 'hoteles',
        loadComponent: () =>
          import('./components/hotel-admin/hotelinicio/hotelinicio.component').then(
            (m) => m.HotelinicioComponent
          ),
      },
      {
        path: 'empleados',
        loadComponent: () => import('./components/empleado/inicio-emp-admin/inicio-emp-admin.component').then(
          (m) => m.InicioEmpAdminComponent),
      },
      {
        path: 'cliente',
        loadComponent: () => import('./components/cliente/inicio-cli-admin/inicio-cli-admin.component').then(
          (m) => m.InicioCliAdminComponent),
      },
      {
        path: 'perfil-cliente',
        loadComponent: () => import('./components/cliente/perfil-cli/perfil-cli.component').then(
          (m) => m.PerfilCliComponent,
        )
      },
      {
       path: 'cuartos',
       loadComponent: () => import('./components/hotel-admin/habitaciones/habitaciones.component').then(
        (m) => m.HabitacionesComponent,
       ) 
      },
      {
        path: 'reservations',
        loadComponent: () => import('./components/hotel-admin/reservas-admin/reservas-admin.component').then(
          (m) => m.ReservasAdminComponent,
        )
      },
      {
        path: 'restaurantes',
        loadComponent: () =>
         import('./components/restaurant-admin/restauinicio/restauinicio.component').then(
            (m) => m.RestauinicioComponent
          ),
      }
      // {
      //   path: 'menu',
      //   loadComponent: () =>
      //     import('./components/restaurantes/crud-menu/crud-menu.component').then(
      //       (m) => m.CrudMenuComponent
      //     ),
      // },
      // ... y así sucesivamente para todas las rutas que no se usarán por ahora.
    ],
  },
];