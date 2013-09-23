/// <reference path="Options.ts" />

module TesserisPro.TGrid {

    export class Grid {
        public table: any; 

        constructor(element: JQuery, option: Options) {
            //element.removeAttr("data-bind");
            if (option.framework == TesserisPro.TGrid.Framework.Knockout)
            {
                var table = document.createElement("table");
                table.setAttribute("border", "1");
                // header
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columnWidth[i]);
                    option.columnHeaders[i].apply(headerCell);
                    head.appendChild(headerCell);
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
                    option.columnDataField[i].apply(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);
                table.appendChild(body);
                element.append(table)
            //element.find("script").remove();
            this.table = table;
            }
            if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                var table = document.createElement("table");
                table.setAttribute("border", "1");
                // header
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columnWidth[i]);
                    option.columnHeaders[i].apply(headerCell);
                    head.appendChild(headerCell);
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
                    option.columnDataField[i].apply(cell);
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
}