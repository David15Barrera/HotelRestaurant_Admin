import { createReducer, on } from '@ngrx/store';
import { initialSessionState } from './session.state';
import { setSession } from './auth.actions';

export const authFeatureKey = 'sessionState';

export const authReducer = createReducer(
  initialSessionState,
  on(setSession, (state, { session }) => ({ ...state, ...session }))
);
