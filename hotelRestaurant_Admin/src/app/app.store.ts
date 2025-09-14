import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export interface AppState {
   auth: any;
}

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorageSync({
        keys: ['auth'],
        rehydrate: true,
        storage: localStorage,
      })(reducer)(state, action);
    }
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer[] = [localStorageSyncReducer];
