import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { setSession, signOut } from './auth.actions';

@Injectable()
export class AuthEffects {
  actions$ = inject(Actions);
  router = inject(Router);

  setSessionEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(setSession),
        tap(({ session }) => {
          localStorage.setItem('session', JSON.stringify(session));
        })
      ),
    { dispatch: false }
  );

  signOutEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signOut),
        tap(() => {
          localStorage.removeItem('session');
          localStorage.removeItem('current_user');
          this.router.navigate(['session/login']);
        })
      ),
    { dispatch: false }
  );
}
