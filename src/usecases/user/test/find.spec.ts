import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { FindUserInputDto, FindUserOutputDto, FindUserUsecase } from "../find";

describe("Find User Usecase", () => {
    let usecase: FindUserUsecase;

    beforeAll(() => {
        usecase = FindUserUsecase.build(mockUserRepository);
    });

    test("should a be return user successfully", async () => {
        const input: FindUserInputDto = {
            id: "test_id",
        };

        const mockUser = {} as UserEntity;
        mockUserRepository.find.mockResolvedValue(mockUser);

        const output: FindUserOutputDto = {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            createdAt: mockUser.createdAt,
            updatedAt: mockUser.updatedAt,
        };

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
    });

    test("should a be throw exception user not found error", async () => {
        const input: FindUserInputDto = {
            id: "test_id",
        };

        mockUserRepository.find.mockResolvedValue(null);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.NOT_FOUND, "User not found with id"),
        );
        expect(mockUserRepository.find).toHaveBeenCalledWith(input.id);
    });
});
