import { Mongoose } from 'mongoose'
import { Event, EventModel } from '../models/Event'
import express from 'express'
import { fork } from 'child_process'
import { join } from 'path'

const base_limit: number = 25
const base_page: number = 1
const base_sort: string = 'start'

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
export async function find(req: express.Request, res: express.Response): Promise<void> {
    const now = new Date().toISOString()
    const fields = req.query.fields ? parseFields(req.query.fields) : {}
    const limit = req.query.limit ? parseInt(req.query.limit) : base_limit
    const page = req.query.page ? parseInt(req.query.page) : base_page
    const skip = limit * (page - 1)
    const sort = req.query.sort ? req.query.sort : base_sort

    Event.find({}).
        skip(skip).
        limit(limit).
        sort(sort).
        select(fields).
        where({ active: true, start: { $gte: now } }).
        exec().
        then((events) => {
            res.status(200).send(events)
        }).
        catch((error) => {
            res.status(404).send(error)
        })
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
export async function detail(req: express.Request, res: express.Response): Promise<void> {
    try {
        const event = await Event.findOne({ _id: req.params.id })
        res.send(event)
    } catch(error) {
        res.status(404).send(error)
    }
}

/**
 *
 *
 * @export
 * @param {express.Request} req
 * @param {express.Response} res
 */
export function fetch(req: express.Request, res: express.Response): void {
    const process = fork(join(__dirname, '../../src/providers'), ['-r', 'ts-node/register'])
    console.log('Provider fetch started:' + new Date() )
    process.on('message', (msg) => {
        if(msg.status === 200) {
            console.log('Provider fetch completed:' + new Date())
        } else {
            console.log('Provider fetch error:' + new Date())
            console.log(msg)
        }
    })

    res.send({ message: 'porcess started' })
}

/**
 *
 *
 * @param {string} query
 * @returns {*}
 */
function parseFields(query: string): any {
    const fields: any = {}
    const array: string[] = query.replace(/\s/g,'').split(',')
    const size = array.length
    let field: string
    let i = 0

    for( ; i < size; i++ ) {
        field = array[i]
        fields[field] = 1;
    }

    return fields
}