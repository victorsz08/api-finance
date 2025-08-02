import { verify } from "jsonwebtoken";
import { UserEntity } from "../../../domain/entities/user.entity";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import {
    AuthSessionInputDto,
    AuthSessionOutputDto,
    AuthSessionUsecase,
} from "../session";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";

jest.mock("jsonwebtoken");

describe("Auth Session Usecase", () => {
    let usecase: AuthSessionUsecase;

    beforeAll(() => {
        usecase = AuthSessionUsecase.build(mockUserRepository);
    });

    test("should a be returns user payload session", async () => {
        const input: AuthSessionInputDto = {
            token: "jwt-token",
        };

        const mockUser = {} as UserEntity;
        const mockUserDecode = { id: "id_user_decoded" };

        (verify as jest.Mock).mockReturnValue(mockUserDecode);

        mockUserRepository.find.mockResolvedValueOnce(mockUser);
        const output: AuthSessionOutputDto = {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
        expect(mockUserRepository.find).toHaveBeenCalledWith(mockUserDecode.id);
    });

    test("should a be to throw exception user not found", async () => {
        const input: AuthSessionInputDto = {
            token: "id-not-found",
        };

        const mockUserDecode = { id: "id_user_decoded" };
        (verify as jest.Mock).mockResolvedValue(mockUserDecode);

        mockUserRepository.find.mockResolvedValue(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.NOT_FOUND, "User not found with id"),
        );
        expect(mockUserRepository.find).toHaveBeenCalledWith(mockUserDecode.id);
    });
});
