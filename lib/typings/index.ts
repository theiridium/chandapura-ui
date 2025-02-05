namespace User {
    export interface Login {
        identifier: string | undefined;
        password: string | undefined;
    }
    export interface Register {
        username: string | undefined;
        email: string | undefined;
        password: string | undefined;
        role: string | undefined;
        firstname: string | undefined;
        lastname: string | undefined;
        phone: string | undefined;
    }
    export interface PasswordReset {
        password: string
        passwordConfirmation: string
        code: string
    }
}