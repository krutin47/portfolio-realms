import { AbilityDefinition, AbilityId, AbilityKind } from "./AbilityDefinition";
import { Math as PhaserMath, Geom as PhaserGeom } from 'phaser';
import type { GameObjects } from 'phaser';

export interface AbilityBehavior extends AbilityDefinition {
    execute(playerPosition: PhaserMath.Vector2, aimDirection: PhaserMath.Vector2, abilityGraphic: GameObjects.Graphics): void;
}

export class MeleeAbility implements AbilityBehavior {
    id: AbilityId;
    name: string;
    kind: AbilityKind;
    damage: number;
    cooldownMs: number;
    rangePx: number;
    arcDegrees: number;

    constructor(abilityDef: AbilityDefinition) {
        this.id = abilityDef.id;
        this.name = abilityDef.name;
        this.kind = abilityDef.kind;
        this.damage = abilityDef.damage;
        this.cooldownMs = abilityDef.cooldownMs;
        this.rangePx = abilityDef.rangePx;
        this.arcDegrees = abilityDef.arcDegrees;
    }

    execute(playerPosition: PhaserMath.Vector2, aimDirection: PhaserMath.Vector2, abilityGraphic: GameObjects.Graphics): void {

        const aimAngle: number = Math.atan2(
            aimDirection.y,
            aimDirection.x
        );

        const arcRadians: number = this.arcDegrees * Math.PI / 180;
        const startAngle: number = aimAngle - arcRadians / 2;
        const endAngle: number = aimAngle + arcRadians / 2;

        abilityGraphic.clear();
        abilityGraphic.lineStyle(3, 0xf09d09, 1);

        abilityGraphic.beginPath();
        abilityGraphic.arc(
            playerPosition.x,
            playerPosition.y,
            this.rangePx,
            startAngle,
            endAngle,
            false
        );
        abilityGraphic.strokePath();
    }

    isObjectInsideHitbox(
        playerPosition: PhaserMath.Vector2,
        aimDirection: PhaserMath.Vector2,
        targetPosition: PhaserMath.Vector2
    ): boolean {
        const offset = targetPosition.clone().subtract(playerPosition);

        const distanceSquared: number = offset.lengthSq();
        const rangeSquared: number = this.rangePx * this.rangePx;

        // Targets exactly at maximum range are included.
        if (distanceSquared > rangeSquared) {
            return false;
        }

        // Our chosen rule: the attack origin is inside the hitbox.
        if (distanceSquared === 0) {
            return true;
        }

        const aimAngle: number = Math.atan2(
            aimDirection.y,
            aimDirection.x
        );

        const targetAngle: number = Math.atan2(
            offset.y,
            offset.x
        );

        const angleDifference: number = targetAngle - aimAngle;

        const shortestAngleDifference: number = Math.atan2(
            Math.sin(angleDifference),
            Math.cos(angleDifference)
        );

        const arcRadians: number = this.arcDegrees * Math.PI / 180;

        return Math.abs(shortestAngleDifference) <= arcRadians / 2;
    }

    intersectsRectangle(
        playerPosition: PhaserMath.Vector2,
        aimDirection: PhaserMath.Vector2,
        targetBounds: PhaserGeom.Rectangle
    ): boolean {
        const topLeft: PhaserMath.Vector2 = new PhaserMath.Vector2(targetBounds.left, targetBounds.top);
        const topRight: PhaserMath.Vector2 = new PhaserMath.Vector2(targetBounds.right, targetBounds.top);
        const bottomLeft: PhaserMath.Vector2 = new PhaserMath.Vector2(targetBounds.left, targetBounds.bottom);
        const bottomRight: PhaserMath.Vector2 = new PhaserMath.Vector2(targetBounds.right, targetBounds.bottom);

        const cornerArray: Array<PhaserMath.Vector2> = [topLeft, topRight, bottomLeft, bottomRight]

        const isObjectInside: boolean = cornerArray.some((corner: PhaserMath.Vector2) => {
            return this.isObjectInsideHitbox(playerPosition, aimDirection, corner)
        })

        if (isObjectInside) {
            return true;
        }

        if (PhaserGeom.Rectangle.Contains(targetBounds, playerPosition.x, playerPosition.y)) {
            return true;
        }

        const aimAngle: number = Math.atan2(
            aimDirection.y,
            aimDirection.x
        );

        const arcRadians: number = this.arcDegrees * Math.PI / 180;
        const startAngle: number = aimAngle - arcRadians / 2;
        const endAngle: number = aimAngle + arcRadians / 2;

        const startLine = new PhaserGeom.Line(
            playerPosition.x,
            playerPosition.y,
            playerPosition.x + (this.rangePx * Math.cos(startAngle)),
            playerPosition.y + (this.rangePx * Math.sin(startAngle))
        );
        const endLine = new PhaserGeom.Line(
            playerPosition.x,
            playerPosition.y,
            playerPosition.x + (this.rangePx * Math.cos(endAngle)),
            playerPosition.y + (this.rangePx * Math.sin(endAngle))
        )

        if (PhaserGeom.Intersects.GetLineToRectangle(
            startLine,
            targetBounds
        ).length > 0 || PhaserGeom.Intersects.GetLineToRectangle(
            endLine,
            targetBounds
        ).length > 0) {
            return true;
        }
        
        const circle : PhaserGeom.Circle = new PhaserGeom.Circle(playerPosition.x, playerPosition.y, this.rangePx)
        
        const arcIntersectingPoint: Array<PhaserMath.Vector2> = PhaserGeom.Intersects.GetCircleToRectangle(
            circle,
            targetBounds
        );

        const isObjectInsideArc = arcIntersectingPoint.some((corner: PhaserMath.Vector2) => {
            return this.isObjectInsideHitbox(playerPosition, aimDirection, corner)
        })

        if(isObjectInsideArc) {
            return true;
        }

        return false;
    }
}