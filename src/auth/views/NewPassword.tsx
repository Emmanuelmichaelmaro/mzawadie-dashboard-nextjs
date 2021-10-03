import useNavigator from "@mzawadie/hooks/useNavigator";
import useUser from "@mzawadie/hooks/useUser";
import { parse as parseQs } from "qs";
import React from "react";

import NewPasswordPage, { NewPasswordPageFormData } from "../components/NewPasswordPage";
import { SetPasswordMutation } from "../mutations";
import { SetPassword } from "../types/SetPassword";
import { NewPasswordUrlQueryParams } from "../urls";

const NewPassword: React.FC<any> = ({ location }) => {
    const navigate = useNavigator();
    const { loginByToken } = useUser();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const params: NewPasswordUrlQueryParams = parseQs(location.search.substr(1));

    // eslint-disable-next-line @typescript-eslint/require-await
    const handleSetPassword = async (data: SetPassword) => {
        if (data?.setPassword?.errors.length === 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            loginByToken(data?.setPassword?.token, data.setPassword.csrfToken, data.setPassword.user);
            navigate("/", true);
        }
    };

    return (
        <SetPasswordMutation onCompleted={handleSetPassword}>
            {(setPassword, setPasswordOpts) => {
                const handleSubmit = (data: NewPasswordPageFormData) =>
                    setPassword({
                        variables: {
                            email: params.email,
                            password: data.password,
                            token: params.token,
                        },
                    });

                return (
                    <NewPasswordPage
                        errors={setPasswordOpts.data?.setPassword?.errors || []}
                        disabled={setPasswordOpts.loading}
                        onSubmit={handleSubmit}
                    />
                );
            }}
        </SetPasswordMutation>
    );
};

NewPassword.displayName = "NewPassword";

export default NewPassword;
