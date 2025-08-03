import { sign } from "jsonwebtoken";
import { UserEntity } from "../../../domain/entities/user.entity";
import { GenerateCrypt } from "../../../helpers/crypt";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { AuthLoginInputDto, AuthLoginUsecase } from "../login"
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";

jest.mock("jsonwebtoken")

describe("Auth Login Usecase", () => {
    let usecase: AuthLoginUsecase;

    beforeAll(() => {
        usecase = AuthLoginUsecase.build(mockUserRepository);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test("should return payload token successfully", async () => {
        const input: AuthLoginInputDto = {
            email: "test_email@email.com",
            password: "pass12345678"
        };

        const mockUser = {} as UserEntity;
        const mockOutputToken = {
            token: "token_jwt_secret"
        };

        mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
        jest.spyOn(GenerateCrypt, "compare").mockResolvedValueOnce(true);
        (sign as jest.Mock).mockReturnValue("token_jwt_secret");

        const result = await usecase.execute(input);

        expect(result).toEqual(mockOutputToken);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    });

    test("should throw error if user not found", async () => {
        const input: AuthLoginInputDto = {
            email: "notfound@email.com",
            password: "pass12345678"
        };

        mockUserRepository.findByEmail.mockResolvedValueOnce(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.BAD_REQUEST, "Email or password incorrect")
        );
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    });

    test("should throw error if password does not match", async () => {
        const input: AuthLoginInputDto = {
            email: "test_email@email.com",
            password: "wrongpassword"
        };

        const mockUser = {} as UserEntity;
        mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);
        jest.spyOn(GenerateCrypt, "compare").mockResolvedValueOnce(false);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.BAD_REQUEST, "Email or password incorrect")
        );
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    });
});