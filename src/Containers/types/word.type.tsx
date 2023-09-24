export interface Words {
    word:       string;
    count:      number;
    moments:    Moment[];
    position:   number;
    texts:      string[];
    percentage: number;
    total?:    number;
}

export interface Moment {
    begin: string;
    end:   string;
}
