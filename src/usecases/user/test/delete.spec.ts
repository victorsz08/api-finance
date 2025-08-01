import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { DeleteUserInputDto, DeleteUserUsecase } from "../delete";

describe("Delete User Usecase", () => {
    let usecase: DeleteUserUsecase;

    beforeAll(() => {
        usecase = DeleteUserUsecase.build(mockUserRepository);
    });

    test("should a be delete user successfully", async () => {
        const input: DeleteUserInputDto = {
            id: "test_id",
        };
        const mockUser = {} as UserEntity;

        mockUserRepository.find.mockResolvedValueOnce(mockUser);
        mockUserRepository.delete.mockResolvedValueOnce(undefined);

        await usecase.execute(input);

        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
        expect(mockUserRepository.delete).toHaveBeenCalledWith(input.id);
    });

    test("should a be to throw exception user not found with id", async () => {
        const input: DeleteUserInputDto = {
            id: "test_rejects_id",
        };

        mockUserRepository.find.mockResolvedValue(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.NOT_FOUND, "User not found with id"),
        );
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
    });
});
