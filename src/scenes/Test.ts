import { SceneProvider } from '../scene/SceneProvider';
import { autoInjectable, injectable } from 'tsyringe';

@injectable()
export class Test {
    constructor(private sceneProvider: SceneProvider) {}
}
