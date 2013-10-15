module TesserisPro.TGrid {

    export interface ISortableItemProvider {
        sort(sortDescriptor: Array<SortDescriptor>): void;
    }
}