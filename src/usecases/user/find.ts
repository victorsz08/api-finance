import { UserEntity } from "../../domain/entities/user.entity";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";
import { Usecase } from "../usecase";

export type FindUserInputDto = {
    id: string;
};

export type FindUserOutputDto = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
};

export class FindUserUsecase
    implements Usecase<FindUserInputDto, FindUserOutputDto>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new FindUserUsecase(userInterface);
    }

    public async execute(input: FindUserInputDto): Promise<FindUserOutputDto> {
        const { id } = input;
        const aUser = await this.userInterface.find(id);

        if (!aUser) {
            throw new HttpException(
                HttpStatus.NOT_FOUND,
                "User not found with id",
            );
        }

        const output = this.present(aUser);
        return output;
    }

    private present(user: UserEntity): FindUserOutputDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
