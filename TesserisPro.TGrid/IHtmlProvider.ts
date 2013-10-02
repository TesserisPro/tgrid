/// <reference path="Options.ts" />

module TesserisPro.TGrid {
    export interface IHtmlProvider {
        getTableElement(option: Options): HTMLElement;
        getTableHeadElement(option: Options): HTMLElement;
        getTableBodyElement(option: Options): HTMLElement;
        getTableFooterElement(option: Options): HTMLElement;
    }
}
