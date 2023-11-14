import { Engine, World, Bodies, Body, SAT } from 'matter-js';
import { Tank, Obstruction } from './rooms/schema/TonkRoomState';

class Physics {
  private engine: Engine;

  constructor() {
    this.engine = Engine.create();
    this.engine.world.gravity.y = 0; // No gravity for a top-down game
  }

  createTankBody(tank: Tank): Body {
    const tankBody = Bodies.rectangle(
      tank.positionX, tank.positionY, tank.width, tank.length,
      {
        angle: (tank.orientation * Math.PI) / 180 // Convert degrees to radians
      }
    );
    return tankBody;
  }

  // Method to update the physics body for a given tank
  updateTankBody(tank: Tank, body: Body) {
    Body.setPosition(body, { x: tank.positionX, y: tank.positionY });
    Body.setAngle(body, (tank.orientation * Math.PI) / 180); // Convert degrees to radians
  }
  createObstructionBody(obstruction: Obstruction): Body {
    const obstructionBody = Bodies.rectangle(
      obstruction.positionX, obstruction.positionY, obstruction.width, obstruction.height,
      {
        angle: (obstruction.orientation * Math.PI) / 180 // Convert degrees to radians
      }
    );
    return obstructionBody;
  }

  checkCollision(bodyA: Body, bodyB: Body): boolean {
    return SAT.collides(bodyA, bodyB).collided;
  }

  createStaticBodiesForObstructions(obstructions: Obstruction[]): Body[] {
    return obstructions.map(obstruction => this.createObstructionBody(obstruction));
  }
  // Test the movement of a tank body and find the farthest position it can move without colliding
  testMovement(tankBody: Body, direction: { x: number, y: number }, maxDistance: number, allBodies: Body[]): { position: { x: number, y: number }, collided: boolean } {
    let distance = 0;
    let collided = false;
    const increment = 1; // The increment can be adjusted for accuracy
    const startPosition = { x: tankBody.position.x, y: tankBody.position.y };

    // Move the tank incrementally and check for collisions
    while (distance < maxDistance && !collided) {
      distance += increment;
      const testPosition = {
        x: startPosition.x + direction.x * distance,
        y: startPosition.y + direction.y * distance
      };

      // Move the tank body to the test position
      Body.setPosition(tankBody, testPosition);

      // Check for collisions with all other bodies
      for (const body of allBodies) {
        if (body !== tankBody && SAT.collides(tankBody, body).collided) {
          collided = true;
          distance -= increment; // Step back to the last non-colliding position
          break;
        }
      }
    }

    // Return the final position and collision status
    return {
      position: {
        x: startPosition.x + direction.x * distance,
        y: startPosition.y + direction.y * distance
      },
      collided
    };
  }
}

export default Physics;