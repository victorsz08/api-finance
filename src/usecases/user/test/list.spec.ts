import { ListUser } from "../../../domain/interfaces/user.interface";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import { ListUserInputDto, ListUserOutputDto, ListUserUsecase } from "../list";

describe("List User Usecase", () => {
    let usecase: ListUserUsecase;

    beforeAll(() => {
        usecase = ListUserUsecase.build(mockUserRepository);
    });

    test("should a be list users successfully", async () => {
        const input: ListUserInputDto = {
            page: 1,
            limit: 10,
            search: "",
        };

        const mockUsers: ListUser = {
            users: [],
            total: 0,
            currentPage: 1,
            perPage: 10,
            totalPages: 1,
        };

        const output: ListUserOutputDto = {
            users: mockUsers.users.map((u) => {
                return {
                    id: u.id,
                    email: u.email,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    createdAt: u.createdAt,
                    updatedAt: u.updatedAt,
                };
            }),
            total: mockUsers.total,
            currentPage: mockUsers.currentPage,
            perPage: mockUsers.perPage,
            totalPages: mockUsers.totalPages,
        };

        mockUserRepository.list.mockResolvedValue(mockUsers);

        const result = await usecase.execute(input);

        expect(result).toEqual(output);
        expect(mockUserRepository.list).toHaveBeenCalledWith(
            input.page,
            input.limit,
            input.search,
        );
    });
});
