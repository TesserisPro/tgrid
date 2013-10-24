module TesserisPro.TGrid {
    export class SortDescriptor {
        constructor(path: string, asc: boolean) {
            this.path = path;
            this.asc = asc;
        }
        public path: string;
        public asc: boolean;
    }
}