import { injectable } from 'tsyringe';
import * as random from 'random';
import * as seedrandom from 'seedrandom';

@injectable()
export class RNGService {
    initialize(str: string) {
        random.use(seedrandom(str));
    }

    randomNumber(from: number, to: number) {
        return random.uniform(from, to);
    }
}
