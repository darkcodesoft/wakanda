import App from './app'
import {expect} from 'chai'

describe('App', () => {
    it('should initialise with a return value of true', () => {
        let app = new App()
        expect(app.init()).to.equal(true)
    })
})