import React from "react";

import { UserContext } from "../src/views/auth";

export const UserDecorator = (user) => storyFn => (
    <UserContext.Provider
        value={{
            login: undefined,
            loginByExternalPlugin: undefined,
            loginByToken: undefined,
            logout: undefined,
            requestLoginByExternalPlugin: undefined,
            tokenAuthLoading: false,
            tokenRefresh: undefined,
            tokenVerifyLoading: false,
            user
        }}
    >
        {storyFn()}
    </UserContext.Provider>
);

export default UserDecorator;
