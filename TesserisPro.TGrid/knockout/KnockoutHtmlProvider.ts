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

        public updateTableHeadElement(option: Options, header: HTMLElement, isSortable: boolean) {
            if (header.innerHTML != null && header.innerHTML != "") {
                // update table header
                if (isSortable) {
                    this.removeArrows(header);
                    var element = header.getElementsByTagName("th");
                    for (var i = 0; i < element.length && i < option.columns.length; i++) {
                        element[i] = <HTMLTableHeaderCellElement>this.addArrows(element[i], option, i);
                    }
                }
            } else {
                // Create table header
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

        public updateMobileHeadElement(option: Options, mobileHeader: HTMLElement, isSortable: boolean): void {
            if (mobileHeader.innerHTML != null && mobileHeader.innerHTML != "") {
                // Update mobile sort arrow
                this.removeArrows(mobileHeader);
                var arrowUpdate = document.getElementsByClassName("tgrid-inline-block");
                if (option.sortDescriptor.asc) {
                    var up = document.createElement("div");
                    up.classList.add("tgrid-arrow-up");
                    arrowUpdate[0].appendChild(up);
                } else {
                    var down = document.createElement("div");
                    down.classList.add("tgrid-arrow-down");
                    arrowUpdate[0].appendChild(down);
                }

                // Update mobile sort column
                var selectUpdate = document.getElementsByTagName("select");
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].sortMemberPath == option.sortDescriptor.column) {
                        selectUpdate[0].selectedIndex = i;
                    }
                }
            } else {
                // Create mobile header
                // Hide table on mobile devices
                var headerClass = mobileHeader.getAttribute("class");
                if (headerClass == null || headerClass == undefined || headerClass == '') {
                    headerClass = "mobile";
                }
                else {
                    headerClass += " mobile";
                }
                mobileHeader.setAttribute("class", headerClass);

                if (isSortable) {
                    var div = document.createElement("div");
                    var arrow = document.createElement("div");
                    var select = document.createElement("select");

                    select.onchange = (e) => {
                        Grid.getGridObject(<HTMLElement>e.target).sortBy(select.options[select.selectedIndex].value);
                    };

                    for (var i = 0; i < option.columns.length; i++) {
                        var selectOption = document.createElement("option");
                        selectOption.value = option.columns[i].sortMemberPath;
                        selectOption.text = option.columns[i].sortMemberPath;
                        select.appendChild(selectOption);
                        if (option.columns[i].sortMemberPath == option.sortDescriptor.column) {
                            arrow = <HTMLDivElement>this.addArrows(arrow, option, i);
                        }
                    }

                    arrow.classList.add("tgrid-inline-block");
                    div.innerHTML += "Sorting by ";
                    div.appendChild(select);
                    div.appendChild(arrow);

                    arrow.onclick = (e) => {
                        Grid.getGridObject(<HTMLElement>e.target).sortBy(select.options[select.selectedIndex].value);
                    };

                    mobileHeader.appendChild(div);
                } else {
                    mobileHeader.innerHTML = "<div></div>";
                }
            }
        }
    }
}