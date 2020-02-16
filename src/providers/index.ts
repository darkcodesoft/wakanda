import TicketMaster from './TicketMaster';
// import EventBrite from './EventBrite'

try {
  TicketMaster.fetch();
  // EventBrite.fetch()

  if (process.send) {
    process.send({ status: 200 });
  }
} catch (e) {
  if (process.send) {
    process.send({ status: 500, error: e });
  }
}
