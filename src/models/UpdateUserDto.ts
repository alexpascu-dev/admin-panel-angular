export interface UpdateUserDto {
    userId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    isActive?: boolean;
    role?: string;
}