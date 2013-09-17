/// <reference path="Options.ts" />

module TesserisPro.TGrid {

    export class Grid {
        public table: any; 
        constructor(element: JQuery, option: Options) {
            //element.removeAttr("data-bind");
            var table = document.createElement("table");
            table.setAttribute("border", 1);
            // header
            var header = document.createElement("thead");
            var head = document.createElement("tr");
            for (var i = 0; i < option.columnHeaders.length; i++) {
                var cell = document.createElement("th");
                cell.setAttribute("width", option.columnWidth[i]);
                cell.innerText = option.columnHeaders[i];
                head.appendChild(cell);
            }
            header.appendChild(head);
            table.appendChild(header);
            //cells
            var body = document.createElement("tbody");
            body.setAttribute("data-bind", "foreach:" + option.mainBinding.split(':')[1]);
            var row = document.createElement("tr");
            for (var i = 0; i < option.columnDataField.length; i++) {
                var cell = document.createElement("td");
                cell.setAttribute("width", option.columnWidth[i]);
                cell.setAttribute("data-bind", option.columnDataField[i]);
                cell.innerText = option.columnDataField[i];
                row.appendChild(cell);
            }
            body.appendChild(row);
            table.appendChild(body);
            element.append(table)
            //element.find("script").remove();
            this.table = table;
        }
    }
}