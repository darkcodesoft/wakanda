import Server from './server'
import express from 'express'
import {expect} from 'chai'

describe('Server', () => {

    const instance = Server.static()
    const port = 2345

    it('should not be null or undefined', () => {
        expect(!!instance).to.equal(true)
    })

    it('should be an instance of Server', () => {
        expect(instance).to.be.instanceof(Server)
    })

    it('process should be an instance of express.Application', () => {
        expect(instance.process).to.be.instanceof(express.application.constructor)
    })

    it('should be able to set port', () => {
        instance.setPort(port)
        expect(instance.getPort()).to.equal(port)
    })
})