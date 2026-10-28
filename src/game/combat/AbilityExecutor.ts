import { MeleeAbility } from "./AbilityBehavior";

export class AbilityExecutor {

    constructor(
    ) { }

    canActivate(
        ability: MeleeAbility,
        lastActivatedTime: number,
        currentTime: number
    ): boolean {
        return (currentTime - lastActivatedTime) >= ability.cooldownMs;
    }

    activate(
        ability: MeleeAbility,
        playerPosition: Phaser.Math.Vector2,
        aimDirection: Phaser.Math.Vector2,
        abilityGraphic: Phaser.GameObjects.Graphics,
        lastActivatedTime: number,
        currentTime: number
    ): boolean {

        // Implement the logic to activate the ability based on its type
        if (this.canActivate(ability, lastActivatedTime, currentTime)) {
            ability.execute(playerPosition, aimDirection, abilityGraphic);
            return true;
        }
        return false
    }

    hitboxCalculation(
        ability: MeleeAbility,
        playerPosition: Phaser.Math.Vector2,
        aimDirection: Phaser.Math.Vector2,
        targetBounds: Phaser.Geom.Rectangle
    ): boolean {
        return ability.intersectsRectangle(playerPosition, aimDirection, targetBounds);
    }
}