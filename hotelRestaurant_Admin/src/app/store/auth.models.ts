export interface User {
  id: string;
  email: string;
  name?: string;
}
export type AuthStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

export interface AuthState {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  error: string | null;
}

export const initialAuthState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null
};