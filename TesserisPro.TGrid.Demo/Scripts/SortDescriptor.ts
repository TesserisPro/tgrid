module TesserisPro.TGrid {
    export class SortDescriptor {
        constructor(column: string, asc: boolean) {
            this.column = column;
            this.asc = asc;
        }
        public column: string;
        public asc: boolean;
    }
}