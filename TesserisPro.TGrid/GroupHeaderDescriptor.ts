module TesserisPro.TGrid {
    export class GroupHeaderDescriptor {
        value: string;
        level: number;
        collapse: boolean;
        constructor(value: string, level: number, collapse: boolean = false) {
            this.collapse = collapse;
            this.value = value;
            this.level = level;
        }
    }
}