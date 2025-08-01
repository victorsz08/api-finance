import { UserEntity } from "../../../domain/entities/user.entity";
import { HttpException, HttpStatus } from "../../../exceptions/http-exception";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { CreateUserInputDto, CreateUserUsecase } from "../create";

describe("Create User Usecase", () => {
    let usecase: CreateUserUsecase;

    beforeAll(() => {
        usecase = CreateUserUsecase.build(mockUserRepository);
    });

    test("should a be create new user successfully", async () => {
        const input: CreateUserInputDto = {
            email: "teste@email.com",
            firstName: "teste",
            lastName: "teste",
            password: "teste1234",
        };

        mockUserRepository.create.mockResolvedValue(undefined);
        mockUserRepository.findByEmail.mockResolvedValueOnce(null);

        await usecase.execute(input);

        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
    });

    test("should a be to throw exception email already exists", async () => {
        const input: CreateUserInputDto = {
            email: "teste@email.com",
            firstName: "teste",
            lastName: "teste",
            password: "teste1234",
        };

        const mockUser = await UserEntity.build(
            input.email,
            input.firstName,
            input.lastName,
            input.password,
        );

        mockUserRepository.findByEmail.mockResolvedValueOnce(mockUser);

        await expect(usecase.execute(input)).rejects.toThrow(
            new HttpException(HttpStatus.CONFLICT, "Email already exists"),
        );
        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
            input.email,
        );
    });
});
