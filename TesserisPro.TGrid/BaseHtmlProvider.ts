/// <reference path="IHtmlProvider.ts" />

module TesserisPro.TGrid {

    export class BaseHtmlProvider implements IHtmlProvider {

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public getTableHeadElement(option: Options): HTMLElement {
            return null;
        }

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<any>): void {

        }

        public getTableFooterElement(option: Options): HTMLElement {
            var footer = document.createElement("tfoot");
            var footrow = document.createElement("tr");
            var footcell = document.createElement("td");
            footcell.setAttribute("align", "center");
            footcell.setAttribute("colspan", option.columnHeaders.length.toString());
            var data = document.createElement("div");

            // add paging hire 
            data.innerHTML = "<div class=\"pagination\"  data-bind=\"template:{ name: 'tpl-pager', data: Pager }\" >" +

            footcell.appendChild(data)
                footrow.appendChild(footcell);
            footer.appendChild(footrow);

            return footer;
        }
    }

}