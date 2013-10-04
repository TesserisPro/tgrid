module TesserisPro.TGrid {

    export interface ISortableItemProvider {
        sort(columnNumber: number): void;
    }
}