/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />

module TesserisPro.TGrid {

    export class KnockoutHtmlProvider extends BaseHtmlProvider {

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public getTableHeadElement(option: Options, isSortable: boolean): HTMLElement {
            var header = document.createElement("thead");
            var head = document.createElement("tr");

            for (var i = 0; i < option.columns.length; i++) {
                var headerCell = document.createElement("th");
                headerCell.setAttribute("width", option.columns[i].width);
                option.columns[i].header.applyTemplate(headerCell);

                // Method changing sorting
                (function (i) {
                    headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(option.columns[i].sortMemberPath);
                })(i);

                // Arrows
                if (isSortable) {
                    if (option.sortDescriptor.column == option.columns[i].sortMemberPath && option.sortDescriptor.asc) {
                        var up = document.createElement("div");
                        up.classList.add("arrow-up");
                        headerCell.appendChild(up);
                    }
                    if (option.sortDescriptor.column == option.columns[i].sortMemberPath && !option.sortDescriptor.asc) {
                        var down = document.createElement("div");
                        down.classList.add("arrow-down");
                        headerCell.appendChild(down);
                    }
                }
                head.appendChild(headerCell);
                
            }

            header.appendChild(head);

            return header;
        }

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>): void {
            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                var row = document.createElement("tr");
                for (var i = 0; i < option.columns.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columns[i].width);
                    option.columns[i].cell.applyTemplate(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);
                ko.applyBindings(items[itemIndex], row);
            }
        }
    }
}