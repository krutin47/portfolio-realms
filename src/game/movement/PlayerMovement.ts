import { Math as PhaserMath, GameObjects } from 'phaser';

export class PlayerMovement {
    constructor(
        private readonly arenaWidth: number,
        private readonly arenaHeight: number
    ) { }

    move(
        player: GameObjects.Rectangle,
        direction: PhaserMath.Vector2,
        speed: number,
        deltaSeconds: number
    ): void {

        const displacement = direction.clone().scale(speed * deltaSeconds);

        player.x = PhaserMath.Clamp(
            player.x + displacement.x,
            player.width / 2,
            this.arenaWidth - player.width / 2
        );

        player.y = PhaserMath.Clamp(
            player.y + displacement.y,
            player.height / 2,
            this.arenaHeight - player.height / 2
        );
    }
}