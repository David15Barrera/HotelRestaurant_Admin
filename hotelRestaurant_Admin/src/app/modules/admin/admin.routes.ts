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
      },
      {
        path:'menu',
        loadComponent: () => import('./components/restaurant-admin/platillos/platillos.component').then(
          (m) => m.PlatillosComponent
        ) 
      },
      {
        path:'ordenes',
        loadComponent: () => import('./components/restaurant-admin/ordenes/ordenes.component').then(
          (m) => m.OrdenesComponent
        ) 
      },
      {
        path:'ordenes-admin/:id',
        loadComponent: () => import('./components/restaurant-admin/ordens-detail/ordens-detail.component').then(
          (m) => m.OrdensDetailComponent
        )
      },
       {
         path: 'reportes',
         loadComponent: () =>
           import('./components/reportes/reportes.component').then(
             (m) => m.ReportesComponent
           ),
      },
      {
        path:'reviws-resta',
        loadComponent: () =>
          import('./components/hotel-admin/reviews-hot/reviews-hot.component').then(
            (m) => m.ReviewsHotComponent
          )
      },
      {
        path:'reviws-hotel',
        loadComponent: () => import('./components/restaurant-admin/reviewsad/reviewsad.component').then(
          (m) => m.ReviewsadComponent
        )
      },
      {
        path:'pagos',
        loadComponent: () => import('./components/empleado/pago/pago.component').then(
          (m) => m.PagoComponent
        )
      },
      {
        path:'promotions-admon',
        loadComponent: () => import('./components/promotions-admin/promotions-admin.component').then(
          (m) => m.PromotionsAdminComponent       
        )
      },
      {
        path: 'reportes', // La URL será /admin/reportes
        children: [
          {
            path: '', // La URL /admin/reportes mostrará el menú de reportes
            loadComponent: () =>
              import('./components/reportes/reportes.component').then(
                (m) => m.ReportesComponent
              ),
          },
          {
            path: 'ingresos-establecimiento', // La URL será /admin/reportes/ingresos-establecimiento
            loadComponent: () =>
              import('./components/report/report-one/report-one.component').then(
                (m) => m.ReportOneComponent
              ),
          },
          {
            path: 'alojamientos-consumos-cliente',
            loadComponent: () =>
              import('./components/report/report-two/report-two.component').then(
                (m) => m.ReportTwoComponent
              ),
          },
          {
            path: 'empleados-establecimiento',
            loadComponent: () =>
              import('./components/report/report-three/report-three.component').then(
                (m) => m.ReportThreeComponent
              ),
          },
          {
            path: 'ganancias',
            loadComponent: () =>
              import('./components/report/report-four/report-four.component').then(
                (m) => m.ReportFourComponent
              ),
          },
          {
            path: 'habitacion-popular',
            loadComponent: () =>
              import('./components/report/report-five/report-five.component').then(
                (m) => m.ReportFiveComponent
              ),
          },
          {
            path: 'restaurante-popular',
            loadComponent: () =>
              import('./components/report/report-six/report-six.component').then(
                (m) => m.ReportSixComponent
              ),
          },
        ],
      },
      {
        path: '**',
        redirectTo: 'inicio'
      }
    ],
  },
];