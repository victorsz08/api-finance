import { sign, verify } from "jsonwebtoken";
import { mockUserRepository } from "../../../package/mock-jest/mock-repository";
import {
    AuthRefreshInputDto,
    AuthRefreshOutputDto,
    AuthRefreshUsecase,
} from "../refresh";

jest.mock("jsonwebtoken");

describe("Auth Refresh Usecase", () => {
    let usecase: AuthRefreshUsecase;

    beforeAll(() => {
        usecase = AuthRefreshUsecase.build(mockUserRepository);
    });

    test("should a be returns refresh token", async () => {
        const input: AuthRefreshInputDto = {
            token: "token-expireds",
        };

        const mockUserDecoded = { id: "id-user-decoded" };
        const mockRefreshtoken = "refresh-token";

        (verify as jest.Mock).mockResolvedValue(mockUserDecoded);
        (sign as jest.Mock).mockReturnValue(mockRefreshtoken);

        const result = await usecase.execute(input);
        const output: AuthRefreshOutputDto = {
            refreshToken: mockRefreshtoken,
        };

        expect(result).toEqual(output);
    });
});
