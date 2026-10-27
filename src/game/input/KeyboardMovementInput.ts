import { Input, Math as PhaserMath } from 'phaser';

export type MovementKeys = {
    W: Input.Keyboard.Key;
    A: Input.Keyboard.Key;
    S: Input.Keyboard.Key;
    D: Input.Keyboard.Key;
};

export class KeyboardMovementInput {
    constructor(
        private readonly keys: MovementKeys
    ) {}

    getDirection(): PhaserMath.Vector2 {
        let directionX = 0;
        let directionY = 0;

        if (this.keys.W.isDown) {
            directionY -= 1;
        }
        if (this.keys.S.isDown) {
            directionY += 1;
        }
        if (this.keys.A.isDown) {
            directionX -= 1;
        }
        if (this.keys.D.isDown) {
            directionX += 1;
        }

        const direction = new PhaserMath.Vector2(directionX, directionY);

        return direction.normalize();
    }
}