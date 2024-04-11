import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { 
    url: 'http://79.174.80.125:5000', 
    options: {
        autoConnect: false,
    } 
};

@Injectable({
    providedIn: 'root'
})
export class SocketService extends Socket {

    constructor() {
        super(config)
    }
}