module TesserisPro.TGrid {

    export interface IItemProvider {
        getItems(firstItem: number, itemsNumber: number, callback: (items: Array<any>, firstItem: number, itemsNumber: number) => void): void;
    }
}