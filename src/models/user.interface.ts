export interface User {
    readonly userId: number,
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    isActive: boolean
}