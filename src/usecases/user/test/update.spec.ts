import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { UpdateUserInputDto, UpdateUserUsecase } from "../update";

describe("Update User Usecase", () => {
    let usecase: UpdateUserUsecase;

    beforeAll(() => {
        usecase = UpdateUserUsecase.build(mockUserRepository);
    });

    test("should a be update user successfully", async () => {
        const input: UpdateUserInputDto = {
            id: "test_id",
            email: "teste@email.com",
            firstName: "test",
            lastName: "test",
        };

        mockUserRepository.find.mockResolvedValueOnce({} as UserEntity);
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);
        mockUserRepository.update.mockResolvedValueOnce(undefined);

        const updatedAt = expect.any(Date);

        await usecase.execute(input);

        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
        expect(mockUserRepository.update).toHaveBeenCalledWith(
            input.id,
            input.email,
            input.firstName,
            input.lastName,
            updatedAt,
        );
    });

    test("should a be to throw exception user not found", async () => {
        const input: UpdateUserInputDto = {
            id: "test_id",
            email: "teste@email.com",
            firstName: "test",
            lastName: "test",
        };

        mockUserRepository.find.mockResolvedValue(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.NOT_FOUND, "User not found with id"),
        );
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
    });

    test("should a be to throw exception email already exists", async () => {
        const mockUser = {} as UserEntity;
        const input: UpdateUserInputDto = {
            id: "test_id",
            email: "teste@email.com",
            firstName: "test",
            lastName: "test",
        };
        mockUserRepository.find.mockResolvedValueOnce(mockUser);
        mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.CONFLICT, "Email already exists"),
        );
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
    });
});
