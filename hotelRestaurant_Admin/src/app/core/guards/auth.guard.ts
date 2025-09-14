import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import { AppState } from '../../app.store';
import { signOut } from '../../store/auth.actions';
import { isPlatformBrowser } from '@angular/common';

export const roleGuard: (allowedRoles: string[]) => CanActivateFn = (allowedRoles) => {
  return (route, state) => {
    const router = inject(Router);
    const store = inject(Store<AppState>);

    // Solo ejecutar si estamos en navegador
    if (typeof window !== 'undefined' && localStorage) {
      const session = localStorage.getItem('session');

      if (session) {
        try {
          const sessionObj = JSON.parse(session);
          if (sessionObj && allowedRoles.includes(sessionObj.roleName)) {
            return true;
          }
        } catch (e) {
          console.error('Error parseando sesión:', e);
        }
      }
    }

    router.navigate(['/session/login']);
    store.dispatch(signOut());
    return false;
  };
};