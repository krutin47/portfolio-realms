import { Scene } from 'phaser';

export class Game extends Scene {
    private player!: Phaser.GameObjects.Rectangle;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private WASD_keys!: Record<'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;

    constructor() {
        super('Game');
    }

    preload() {
    }

    create() {
        const playerWidth = 32;
        const playerHeight = 48;
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.WASD_keys = {
            w: this.input.keyboard!.addKey('W'),
            a: this.input.keyboard!.addKey('A'),
            s: this.input.keyboard!.addKey('S'),
            d: this.input.keyboard!.addKey('D')
        };


        const backgroundGraphics = this.add.graphics();
        backgroundGraphics.fillStyle(0x354252);
        backgroundGraphics.fillRect(
            0,
            0,
            Number(this.game.config.width ?? 1024),
            Number(this.game.config.height ?? 768)
        );

        this.player = this.add.rectangle(
            Number(this.game.config.width ?? 1024) / 2,
            Number(this.game.config.height ?? 768) / 2,
            playerWidth,
            playerHeight,
            0x00ff00
        );

    }

    update() {
        if (this.cursors.up.isDown || this.WASD_keys.w.isDown) {
            this.player.y -= 5;
        }
        if (this.cursors.down.isDown || this.WASD_keys.s.isDown) {
            this.player.y += 5;
        }
        if (this.cursors.left.isDown || this.WASD_keys.a.isDown) {
            this.player.x -= 5;
        }
        if (this.cursors.right.isDown || this.WASD_keys.d.isDown) {
            this.player.x += 5;
        }
    }
}
