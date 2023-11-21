import { Room, Client } from 'colyseus';
import { Tank, Obstruction, TonkRoomState } from './schema/TonkRoomState';
import Physics from '../Physics'; // Assuming Physics is in the same directory
import { Body } from 'matter-js';


// TonkGameRoom that extends Colyseus.Room
class TonkGameRoom extends Room<TonkRoomState> {
  private physics: Physics;
  private tankBodies: Map<string, Body> = new Map(); // Map of physics bodies keyed by sessionId
  private obstructionBodies: Body[]; // Array to store static obstruction bodies

  onCreate(options: any) {
    this.setState(new TonkRoomState());
    this.physics = new Physics();
    // Initialize tanks and obstructions here...
    this.obstructionBodies = this.physics.createStaticBodiesForObstructions(Array.from(this.state.obstructions));

    // Register message handlers
    this.onMessage('move', this.handleMove);
    this.onMessage('fire', this.handleFire);
    this.onMessage('reload', this.handleReload);
    this.onMessage('rotateTurret', this.handleRotateTurret);
    this.setMetadata({ name: options.name?options.name:"Default Room"})
    this.setMetadata({ gameState: "waiting" });
  }

  // ... other methods ...
  

  // Override onJoin to create a tank and a physics body for each client

  onJoin(client: Client, options: any) {
    // Create a new tank instance
    const newTank = new Tank(client.sessionId, 100, 0, 0, 0, 0, 50, 100);
    this.state.tanks.set(client.sessionId, newTank);

    // Create a new physics body for the tank
    const tankBody = this.physics.createTankBody(newTank);
    this.tankBodies.set(client.sessionId, tankBody as Body);
    
  }

  // Override onLeave to remove the tank and its physics body
  onLeave(client: Client, consented: boolean) {
    // Remove the tank from the state
    this.state.tanks.delete(client.sessionId);

    // Remove the physics body from the map
    this.tankBodies.delete(client.sessionId);
  }

  //movement message handler
  private handleMove(client: Client, moveDetails: any) {
    const tank = this.state.tanks.get(client.sessionId);
    if (!tank) {
      console.warn("No tank found for client:", client.sessionId);
      return;
    }

    // Calculate the direction vector for the movement
    const directionRadians = (tank.orientation * Math.PI) / 180;
    const direction = {
      x: Math.cos(directionRadians),
      y: Math.sin(directionRadians)
    };

    // Get the physics body for the tank
    const tankBody = this.tankBodies.get(client.sessionId);
    if (tankBody) {
      // Test the movement and find the farthest position it can move without colliding
      const movementTest = this.physics.testMovement(tankBody, direction, moveDetails.distance, this.obstructionBodies);

      if (movementTest.collided) {
        // If a collision is detected, stop the tank at the farthest non-colliding position
        tank.positionX = movementTest.position.x;
        tank.positionY = movementTest.position.y;
      } else {
        // If no collision is detected, move the tank the full distance
        tank.positionX += direction.x * moveDetails.distance;
        tank.positionY += direction.y * moveDetails.distance;
      }

      // Update the tank body's position to match the tank's game state
      Body.setPosition(tankBody, { x: tank.positionX, y: tank.positionY });

      // Broadcast the updated position to all clients
      this.broadcast('move', { clientId: client.sessionId, position: { x: tank.positionX, y: tank.positionY } });
    }
  }

  // Define the message handlers with the specific expected signatures

  private handleFire(client: Client, fireDetails: any) {
    // ... implement fire logic ...
  }

  private handleReload(client: Client, reloadDetails: any) {
    // ... implement reload logic ...
  }

  private handleRotateTurret(client: Client, rotateDetails: any) {
    // ... implement turret rotation logic ...
  }

  // ... additional message handlers and methods ...
}

export default TonkGameRoom;