import App from './app'
import {expect} from 'chai'
import * as mocha from 'mocha'

describe('calculator', () => {
    it('should initialise with a return value of true', () => {
        let app = new App()
        expect(app.init()).to.equal(true)
    })
})