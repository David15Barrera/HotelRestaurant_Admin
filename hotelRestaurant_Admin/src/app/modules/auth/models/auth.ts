// sign-up para cualquier tipo de usuario
export interface SignUpModel {
  fullName: string;
  cui: string;
  phone?: string;
  email: string;
  address: string;
  password: string;
  roleId: number;
  // Opcionales de empleado
  jobPosition?: string;
  salary?: number;
  hotelId?: string;
  restaurantId?: string;
}


export interface Confirmation {
  email: string;
  code: string;
}


//Cliente
export interface CustomerSignUpModel {
  cui: string;
  email: string;
  password: string;   

}

//Empleado
export interface EmployeeSignUpModel {
  fullName: string;
  cui: string;
  phone?: string;
  email: string;
  jobPosition?: string;
  salary: number;
  address: string;
  password: string;
  roleId: number;
  hotelId?: string;
  restaurantId?: string;
}

//Inicio session
export interface SignInModel {
  email: string;
  password: string;
}

//Inicio sesión con MFA
export interface SignInMFAModel {
  email: string;
  code: number;
}

//Recuperar contraseña
export interface RecoverPasswordModel {
  email: string;
}

export interface Register {
  cui: string;
  email: string;
  password: string;
}

export interface Session {
  token: string;
  id: number;
  email: string;
  cui: string;
  active: boolean;
  employeeId: string;
  customerId: string;
  roleName: Rol;
}

export enum Rol {
  CLIENTE = 'CLIENTE',
}
