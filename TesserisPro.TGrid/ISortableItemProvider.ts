module TesserisPro.TGrid {

    export interface ISortableItemProvider {
        sort(sortDescriptor: SortDescriptor): void;
    }
}