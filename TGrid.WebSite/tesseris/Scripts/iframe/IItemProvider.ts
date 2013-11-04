module TesserisPro.TGrid {

    export interface IItemProvider {

        isSortable(): boolean;

        isFilterable(): boolean;

        getItems(
            skip: number,
            take: number,
            sort: Array<SortDescriptor>,
            filter: Array<FilterDescriptor>,
            collapsedGroupFilters: Array<FilterDescriptor>,
            callback: (items: Array<any>, firstItem: number, itemsNumber: number) => void): void;
        
        getTotalItemsCount(filter: Array<FilterDescriptor>, callback: (total: number) => void): void;
    }
}