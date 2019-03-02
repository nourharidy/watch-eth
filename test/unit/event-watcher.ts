import { should } from '../setup'
import { EventWatcher } from '../../src/event-watcher'
import { EventFilterOptions, EventLog } from '../../src/models'
import * as mockEth from '../mock/eth-provider'
import { sleep } from '../../src/utils'

class ListenerSpy {
  public args: EventLog[]
  public listener(args: EventLog[]): void {
    this.args = args
  }
}

describe('EventWatcher', () => {
  let watcher: EventWatcher

  beforeEach(() => {
    watcher = new EventWatcher({
      address: '0x0',
      abi: [
        {
          anonymous: false,
          inputs: [
            {
              indexed: false,
              name: '_value',
              type: 'uint256',
            },
          ],
          name: 'TestEvent',
          type: 'event',
        },
      ],
      finalityDepth: 0,
      pollInterval: 0,
      eth: mockEth.eth,
    })
  })

  afterEach(() => {
    watcher.stopPolling()
    mockEth.reset()
  })

  describe('subscribe', () => {
    it('should allow a user to subscribe to an event', () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const listener = () => {
        return
      }

      watcher.subscribe(filter, listener)
      watcher.isPolling.should.be.true
    })

    it('should allow a user to subscribe twice with the same listener', () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const listener = () => {
        return
      }

      should.not.Throw(() => {
        watcher.subscribe(filter, listener)
        watcher.subscribe(filter, listener)
      })
    })
  })

  describe('unsubscribe', () => {
    it('should allow a user to unsubscribe from an event', () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const listener = () => {
        return
      }

      watcher.subscribe(filter, listener)
      watcher.unsubscribe(filter, listener)
      watcher.isPolling.should.be.false
    })

    it('should allow a user to unsubscribe even if not subscribed', () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const listener = () => {
        return
      }

      should.not.Throw(() => {
        watcher.unsubscribe(filter, listener)
      })
    })

    it('should still be polling if other listeners exist', () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const listener1 = () => {
        return true
      }
      const listener2 = () => {
        return false
      }

      watcher.subscribe(filter, listener1)
      watcher.subscribe(filter, listener2)
      watcher.unsubscribe(filter, listener1)
      watcher.isPolling.should.be.true
    })
  })

  describe('events', () => {
    it('should alert a listener when it hears an event', async () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const spy = new ListenerSpy()

      // Mock out the events that will be returned.
      const event: EventLog = new EventLog({
        transactionHash: '0x123',
        logIndex: 0,
      })
      mockEth.setEvents([event])

      // Subscribe for new events.
      watcher.subscribe(filter, spy.listener.bind(spy))

      // Wait for events to be detected.
      await sleep(10)

      spy.args.should.deep.equal([event])
    })

    it('should alert multiple listeners on the same event', async () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const spy1 = new ListenerSpy()
      const spy2 = new ListenerSpy()

      // Mock out the events that will be returned.
      const event: EventLog = new EventLog({
        transactionHash: '0x123',
        logIndex: 0,
      })
      mockEth.setEvents([event])

      // Subscribe for new events.
      watcher.subscribe(filter, spy1.listener.bind(spy1))
      watcher.subscribe(filter, spy2.listener.bind(spy2))

      // Wait for events to be detected.
      await sleep(10)

      spy1.args.should.deep.equal([event])
      spy2.args.should.deep.equal([event])
    })

    it('should only alert the same event once', async () => {
      const filter: EventFilterOptions = {
        event: 'TestEvent',
      }
      const spy = new ListenerSpy()

      // Mock out the events that will be returned.
      const event: EventLog = new EventLog({
        transactionHash: '0x123',
        logIndex: 0,
      })
      mockEth.setEvents([event, event])

      // Subscribe for new events.
      watcher.subscribe(filter, spy.listener.bind(spy))

      // Wait for events to be detected.
      await sleep(10)

      spy.args.should.deep.equal([event])
    })
  })
})
