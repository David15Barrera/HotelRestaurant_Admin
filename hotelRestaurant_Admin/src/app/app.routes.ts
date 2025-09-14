import { Routes } from '@angular/router';
import { AuthUserComponent } from './modules/auth/auth-user/auth-user.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { roleGuard } from './core/guards/auth.guard';
import { ConfirmationComponent } from './modules/auth/confirmation/confirmation.component';
export const routes: Routes = [

    {path: "session",
    children: [
        {
            path: "login", component: AuthUserComponent
        },
        {
            path: "register", component: RegisterComponent
        },
        {
            path: "Confirmation", component: ConfirmationComponent 
        }
     ]
        },
        
        {path: "client",
          canActivate: [roleGuard(['CUSTOMER'])],
         loadChildren: () => import('./modules/client/client.routes').then(
            (m) => m.CLIENT_ROUTES),
        },
        {
            path:'admin',
            loadChildren: () => import('./modules/admin/admin.routes').then(
                (m) => m.ADMIN_ROUTES
            )
        },
    {
        path: '',
        redirectTo: 'session/login',
        pathMatch: 'full',
    },
    {
        path: '**',
        component: AuthUserComponent
    }
];
