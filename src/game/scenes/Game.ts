import { GameObjects, Scene, Math as PhaserMath, Input } from 'phaser';
import { KeyboardMovementInput, MovementKeys } from '../input/KeyboardMovementInput';
import { PlayerMovement } from '../movement/PlayerMovement';
import { MouseAimInput } from '../input/MouseAimInput';
import { AbilityExecutor } from '../combat/AbilityExecutor';
import { MeleeAbility } from '../combat/AbilityBehavior';

export class Game extends Scene {
    private player!: GameObjects.Rectangle;
    private enemy!: GameObjects.Rectangle;
    private aimGraphics!: GameObjects.Graphics;
    private keyboardInput!: KeyboardMovementInput;
    private playerMovement!: PlayerMovement;
    private mouseAimInput!: MouseAimInput;
    private abilityExecutor!: AbilityExecutor;
    private meleeAbility!: MeleeAbility;
    private movementSpeed: number = 500;
    private lastAbilityActivatedTime: number = Number.NEGATIVE_INFINITY;
    private slashVisualExpiresAt: number | null = null;

    constructor() {
        super('Game');
    }

    preload() {
    }

    create() {
        const playerWidth = 32;
        const playerHeight = 48;
        const enemyWidth = 32;
        const enemyHeight = 48;

        this.keyboardInput = new KeyboardMovementInput(this.input.keyboard!.addKeys('W,A,S,D') as MovementKeys);
        this.playerMovement = new PlayerMovement(this.scale.width, this.scale.height);
        this.mouseAimInput = new MouseAimInput(this.input.activePointer);
        this.input.on('pointerdown', (pointer: Input.Pointer): void => {
            if (pointer.leftButtonDown()) {
                this.basicAbilityActivate();
            }
        });

        this.abilityExecutor = new AbilityExecutor();
        this.meleeAbility = new MeleeAbility({
            id: 'basic-slash',
            name: 'Slash',
            kind: 'melee',
            damage: 10,
            cooldownMs: 1000,
            rangePx: 100,
            arcDegrees: 90
        });

        const backgroundGraphics = this.add.graphics();
        backgroundGraphics.fillStyle(0x354252);
        backgroundGraphics.fillRect(
            0,
            0,
            this.scale.width,
            this.scale.height
        );

        this.player = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            playerWidth,
            playerHeight,
            0x00ff00
        );

        this.enemy = this.add.rectangle(
            this.scale.width / 2 + 100,
            this.scale.height / 2,
            enemyWidth,
            enemyHeight,
            0xff0000
        );

        this.aimGraphics = this.add.graphics();

    }

    update(_time: number, delta: number) {
        const direction = this.keyboardInput.getDirection();

        this.playerMovement.move(
            this.player,
            direction,
            this.movementSpeed,
            delta / 1000
        );

        if (
            this.slashVisualExpiresAt !== null &&
            this.time.now >= this.slashVisualExpiresAt
        ) {
            this.aimGraphics.clear();
            this.slashVisualExpiresAt = null;
        }
    }

    private basicAbilityActivate(): void {
        const playerPosition = new PhaserMath.Vector2(
            this.player.x,
            this.player.y
        );

        const targetPosition = new PhaserMath.Vector2(
            this.enemy.x,
            this.enemy.y
        );

        const targetBounds: Phaser.Geom.Rectangle = this.enemy.getBounds();
        console.log("targetBounds ---> ", targetBounds);
        

        const aimDirection =
            this.mouseAimInput.getAimDirection(playerPosition);

        // There is no aiming direction when both positions coincide.
        if (aimDirection.lengthSq() === 0) {
            return;
        }

        const currentTime: number = this.time.now;

        const activatedSuccessfully = this.abilityExecutor.activate(
            this.meleeAbility,
            playerPosition,
            aimDirection,
            this.aimGraphics,
            this.lastAbilityActivatedTime,
            currentTime
        );

        if (activatedSuccessfully) {
            this.lastAbilityActivatedTime = currentTime;
            this.slashVisualExpiresAt = currentTime + 200;
            if (
                this.abilityExecutor.hitboxCalculation(
                    this.meleeAbility,
                    playerPosition,
                    aimDirection,
                    targetBounds
                )
            ) {
                console.log("Hit");
            } else {
                console.log("Miss");
            }
        }
    }
}
