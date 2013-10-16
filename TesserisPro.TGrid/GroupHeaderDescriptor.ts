module TesserisPro.TGrid {
    export class GroupHeaderDescriptor {
        value: string;
        level: number;
        constructor(value: string, level: number) {
            this.value = value;
            this.level = level;
        }
    }
}