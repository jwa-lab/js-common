import {isStudio} from "../../src";

describe("Given isStudio", () => {
    let mockTokenParser;

    beforeAll(() => {
        mockTokenParser = {
            studio:  jest.fn().mockReturnValue({
                studio_id: "studio_id",
                username: "studio_id",
                user_id: "",
                is_studio: true
            }),
            user: jest.fn().mockReturnValue({
                studio_id: "studio_id",
                user_id: "unique_user_id",
                username: "unique_username",
                is_studio: false
            }),
            malformed: jest.fn().mockReturnValue({
                studio_id: "studio_id",
                user_id: "unique_user_id",
                username: "unique_username",
            })
        }
    })

    describe("When a parsed studio JWT is given", () => {
        it("Should return true", () => {
            expect(isStudio(mockTokenParser.studio())).toEqual(true);
        })
    });

    describe("When a parsed user JWT is given", () => {
        it("Should return false", () => {
            expect(isStudio(mockTokenParser.user())).toEqual(false);
        })
    });

    describe("When a malformed object is given (missing is_studio property)", () => {
        it("Should return false", () => {
            expect(isStudio(mockTokenParser.malformed())).toEqual(false);
        })
    });
})
