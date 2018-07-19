
import Sockette     from 'sockette';
import packetParser from './packetParser.js';

class Websocket {
    constructor(data){
        this.ws             = null;
        this.that           = data.that;
    }

    connect(address, initPacket){
        this.ws = new Sockette(address, {
            onopen: e => {
                let state = this.that.state;
                state.rawLogs         = [];
                state.processedLogs   = '';
                this.that.setState(state);
                console.warn('WS Connected!', e);
                this.that.msg.success("The websocket connected!");
                if(initPacket != null)
                    this.send(initPacket, true, false);
            },
            onmessage: e => {
                // console.warn('Message Received:', e.data);
                packetParser(this.that, e.data);
            },
            onreconnect:    e => console.warn('WS Reconnecting...', e),
            maxAttempts:    -1, // To prevent reconnecting the websocket
            onmaximum:      e => console.warn('WS Stop Attempting!', e),
            onclose:        e => {
                let state = this.that.state;
                state.user = null;
                state.ws   = null;
                this.that.setState(state);
                this.that.msg.error("Websocket disconnected!")
                console.warn('WS Closed!', e);
            },
            onerror:        e => console.warn('WS Error:', e)
        });
    }

    close(){
        if(this.ws != null)
            this.ws.close();
    }

    send(packet){
        if(this.ws != null){
            let checkJSON = this.that.state.inputValue.checkJSON;
            
            if(checkJSON === true)
                this.ws.send(JSON.stringify(packet));
            else
                this.ws.send(packet);
            // console.log('packet sent: ', packet);
        }else
            console.error("Can't send ws packet. ws is null or ws has not been opened");
    }

}


export default Websocket;