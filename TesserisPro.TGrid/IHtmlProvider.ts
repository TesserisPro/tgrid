/// <reference path="Options.ts" />
/// <reference path="ItemViewModel.ts" />

module TesserisPro.TGrid {
    export interface IHtmlProvider {
        getElemntsSize(container: HTMLElement, items: Array<any>): number;
        getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel;
        getTableElement(option: Options): HTMLElement;
        updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, isSortable: boolean);
        updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void;
        updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number): void;
        updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void;
        updateMobileHeadElement(option: Options, header: HTMLElement, isSortable: boolean);
        updateTableDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void;
        updateMobileDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void;
    }
}
