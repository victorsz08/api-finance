import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";
import { Usecase } from "../usecase";

export type DeleteUserInputDto = {
    id: string;
};

export type DeleteUserOutputDto = void;

export class DeleteUserUsecase
    implements Usecase<DeleteUserInputDto, DeleteUserOutputDto>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new DeleteUserUsecase(userInterface);
    }

    public async execute(input: DeleteUserInputDto): Promise<void> {
        const { id } = input;
        const aUser = await this.userInterface.find(id);

        if (!aUser) {
            throw new HttpException(
                HttpStatus.NOT_FOUND,
                "User not found with id",
            );
        }

        await this.userInterface.delete(id);
        return;
    }
}
