export interface User {
  addresses: any;
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  phone:string;
  email: string;
  __t: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface AuthFormProps {
    email: string;
    password: string;
    confirmPassword?: string;
  }
  
  export interface LoginProps {
    email: string;
    password: string;
  }
  
  export interface RegisterProps {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
  }
  
  export interface RegisterFormValues extends RegisterProps {
    confirmPassword: string;
  }