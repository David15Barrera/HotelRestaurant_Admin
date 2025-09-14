import { ActionReducerMap } from "@ngrx/store";
import { SessionState } from "./session.state";
import { authReducer } from "./auth.reducer";

export interface AppState {
  sessionState: SessionState;
}

export const reducers: ActionReducerMap<AppState> = {
  sessionState: authReducer
};