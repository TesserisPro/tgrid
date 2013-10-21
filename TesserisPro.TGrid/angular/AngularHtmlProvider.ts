/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>

module TesserisPro.TGrid {

    export class AngularHtmlProvider extends BaseHtmlProvider {

        // Table Methods

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, isSortable: boolean) {
            if (header.innerHTML != null && header.innerHTML != "") {
                // update table header
                if (isSortable) {
                    this.removeArrows(header);
                    var element = header.getElementsByTagName("th");

                    for (var i = option.groupBySortDescriptor.length; i < element.length && i - option.groupBySortDescriptor.length < option.columns.length; i++) {
                        element[i] = <HTMLTableHeaderCellElement>this.addArrows(element[i], option, i - option.groupBySortDescriptor.length);
                    }
                }
            } else {
                // Create table header
                var head = document.createElement("tr");

                this.appendIndent(head, option.groupBySortDescriptor.length, true);

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
                        headerCell = <HTMLTableHeaderCellElement>this.addArrows(headerCell, option, i);
                    }
                    head.appendChild(headerCell);
                }
                var placeholderColumn = document.createElement("th");
                placeholderColumn.setAttribute("class", "tgrid-placeholder");
                head.appendChild(placeholderColumn);

                header.appendChild(head);
            }
        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            if (!option.showDetailFor.isDetailColumn) {
                option.showDetailFor.column = -1;
            }

            for (var i = 0; i < items.length; i++) {
                this.appendTableElement(option, container, items[i], 0, selected);
            }

            //Hide table on mobile devices
            var bodyClass = container.getAttribute("class");
            if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                bodyClass = "desktop";
            }
            else {
                if (bodyClass.indexOf("desktop") == -1) {
                    bodyClass += " desktop";
                }
            }
            container.setAttribute("class", bodyClass);
        }

        private appendTableElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;

            if (item.isGroupHeader) {
                var groupHeader = this.buildGroupHeaderRow(option, item.item);
                container.appendChild(groupHeader);
                //ko.applyBindings(item, groupHeader);
            } else {
                var row = this.buildRowElement(option, item, container, selected);

                container.appendChild(row);
                //ko.applyBindings(item, row);

                if (option.showDetailFor.item == item.item) {
                    itemWithDetails = item;
                    rowWithDetail = row;
                }

                var details = this.buildDetailsRow(option);

                // Insert row details after selected item
                if (itemWithDetails != null) {
                    insertAfter(rowWithDetail, details);
                    //ko.applyBindings(itemWithDetails, details);
                }
            }
        }

        private buildRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("tr");

            if (option.isSelected(item.item)) {
                row.setAttribute("class", "selected");
            }

            this.appendIndent(row, option.groupBySortDescriptor.length, false);

            for (var i = 0; i < option.columns.length; i++) {
                var cell = document.createElement("td");
                cell.setAttribute("width", option.columns[i].width);
                cell.setAttribute("ng-bind", "item." + option.columns[i].sortMemberPath);
                option.columns[i].cell.applyTemplate(cell);
                row.appendChild(cell);
            }

            var placeholderColumn = document.createElement("td");
            placeholderColumn.setAttribute("class", "tgrid-placeholder");
            row.appendChild(placeholderColumn);

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        selected(item, e.ctrlKey);
                    }
                    if (option.selectionMode == SelectionMode.Multi) {
                        if (!e.ctrlKey) {
                            for (var i = 0; i < container.children.length; i++) {
                                container.children.item(i).removeAttribute("class");
                            }
                        }
                        if (option.isSelected(item.item)) {
                            (<HTMLElement>this).setAttribute("class", "selected");
                        }
                        else {
                            (<HTMLElement>this).removeAttribute("class");
                        }
                    }
                    if (option.selectionMode == SelectionMode.Single) {
                        for (var i = 0; i < container.children.length; i++) {
                            container.children.item(i).removeAttribute("class");
                        }
                        if (option.isSelected(item.item)) {
                            (<HTMLElement>this).setAttribute("class", "selected");
                        }
                        else {
                            (<HTMLElement>this).removeAttribute("class");
                        }
                    }
                };
            })(item);

            return row;
        }

        private buildDetailsRow(option: Options): HTMLElement {
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            this.appendIndent(detailTr, option.groupBySortDescriptor.length, false);

            detailTr.setAttribute("class", "details")
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
            detailTd.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
            detailTr.appendChild(detailTd);

            return detailTr;
        }

        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerTr = document.createElement("tr");
            var headerTd = document.createElement("td");

            this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

            var colspan = option.columns.length + 1 + option.groupBySortDescriptor.length - groupHeaderDescriptor.level;
            headerTd.setAttribute("colspan", colspan.toString());
            headerTd.setAttribute("class", "tgrid-table-group-header");
            headerTd.innerHTML = option.groupHeaderTemplate;
            headerTr.appendChild(headerTd);

            return headerTr;
        }

        private addArrows(htmlNode: Node, option: Options, columnNumber: number): Node {
            if (option.sortDescriptor.column == option.columns[columnNumber].sortMemberPath && option.sortDescriptor.asc) {
                var up = document.createElement("div");
                up.classList.add("tgrid-arrow-up");
                htmlNode.appendChild(up);
            }
            if (option.sortDescriptor.column == option.columns[columnNumber].sortMemberPath && !option.sortDescriptor.asc) {
                var down = document.createElement("div");
                down.classList.add("tgrid-arrow-down");
                htmlNode.appendChild(down);
            }
            return htmlNode;
        }

        private removeArrows(htmlNode: HTMLElement): void {
            var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
            if (element.length == 1) {
                element[0].parentNode.removeChild(element[0]);
            }
            var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
            if (element.length == 1) {
                element[0].parentNode.removeChild(element[0]);
            }
        }

        private appendIndent(target: HTMLElement, level: number, isHeader: boolean) {
            var tag = isHeader ? "th" : "td";
            for (var i = 0; i < level; i++) {
                var cell = document.createElement(tag);
                cell.className = "tgrid-table-indent-cell";
                target.appendChild(cell);
            }
        }



