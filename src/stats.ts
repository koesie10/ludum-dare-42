export class Statistics {
    private _score: number;

    get score(): number {
        return this._score;
    }

    addScore(score: number): number {
        this._score += score;
        return this._score;
    }
}

export const Stats = new Statistics();