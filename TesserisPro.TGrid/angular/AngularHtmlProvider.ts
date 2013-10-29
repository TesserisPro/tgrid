/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>

module TesserisPro.TGrid {

    export class AngularHtmlProvider extends BaseHtmlProvider {

        // Table Methods

        public getElemntsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = children.item(i);
                var viewModel = <ItemViewModel>(items[i]);//ko.contextFor(child).$root);

                if (viewModel != null && items.indexOf(viewModel) > 0) {
                    size += child.clientHeight;
                }
            }

            return size;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = children.item(i);
                var viewModel = <ItemViewModel>(items[i]);//(ko.contextFor(child).$root);
                if (viewModel != null && items.indexOf(viewModel) > 0) {
                    size += child.clientHeight;
                }
                if (size > scrollTop) {
                    return viewModel;
                }
            }

            return null;
        }

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, isSortable: boolean)
        {
            if (header.innerHTML != null && header.innerHTML != "") {
                // update table header
                if (isSortable) {
                    this.removeArrows(header);
                    var element = header.getElementsByTagName("th");

                    for (var i = option.groupBySortDescriptor.length; i < element.length && i - option.groupBySortDescriptor.length < option.columns.length; i++) {
                        element[i] = <HTMLTableHeaderCellElement>this.addArrows(element[i], option, i - option.groupBySortDescriptor.length);
                    }
                }

                var groupByContainer = <NodeList>header.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("group-by-container");
                this.deleteAllGroupByElements(<HTMLElement>groupByContainer[0]);
                this.addGroupByHandlers(option, <HTMLElement>groupByContainer[0]);

                var listButtonContainer = <NodeList>header.parentElement.parentElement.parentElement.parentElement.getElementsByClassName("list-button-container");
                (<HTMLElement>listButtonContainer[0]).appendChild(this.updateGroupByList(<HTMLUListElement>(<HTMLElement>listButtonContainer[0]).children[1], option));


            } else {
                //method adding groupBy element
                var groupByRow = document.createElement("div");
                groupByRow.setAttribute("class", "group-by-container");

                this.addGroupByHandlers(option, groupByRow);

                var listButtonContainerElement = document.createElement("div");
                listButtonContainerElement.setAttribute("class", "list-button-container");

                var listGroupByElement = document.createElement("ul");
                listGroupByElement.setAttribute("class", "group-by-ul");

                var groupByButtonElement = document.createElement("a");
                groupByButtonElement.setAttribute("class", "button-group-by");

                groupByButtonElement.onclick = (e) => {
                    Grid.getGridObject(<HTMLElement>e.target).showElement((<HTMLElement>e.target).nextElementSibling);
                }

                listButtonContainerElement.appendChild(groupByButtonElement);
                listButtonContainerElement.appendChild(this.createListGroupByAvailable(listGroupByElement, option));

                groupByRow.appendChild(listButtonContainerElement);
                header.parentElement.parentElement.parentElement.insertBefore(groupByRow, header.parentElement.parentElement.parentElement.firstChild); 

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
            } else {
                var row = this.buildRowElement(option, item, container, selected);
                container.appendChild(row);
                
                if (option.showDetailFor.item == item.item) {
                    itemWithDetails = item;
                    rowWithDetail = row;
                }

                var details = this.buildDetailsRow(option,item);

                // Insert row details after selected item
                if (itemWithDetails != null) {
                    insertAfter(rowWithDetail, details);
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
                option.columns[i].cell.applyTemplate(cell);
                cell.innerHTML = cell.innerHTML.replace("{{item." + option.columns[i].sortMemberPath + "}}", item.item[option.columns[i].sortMemberPath]);
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

        private buildDetailsRow(option: Options, item: ItemViewModel): HTMLElement {
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            this.appendIndent(detailTr, option.groupBySortDescriptor.length, false);

            detailTr.setAttribute("class", "details")
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
            detailTd.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;
            var begin = detailTd.innerHTML.indexOf("{{item.");
            var end = detailTd.innerHTML.indexOf("}}");
            var str = detailTd.innerHTML.substring(begin + 7, end);
            detailTd.innerHTML = detailTd.innerHTML.replace("{{item." + str + "}}", item.item[str]);
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
            headerTd.innerHTML = headerTd.innerHTML.replace("{{item.value}}", groupHeaderDescriptor.value);
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

        //function for adding groupBy functionality at the top of the grid
        private addGroupByHandlers(option: Options, groupByContainer: HTMLElement) {
            for (var i = 0; i < option.groupBySortDescriptor.length; i++) {
                var groupByHeaderElement = document.createElement("div");

                for (var j = 0; j < option.columns.length; j++) {
                    if (option.columns[j].groupMemberPath == option.groupBySortDescriptor[i].column) {
                        option.columns[j].header.applyTemplate(groupByHeaderElement);
                    }
                }

                groupByHeaderElement.setAttribute("class", "condition-group-by");
                groupByHeaderElement["data-group-by"] = option.groupBySortDescriptor[i];

                //create deleteGroupByElement
                var deleteGroupByElement = document.createElement("input");
                deleteGroupByElement.setAttribute("type", "button");
                deleteGroupByElement.setAttribute("class", "delete-condition-group-by");
                deleteGroupByElement.setAttribute("value", "x");
                deleteGroupByElement["data-delete-groupby"] = option.groupBySortDescriptor[i];

                //adding function to delete GroupBy condition by clicking on close button
                deleteGroupByElement.onclick = (e) => {
                    var groupByElement = <SortDescriptor>e.target["data-delete-groupby"];
                    Grid.getGridObject(<HTMLElement>e.target).deleteGroupBy(groupByElement.column, groupByElement.asc);
                }

                groupByHeaderElement.appendChild(deleteGroupByElement);
                groupByContainer.appendChild(groupByHeaderElement);
                //ko.applyBindings(ko.contextFor(option.target), groupByHeaderElement);
            }
        }
        //delete all elements of groupBy from the top of the grid
        private deleteAllGroupByElements(groupByContainerElement: HTMLElement) {
            for (var i = 0; i < groupByContainerElement.children.length; i++) {
                if (groupByContainerElement.children[i]["data-group-by"] != undefined) {
                    groupByContainerElement.removeChild(groupByContainerElement.children[i]);
                    i--;
                }
            }
        }
        // creates list groupBys to choose from
        private createListGroupByAvailable(listGroupByElement: HTMLUListElement, option: Options) {
            for (var i = 0; i < option.columns.length; i++) {
                var hasNotGroupBy = true;
                for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                    if (option.groupBySortDescriptor[j].column == option.columns[i].groupMemberPath) {
                        hasNotGroupBy = false;
                        continue;
                    }
                }
                if (hasNotGroupBy) {
                    var listItemGroupByElement = document.createElement("li");
                    listItemGroupByElement.onclick = (e) => {
                        var el = <Node>e.target;
                        while (el && el.nodeName !== 'LI') {
                            el = el.parentNode
                            }
                        Grid.getGridObject(<HTMLElement>e.target).addGroupBy((<string>el["data-group-by-condition"]), true);
                    }
                    option.columns[i].header.applyTemplate(listItemGroupByElement);
                    listItemGroupByElement["data-group-by-condition"] = option.columns[i].groupMemberPath;

                    listGroupByElement.appendChild(listItemGroupByElement);
                   // var viewModel = ko.contextFor(option.target);
                    //ko.applyBindings(viewModel, listItemGroupByElement);
                }
            }

            return listGroupByElement;
        }

        private updateGroupByList(list: HTMLUListElement, option: Options) {
            while (list.firstChild)
                list.removeChild(list.firstChild);
            list = this.createListGroupByAvailable(list, option);
            Grid.getGridObject(list).hideElement(list);

            return list;
        }

        // Mobile Methods

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

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            if (!option.showDetailFor.isDetailColumn) {
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
            option.showDetailFor.isDetailColumn = false;
        }

        private appendMobileElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;
            if (item.isGroupHeader) {
                var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                container.appendChild(mobileGroupHeader);
            } else {
                var row = this.buildMobileRowElement(option, item, container, selected);

                container.appendChild(row);

                if (option.showDetailFor.item == item.item) {
                    itemWithDetails = item;
                    rowWithDetail = row;
                }

                var details = this.buildMobileDetailsRow(option, item.item);

                // Insert row details after selected item
                if (itemWithDetails != null) {
                    insertAfter(rowWithDetail, details);
                }
            }
        }

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("div");
            row.setAttribute("class", "tgrid-mobile-row");
            row.setAttribute("style", "padding-left: " + 20 * (option.groupBySortDescriptor.length) + "px !important;");


            if (option.isSelected(item.item)) {
                row.setAttribute("class", "selected tgrid-mobile-row");
            }

            row.innerHTML = option.mobileTemplateHtml;

            for (var i = 0; i < option.columns.length; i++) {
                row.innerHTML = row.innerHTML.replace("{{item." + option.columns[i].sortMemberPath + "}}", item.item[option.columns[i].sortMemberPath]);
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

        private buildMobileDetailsRow(option: Options, item: ItemViewModel): HTMLElement {
            var detailDiv = document.createElement("div");

            detailDiv.setAttribute("class", "tgrid-mobile-details ")
            detailDiv.innerHTML = option.showDetailFor.column == -1 ? option.detailsTemplateHtml : option.columns[option.showDetailFor.column].cellDetail;

            var begin = detailDiv.innerHTML.indexOf("{{item.");
            var end = detailDiv.innerHTML.indexOf("}}");
            var str = detailDiv.innerHTML.substring(begin + 7, end);
            detailDiv.innerHTML = detailDiv.innerHTML.replace("{{item." + str + "}}", item[str]);

            return detailDiv;
        }

        private buildGroupMobileHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerDiv = document.createElement("div");

            headerDiv.setAttribute("class", "tgrid-mobile-group-header ")
            headerDiv.setAttribute("style", "padding-left: " + (20 * groupHeaderDescriptor.level) + "px !important;");

            headerDiv.innerHTML = option.groupHeaderTemplate;
            headerDiv.innerHTML = headerDiv.innerHTML.replace("{{item.value}}", groupHeaderDescriptor.value);

            return headerDiv;
        }

    }
}