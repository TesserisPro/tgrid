/// <reference path="Options.ts" />

module TesserisPro.TGrid {

    export class Grid {
        public table: any; 

        constructor(element: JQuery, option: Options) {
        
        // Create Table Knockout
            if (option.framework == TesserisPro.TGrid.Framework.Knockout)
            {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                
                // Knockout desktop header
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                head.className = "tgrid-header"

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
                    headerCell.setAttribute("data-bind", "click: function(){" +
                        "if(sort().column == \"" + columnName + "\"){sort({ column : \"" + columnName + "\", order: -1 * sort().order});}" +
                        "else {sort({ column : \"" + columnName + "\", order: 1}); }" +
                        "}");

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
                table.appendChild(header);
                
                // Knockout desktop cells
                var body = document.createElement("tbody");
                body.setAttribute("data-bind", "foreach:pagedData");
                var row = document.createElement("tr");
                for (var i = 0; i < option.columnDataField.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columnWidth[i]);
                    option.columnDataField[i].applyKnockout(cell);
                    row.appendChild(cell);
                }
                body.appendChild(row);
                table.appendChild(body);
                
                // Knockout desktop footer
                var footer = document.createElement("tfoot");
                var footrow = document.createElement("tr");
                var footcell = document.createElement("td");
                footcell.setAttribute("align", "center");
                footcell.setAttribute("colspan", option.columnHeaders.length.toString());
                var data = document.createElement("div");

                // add paging hire 
                data.innerHTML = 
                "<div class=\"pagination\"  data-bind=\"template:{ name: 'tpl-pager', data: Pager }\" >"+
                
                footcell.appendChild(data) 
                footrow.appendChild(footcell);
                footer.appendChild(footrow);
                table.appendChild(footer);
                element.append(table)
                this.table = table;
            }

        // Create Table Angular
            if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                var controllerName: string = "Ctrl";
                var appName: string = "App";

                var table = document.createElement("table");
                table.setAttribute("ng-controller", controllerName);
                //table.setAttribute("border", "2");
                table.className = "tgrid-table";
                
                // Angular desktop header
                var header = document.createElement("thead");
                var head = document.createElement("tr");
                for (var i = 0; i < option.columnHeaders.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columnWidth[i]);
                    option.columnHeaders[i].applyAngular(headerCell, "");

                    // Get column 
                    var columnName = option.columnDataField[i].GetBinding();
                    if (columnName != null && columnName != "") {
                        columnName = columnName.split(':')[1].trim();
                    }

                    // Method changing sorting
                    headerCell.setAttribute("ng-click",
                        "sortColumn = \"" + columnName + "\";" +
                        "sortOrder=!sortOrder;");

                    // Arrows
                    var up = document.createElement("div");
                    up.classList.add("arrow-up");
                    up.setAttribute("ng-show", "!sortOrder&&sortColumn==\"" + columnName+"\"");
                    headerCell.appendChild(up);
                    var down = document.createElement("div");
                    down.classList.add("arrow-down");
                    down.setAttribute("ng-show", "sortOrder&&sortColumn==\"" + columnName + "\"");
                    headerCell.appendChild(down);

                    head.appendChild(headerCell);
                }
                head.appendChild(headerCell);
 
                header.appendChild(head);
                table.appendChild(header);
               
                // Angular desktop cells
                var body = document.createElement("tbody");
                var row = document.createElement("tr");
                row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder| startFrom:currentPage*pageSize | limitTo:pageSize");
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
                div.appendChild(table);
                element.append(div);
                this.table = table;

                // Angular desktop footer
                var footer = document.createElement("tfoot");
                var footrow = document.createElement("tr");
                var footcell = document.createElement("td");
                footcell.setAttribute("align", "center");
                footcell.setAttribute("colspan", option.columnHeaders.length.toString());
                var data = document.createElement("div");

                // add paging hire
                data.innerHTML = //option.pageSize.toString() + " items on page";
                "<div>\
                    {{firstItemIndex()}} - {{lastItemIndex()}} of {{totalItemCount}} total results.\
                 </div>\
                 <ul>\
                    <li><a href ng-class=\"{disabledPage:currentPage == 0}\" ng-click=\"currentPage = 0\">&laquo;&laquo;</a ></li>\
                    <li><a href ng-class=\"{disabledPage:currentPage == 0}\" ng-click=\"previousPage()\">&laquo;</a ></li>\
                    <li class=\"active\">{{currentPage+1}}</li>\
                    <li><a href ng-class=\"{disabledPage:currentPage == maxPage()}\" ng-click=\"nextPage()\">&raquo;</a></li>\
                    <li><a href ng-class=\"{disabledPage:currentPage == maxPage()}\" ng-click=\"currentPage = maxPage()\">&raquo;&raquo;</a></li>\
                 </ul>";

                footcell.appendChild(data);
                footrow.appendChild(footcell);
                footer.appendChild(footrow);
                table.appendChild(footer);
                element.append(table)
                this.table = table;
            }
        }
    }
}