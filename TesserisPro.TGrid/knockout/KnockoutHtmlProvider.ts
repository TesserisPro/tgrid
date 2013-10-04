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

        public getTableHeadElement(option: Options): HTMLElement {
            var header = document.createElement("thead");
            var head = document.createElement("tr");
            head.className = "tgrid-header";

            for (var i = 0; i < option.columnHeaders.length; i++) {
                var headerCell = document.createElement("th");
                headerCell.setAttribute("width", option.columnWidth[i]);
                option.columnHeaders[i].applyTemplate(headerCell);
                
                // Method changing sorting
                headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(columnName);
                
                // Arrows
                var up = document.createElement("div");
                up.classList.add("arrow-up");
                up.setAttribute("data-bind", "visible:sort().order == 1 && sort().column == \"" + columnName + "\"");
                headerCell.appendChild(up);
                var down = document.createElement("div");
                down.classList.add("arrow-down");
                down.setAttribute("data-bind", "visible:sort().order == -1 && sort().column == \"" + columnName + "\"");
                headerCell.appendChild(down);

                head.appendChild(headerCell);

            }

            header.appendChild(head);

            return header;
        }

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>): void {
            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                var row = document.createElement("tr");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].applyTemplate(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);
                ko.applyBindings(items[itemIndex], row);
            }
        }
    }
    
}