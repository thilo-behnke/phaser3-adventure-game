import { BaseGameObject } from './BaseGameObject';
import { IPlayerStateMachine } from './state/player/IPlayerStateMachine';
import { Direction } from '../global/direction';
import { DynamicObjectAnimation } from './anim/DynamicObjectAnimation';

export abstract class DynamicGameObject extends BaseGameObject {
    protected _direction = Direction.DOWN;
    protected _activeAnim: DynamicObjectAnimation;

    get direction(): Direction {
        return this._direction;
    }

    set direction(value: Direction) {
        if (value !== this._direction) {
            this._direction = value;
            this.updateAnim();
        }
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
