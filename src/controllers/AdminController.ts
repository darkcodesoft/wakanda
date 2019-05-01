import express from 'express'
import Socket from '../../public/socket'
import { fork } from 'child_process'
import { join } from 'path'
import EventService from '../services/event'
import UserService from '../services/user'
import ModelController from '../../src/controllers/ModelController'

const modelController = new ModelController

/**
 *
 * @todo
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
export async function index(req: express.Request, res: express.Response): Promise<void> {

    // should be getting data from Jobs Model
    res.send({
        'updated': new Date(),
        'models':[
            {
                'name': 'user',
                'count': await UserService.count(),
            },
            {
                'name': 'event',
                'count': await EventService.count(),
            }
        ]
    })
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<any>}
 */
export async function event(req: express.Request, res: express.Response): Promise<any> {
    modelController.Service = EventService
    return modelController.find(req, res)
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
export async function user(req: express.Request, res: express.Response): Promise<void> {
    modelController.Service = UserService
    return modelController.find(req, res)
}

/**
 *
 * @todo
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function mine(req: express.Request, res: express.Response): void {
    const process = fork(join(__dirname, '../../src/providers'), ['-r', 'ts-node/register'])
    console.log('Provider fetch started:' + new Date() )
    process.on('message', async (msg) => {
        if(msg.status === 200) {
            console.log('MINING_SUCCESS:' + new Date())
            Socket.json({ message: 'MINING_SUCCESS', data: await EventService.count() })
        } else {
            console.log('MINING_ERROR:' + new Date())
            Socket.json({ message: 'MINING_ERROR', data: msg})
        }
    })

    res.send({ message: 'porcess started', timestamp: new Date() })
}

export async function socket(req: express.Request, res: express.Response): Promise<void> {
    const message = req.params.message ? req.params.message : 'MESSAGE'
    Socket.send(JSON.stringify({ message: message }))
    res.json(message)
}
