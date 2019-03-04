import App from './app'
import Server from '../../public/server'
import {expect} from 'chai'

describe('App', () => {

    let app = App.static()

    it('should not be null or undefined', () => {
        expect(!!app).to.equal(true)
    })

    it('should be an instance of App', () => {
        expect(app).to.be.instanceof(App)
    })

    it('should have a server mouneted', () => {
        expect(app.server).to.be.instanceof(Server)
    })
})