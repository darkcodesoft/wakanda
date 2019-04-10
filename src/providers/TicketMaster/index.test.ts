import TicketMaster from '.'
import {expect} from 'chai'

describe('TicketMaster Provider', () => {

    let provider = TicketMaster.static()

    it('should not be null or undefined', () => {
        expect(!!provider).to.equal(true)
    })

    it('should be an instance of App', () => {
        expect(provider).to.be.instanceof(TicketMaster)
    })

    it('should get page attribute', () => {
        expect(provider.getPage()).to.be.gte(0)
    })

    it('should set page attribute', () => {
        provider.setPage(1)
        expect(provider.getPage()).to.equal(1)
    })

    it('should increase page value attribute', () => {
        let page = provider.getPage()
        let next = page + 1
        provider.nextPage()
        expect(provider.getPage()).to.equal(next)
    })

    it('should decrease page value attribute', () => {
        let page = provider.getPage()
        let previous = page - 1
        provider.previousPage()
        expect(provider.getPage()).to.equal(previous)
    })

    it('should get array of failed request', () => {
        expect(provider.getFailed()).to.be.instanceOf(Array)
    })
})