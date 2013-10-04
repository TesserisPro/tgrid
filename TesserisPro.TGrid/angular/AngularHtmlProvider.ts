/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />

module TesserisPro.TGrid {

    export class AngularHtmlProvider extends BaseHtmlProvider {

        public getTableElement(option: Options): HTMLElement {
            var controllerName: string = "Ctrl";
            var table = document.createElement("table");
            table.setAttribute("ng-controller", controllerName);
            //table.setAttribute("border", "2");
            table.className = "tgrid-table";
            return table;
        }

        public getTableHeadElement(option: Options): HTMLElement {
            var header = document.createElement("thead");
            var head = document.createElement("tr");
            for (var i = 0; i < option.columnHeaders.length; i++) {
                var headerCell = document.createElement("th");
                headerCell.setAttribute("width", option.columnWidth[i]);
                /*option.columnHeaders[i].applyAngular(headerCell, "");

                // Get column 
                var columnName = option.columnDataField[i].GetBinding();
                if (columnName != null && columnName != "") {
                    columnName = columnName.split(':')[1].trim();
                }
*/
                // Method changing sorting
  /*              headerCell.setAttribute("ng-click",
                    "sortColumn = \"" + columnName + "\";" +
                    "sortOrder=!sortOrder;");

                // Arrows
                var up = document.createElement("div");
                up.classList.add("arrow-up");
                up.setAttribute("ng-show", "!sortOrder&&sortColumn==\"" + columnName + "\"");
                headerCell.appendChild(up);
                var down = document.createElement("div");
                down.classList.add("arrow-down");
                down.setAttribute("ng-show", "sortOrder&&sortColumn==\"" + columnName + "\"");
                headerCell.appendChild(down);
*/
                head.appendChild(headerCell);
            }
            head.appendChild(headerCell);

            header.appendChild(head);
            return header;
        }

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>): void {
            var row = document.createElement("tr");
            /*row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder| startFrom:currentPage*pageSize | limitTo:pageSize");
            for (var i = 0; i < option.columnDataField.length; i++) {
                var cell = document.createElement("td");
                cell.setAttribute("width", option.columnWidth[i]);
                option.columnDataField[i].applyAngular(cell, "item.");
                row.appendChild(cell);
            }*/
            body.appendChild(row);
        }
    }

}