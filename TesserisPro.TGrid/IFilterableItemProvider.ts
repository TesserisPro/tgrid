module TesserisPro.TGrid {

    export interface IFilterableItemProvider {
        getFiltered(firstItem: number, itemsNumber: number, filterDescriptor: Array<FilterDescriptor>, callback: (items: Array<any>, firstItem: number, itemsNumber: number, totalItemsNumber: number) => void): Array<any>;
        getFilteredTotalItemsCount(filterDescriptor: Array<FilterDescriptor>, callback: (total: number) => void): void;
    }
}