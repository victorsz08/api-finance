import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";
import { Usecase } from "../usecase";

export type UpdateUserInputDto = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
};

export type UpdateUserOutputDto = void;

export class UpdateUserUsecase
    implements Usecase<UpdateUserInputDto, UpdateUserOutputDto>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new UpdateUserUsecase(userInterface);
    }

    public async execute(input: UpdateUserInputDto): Promise<void> {
        const { id, email, firstName, lastName } = input;
        const updatedAt = new Date();

        const aUser = await this.userInterface.find(id);
        if (!aUser) {
            throw new HttpException(
                HttpStatus.NOT_FOUND,
                "User not found with id",
            );
        }

        if (aUser.email !== email) {
            const emailAlredyExist =
                await this.userInterface.findByEmail(email);
            if (emailAlredyExist) {
                throw new HttpException(
                    HttpStatus.CONFLICT,
                    "Email already exists",
                );
            }
        }

        await this.userInterface.update(
            id,
            email,
            firstName,
            lastName,
            updatedAt,
        );
        return;
    }
}
