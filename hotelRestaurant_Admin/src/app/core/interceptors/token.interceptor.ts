import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, switchMap, take } from 'rxjs';
import { selectToken } from '../../store/auth.selectors';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(selectToken).pipe(
    take(1), // tomar solo el valor actual del token
    switchMap(token => {
      if (!token) {
        return next(req);
      }

      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });

      return next(authReq);
    })
  );
};