import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

//Player for the Chatroom and for the TonkGameRoom
class Player extends Schema {
  @type("string")
  sessionId: string;

  @type("string")
  name: string;

  // Constructor for initializing a Player instance
  constructor(sessionId: string, name: string) {
    super();
    this.sessionId = sessionId;
    this.name = name;
  }
}