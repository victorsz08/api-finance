import {
    ListUser,
    UserInterface,
} from "../../domain/interfaces/user.interface";
import { Usecase } from "../usecase";

export type ListUserInputDto = {
    page: number;
    limit: number;
    search: string;
};

export type ListUserOutputDto = {
    users: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        createdAt: Date;
        updatedAt: Date;
    }[];
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
};

export class ListUserUsecase
    implements Usecase<ListUserInputDto, ListUserOutputDto>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new ListUserUsecase(userInterface);
    }

    public async execute(input: ListUserInputDto): Promise<ListUserOutputDto> {
        const { page, limit, search } = input;
        const uData = await this.userInterface.list(page, limit, search);

        const output = this.present(uData);
        return output;
    }

    private present(data: ListUser): ListUserOutputDto {
        return {
            users: data.users.map((user) => {
                return {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                };
            }),
            total: data.total,
            currentPage: data.currentPage,
            perPage: data.perPage,
            totalPages: data.totalPages,
        };
    }
}
