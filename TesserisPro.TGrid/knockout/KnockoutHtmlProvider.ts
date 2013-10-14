/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../IGroup.ts" />

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

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            if (!option.showDetailFor.isApply) {
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

        private buildDetailsRow(option: Options): HTMLElement {
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            detailTr.setAttribute("class", "details")
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
            detailTd.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
            detailTr.appendChild(detailTd);

            return detailTr;
        }

        private buildMobileDetailsRow(option: Options): HTMLElement {
            var detailDiv = document.createElement("div");

            detailDiv.setAttribute("class", "tgrid-mobile-details ")
            detailDiv.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;

            return detailDiv;
        }

        private buildRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("tr");

            if (option.isSelected(item.item)) {
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
                        
            (function (item) {
                row.onclick = function (e) {
                    if (option.selectMode != SelectMode.None) {
                        selected(item, e.ctrlKey);
                    }
                    if (option.selectMode == SelectMode.Multi) {
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
                    if (option.selectMode == SelectMode.Single) {
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

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("div");
            row.setAttribute("class", "tgrid-mobile-row");

            if (option.isSelected(item.item)) {
                row.setAttribute("class", "selected tgrid-mobile-row");
            }

            row.innerHTML = option.mobileTemplateHtml;

            var placeholderColumn = document.createElement("td");
            placeholderColumn.setAttribute("class", "tgrid-placeholder");
            row.appendChild(placeholderColumn);

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectMode != SelectMode.None) {
                        selected(item, e.ctrlKey);
                    }
                    if (option.selectMode == SelectMode.Multi) {
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
                    if (option.selectMode == SelectMode.Single) {
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



        private appendTableElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            //var maxGroupLevel = 1;
            
            //if (groupLevel != maxGroupLevel) {
            //    var groupElement = document.createElement("tr");
            //    var groupColumnElement = document.createElement("td");
            //    var shiftingElement = document.createElement("div");
            //    shiftingElement.setAttribute("style", "display: inline-block; width:" + (groupLevel * 10).toString + "px;");
            //    groupColumnElement.setAttribute("colspan", (option.columns.length + 1).toString());
            //    groupColumnElement.appendChild(shiftingElement);
            //    var groupDescription = document.createElement("span");
            //    groupDescription.innerHTML = "Group";
            //    groupColumnElement.appendChild(groupDescription);
            //    groupElement.appendChild(groupColumnElement);
            //    container.appendChild(groupElement);
            
            
            //    for (var i = 0; i < item.children.length; i++) {
            //        this.appendGroupElement(option, container, item.children[i], groupLevel + 1, selected);
            //    }
            //}

            //if (groupLevel == maxGroupLevel || item.children == null) {
                var itemWithDetails: any;
                var rowWithDetail: HTMLElement;

                var row = this.buildRowElement(option, item, container, selected);

                container.appendChild(row);
                ko.applyBindings(item, row);

                if (option.showDetailFor.item == item.item) {
                    itemWithDetails = item;
                    rowWithDetail = row;
                }

                var details = this.buildDetailsRow(option);

                // Insert row details after selected item
                if (itemWithDetails != null) {
                    insertAfter(rowWithDetail, details);
                    ko.applyBindings(itemWithDetails, details);
                }
            //}
        }

        private appendMobileElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            //var maxGroupLevel = 1;

            //if (groupLevel != maxGroupLevel) {
            //    var groupElement = document.createElement("div");
            //    var shiftingElement = document.createElement("div");
            //    shiftingElement.setAttribute("style", "display: inline-block; width:" + (groupLevel * 10).toString + "px;");
            //    groupElement.setAttribute("colspan", (option.columns.length + 1).toString());
            //    groupElement.setAttribute("class", "tgrid-mobile-group");
            //    groupElement.appendChild(shiftingElement);
            //    var groupDescription = document.createElement("span");
            //    groupDescription.innerHTML = "Group";
            //    groupElement.appendChild(groupDescription);
            //    container.appendChild(groupElement);


            //    for (var i = 0; i < item.children.length; i++) {
            //        this.appendMobileGroupElement(option, container, item.children[i], groupLevel + 1, selected);
            //    }
            //}

            //if (groupLevel == maxGroupLevel || item.children == null) {
                var itemWithDetails: any;
                var rowWithDetail: HTMLElement;

                var row = this.buildMobileRowElement(option, item, container, selected);

                container.appendChild(row);
                ko.applyBindings(item, row);

                if (option.showDetailFor.item == item.item) {
                    itemWithDetails = item;
                    rowWithDetail = row;
                }

                var details = this.buildMobileDetailsRow(option);

                // Insert row details after selected item
                if (itemWithDetails != null) {
                    insertAfter(rowWithDetail, details);
                    ko.applyBindings(itemWithDetails, details);
                }
            //}
        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            if (!option.showDetailFor.isApply) {
                option.showDetailFor.column = -1;
            }

            for (var i = 0; i < items.length; i++) {
                this.appendMobileElement(option, container, items[i], 0, selected);
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
            option.showDetailFor.isApply = false;
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