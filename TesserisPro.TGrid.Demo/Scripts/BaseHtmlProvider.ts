/// <reference path="IHtmlProvider.ts" />
/// <reference path="ItemViewModel.ts" />

module TesserisPro.TGrid {

    export class BaseHtmlProvider implements IHtmlProvider {

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public getTableHeadElement(option: Options, isSortable: boolean): HTMLElement {
            return null;
        }

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>): void {

        }

        public getTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number): void {
            var footrow = document.createElement("tr");
            var footcell = document.createElement("td");
            footcell.setAttribute("align", "center");
            footcell.setAttribute("colspan", option.columns.length.toString());

            var firstVisiblePage = option.currentPage - Math.ceil(option.pageSlide / 2);

            if (firstVisiblePage < 0) {
                firstVisiblePage = 0;
            }

            var lastVisiblePage = firstVisiblePage + option.pageSlide;
            var pageCount = totalItemsCount / option.pageSize;

            if (lastVisiblePage >= pageCount) {
                lastVisiblePage = pageCount - 1;
            }

            var pagerElement = document.createElement("div");
            pagerElement.setAttribute("class", "tgird-pagination");

            for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                if (option.currentPage == i) {
                    pagerElement.innerHTML += "<span class='tgird-page-current'>" + (i + 1) + "</span>";
                }
                else {
                    pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage("+ i +")' >" + (i + 1) + "</span>";
                }
            }

            footcell.appendChild(pagerElement);
            footrow.appendChild(footcell);
            footer.appendChild(footrow);
        }
    }

}