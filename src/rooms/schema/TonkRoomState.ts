import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

enum GameState {
  Waiting = "waiting",
  Setup = "setup",
  Playing = "playing",
  GameOver = "gameOver"
}
class Tank extends Schema {
  @type("string")
  sessionId: string;

  @type("number")
  hullPoints: number;

  @type("number")
  orientation: number; // Tank's orientation in degrees (0 to 359)

  @type("number")
  turretOrientationOffset: number; // Turret's orientation offset in degrees (0 to 359)

  @type("number")
  positionX: number;

  @type("number")
  positionY: number;

  @type("number")
  width: number;

  @type("number")
  length: number;

  // Constructor for initializing a Tank instance
  constructor(sessionId: string, hullPoints: number, orientation: number, turretOrientationOffset: number, positionX: number, positionY: number, width: number, length: number) {
    super();
    this.sessionId = sessionId;
    this.hullPoints = hullPoints;
    this.orientation = orientation;
    this.turretOrientationOffset = turretOrientationOffset;
    this.positionX = positionX;
    this.positionY = positionY;
    this.width = width;
    this.length = length;
  }
}

class Obstruction extends Schema {
  @type("number")
  positionX: number;

  @type("number")
  positionY: number;

  @type("number")
  orientation: number;

  @type("number")
  width: number;

  @type("number")
  height: number;

  // Constructor is not necessary but can be useful for initializing
  constructor(positionX: number, positionY: number, orientation: number, width: number, height: number) {
    super();
    this.positionX = positionX;
    this.positionY = positionY;
    this.orientation = orientation;
    this.width = width;
    this.height = height;
  }
}

class TonkRoomState extends Schema {
  @type({ map: Tank })
  tanks = new MapSchema<Tank>();

  @type([Obstruction])
  obstructions = new ArraySchema<Obstruction>();

  // basic game state
  @type("string")
  gameState: GameState;
  @type("string")
  prevGameState: GameState;
}

export { Tank, Obstruction, TonkRoomState };
