module TesserisPro.TGrid {
    export interface IGroupableItemProvider {
        group(columns: Array<string>): void;
    }
}