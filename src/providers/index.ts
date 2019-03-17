import TicketMaster from './TicketMaster'
import EventBrite from './EventBrite'

try {
    TicketMaster.static().fetch()
    EventBrite.static().fetch()

    if(process.send) {
        process.send({ status: 200 })
    }
} catch(e) {
    if(process.send) {
        process.send({ status: 500, error: e })
    }
}

