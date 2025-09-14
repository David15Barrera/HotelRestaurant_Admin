import { Routes } from '@angular/router';

export const CLIENT_ROUTES: Routes = [
    {
        path:'',
        loadComponent: () => import('./layout-client/layout-client.component').then(
            (m) => m.LayoutClientComponent
        ),
        children: [
            {
             path: 'inicio',
             loadComponent: () => import('./inicio/inicio.component').then(
                (m) => m.InicioComponent
             ),
            },
            {
             path:'hoteles',
             loadComponent: () => import('./hotel/list-hoteles/list-hoteles.component').then(
                (m) => m.ListHotelesComponent
             ),
            },
            {
               path:'hoteles-detail/:id',
               loadComponent: () => import('./hotel/detail-hoteles/detail-hoteles.component').then(
                  (m) => m.DetailHotelesComponent,
               )
            },
            {
             path:'habitaciones',
             loadComponent: () => import('./hotel/list-habitaciones/list-habitaciones.component').then(
                (m) => m.ListHabitacionesComponent
             ),
            },
            {
             path:'resarvar/:id',
             loadComponent: () => import('./hotel/reservar-habitaciones/reservar-habitaciones.component').then(
             (m) => m.ReservarHabitacionesComponent
             ),
            },
            {
               path:'opinion-hotel',
               loadComponent: () => import('./hotel/opinion-hotel/opinion-hotel.component').then(
                  (m) => m.OpinionHotelComponent
               )
            },
            {
               path:'opinion-cuarto/:id',
               loadComponent: () => import('./hotel/opinion-cuarto/opinion-cuarto.component').then(
                  (m) => m.OpinionCuartoComponent
               )
            },
            {
               path:'ver-opinion-hotel/:id',
               loadComponent: () => import('./hotel/veropinion-hotel/veropinion-hotel.component').then(
                  (m) => m.VeropinionHotelComponent
               )
            },
            {
               path:'ver-Reviews/:id',
               loadComponent: () => import('./restaurant/ver-opinion/ver-opinion.component').then(
                  (m) => m.VerOpinionComponent
               )
            },
            {
             path:'restaurantes',
             loadComponent: () => import('./restaurant/list-restaurantes/list-restaurantes.component').then(
                (m) => m.ListRestaurantesComponent
             ),
            },
            {
             path:'pedidos',
             loadComponent: () => import('./restaurant/pedido/pedido.component').then(
                (m) => m.PedidoComponent
             )
            },
            {
               path:'pedidos-detail/:id',
               loadComponent: () => import('./restaurant/pedido-detail/pedido-detail.component').then(
                  (m) => m.PedidoDetailComponent
               )
            },
            {
               path: 'perfil-cliente',
               loadComponent: () => import('./perfil-cliente/perfil-cliente.component').then(
                  (m) => m.PerfilClienteComponent,
               )
            },
            {
               path: 'reservaciones',
               loadComponent: () => import('./hotel/ver-reservacion-cli/ver-reservacion-cli.component').then(
                  (m) => m.VerReservacionCliComponent,
               )
            },
            {
               path: 'restaurant-details/:id',
               loadComponent: () => import('./restaurant/restaurant-details/restaurant-details.component').then(
                  (m) => m.RestaurantDetailsComponent,
               )
            }
         
        ]
    }
]