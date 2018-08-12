export class Statistics {
    private _moneyEarned: number = 0;
    public nextLevel: string = 'level1';

    get moneyEarned(): number {
        return this._moneyEarned;
    }

    public addMoney(amount: number): number {
        this._moneyEarned += amount;
        return this.moneyEarned;
    }

    public resetMoney(): void {
        this._moneyEarned = 0;
    }
}

export const Stats = new Statistics();