//        public getTableElement(option: Options): HTMLElement {
//            var controllerName: string = "Ctrl";
//            var table = document.createElement("table");
//            table.setAttribute("ng-controller", controllerName);
//            table.className = "tgrid-table";
//            return table;
//        }

//        public upadteTableHeadElement(option: Options, header: HTMLElement, isSortable: boolean) {
//            var head = document.createElement("tr");
//            for (var i = 0; i < option.columns.length; i++) {
//                var headerCell = document.createElement("th");
//                headerCell.setAttribute("width", option.columns[i].width);
//                option.columns[i].header.applyTemplate(headerCell);

//                // Get column 
//                /*var columnName = option.columnDataField[i].GetBinding();
//                if (columnName != null && columnName != "") {
//                    columnName = columnName.split(':')[1].trim();
//                }
//               // Method changing sorting
//               headerCell.setAttribute("ng-click",
//                    "sortColumn = \"" + columnName + "\";" +
//                    "sortOrder=!sortOrder;");

//                // Arrows
//                var up = document.createElement("div");
//                up.classList.add("arrow-up");
//                up.setAttribute("ng-show", "!sortOrder&&sortColumn==\"" + columnName + "\"");
//                headerCell.appendChild(up);
//                var down = document.createElement("div");
//                down.classList.add("arrow-down");
//                down.setAttribute("ng-show", "sortOrder&&sortColumn==\"" + columnName + "\"");
//                headerCell.appendChild(down);
//*/
//                head.appendChild(headerCell);
//            }
//            head.appendChild(headerCell);

//            header.appendChild(head);
//        }

//        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel) => boolean): void {
//            var row = document.createElement("tr");
//            //row.setAttribute("ng-repeat", "item in items|orderBy:sortColumn:sortOrder| startFrom:currentPage*pageSize | limitTo:pageSize");
//            //for (var i = 0; i < option.columns.length; i++) {
//            //    var cell = document.createElement("td");
//            //    cell.setAttribute("width", option.columns[i].width);
//            //    option.columns[i].cell.applyTemplate(cell);
//            //    row.appendChild(cell);
//            //}
//            body.appendChild(row);
//        }
    }

}