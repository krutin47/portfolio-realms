export interface AbilityDefinition {
    id: AbilityId;
    name: string;
    kind: AbilityKind;
    damage: number;
    cooldownMs: number;
    rangePx: number;
    arcDegrees: number;
}

export type AbilityKind =
    | 'melee'
    | 'projectile'
    | 'area';

export type AbilityId =
    | 'basic-slash'
    | 'heavy-strike'
    | 'whirlwind'
    | 'dodge';