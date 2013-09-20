/// <reference path="Options.ts" />

module TesserisPro.TGrid {

    export class Grid {
        public table: HTMLElement 

        constructor(element: HTMLElement, option: Options) {
            

            var table = this.getTableElement(option);
            // header
            var header = this.getTableHeadElement(option);
            table.appendChild(header);

            //cells
            var body = this.getTableBodyElement(option);
            table.appendChild(body);

            element.appendChild(table);
            
            var script = element.getElementsByTagName("script").item(0)
            element.removeChild(script);
            element.removeAttribute("data-bind");
                
            this.table = table;
        }

        private getHtmlProvider(options: Options) {

        }

        private getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.border = "1";
            table.className = "tp-tgrid";
            return table;
        }

        private getTableHeadElement(option: Options): HTMLElement {
            var header = document.createElement("thead");
            header.className = "tp-tgrid";
            var headRow = document.createElement("tr");
            headRow.className = "tp-tgrid";

            for (var i = 0; i < option.columnHeaders.length; i++) {
                var headerCell = document.createElement("th");
                headerCell.setAttribute("width", option.columnWidth[i]);
                headerCell.className = "tp-tgrid";
                option.columnHeaders[i].apply(headerCell);
                headRow.appendChild(headerCell);
            }
            header.appendChild(headRow);

            return header;
        }

        private getTableBodyElement(option: Options): HTMLElement {
            var body = document.createElement("tbody");
            body.setAttribute("data-bind", "foreach:" + option.mainBinding.split(':')[1]);
            var row = document.createElement("tr");
            for (var i = 0; i < option.columnDataField.length; i++) {
                var cell = document.createElement("td");
                cell.setAttribute("width", option.columnWidth[i]);
                option.columnDataField[i].apply(cell);
                row.appendChild(cell);
            }
            body.appendChild(row);

            return body;
        }
    }
}