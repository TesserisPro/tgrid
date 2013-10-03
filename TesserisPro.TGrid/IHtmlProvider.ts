/// <reference path="Options.ts" />

module TesserisPro.TGrid {
    export interface IHtmlProvider {
        getTableElement(option: Options): HTMLElement;
        getTableHeadElement(option: Options): HTMLElement;
        updateTableBodyElement(option: Options, body: HTMLElement, items: Array<any>): void;
        getTableFooterElement(option: Options): HTMLElement;
    }
}
