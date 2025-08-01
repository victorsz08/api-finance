import { UserEntity } from "../entities/user.entity";

export type ListUser = {
    users: UserEntity[];
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
};

export interface UserInterface {
    create(user: UserEntity): Promise<void>;
    find(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    list(page: number, limit: number, search?: string): Promise<ListUser>;
    update(
        id: string,
        email: string,
        firstName: string,
        lastName: string,
        updatedAt: Date,
    ): Promise<void>;
    updatePassword(
        id: string,
        password: string,
        updatedAt: Date,
    ): Promise<void>;
    delete(id: string): Promise<void>;
}
