import HomeController from './HomeController'
import MemberController from './MemberController'
import Auth from './Auth'
import ProfileController from './ProfileController'
import DashboardController from './DashboardController'
import Admin from './Admin'
const Controllers = {
    HomeController: Object.assign(HomeController, HomeController),
MemberController: Object.assign(MemberController, MemberController),
Auth: Object.assign(Auth, Auth),
ProfileController: Object.assign(ProfileController, ProfileController),
DashboardController: Object.assign(DashboardController, DashboardController),
Admin: Object.assign(Admin, Admin),
}

export default Controllers