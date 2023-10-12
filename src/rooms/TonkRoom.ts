import { Room, Client } from "@colyseus/core";
import { TonkRoomState, Player, Obstacle } from "./schema/TonkRoomState";

//create a room that handles up to 8 players in turn order  (2 teams of 4)
export class TonkRoom extends Room<TonkRoomState> {
  maxClients = 8;

  onCreate (options: any) {
    this.setState(new TonkRoomState());
    this.onMessage ("submitTurn", (client, message) => {
      if(client.sessionId == this.state.activePlayer){
        this.handleTurn(client, message);
      }
      if(client.sessionId != this.state.activePlayer){
        console.log("not your turn");
      }
    });

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });
  }


  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");   

        // create Player instance
        const player = new Player();

        // place Player at a random position
        const FLOOR_SIZE = 4;
        player.x = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
        player.y = 1.031;
        player.z = -(FLOOR_SIZE/2) + (Math.random() * FLOOR_SIZE);
        player.playerNumber = this.state.players.size;
        player.turret = 1;
        player.rotation = 0;
        player.hp = 6;
        // place player in the map of players by its sessionId
        // (client.sessionId is unique per connection!)
        this.state.players.set(client.sessionId, player);
  }

  //a turn will contain a list of up to 4 actions and their properties
  handleTurn(client: Client, message: any){
      
  };
  //handle starting the next turn incrementing the active player saving their sessionID and sending a message to that player
  startNextTurn(){
    const playerIds = Object.keys(this.state.players);
    const currentPlayerIndex = playerIds.indexOf(this.state.activePlayer);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerIds.length;
    this.state.activePlayer = playerIds[nextPlayerIndex];
    this.broadcast("nextPlayer", "your turn", {afterNextPatch: true});
  }


  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}