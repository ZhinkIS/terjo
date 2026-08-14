import slideshows from './slideshows'
import members from './members'
import registrations from './registrations'
import settings from './settings'
const admin = {
    slideshows: Object.assign(slideshows, slideshows),
members: Object.assign(members, members),
registrations: Object.assign(registrations, registrations),
settings: Object.assign(settings, settings),
}

export default admin