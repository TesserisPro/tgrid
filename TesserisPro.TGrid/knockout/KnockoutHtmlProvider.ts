/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />

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
                option.columnHeaders[i].applyKnockout(headerCell);

                // Get column 
                var columnName = option.columnDataField[i].GetBinding();
                if (columnName != null && columnName != "") {
                    columnName = columnName.split(':')[1].trim();
                }

                // Method changing sorting
                headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.srcElement).sortBy(columnName);
                
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

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<any>): void {
            body.setAttribute("data-bind", "foreach: pagedData");
            var row = document.createElement("tr");
            for (var i = 0; i < option.columnDataField.length; i++) {
                var cell = document.createElement("td");
                cell.setAttribute("width", option.columnWidth[i]);
                option.columnDataField[i].applyKnockout(cell);
                row.appendChild(cell);
            }
            body.appendChild(row);
        }
    }
    
}