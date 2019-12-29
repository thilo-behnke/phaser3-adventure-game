import { BaseGameObject } from './BaseGameObject';
import { IPlayerStateMachine } from './state/player/IPlayerStateMachine';
import { Direction } from '../shared/direction';
import { DynamicObjectAnimation } from './anim/DynamicObjectAnimation';
import { getAngle } from '../util/map';

export type BaseStats = {
    health: number;
    strength: number;
    agility: number;
    attackRange: number;
};

export abstract class DynamicGameObject extends BaseGameObject {
    protected _stats: BaseStats;

    protected _direction = Direction.DOWN;
    protected _activeAnim: DynamicObjectAnimation;
    protected _hp: number;
    protected _dying = false;

    get direction(): Direction {
        return this._direction;
    }

    set direction(value: Direction) {
        if (value !== this._direction) {
            this._direction = value;
            this.updateAnim();
        }
    }

    get dying(): boolean {
        return this._dying;
    }

    set dying(value: boolean) {
        this._dying = value;
    }

    get hp(): number {
        return this._hp;
    }

    set hp(value: number) {
        // Don't allow hp below 0 or above max hp.
        const correctedHp = Math.max(0, Math.min(value, this.baseStats.health));
        if (correctedHp === 0) {
            this.dying = true;
        }
        this._hp = correctedHp;
    }

    get activeAnim(): DynamicObjectAnimation {
        return this._activeAnim;
    }

    set activeAnim(value: DynamicObjectAnimation) {
        if (value !== this._activeAnim) {
            this._activeAnim = value;
            this.updateAnim();
        }
    }

    get baseStats() {
        return this._stats;
    }

    attack = (obj: DynamicGameObject) => {
        obj.hp -= this.baseStats.strength;
    };

    protected updateAnim = () => {
        if (!this.activeAnim || !this.direction) {
            console.error(
                `Can't play animation for ${this} because animation or direction is not determined.`
            );
            return;
        }
        console.log(this.activeAnim, this.direction);
        this._sprite.anims.play(`${this.type}-${this.activeAnim}--${this.direction}`);
    };
}
