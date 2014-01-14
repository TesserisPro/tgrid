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
            if (items == null) {
                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    size += child.clientHeight;
                }
            } else {
                for (var i = 0; i < children.length; i++) {
                    var child = children.item(i);
                    var viewModel = <ItemViewModel>(items[i]);

                    if (viewModel != null && items.indexOf(viewModel) > 0) {
                        size += child.clientHeight;
                    }
                }
            }

            return size;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                if (size > scrollTop) {
                    return viewModel;
                }
                var child = children.item(i);
                var viewModel = <ItemViewModel>(items[i]);
                if (viewModel != null && items.indexOf(viewModel) >= 0) {
                    size += child.clientHeight;
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
        static angularGroupModuleName = 'tgrid-group-module';

        public getFooterViewModel(grid:any) {
            var angularFooterViewModel = new AngularFooterViewModel(grid);
            angularFooterViewModel.angularModuleName = 'tgrid-footer-module' + AngularHtmlProvider.moduleFooterCounter++;
            angular
                .module(angularFooterViewModel.angularModuleName, [])
                .controller('tgrid-footer-controller', ['$scope',function ($scope) {
                    angularFooterViewModel.setScope($scope);
                }]);
            return angularFooterViewModel;
        }
         
        public getFilterPopupViewModel(container: HTMLElement) {
            var angularFilterPopupViewModel = new AngularFilterPopupViewModel(container, this.onCloseFilterPopup);
            angularFilterPopupViewModel.angularModuleName = 'tgrid-filter-popup-module';
            var angularFilterModule= angular
                .module(angularFilterPopupViewModel.angularModuleName, [])
                .controller('tgrid-filter-popup-controller', ['$scope',function ($scope) {
                    angularFilterPopupViewModel.setScope($scope);
                }]);
            return angularFilterPopupViewModel;
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: ColumnInfo) => void) {
            this.updateGroupByPanel(option, groupByContainer);

            if (header.innerHTML != null && header.innerHTML != "") {
                //add indents for groupBy
                this.showNeededIndents(header, option.groupBySortDescriptors.length, Grid.getGridObject(header));
                var element = header.getElementsByTagName("th");
                var indendsQuantity = option.columns.length;
                var columnsQuantity = option.columns.length;
                var headerElementsQuantity = element.length;
                // update table header
                if (option.enableSorting) {
                    this.removeArrows(header);
                    for (var headerElementNumber = indendsQuantity, j = 0; headerElementNumber < headerElementsQuantity, j < columnsQuantity; headerElementNumber, j++) {
                        if (option.columns[j].device.indexOf("desktop") != -1) {
                            if (option.sortDescriptor.path == option.columns[j].sortMemberPath && option.columns[j].sortMemberPath != null) {
                                this.addArrows(element[headerElementNumber].getElementsByClassName("tgrid-header-cell-buttons")[0], option, headerElementNumber);
                            }
                            headerElementNumber++;
                        }
                    }
                }
                if (option.enableFiltering) {
                    this.removeFilterButtons(header);
                    for (var headerElementNumber = indendsQuantity, j = 0; headerElementNumber < headerElementsQuantity, j < columnsQuantity; headerElementNumber, j++) {
                        if (option.columns[j].device.indexOf("desktop") != -1) {
                            var isFilterApplied = false;
                            for (var i = 0; i < option.filterDescriptors.length; i++) {
                                if (option.filterDescriptors[i].path == option.columns[j].filterMemberPath && option.columns[j].filterMemberPath != null) {
                                    isFilterApplied = true;
                                    break;
                                }
                            }
                            var headerElementsButton = element[headerElementNumber].getElementsByClassName("tgrid-header-cell-buttons")[0];
                            this.addFilterButton(option, filterPopupContainer, <HTMLElement>headerElementsButton, j, isFilterApplied);

                            headerElementNumber++;
                        }
                    }
                }
                

            } else {
                // Create table header
                var head = document.createElement("tr");

                this.appendIndent(head, option.columns.length, true);
                this.showNeededIndents(head, option.groupBySortDescriptors.length, Grid.getGridObject(header));

                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].device.indexOf("desktop") != -1) {
                        var headerCell = document.createElement("th");
                        headerCell.setAttribute("width", option.columns[i].width);

                        var headerMainContainer = document.createElement("div");
                        headerMainContainer.className = "tgrid-header-cell-container";
                        var headerContent = document.createElement("div");
                        var headerButtons = document.createElement("div");
                        headerContent.className = "tgrid-header-cell-content";
                        headerContent.style.overflow = "hidden";
                        headerButtons.className = "tgrid-header-cell-buttons";
                        headerMainContainer.appendChild(headerContent);
                        headerMainContainer.appendChild(headerButtons);
                        headerCell.appendChild(headerMainContainer);

                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(headerContent);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                            this.buildDefaultHeader(headerContent, headerText);
                        }

                        if (option.enableSorting) {
                            // Method changing sorting
                            (function (i) {
                                headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(option.columns[i].sortMemberPath);
                            })(i);

                            // Arrows
                            if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                <HTMLTableHeaderCellElement>this.addArrows(headerButtons, option, i);
                            }
                        }

                        //filter
                        this.addFilterButton(option, filterPopupContainer, headerButtons, i, false);

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
                }
                var placeholderColumn = document.createElement("th");
                placeholderColumn.classList.add("tgrid-placeholder");
                head.appendChild(placeholderColumn);

                header.appendChild(head);
            }
        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
           
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

        public updateTableDetailRow(options: Options, container: HTMLElement, item: ItemViewModel, isDetailsAdded: boolean) {
            var detailRow = container.getElementsByClassName("tgrid-details");
            if (detailRow.length > 0) {
                detailRow[0].parentNode.removeChild(detailRow[0]);
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if ((<HTMLElement>container.children.item(i))["dataContext"] == item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item)) {
                    targetRow.classList.add("selected");
                }
                else {
                    targetRow.classList.remove("selected");
                }

                if (isDetailsAdded) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildDetailsRow(options, item, detailsTemplate);
                        insertAfter(targetRow, details);
                    }
                }
            }
        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel): void {
            //if there isn't footer template in grid
            if (option.tableFooterTemplate == null && option.enablePaging) {
                this.buildDefaultTableFooterElement(option, footer, totalItemsCount);
            } else if (option.tableFooterTemplate != null) {
                var footerContainer = document.createElement("div");
                footerContainer.className = "tgrid-footer-container";
                footerContainer.setAttribute("ng-controller", "tgrid-footer-controller"); 
                option.tableFooterTemplate.applyTemplate(footerContainer);
                footer.innerHTML = "";

                angular.bootstrap(footerContainer, [(<AngularFooterViewModel>footerModel).angularModuleName]);
                footer.appendChild(footerContainer);
            }
        }

        public updateFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {
            if (option.filterPopup == null) {
                this.buildDefaultFiltringPopUp(option, filterPopup);
            } else {
                var filterPopupContainer = document.createElement("div");
                filterPopupContainer.className = "tgrid-filter-popup-container";
                filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller"); 
                option.filterPopup.applyTemplate(filterPopupContainer);
                filterPopup.innerHTML = "";

                angular.bootstrap(filterPopupContainer, [(<AngularFilterPopupViewModel>filterPopupModel).angularModuleName]);

                filterPopup.appendChild(filterPopupContainer);
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

            var appModule = angular.module(AngularHtmlProvider.angularModuleName, []);
            appModule.controller(angularItemViewModel.angularControllerName, ['$scope', function ($scope) {
                angularItemViewModel.setScope($scope);
            }])
                .directive('ngShowInFocus', function () {
                    return {
                        replace: true,
                        restrict: 'A',
                        link: function (scope, element, attr) {
                            scope.$watch(attr.ngShowInFocus, function (value) {
                                if (value) {
                                    element.css('display', 'block');
                                    element.focus();
                                } else {
                                    element.css('display', 'none');
                                }
                            });
                        }
                    };
                });
            row.setAttribute("ng-controller", angularItemViewModel.angularControllerName);

            this.appendIndent(row, option.groupBySortDescriptors.length, false);

            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("desktop") != -1) {
                    var cell = document.createElement("td");

                    var cellContent = document.createElement("div");
                    cellContent.className = "tgrid-cell-content";
                    cellContent.style.overflow = "hidden"; 
                    cell.appendChild(cellContent);
                    
                    if (option.columns[i].cell != null) {
                        option.columns[i].cell.applyTemplate(cellContent);
                    } else {
                        if (option.columns[i].member != null) {
                            this.createDefaultCell(cellContent, option.columns[i].member);
                        }
                    }
                    row.appendChild(cell);
                }              
            }
            angular.bootstrap(row, [angularModuleName]);

            row["dataContext"] = item.item;

            var placeholderColumn = document.createElement("td");
            placeholderColumn.classList.add("tgrid-placeholder");
            row.appendChild(placeholderColumn);

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        selected(item, e.ctrlKey);
                    }
                };
            })(item);

            return row;
        }

        private buildDetailsRow(option: Options, item: ItemViewModel, template: Template): HTMLElement {
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            this.appendIndent(detailTr, option.groupBySortDescriptors.length, false);

            detailTr.classList.add("tgrid-details");
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
            template.applyTemplate(detailTd);

            var angularItemViewModel = new AngularItemViewModel(null, item, null, null);
            angularItemViewModel.angularControllerName = 'tgrid-detail-controller' + AngularHtmlProvider.controllerItemCounter++;
            angular.module(AngularHtmlProvider.angularModuleName, [])
                .controller(angularItemViewModel.angularControllerName, ['$scope',function toGridDetailsController($scope) {
                    angularItemViewModel.setScope($scope);
                }]);
            detailTd.setAttribute("ng-controller", angularItemViewModel.angularControllerName); 
            detailTr.appendChild(detailTd);
            angular.bootstrap(detailTd, [AngularHtmlProvider.angularModuleName]);

            return detailTr;

        }


        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerTr = document.createElement("tr");
            var headerTd = document.createElement("td");

            this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

            var colspan = option.columns.length + 1 + option.groupBySortDescriptors.length - groupHeaderDescriptor.level;
            headerTd.setAttribute("colspan", colspan.toString());
            headerTd.classList.add("tgrid-table-group-header");
            headerTr.classList.add("tgrid-table-group-header");
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerTd);
            } else {
                headerTd = this.createDefaultGroupHeader(headerTd);
            }
            
            if (option.enableCollapsing) {
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

            var angularGroupViewModel = new AngularItemViewModel(null, groupHeaderDescriptor.value, null, null);
            angularGroupViewModel.angularControllerName = 'tgrid-groupHeader-controller' + AngularHtmlProvider.controllerItemCounter++;
            angular.module(AngularHtmlProvider.angularGroupModuleName, [])
                .controller(
                angularGroupViewModel.angularControllerName,['$scope',
                function toGridGroupHeaderController($scope) {
                    angularGroupViewModel.setScope($scope);
                }]);

            headerTd.setAttribute("ng-controller", angularGroupViewModel.angularControllerName);
            headerTr.appendChild(headerTd);
            angular.bootstrap(headerTd, [AngularHtmlProvider.angularGroupModuleName]);

            return headerTr;
        }

        private addArrows(sortArrowContainer: Node, option: Options, columnNumber: number): Node {
            if (option.sortDescriptor.asc) {
                var up = document.createElement("div");
                up.classList.add("tgrid-arrow-up");
                sortArrowContainer.appendChild(up);
            }
            if (!option.sortDescriptor.asc) {
                var down = document.createElement("div");
                down.classList.add("tgrid-arrow-down");
                sortArrowContainer.appendChild(down);
            }
            return sortArrowContainer;
        }

        private removeArrows(htmlNode: HTMLElement): void {
            var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
            for (var i = 0; i < element.length; i++) {
                element[i].parentNode.removeChild(element[i]);
                i--;
            }
            var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
            for (var i = 0; i < element.length; i++) {
                element[i].parentNode.removeChild(element[i]);
                i--;
            }
        }

        private removeFilterButtons(container: HTMLElement): void {
            var elements = container.getElementsByClassName("tgrid-filter-button");
            for (var i = 0; i < elements.length; i++) {
                elements[i].parentNode.removeChild(elements[i]);
                i--;
            }
            var elements = container.getElementsByClassName("tgrid-filter-button-active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].parentNode.removeChild(elements[i]);
                i--;
            }
        }
        // Mobile Methods
        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
           
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
            option.showDetailFor.column = -1;
        }

        public updateMobileDetailRow(options: Options, container: HTMLElement, item: ItemViewModel, shouldAddDetails: boolean): void {

            var detailRow = container.getElementsByClassName("tgrid-mobile-details");
            if (detailRow.length > 0) {
                detailRow[0].parentNode.removeChild(detailRow[0]);
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (container.children.item(i)['dataContext'] == item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item)) {
                    targetRow.classList.add("selected");
                }
                else {
                    targetRow.classList.remove("selected");
                }

                if (shouldAddDetails) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildMobileDetailsRow(options, item, detailsTemplate);
                        insertAfter(targetRow, details);
                    }
                }
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

            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                row.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
            }

            var rowTemplate = document.createElement("div");
            rowTemplate.classList.add('tgrid-mobile-div');

            if (option.mobileTemplateHtml != null) {
                option.mobileTemplateHtml.applyTemplate(rowTemplate);
            } else {
                rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option);
            }
            row.appendChild(rowTemplate);

            var angularItemViewModel = new AngularItemViewModel(item.model, item.item, item.grid, item.isGroupHeader);
            angularItemViewModel.angularControllerName = 'tgrid-mobile-row-controller' + AngularHtmlProvider.controllerItemCounter++;
            angular.module(AngularHtmlProvider.angularModuleName)
                .controller(
                angularItemViewModel.angularControllerName,['$scope',
                function toGridFooterController($scope) {
                    angularItemViewModel.setScope($scope);
                }]);

            row.setAttribute("ng-controller", angularItemViewModel.angularControllerName);
            angular.bootstrap(row, [AngularHtmlProvider.angularModuleName]);
            row["dataContext"] = item.item;

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        var s = container;
                        selected(item, e.ctrlKey);
                    }
                };
            })(item);

            return row;
        }

        public createDefaultGroupHeader(tableRowElement: any) {
            var groupHeaderContainer = document.createElement("div");
            var groupHeaderName = document.createElement("span");
            groupHeaderName.innerHTML = "{{item}}";
            groupHeaderContainer.appendChild(groupHeaderName);
            tableRowElement.appendChild(groupHeaderContainer);
            return tableRowElement;
        }

        private buildMobileDetailsRow(option: Options, item: ItemViewModel, template: Template): HTMLElement {
            var detailDiv = document.createElement("div");

            detailDiv.classList.add("tgrid-mobile-details");

            template.applyTemplate(detailDiv);

            var angularItemViewModel = new AngularItemViewModel(null, item, null, null);
            angularItemViewModel.angularControllerName = 'tgrid-detail-controller' + AngularHtmlProvider.controllerItemCounter++;
            angular.module(AngularHtmlProvider.angularModuleName, [])
                .controller(
                angularItemViewModel.angularControllerName,['$scope',
                function toGridFooterController($scope) {
                    angularItemViewModel.setScope($scope);
                }]);

            detailDiv.setAttribute("ng-controller", angularItemViewModel.angularControllerName);
           
            angular.bootstrap(detailDiv, [AngularHtmlProvider.angularModuleName]);

            return detailDiv;
        }

        public bindMobileGroupHeader(headerContainer: HTMLElement, item: any, headerDiv: HTMLElement){
           var angularGroupViewModel = new AngularItemViewModel(null, item, null, null);
            angularGroupViewModel.angularControllerName = 'tgrid-groupHeader-controller' + AngularHtmlProvider.controllerItemCounter++;
            angular.module(AngularHtmlProvider.angularGroupModuleName, [])
                .controller( angularGroupViewModel.angularControllerName,['$scope',
                function toGridGroupHeaderController($scope) {
                    angularGroupViewModel.setScope($scope);
                }]);

            headerDiv.setAttribute("ng-controller", angularGroupViewModel.angularControllerName);           
            headerContainer.appendChild(headerDiv);
            angular.bootstrap(headerDiv, [AngularHtmlProvider.angularGroupModuleName]);
        }

        private createDefaultCell(cell: HTMLElement, defaultCellBindingName: string) {
            var spanForCell = document.createElement("span");
            var textBinding = "{{item.".concat(defaultCellBindingName).concat("}}");
            spanForCell.innerHTML = textBinding;
            cell.appendChild(spanForCell);
        }

        private createDefaultMobileTemplate(rowTemplate: any, option: Options) {
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("mobile") != -1) {
                    var mobileColumnContainer = document.createElement("div");
                    var mobileColumnName = document.createElement("span");

                    if (option.columns[i].member != null) {
                        mobileColumnName.innerHTML = option.columns[i].member;
                    } else if (option.columns[i].sortMemberPath != null) {
                        mobileColumnName.innerHTML = option.columns[i].sortMemberPath;
                    } else if (option.columns[i].groupMemberPath != null) {
                        mobileColumnName.innerHTML = option.columns[i].groupMemberPath;
                    } else {
                        mobileColumnName.innerHTML = "";
                    }

                    var columnData = document.createElement("span");
                    if (option.columns[i].member != null) {
                        var columnBinding = document.createElement('span');
                        columnData.innerHTML = " : {{item." + option.columns[i].member +"}}";
                        columnData.appendChild(columnBinding);
                    } else {
                        columnData.innerHTML = ": ";
                    }
                    mobileColumnContainer.appendChild(mobileColumnName);
                    mobileColumnContainer.appendChild(columnData);
                    rowTemplate.appendChild(mobileColumnContainer);
                }
            }
            return rowTemplate;
        }
    
    }
}