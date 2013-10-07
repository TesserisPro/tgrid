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

        public updateTableHeadElement(option: Options, header: HTMLElement, isSortable: boolean) {
            if (header.innerHTML != null && header.innerHTML != "") {
                if (isSortable) {
                    var element = header.getElementsByClassName("tgrid-arrow-up");
                    if (element.length == 1) {
                        element[0].parentNode.removeChild(element[0]);
                    }
                    var element = header.getElementsByClassName("tgrid-arrow-down");
                    if (element.length == 1) {
                        element[0].parentNode.removeChild(element[0]);
                    }
                    element = header.getElementsByTagName("th");
                    for (var i = 0; i < element.length && i < option.columns.length; i++) {
                        element[i] = this.addArrows(element[i], option, i);
                    }
                }
            } else {
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

        public updateTableBodyElement(option: Options, body: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                var row = document.createElement("tr");
                
                if(option.isSelected(items[itemIndex].item)) {
                    row.setAttribute("class", "selected");
                }

                for (var i = 0; i < option.columns.length; i++) {
                    var cell = document.createElement("td");
                    cell.setAttribute("width", option.columns[i].width);
                    option.columns[i].cell.applyTemplate(cell);
                    row.appendChild(cell);
                }

                var placeholderColumn = document.createElement("td");
                placeholderColumn.setAttribute("class", "tgrid-placeholder");
                row.appendChild(placeholderColumn);

                body.appendChild(row);
                ko.applyBindings(items[itemIndex], row);
                (function (item) {
                    row.onclick = function (e) {
                        selected(item, e.ctrlKey);

                        if (!e.ctrlKey) {
                            for (var i = 0; i < body.children.length; i++) {
                                body.children.item(i).removeAttribute("class");
                            }
                        }

                        if (option.isSelected(item.item)) {
                            (<HTMLElement>this).setAttribute("class", "selected");
                        }
                        else {
                            (<HTMLElement>this).removeAttribute("class");
                        }
                    };
                })(items[itemIndex]);
            }

            //Hide table on mobile devices
            var bodyClass = body.getAttribute("class");
            if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                bodyClass = "desktop";
            }
            else {
                bodyClass += " desktop";
            }
            body.setAttribute("class", bodyClass);
        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                var row = document.createElement("div");
                row.setAttribute("class", "tgrid-mobile-row");
                row.innerHTML = option.mobileTemplateHtml;
                container.appendChild(row);
                ko.applyBindings(items[itemIndex], row);

                (function (item) {
                    row.onclick = function (e) {
                        if (!e.ctrlKey) {
                            if (selected(item, false)) {
                                for (var i = 0; i < container.children.length; i++) {
                                    container.children.item(i).removeAttribute("class");
                                }
                                (<HTMLElement>this).setAttribute("class", "selected");
                            }
                        }
                        else {
                            if ((<HTMLElement>this).getAttribute("class") == "selected") {
                                if (selected(item, true)) {
                                    (<HTMLElement>this).removeAttribute("class");
                                }
                            }
                            else {
                                if (selected(item, true)) {
                                    (<HTMLElement>this).setAttribute("class", "selected");
                                }
                            }
                        }

                    };
                })(items[itemIndex]);
            }

            //Hide table on mobile devices
            var bodyClass = container.getAttribute("class");
            if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                bodyClass = "mobile";
            }
            else {
                bodyClass += " mobile";
            }
            container.setAttribute("class", bodyClass);
        }

        updateMobileHeadElement(option: Options, header: HTMLElement, isSortable: boolean): void {
            if (isSortable) {
                header.innerHTML = "<div>mobile sorting will insert hire</div>";
            }
            //Hide table on mobile devices
            var headerClass = header.getAttribute("class");
            if (headerClass == null || headerClass == undefined || headerClass == '') {
                headerClass = "mobile";
            }
            else {
                headerClass += " mobile";
            }
            header.setAttribute("class", headerClass);
        }
    }
}