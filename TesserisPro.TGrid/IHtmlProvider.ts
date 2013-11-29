/// <reference path="Options.ts" />
/// <reference path="ItemViewModel.ts" />
/// <reference path="IFooterViewModel.ts"/>

module TesserisPro.TGrid {
    export interface IHtmlProvider {
        getElemntsSize(container: HTMLElement, items: Array<any>): number;
        getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel;
        getFooterViewModel();
        getFilterPopupViewModel(container: HTMLElement);
        getTableElement(option: Options): HTMLElement;
        updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean, columnsResized: (c: ColumnInfo) => void);
        updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void;
        updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel): void;
        updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void;
        updateMobileHeadElement(option: Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean): void;
        updateTableDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void;
        updateMobileDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void;
        updateFilteringPopUp(option: Options, filterPopupContainer: HTMLElement, filterPopupModel: IFilterPopupViewModel): void;
        updateColumnWidth(option: Options, header: HTMLElement, body: HTMLElement, footer: HTMLElement): void;
    }
}
