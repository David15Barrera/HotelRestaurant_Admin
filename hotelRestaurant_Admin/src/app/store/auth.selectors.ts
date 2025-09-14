import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.models";
import { AppState } from ".";
import { SessionState } from "./session.state";

export const selectSessionState = (state: AppState) => state.sessionState;

export const selectToken = createSelector(
  selectSessionState,
  (state: SessionState) => state.token
);