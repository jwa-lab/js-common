import { parseJwtToNats } from "../../src/tokenParser";

const WELL_FORMED_STUDIO_JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImZkNmM1ZjJiLTRlMTQtNGYzMS1iODQwLTc3MjVlMDY4OWJmMiJ9.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaXNzIjoiaHR0cDovL2F1dGhvcml6YXRpb24tc2VydmljZTo4OTk5L29hdXRoMi9kZWZhdWx0IiwiZXhwIjo0MTE2ODE2MzUxLCJpYXQiOjE2Mzc1OTc5MTYsImp0aSI6IjAyYWZiNTNkLWFjNjAtNDU2Yi04YjUzLWY0ZTZkNDRmMWQzNyIsImNpZCI6InN0dWRpb19pZCIsInN1YiI6InN0dWRpb19pZCIsInN0dWRpbyI6dHJ1ZSwic2NwIjpbInN0dWRpb19zY29wZSJdfQ.paEdadQ02aciQv6qjQIyggy-em73_MXEA3chA-FFsCVwmUi1TYLty8Bb2DXo63XiXmPtbA5Mn5h62yM_CCPk3qJN47zRwLkiB9qfITDFi6SJXo2k0VPuHW9a2ZCp1Y2lwNtofBUs3qedFH0bIDBsbdW8qFOHl1FH5gd4yUSMZj0jnFbA9Q9lu_TSZ_J5jRBWhVJIrLPCRh7gtOWu1s1FKv2Rp2sZdc1sepvetQXEQx9GxqpI5BMc6p57_wzqad6CmIzuqcX1CLu-AYAueOmgXZGadjJhzHRa0qk2VElGZ7m8lW4pKqn-JXXhEnVRXpHIwb8mWonZey_33ywthV_pZw";
const WELL_FORMED_USER_JWT = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImZkNmM1ZjJiLTRlMTQtNGYzMS1iODQwLTc3MjVlMDY4OWJmMiJ9.eyJhdWQiOiJhcGk6Ly9kZWZhdWx0IiwiaXNzIjoiaHR0cDovL2F1dGhvcml6YXRpb24tc2VydmljZTo4OTk5L29hdXRoMi9kZWZhdWx0IiwiZXhwIjo0MTE2ODE2MzUxLCJpYXQiOjE2Mzc1OTgyOTYsImp0aSI6IjczOTdmY2NjLTY2MTYtNDMxMi1iMjE5LTBmN2E2NDBhOGVkNCIsImNpZCI6InN0dWRpb19pZCIsInVpZCI6InVuaXF1ZV91c2VyX2lkIiwic3ViIjoidW5pcXVlX3VzZXJuYW1lIn0.SoEEGJK6BbUA4VxCfWxpJ1xmRxiAOungSeCqLkhGtbR5kERicGJ8jLcXWNjWOqq_Dd_0Z0DmXZBhwkFlO3A1nD-GHmuZ3ab96ZGqFDlMdBTk1p4utG7mMGt6-HHabVRvGr02xuEdspO-oUng3LqXqCvs4W6MJtGb18DaZhEFqtGH-f_uKwZvXRbmH6Xl5NzLTQ0QaCDFI_bs9e63aJSvh3AN4DyP5zF1f5626PKvxLKLYwQ6LzWB1lAbNSocygViBBGto9FrSKjmE-qMaoHZS6PosfWJmyoH5Rh78L1VecErK12N50TdzwTedFRg49AsrFxw_uu6jplV2xUtpMh4sg";
const MALFORMED_USER_JWT = "BAD_JWT";

describe("Given tokenParser", () => {
    describe("When called with a bad parameter", () => {
        it("Should throw an invalid JWT error.", () => {
            expect(() => parseJwtToNats(undefined)).toThrow("INVALID_JWT");            
        })
    });

    describe("When called with an invalid JWT", () => {
        it("Should throw an invalid JWT error.", () => {
            expect(() => parseJwtToNats(MALFORMED_USER_JWT)).toThrow("INVALID_JWT: Invalid token specified");
        })
    });

    describe("When called to parse a well formed studio JWT", () => {
        it("Should a parsed JWT object containing the required studio fields.", () => {
            const parsed = parseJwtToNats(WELL_FORMED_STUDIO_JWT);
            
            expect(parsed).toEqual({
                studio_id: "studio_id",
                username: "studio_id",
                user_id: "",
                is_studio: true
            })
        })
    });

    describe("When called to parse a well formed user JWT", () => {
        it("Should a parsed JWT object containing the required user fields.", () => {
            const parsed = parseJwtToNats(WELL_FORMED_USER_JWT);
            
            expect(parsed).toEqual({
                studio_id: "studio_id",
                user_id: "unique_user_id",
                username: "unique_username",
                is_studio: false
            })
        })
    });
});
