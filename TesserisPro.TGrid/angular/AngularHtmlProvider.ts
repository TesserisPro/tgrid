/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="AngularFooterViewModel.ts" />
/// <reference path="AngularItemViewModel.ts" />

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

        static moduleFooterCounter = 0;

        static controllerItemCounter = 0;

        static angularModuleName = 'tgrid-row-module';

        public getFooterViewModel() {
            var angularFooterViewModel = new AngularFooterViewModel();
            angularFooterViewModel.angularModuleName = 'tgrid-footer-module' + AngularHtmlProvider.moduleFooterCounter++;
            angular
                .module(angularFooterViewModel.angularModuleName, [])
                .controller(
                       'tgrid-footer-controller',
                        function toGridFooterController($scope) {
                            angularFooterViewModel.setScope($scope);
                        });
            return angularFooterViewModel;
        }
         
        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean, columnsResized: (c: ColumnInfo) => void) {
            if (header.innerHTML != null && header.innerHTML != "") {
                //add intends for groupBy
                this.showNeededIntends(header, option.groupBySortDescriptor.length, Grid.getGridObject(header));
                // update table header
                if (isSortable) {
                    this.removeArrows(header);
                    var element = header.getElementsByTagName("th");

                    for (var i = option.columns.length, j = 0; i < element.length, j < option.columns.length; i++, j++) {
                        if (option.sortDescriptor.path == option.columns[j].sortMemberPath) {
                            element[i] = <HTMLTableHeaderCellElement>this.addArrows(element[i], option, i);
                        }
                    }
                }
                this.updateGroupByElements(option, header, groupByContainer);

            } else {
                //method adding groupBy element
                this.addGroupBy(option, header, groupByContainer);

                // Create table header
                var head = document.createElement("tr");

                this.appendIndent(head, option.columns.length, true);
                this.showNeededIntends(head, option.groupBySortDescriptor.length, Grid.getGridObject(header));

                for (var i = 0; i < option.columns.length; i++) {
                    var headerCell = document.createElement("th");
                    headerCell.setAttribute("width", option.columns[i].width);

                    var headerMainContainer = document.createElement("div");
                    headerMainContainer.className = "tgrid-header-cell-container";
                    var headerContent = document.createElement("div");
                    var headerButtons = document.createElement("div");
                    headerContent.className = "tgrid-header-cell-content";
                    headerButtons.className = "tgrid-header-cell-buttons";
                    headerMainContainer.appendChild(headerContent);
                    headerMainContainer.appendChild(headerButtons);
                    headerCell.appendChild(headerMainContainer);

                    if (option.columns[i].header != null) {
                        option.columns[i].header.applyTemplate(headerContent);
                    } else {
                        var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                        this.createDefaultHeader(headerContent, headerText);
                    }

                    // Method changing sorting
                    (function (i) {
                        headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(option.columns[i].sortMemberPath);
                    })(i);

                    // Arrows
                    if (isSortable) {
                        if (option.sortDescriptor.path == option.columns[i].sortMemberPath) {
                            <HTMLTableHeaderCellElement>this.addArrows(headerButtons, option, i);
                        }
                    }

                    //filer
                    if (option.isEnableFiltering) {
                        var filter = document.createElement("div");
                        filter.classList.add("tgrid-filter-button");
                        (function (i) {
                            filter.onclick = (e) => {
                                var left = (<HTMLElement>e.target).offsetLeft;
                                for (var j = 0; j < i; j++) {
                                    left += parseInt(option.columns[j].width);
                                }
                                var el = header.getElementsByClassName("tgrid-table-indent-cell");
                                if (el.length > 0) {
                                    for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                                        left += 20;
                                    }
                                }
                                Grid.getGridObject(<HTMLElement>e.target).showFilterBox(<Element>(filterPopupContainer), option.columns[i].sortMemberPath, left);
                                e.cancelBubble = true;
                            };
                        })(i);
                        headerButtons.appendChild(filter);
                    }


                    if (option.columns[i].resizable) {
                        var columnResize = document.createElement("div");
                        columnResize.className = "tgrid-header-column-resize";

                        columnResize.onclick = e => e.stopImmediatePropagation();

                        (function (i, headerCell, columnResize) {
                            var documentMouseMove = null;
                            var position = 0;
                            columnResize.onmousedown = e => {
                                e.stopImmediatePropagation();
                                console.log("test");
                                position = e.screenX;
                                documentMouseMove = document.onmousemove;
                                document.onmousemove = m => {
                                    if (position != 0) {
                                        option.columns[i].width = (parseInt(option.columns[i].width) + m.screenX - position).toString();
                                        position = m.screenX;
                                        columnsResized(option.columns[i]);
                                    }
                                };
                            };

                            document.onmouseup = e => {
                                document.onmousemove = documentMouseMove;
                                position = 0;
                            }
                    })(i, headerCell, columnResize);


                        headerButtons.appendChild(columnResize);

                    }
                    head.appendChild(headerCell);
                }
                var placeholderColumn = document.createElement("th");
                placeholderColumn.classList.add("tgrid-placeholder");
                head.appendChild(placeholderColumn);

                header.appendChild(head);
            }
        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            if (!option.showDetailFor.isDetailColumn) {
                option.showDetailFor.column = -1;
            }

            var angularModule = angular.module(AngularHtmlProvider.angularModuleName, []);

            for (var i = 0; i < items.length; i++) {
                
                this.appendTableElement(option, container, items[i], 0, selected, AngularHtmlProvider.angularModuleName, angularModule);
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
            container.setAttribute('class', bodyClass);
        }

        public addDetailRow(option: Options, container: HTMLElement) {

        }

        public updateTableDetailRow(option: Options, container: HTMLElement, item: ItemViewModel) {
            var detailRow = container.getElementsByClassName("details");
            if (detailRow.length > 0) {
                detailRow[0].parentNode.removeChild(detailRow[0]);
            }

            if (option.selectionMode == SelectionMode.Multi) {
                if (!option.ctrlKey) {
                    for (var i = 0; i < container.children.length; i++) {
                        (<HTMLElement>container.children.item(i)).classList.remove("selected");
                    }
                }
                if (option.isSelected(item)) {
                    option.selectedRow.classList.add("selected");
                }
                else {
                    option.selectedRow.classList.remove("selected");
                }
            }
            if (option.selectionMode == SelectionMode.Single) {
                for (var i = 0; i < container.children.length; i++) {
                    (<HTMLElement>container.children.item(i)).classList.remove("selected");
                }
                if (option.isSelected(item)) {
                    option.selectedRow.classList.add("selected");;
                }
                else {
                    option.selectedRow.classList.remove('selected');
                }
            }

            var selectedElement = container.getElementsByClassName("selected");
            // Insert row details after selected item
            if (this.hasDetails(selectedElement, option)) {
                var details = this.buildDetailsRow(option, item);
                details.classList.add("details");
                insertAfter(selectedElement[0], details);
                //ko.applyBindings(option.showDetailFor, details);
            }
        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel): void {
            //if there isn't footer template in grid
            if (footerModel == null && option.isEnablePaging) {
                this.updateTableFooterElementDefault(option, footer, totalItemsCount);
            } else if (option.tableFooterTemplate != null) {
                var footerContainer = document.createElement("div");
                footerContainer.className = "tgrid-footer-container";
                footerContainer.setAttribute("ng-controller", "tgrid-footer-controller"); 
                option.tableFooterTemplate.applyTemplate(footerContainer);
                footer.innerHTML = "";
                footer.appendChild(footerContainer);

                angular.bootstrap(footerContainer, [(<AngularFooterViewModel>footerModel).angularModuleName]);
            }
        }

        public addFiltringPopUp(option: Options, filterPopupContainer: HTMLElement, filterPopupViewModel: FilterPopupViewModel) {
            if (option.filterPopup == null) {
                this.defaultFiltringPopUp(option, filterPopupContainer);
            } else {
                option.filterPopup.applyTemplate(filterPopupContainer);
                //ko.applyBindings(filterPopupViewModel, filterPopupContainer);
            }
        }

        //private methods
        private appendTableElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean, angularModuleName: string, angularModule: any): void {
            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;

            if (item.isGroupHeader) {
                var groupHeader = this.buildGroupHeaderRow(option, item.item);
                container.appendChild(groupHeader);
            } else {
                var row = this.buildRowElement(option, item, container, selected, angularModuleName, angularModule);
                container.appendChild(row);
            }
        }

        private buildRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean, angularModuleName: string, angularModule: any): HTMLElement {
            var row = document.createElement("tr");
            row.classList.add("table-body-row");

            if (option.isSelected(item.item)) {
                row.classList.add("selected");
            }

            var angularItemViewModel = new AngularItemViewModel(item.model, item.item, item.grid, item.isGroupHeader);
            angularItemViewModel.angularControllerName = 'tgrid-row-controller' + AngularHtmlProvider.controllerItemCounter++;
            angularModule.controller(
                angularItemViewModel.angularControllerName,
                function toGridFooterController($scope) {
                    angularItemViewModel.setScope($scope);
                });

            row.setAttribute("ng-controller", angularItemViewModel.angularControllerName);

            this.appendIndent(row, option.groupBySortDescriptor.length, false);

            for (var i = 0; i < option.columns.length; i++) {
                var cell = document.createElement("td");
                if (option.columns[i].cell != null) {
                    option.columns[i].cell.applyTemplate(cell);
                } else {
                    if (option.columns[i].member != null) {
                        cell = this.createDefaultCell(cell, option.columns[i].member);
                    }
                }
                //cell.innerHTML = cell.innerHTML.replace("{{item." + option.columns[i].sortMemberPath + "}}", item.item[option.columns[i].sortMemberPath]);
                row.appendChild(cell);                
            }
            angular.bootstrap(row, [angularModuleName]);

            var placeholderColumn = document.createElement("td");
            placeholderColumn.classList.add("tgrid-placeholder");
            row.appendChild(placeholderColumn);

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        option.ctrlKey = e.ctrlKey;
                        option.selectedRow = <HTMLElement>this;
                        selected(item, e.ctrlKey);
                    }
                };
            })(item);

            return row;
        }

        private buildDetailsRow(option: Options, item: ItemViewModel): HTMLElement {
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            this.appendIndent(detailTr, option.groupBySortDescriptor.length, false);

            detailTr.classList.add("details");
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
            option.showDetailFor.column == -1 ? option.detailsTemplateHtml.applyTemplate(detailTd) : option.columns[option.showDetailFor.column].cellDetail.applyTemplate(detailTd);
            

            var angularItemViewModel = new AngularItemViewModel(null, item, null, null);
            angularItemViewModel.angularControllerName = 'tgrid-detail-controller' + AngularHtmlProvider.controllerItemCounter++;
            angular.module(AngularHtmlProvider.angularModuleName, [])
                .controller(
                angularItemViewModel.angularControllerName,
                function toGridFooterController($scope) {
                    angularItemViewModel.setScope($scope);
                });

            detailTd.setAttribute("ng-controller", angularItemViewModel.angularControllerName); 
            detailTr.appendChild(detailTd);
            angular.bootstrap(detailTd, [AngularHtmlProvider.angularModuleName]);

            return detailTr;

        }


        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerTr = document.createElement("tr");
            var headerTd = document.createElement("td");

            this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

            var colspan = option.columns.length + 1 + option.groupBySortDescriptor.length - groupHeaderDescriptor.level;
            headerTd.setAttribute("colspan", colspan.toString());
            headerTd.classList.add("tgrid-table-group-header");
            headerTr.classList.add("tgrid-table-group-header");
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerTd);
            } else {
                headerTd = this.createDefaultGroupHeader(headerTd);
            }
            headerTd.innerHTML = headerTd.innerHTML.replace("{{item.value}}", groupHeaderDescriptor.value);
            if (option.isEnableCollapsing) {
                if (!groupHeaderDescriptor.collapse) {
                    headerTd.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                } else {
                    headerTd.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                }
            }

            headerTr.appendChild(headerTd);

            return headerTr;
        }

        private addArrows(htmlNode: Node, option: Options, columnNumber: number): Node {
            if (option.sortDescriptor.asc) {
                var up = document.createElement("div");
                up.classList.add("tgrid-arrow-up");
                htmlNode.appendChild(up);
            }
            if (!option.sortDescriptor.asc) {
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
                    if (option.columns[i].sortMemberPath == option.sortDescriptor.path) {
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
                        if (option.columns[i].sortMemberPath == option.sortDescriptor.path) {
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

        public updateMobileDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void {
            var detailRow = container.getElementsByClassName("details");
            if (detailRow.length > 0) {
                detailRow[0].parentNode.removeChild(detailRow[0]);
            }

            if (option.selectionMode == SelectionMode.Multi) {
                if (!option.ctrlKey) {
                    for (var i = 0; i < container.children.length; i++) {
                        (<HTMLElement>container.children.item(i)).classList.add("tgrid-mobile-row");
                    }
                }
                if (option.isSelected(item.item)) {
                    option.selectedRow.classList.add("selected");
                }
                else {
                    (<HTMLElement>container.children.item(i)).classList.add("tgrid-mobile-row");
                }
            }
            if (option.selectionMode == SelectionMode.Single) {
                for (var i = 0; i < container.children.length; i++) {
                    (<HTMLElement>container.children.item(i)).classList.add("tgrid-mobile-row");
                }
                if (option.isSelected(item)) {
                    option.selectedRow.classList.add("selected");
                }
                else {
                    (<HTMLElement>container.children.item(i)).classList.add("tgrid-mobile-row");
                }
            }

            var selectedElement = container.getElementsByClassName("selected");

            // Insert row details after selected item
            //if (selectedElement != null && selectedElement.length == 1) {
            if (this.hasDetails(selectedElement, option)) {
                var details = this.buildMobileDetailsRow(option);
                details.classList.add("details");
                insertAfter(selectedElement[0], details);
                //ko.applyBindings(option.showDetailFor, details);
            }
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
            }
        }

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("div");
            row.classList.add("tgrid-mobile-row");

            if (option.isSelected(item.item)) {
                row.classList.add("selected");
            }

            for (var i = 0; i < option.groupBySortDescriptor.length; i++) {
                row.innerHTML += "<div class='tgrid-mobile-indent-div'></div>"
            }

            var rowTemplate = document.createElement("div");
            rowTemplate.classList.add('tgrid-mobile-div');
            option.mobileTemplateHtml.applyTemplate(rowTemplate);
            row.appendChild(rowTemplate);

            for (var i = 0; i < option.columns.length; i++) {
                row.innerHTML = row.innerHTML.replace("{{item." + option.columns[i].sortMemberPath + "}}", item.item[option.columns[i].sortMemberPath]);
            }

            var placeholderColumn = document.createElement("td");
            placeholderColumn.classList.add("tgrid-placeholder");
            row.appendChild(placeholderColumn);

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        selected(item, e.ctrlKey);
                    }
                    if (option.selectionMode == SelectionMode.Multi) {
                        if (!e.ctrlKey) {
                            for (var i = 0; i < container.children.length; i++) {
                                (<HTMLElement>container.children.item(i)).classList.remove("selected");
                            }
                        }
                        if (option.isSelected(item.item)) {
                            (<HTMLElement>this).classList.add("selected");
                        }
                        else {
                            (<HTMLElement>this).classList.remove("selected");
                        }
                    }
                    if (option.selectionMode == SelectionMode.Single) {
                        for (var i = 0; i < container.children.length; i++) {
                            (<HTMLElement>container.children.item(i)).classList.remove("selected");
                        }
                        if (option.isSelected(item.item)) {
                            (<HTMLElement>this).classList.add("selected");
                        }
                        else {
                            (<HTMLElement>this).classList.remove("selected");
                        }
                    }
                };
            })(item);

            return row;
        }

        private createDefaultGroupHeader(tableRowElement: any) {
            var groupHeaderContainer = document.createElement("div");
            var groupHeaderName = document.createElement("span");
            groupHeaderName.innerHTML = "{{item.value}}";
            groupHeaderName.setAttribute("style", "color: green;");
            groupHeaderContainer.appendChild(groupHeaderName);
            tableRowElement.appendChild(groupHeaderContainer);
            return tableRowElement;
        }

        private buildMobileDetailsRow(option: Options): HTMLElement {
            var detailDiv = document.createElement("div");

            detailDiv.classList.add("tgrid-mobile-details");

            option.showDetailFor.column == -1 ? option.detailsTemplateHtml.applyTemplate(detailDiv) : option.columns[option.showDetailFor.column].cellDetail.applyTemplate(detailDiv);

            var begin = detailDiv.innerHTML.indexOf("{{item.");
            var end = detailDiv.innerHTML.indexOf("}}");
            var str = detailDiv.innerHTML.substring(begin + 7, end);
            detailDiv.innerHTML = detailDiv.innerHTML.replace("{{item." + str + "}}", option.showDetailFor.item[str]);

            return detailDiv;
        }

        private buildGroupMobileHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerDiv = document.createElement("div");

            headerDiv.classList.add("tgrid-mobile-group-header")
            headerDiv.setAttribute("style", "padding-left: " + (20 * groupHeaderDescriptor.level) + "px !important;");

            if (option.isEnableCollapsing) {
                if (!groupHeaderDescriptor.collapse) {
                    headerDiv.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                } else {
                    headerDiv.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                }
            }
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerDiv);
            }
            headerDiv.innerHTML = headerDiv.innerHTML.replace("{{item.value}}", groupHeaderDescriptor.value);

            return headerDiv;
        }

        private createDefaultCell(cell: HTMLTableCellElement, defaultCellBindingName: string): HTMLTableCellElement {
            var spanForCell = document.createElement("span");
            var textBinding = "{{item.".concat(defaultCellBindingName).concat("}}");
            spanForCell.innerHTML = textBinding;
            cell.appendChild(spanForCell);

            return cell;
        }
    
    }
}