import { sign } from "jsonwebtoken";
import { GenerateCrypt } from "../../../helpers/crypt";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { AuthLoginInputDto, AuthLoginUsecase } from "../login";
import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "jwt-payload-token"),
}));

describe("Auth Login Usecase", () => {
    let usecase: AuthLoginUsecase;

    beforeAll(() => {
        usecase = AuthLoginUsecase.build(mockUserRepository);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test("should a be return payload login successfully", async () => {
        const mockUser = {} as UserEntity;
        const input: AuthLoginInputDto = {
            email: "test@email.com",
            password: "password1234",
        };

        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        jest.spyOn(GenerateCrypt, "compare").mockResolvedValue(true);

        const payload = (sign as jest.Mock).mockReturnValue(
            "jwt-payload-token",
        );

        await usecase.execute(input);

        const output = {
            token: payload,
        };

        expect(payload).toEqual(output.token);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
    });

    test("should a be to throw exception email incorrect", async () => {
        const input: AuthLoginInputDto = {
            email: "test-incorrect@email.com",
            password: "password1234",
        };

        mockUserRepository.findByEmail.mockResolvedValueOnce(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatus.BAD_REQUEST,
                "Email or password incorrect",
            ),
        );
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
    });

    test("should a be to throw exception password incorrect", async () => {
        const mockUser = {} as UserEntity;
        const input: AuthLoginInputDto = {
            email: "test@email.com",
            password: "password-incorrect",
        };

        mockUserRepository.findByEmail.mockResolvedValue(mockUser);
        jest.spyOn(GenerateCrypt, "compare").mockResolvedValueOnce(false);

        await expect(usecase.execute(input)).rejects.toThrow(HttpException);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
    });
});
