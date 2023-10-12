import { MapSchema, Schema, Context, type } from "@colyseus/schema";


export class Player extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  @type("number") hp: number;
  @type("number") rotation: number;
  @type("number") turret: number;
  @type("boolean") reloading: boolean = false;
  @type("number") playerNumber: number;
}
export class Obstacle extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type("number") z: number;
  @type("number") rotation: number;
  @type("boolean") big: boolean = false;
}
export class TonkRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type({ map: Obstacle }) obstacles = new MapSchema<Obstacle>();
  @type("string") activePlayer: string;
}
