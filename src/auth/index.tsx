import React from "react"

import { User } from "../../generated/graphql"

interface UserContext {
    user?: User
    login: (username: string, password: string) => void
    loginByToken: (auth: string, csrf: string, user: User) => void
    logout: () => void
    tokenAuthLoading: boolean
    tokenRefresh: () => Promise<boolean>
    tokenVerifyLoading: boolean
}

export const UserContext = React.createContext<UserContext>({
    login: undefined,
    loginByToken: undefined,
    logout: undefined,
    tokenAuthLoading: false,
    tokenRefresh: undefined,
    tokenVerifyLoading: false,
})

// const AuthRouter: React.FC = () => (
//     <Layout>
//         <Switch>
//             <Route path={passwordResetSuccessPath} component={ResetPasswordSuccess} />
//             <Route path={passwordResetPath} component={ResetPassword} />
//             <Route path={newPasswordPath} component={NewPassword} />
//             <Route component={LoginView} />
//         </Switch>
//     </Layout>
// )

// AuthRouter.displayName = "AuthRouter"

// export default AuthRouter

export * from "./utils"
