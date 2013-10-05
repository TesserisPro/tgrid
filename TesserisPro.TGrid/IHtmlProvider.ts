/// <reference path="Options.ts" />
/// <reference path="ItemViewModel.ts" />

module TesserisPro.TGrid {
    export interface IHtmlProvider {
        getTableElement(option: Options): HTMLElement;
        getTableHeadElement(option: Options, isSortable: boolean): HTMLElement;
        updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>): void;
        getTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number): void;
    }
}
