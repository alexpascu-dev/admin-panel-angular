export interface CurrentUserPayload {
    sub: string,
    unique_name: string,
    email: string,
    role: string,
    exp: number;
}