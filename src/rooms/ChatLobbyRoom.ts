import { Client, Room } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

class LobbyState extends Schema {
    @type({ map: "string" })
    userNames = new MapSchema<string>();
}

class MyMessage extends Schema {
    @type("string")
    message: string;
    @type("string")
    sessionId: string;
    @type("string")
    name: string;
}

export class ChatRoom extends Room {
    autoDispose = false;
    async onCreate(options: any) {
        console.log("ChatRoom created!", options);
        this.setState(new LobbyState());
        this.onMessage("message", (client, message) => {
            console.log("ChatRoom received message from", client.sessionId, ":", message);
            const data = new MyMessage();
            data.message = message;
            data.sessionId = client.sessionId;
            data.name = this.state.userNames.get(client.sessionId) ? this.state.userNames.get(client.sessionId) : "Default Name";
            this.broadcast("messages", data);
        });
        
        this.setMetadata({ name: options.name ? options.name : "Chat Room" })
        this.setMetadata({ gameState: "waiting" });
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        this.state.userNames.set(client.sessionId, options.name ? options.name : "Default Name");
        const data = new MyMessage();
        data.message = `${options.name?options.name:client.sessionId} joined.`;
        data.sessionId = client.sessionId;
        data.name = "Server";
        this.broadcast("messages", data);
        
    }

    onLeave(client: Client) {
        const data = new MyMessage();
        data.message = `${client.sessionId} left.`;
        data.sessionId = client.sessionId;
        data.name = "Server";
        this.broadcast("messages", data);
        this.state.userNames.delete(client.sessionId);
    }

    onDispose() {
        console.log("Dispose ChatRoom");
    }
}