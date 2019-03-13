import TicketMaster from './TicketMaster'
import EventBrite from './EventBrite'

try {
    TicketMaster.static().fetch()
    EventBrite.static().fetch()

    if(process.send) {
        process.send({ message: 'done' })
    }
} catch(e) {
    if(process.send) {
        process.send({ message: e.message })
    }
}

