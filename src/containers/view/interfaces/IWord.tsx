export interface IWord {
    word: string;
    count: number;
    moments: Moment[];
    position: number;
    percentage: number;
    total?: number;
}

export interface Moment {
    begin: string;
    end: string;
    text: string;
}
