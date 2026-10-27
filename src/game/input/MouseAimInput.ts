import { Input, Math as PhaserMath } from 'phaser';

export class MouseAimInput {
    constructor(
        private readonly activePointer: Input.Pointer
    ) {}

    getAimDirection(
        playerPosition: PhaserMath.Vector2
    ): PhaserMath.Vector2 {
        const mousePosition = new PhaserMath.Vector2(
            this.activePointer.worldX,
            this.activePointer.worldY
        );

        return mousePosition
            .subtract(playerPosition)
            .normalize();
    }
}
