import { UserInterface } from "../../domain/interfaces/user.interface";

export const mockUserRepository: jest.Mocked<UserInterface> = {
    create: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
    findByEmail: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    updatePassword: jest.fn(),
};
