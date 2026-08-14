import SlideshowController from './SlideshowController'
import MemberController from './MemberController'
import RegistrationController from './RegistrationController'
import SettingsController from './SettingsController'
const Admin = {
    SlideshowController: Object.assign(SlideshowController, SlideshowController),
MemberController: Object.assign(MemberController, MemberController),
RegistrationController: Object.assign(RegistrationController, RegistrationController),
SettingsController: Object.assign(SettingsController, SettingsController),
}

export default Admin