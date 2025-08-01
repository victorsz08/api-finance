import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";
import { GenerateCrypt } from "../../../helpers/crypt";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import {
    UpdatePasswordUserInputDto,
    UpdatePasswordUserUsecase,
} from "../update-password";

describe("Update Password User Usecase", () => {
    let usecase: UpdatePasswordUserUsecase;

    beforeAll(() => {
        usecase = UpdatePasswordUserUsecase.build(mockUserRepository);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    test("should a be update password user successfully", async () => {
        const input: UpdatePasswordUserInputDto = {
            id: "test_id",
            currentPassword: "test12345",
            newPassword: "test12345678",
        };

        const mockUser = {} as UserEntity;

        mockUserRepository.find.mockResolvedValueOnce(mockUser);
        jest.spyOn(GenerateCrypt, "compare").mockResolvedValue(true);
        jest.spyOn(GenerateCrypt, "hash").mockResolvedValue("newHashPassword");

        const updateAt = new Date();
        const newPasswordHashed = await GenerateCrypt.hash(input.newPassword);

        mockUserRepository.updatePassword.mockResolvedValueOnce(undefined);

        await usecase.execute(input);
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
        expect(mockUserRepository.updatePassword).toHaveBeenCalledWith(
            input.id,
            newPasswordHashed,
            updateAt,
        );
    });

    test("should a be to throw exception user not found", async () => {
        const input: UpdatePasswordUserInputDto = {
            id: "test_id",
            currentPassword: "test12345",
            newPassword: "test12345678",
        };

        mockUserRepository.find.mockResolvedValue(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.NOT_FOUND, "User not found with id"),
        );
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
    });

    test("shold a be to throw exception current password incorrect", async () => {
        const input: UpdatePasswordUserInputDto = {
            id: "test_id",
            currentPassword: "test12345",
            newPassword: "test12345678",
        };

        const mockUser = {} as UserEntity;
        mockUserRepository.find.mockResolvedValueOnce(mockUser);
        jest.spyOn(GenerateCrypt, "compare").mockResolvedValueOnce(false);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(
                HttpStatus.BAD_REQUEST,
                "Current password incorrect",
            ),
        );
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
    });
});
