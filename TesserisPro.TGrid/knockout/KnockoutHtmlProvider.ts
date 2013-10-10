/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />
/// <reference path="../utils.ts" />

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
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");
            detailTr.setAttribute("class","details")
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
            detailTd.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
            detailTr.appendChild(detailTd);
            var selectedRow: any;

            var itemWithDetails: any;

            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                var row = document.createElement("tr");
                
                if(option.isSelected(items[itemIndex].item)) {
                    row.setAttribute("class", "selected");
                }

                if (option.showDetailFor.item == items[itemIndex].item) {
                    itemWithDetails = items[itemIndex];
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
                        if (option.selectMode != SelectMode.None) {
                            selected(item, e.ctrlKey);
                        }
                        if (option.selectMode == SelectMode.Multi) {
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
                        }
                        if (option.selectMode == SelectMode.Single) {
                            for (var i = 0; i < body.children.length; i++) {
                                body.children.item(i).removeAttribute("class");
                            }
                            if (option.isSelected(item.item)) {
                                (<HTMLElement>this).setAttribute("class", "selected");
                            }
                            else {
                                (<HTMLElement>this).removeAttribute("class");
                            }
                        }
                    };
                })(items[itemIndex]);

                selectedRow = body.getElementsByClassName("selected");
            }

            // Insert row details after selected item
            if (itemWithDetails != null) {
                insertAfter(selectedRow[0], detailTr);
                ko.applyBindings(itemWithDetails, detailTr);
            }

            //Hide table on mobile devices
            var bodyClass = body.getAttribute("class");
            if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                bodyClass = "desktop";
            }
            else {
                if (bodyClass.indexOf("desktop") == -1) {
                    bodyClass += " desktop";
                }
            }
            body.setAttribute("class", bodyClass);
        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            var detailDiv = document.createElement("div");
            detailDiv.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
            detailDiv.setAttribute("class", "details tgrid-mobile-row")
            var selectedRow: any;

            var itemWithDetails: any;

            for (var itemIndex = 0; itemIndex < items.length; itemIndex++) {
                var row = document.createElement("div");
                row.setAttribute("class", "tgrid-mobile-row");
                row.innerHTML = option.mobileTemplateHtml;
                container.appendChild(row);
                ko.applyBindings(items[itemIndex], row);

                if (option.isSelected(items[itemIndex].item)) {
                    row.setAttribute("class", "tgrid-mobile-row selected");
                }

                if (option.showDetailFor.item == items[itemIndex].item) {
                    itemWithDetails = items[itemIndex];
                }

                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectMode != SelectMode.None) {
                            selected(item, e.ctrlKey);
                        }
                        if (option.selectMode == SelectMode.Multi) {
                            if (!e.ctrlKey) {
                                for (var i = 0; i < container.children.length; i++) {
                                    container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                                }
                            }

                            if (option.isSelected(item.item)) {
                                (<HTMLElement>this).setAttribute("class", "tgrid-mobile-row selected");
                            }
                            else {
                                (<HTMLElement>this).setAttribute("class", "tgrid-mobile-row");
                            }
                        }
                        if (option.selectMode == SelectMode.Single) {
                            for (var i = 0; i < container.children.length; i++) {
                                container.children.item(i).setAttribute("class", "tgrid-mobile-row");
                            }
                            if (option.isSelected(item.item)) {
                                (<HTMLElement>this).setAttribute("class", "tgrid-mobile-row selected");
                            }
                            else {
                                (<HTMLElement>this).setAttribute("class", "tgrid-mobile-row");
                            }
                        }
                    };
                })(items[itemIndex]);

                selectedRow = container.getElementsByClassName("selected");
            }

            // Insert row details after selected item
            if (itemWithDetails != null) {
                insertAfter(selectedRow[0], detailDiv);
                ko.applyBindings(itemWithDetails, detailDiv);
            }

            //Hide table on mobile devices
            var bodyClass = container.getAttribute("class");
            if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                bodyClass = "mobile";
            }
            else {
                if (bodyClass.indexOf("mobile") == -1) {
                    bodyClass += " mobile";
                }
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