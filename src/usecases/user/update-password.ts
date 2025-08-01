import { UserInterface } from "../../domain/interfaces/user.interface";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";
import { GenerateCrypt } from "../../helpers/crypt";
import { Usecase } from "../usecase";

export type UpdatePasswordUserInputDto = {
    id: string;
    currentPassword: string;
    newPassword: string;
};

export type UpdatePasswordUserOutput = void;

export class UpdatePasswordUserUsecase
    implements Usecase<UpdatePasswordUserInputDto, UpdatePasswordUserOutput>
{
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new UpdatePasswordUserUsecase(userInterface);
    }

    public async execute(input: UpdatePasswordUserInputDto): Promise<void> {
        const { id, currentPassword, newPassword } = input;
        const aUser = await this.userInterface.find(id);

        if (!aUser) {
            throw new HttpException(
                HttpStatus.NOT_FOUND,
                "User not found with id",
            );
        }

        const validateCurrentPassword = await GenerateCrypt.compare(
            currentPassword,
            aUser.password,
        );

        if (!validateCurrentPassword) {
            throw new HttpException(
                HttpStatus.BAD_REQUEST,
                "Current password incorrect",
            );
        }

        const newPasswordHashed = await GenerateCrypt.hash(newPassword);
        const updatedAt = new Date();

        await this.userInterface.updatePassword(
            id,
            newPasswordHashed,
            updatedAt,
        );

        return;
    }
}
