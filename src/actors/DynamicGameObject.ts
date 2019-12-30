import { BaseGameObject } from './BaseGameObject';
import { IPlayerStateMachine } from './state/player/IPlayerStateMachine';
import { Direction } from '../shared/direction';
import { DynamicObjectAnimation } from './anim/DynamicObjectAnimation';

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
    private _damageReceived: number | null;
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

    get damageReceived(): number | null {
        return this._damageReceived;
    }

    set damageReceived(value: number | null) {
        this._damageReceived = value;
    }

    hurt(value: number) {
        this.hp = this.hp - value;
    }

    heal(value: number) {
        this.damageReceived = value;
        this.hp = this.hp + value;
    }

    get hp(): number {
        return this._hp;
    }

    set hp(value: number) {
        // Don't allow hp below 0 or above max hp.
        const correctedHp = Math.max(0, value);
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
        obj.hurt(this.baseStats.strength);
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

    protected getDirection = () => {
        const angle = Math.acos(this.sprite.body.velocity.clone().normalize().x);
        if (angle >= Math.PI / 4 && angle <= (Math.PI * 3) / 4) {
            if (this.sprite.body.velocity.y > 0) {
                return Direction.DOWN;
            } else {
                return Direction.UP;
            }
        } else if (angle > (Math.PI * 3) / 4 || angle < Math.PI / 4) {
            if (this.sprite.body.velocity.x > 0) {
                return Direction.RIGHT;
            } else {
                return Direction.LEFT;
            }
        }
    };
}
