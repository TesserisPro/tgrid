/// <reference path="Options.ts" />
/// <reference path="ItemViewModel.ts" />

module TesserisPro.TGrid {
    export interface IHtmlProvider {
        getTableElement(option: Options): HTMLElement;
        updateTableHeadElement(option: Options, header: HTMLElement, isSortable: boolean);
        updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>): void;
        updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number): void;
        updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>): void;
    }
}
