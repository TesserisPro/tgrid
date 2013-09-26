/// <reference path="Options.ts" />

module TesserisPro.TGrid {

    export class Grid {
        public table: any; 

        constructor(element: JQuery, option: Options) {
            
            // Create Table Knockout
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
                    option.columnHeaders[i].applyKnockout(headerCell);
                    //headerCell = headerCell.("<div class=\"arrow-up\"></div><div class=\"arrow-down\"></div>");
                    head.appendChild(headerCell);
                }
                header.appendChild(head);
                table.appendChild(header);
                //cells
                var body = document.createElement("tbody");
                body.setAttribute("data-bind", "foreach:sortedData");//option.mainBinding.split(':')[1]);
                var row = document.createElement("tr");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].applyKnockout(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);
                table.appendChild(body);
                element.append(table)
                //element.find("script").remove();
                this.table = table;
            }

            // Create Table Angular
            if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                var controllerName: string = "Ctrl";
                var appName: string = "App";

                var table = document.createElement("table");
                table.setAttribute("ng-controller", controllerName);
                table.setAttribute("border", "2");
                // header
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                //var headerCell = document.createElement("th");
                //headerCell.setAttribute("ng-repeat", "item in header");
                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columnWidth[i]);
                    option.columnHeaders[i].applyAngular(headerCell,"");
                    head.appendChild(headerCell);
                }
                head.appendChild(headerCell);
 
                header.appendChild(head);
                table.appendChild(header);
                //cells
                var body = document.createElement("tbody");
                var row = document.createElement("tr");
                row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].applyAngular(cell, "item.");
                    row.appendChild(cell);
                }
                body.appendChild(row);
                table.appendChild(body);
                var div = document.createElement("div");
                div.setAttribute("ng-app", appName);
                //div.setAttribute("compile", "html");
                div.appendChild(table);
                element.append(div);
                //element.find("script").remove();
                this.table = table;
            }
        }
    }
}