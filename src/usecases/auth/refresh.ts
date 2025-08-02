import { sign, verify } from "jsonwebtoken";
import { UserInterface } from "../../domain/interfaces/user.interface";
import { Usecase } from "../usecase";
import { HttpException, HttpStatus } from "../../exceptions/http-exception";




export type AuthRefreshInputDto = {
    token: string;
}

export type AuthRefreshOutputDto = {
    refreshToken: string;
}

export class AuthRefreshUsecase implements Usecase<AuthRefreshInputDto, AuthRefreshOutputDto> {
    private constructor(private readonly userInterface: UserInterface) {}

    public static build(userInterface: UserInterface) {
        return new AuthRefreshUsecase(userInterface)
    }
    
    public async execute(input: AuthRefreshInputDto): Promise<AuthRefreshOutputDto> {
        const { token } = input;
        const decoded = verify(token, String(process.env.JWT_SECRET)) as { id: string };

        const payload = sign({
            id: decoded.id
        }, String(process.env.JWT_SECRET), { expiresIn: "1d" })

        return {
            refreshToken: payload
        }
    }
}