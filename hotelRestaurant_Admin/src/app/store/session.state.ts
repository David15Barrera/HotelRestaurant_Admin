export interface SessionState {
    token: string,
    id: number,
    name: string,
    email: string,
    roleName: string
}

export const initialSessionState: SessionState = {
    token: "",
    id: 0,
    name: "",
    email: "",
    roleName: "",
}

