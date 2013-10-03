module TesserisPro.TGrid {

    export interface ISortableItemProvider {
        sort(columnName: string): void;
    }
}