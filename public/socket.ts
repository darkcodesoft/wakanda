import WebSocket from 'ws';
import server from './server';

export interface JSONMessage {
    message: string
    data: any
}

/**
 *
 *
 * @export
 * @class SocketClass
 */
export class WebSocketServer {

    /**
     *
     *
     * @type {WebSocket.Server}
     * @memberof SocketClass
     */
    public server: WebSocket.Server

    /**
     *Creates an instance of SocketClass.
     * @memberof SocketClass
     */
    constructor(port: number = 3001) {
        this.server = new WebSocket.Server({ port: port });
    }

    /**
     *
     *
     * @param {string} message
     * @memberof SocketClass
     */
    public send(message: string) {
        this.server.clients.forEach( client => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(message)
            }
        })
    }

    /**
     *
     *
     * @param {JSONMessage} data
     * @memberof WebSocketServer
     */
    public json(data: JSONMessage) {
        const encoded = JSON.stringify(data)
        this.send(encoded)
    }
}

const port = server.static().getPort() + 1
export default new WebSocketServer(port)