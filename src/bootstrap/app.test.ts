import App from './app'
import {expect} from 'chai'

describe('App', () => {
    it('should initialise with a return value of true', () => {
        let app = App.static()
        expect(app.main()).to.equal(true)
    })
})