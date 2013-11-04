module TesserisPro.TGrid {
    export class GroupHeaderDescriptor {
        value: string;
        level: number;
        collapse: boolean;
        filterDescriptor: FilterDescriptor;
        constructor(value: string, level: number, collapse: boolean, filterDescriptor: FilterDescriptor) {
            this.collapse = collapse;
            this.value = value;
            this.level = level;
            this.filterDescriptor = filterDescriptor;
        }
    }
}