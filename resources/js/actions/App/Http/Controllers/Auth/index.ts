import AuthenticatedSessionController from './AuthenticatedSessionController'
import RegisteredUserController from './RegisteredUserController'
import LogoutController from './LogoutController'
const Auth = {
    AuthenticatedSessionController: Object.assign(AuthenticatedSessionController, AuthenticatedSessionController),
RegisteredUserController: Object.assign(RegisteredUserController, RegisteredUserController),
LogoutController: Object.assign(LogoutController, LogoutController),
}

export default Auth