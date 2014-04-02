//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// software and associated documentation files(the "Software"), to deal in the Software 
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
  
// 1. The above copyright notice and this permission notice shall be included in all 
//    copies or substantial portions of the Software.
//
// 2. Any software that fully or partially contains or uses materials covered by 
//    this license shall notify users about this notice and above copyright.The 
//    notification can be made in "About box" and / or site main web - page footer.The 
//    notification shall contain name of Tesseris Pro company and name of the Software 
//    covered by current license.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//=====================================================================================


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

        public getElementsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            var size = 0;
            var children = container.children;
            if (items == null) {
                for (var i = 0; i < children.length; i++) {
                    var child = <HTMLElement>children.item(i);
                    size += child.offsetHeight;
                }
            } else {
                for (var i = 0; i < children.length; i++) {
                    var child = <HTMLElement>children.item(i);
                    var viewModel = <ItemViewModel>(items[i]);

                    if (viewModel != null && items.indexOf(viewModel) > 0) {
                        size += child.offsetHeight;
                    }
                }
            }

            return size;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                var viewModel = <ItemViewModel>(items[i]);
                if (viewModel != null && items.indexOf(viewModel) >= 0) {
                    size += child.offsetHeight;
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
            if (option.columns.length <= 0) {
                var grid = TesserisPro.TGrid.Grid.getGridObject(header);
                grid.setColumnsFromItemsProvider();
            }

            this.updateGroupByPanel(option, groupByContainer);
            // Create table header
            var head = document.createElement("tr");

            this.appendIndent(head, option.columns.length, true);
            this.showNeededIndents(head, option.groupBySortDescriptors.length, Grid.getGridObject(header));

            var hasNotSizedColumn = false;
            if (option.columns.length > 0) {
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].device.indexOf("desktop") != -1) {
                        var headerCell = document.createElement("th");
                        headerCell.className = "tgrid-header-cell";
                        headerCell.draggable = false;

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

                        if (!option.columns[i].notSized) {
                            headerCell.style.width = option.columns[i].width.toString() + "px";
                        } else {
                            option.columns[i].resizable = false;
                            hasNotSizedColumn = true;
                        }

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
                        this.addFilterButton(option, header, filterPopupContainer, headerButtons, i);

                        if (option.columns[i].resizable) {
                            var columnResize = document.createElement("div");
                            columnResize.className = "tgrid-header-column-resize";

                            columnResize.onclick = e => e.stopImmediatePropagation();

                            (function (i, headerCell, columnResize) {
                                var documentMouseMove = null;
                                var position = 0;
                                columnResize.onmousedown = e => {
                                    e.stopImmediatePropagation();
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
                        if (hasNotSizedColumn) {
                            header.parentElement.style.tableLayout = "fixed";
                        }
                        head.appendChild(headerCell);
                    }
                }
            }
          
            var placeholderColumn = document.createElement("th");
            addClass(placeholderColumn, "tgrid-placeholder");
            if (hasNotSizedColumn) {
                placeholderColumn.style.width = "12px";
            }
            head.appendChild(placeholderColumn);
            
            header.innerHTML = "";
            header.appendChild(head);
           
        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var appModule = angular.module("TGridTbody", []);
            var angularItemsViewModel = new TesserisPro.TGrid.AngularItemsViewModel(items, option, selected);
            appModule
                .controller("TableCtrl", ['$scope', function ($scope) {
                    angularItemsViewModel.setScope($scope);
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
            var parentContainer = container.parentElement;
            parentContainer.innerHTML = "";
            container = parentContainer;
            var rowsContainer = document.createElement("tbody");
            rowsContainer.style.border = "none";
            rowsContainer.setAttribute("ng-controller", "TableCtrl");
            var row = this.appendTableElement(option, container, items, 0, selected);
            row.setAttribute("ng-repeat-start", "item in items");
            row.setAttribute("ng-class", "{'tgrid-table-body-row' : !item.isGroupHeader, 'tgrid-table-group-header':  item.isGroupHeader,'tgrid-table-body-row selected': !item.isGroupHeader && item.isSelected }");
            var action = "";
            if (isNull(option.rowClick)) {
                action = "item.select($event, item, $parent.items)";
            } else {
                action = "item.model.".concat(option.rowClick).concat("(item.item ,$event);");
            }
            row.setAttribute("ng-click", action);
            
            var detailsRow = this.buildDetailsRow(option);
           
            rowsContainer.appendChild(row);
            rowsContainer.appendChild(detailsRow);
            angular.bootstrap(rowsContainer, ["TGridTbody"]);
            container.appendChild(rowsContainer);
           
            //Hide table on mobile devices
            addClass(container, "desktop");
            return rowsContainer;
        }

        public appendTableElement(option: Options, container: HTMLElement, items:Array<ItemViewModel>, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean):HTMLTableRowElement {
            var row = document.createElement('tr');
            if (items.length > 0) {
                if (option.enableGrouping) {
                    if (items[0].isGroupHeader) {
                        this.buildGroupHeaderRow(option, items[0].item, row);
                    }
                }
                this.buildRowElement(option, items[0], container, selected, row);
            }
            return row;
        }

        private buildRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean, row: HTMLTableRowElement) {
            this.appendIndentRow(row, option.groupBySortDescriptors.length);
            var hasNotSizedColumn = false;
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("desktop") != -1) {
                    if (option.columns[i].notSized) {
                        hasNotSizedColumn = true;
                    }
                    var cell = document.createElement("td");
                    cell.setAttribute("ng-hide", "item.isGroupHeader");

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
            if (hasNotSizedColumn) {
                container.style.tableLayout = "fixed";
                container.parentElement.style.overflowY = "scroll";
            }

            row["dataContext"] = item.item;

            if (!hasNotSizedColumn) {
                var placeholderColumn = document.createElement("td");
                addClass(placeholderColumn, "tgrid-placeholder");
                placeholderColumn.setAttribute("ng-hide", "item.isGroupHeader");
                row.appendChild(placeholderColumn);
            }
        }

        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor, headerTr: HTMLTableRowElement) {
            this.appendIndentGroupHeader(headerTr, option.columns.length);
            var headerTd = document.createElement("td");
            headerTd.setAttribute("colspan", "{{item.colspan}}");
            addClass(headerTd, "tgrid-table-group-header");
            headerTd.setAttribute("ng-hide", "!item.isGroupHeader");
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerTd);
            } else {
                headerTd = this.createDefaultGroupHeader(headerTd);
            }

            if (option.enableCollapsing) {
                addClass(headerTd, "collapsing");
                headerTd.setAttribute("ng-click", "item.toggleGroupCollapsing($event, item)");
            }
            headerTr.appendChild(headerTd);
        }

        private buildDetailsRow(option: Options): HTMLTableRowElement {
            var detailTr = document.createElement("tr");
            detailTr.setAttribute("ng-repeat-end", "");
            detailTr.setAttribute("ng-hide", "!item.showDetail");
            
            var indentsAreAppended = false;
            if (isNotNull(option.detailsTemplateHtml)) {
                var detailTd = document.createElement("td");
                this.appendIndentRow(detailTr, option.groupBySortDescriptors.length);
                indentsAreAppended = true;
                addClass(detailTr, "tgrid-details");
                detailTd.setAttribute("colspan", "{{item.detailsColspan}}");
                detailTd.setAttribute("ng-hide", "item.showDetailFor.item != item || item.showDetailFor.column != -1");
                option.detailsTemplateHtml.applyTemplate(detailTd);
                detailTr.appendChild(detailTd);
            }
            for (var i = 0; i < option.columns.length; i++) {
                if (isNotNull(option.columns[i].cellDetail)) {
                    var detailTd = document.createElement("td");
                    if (!indentsAreAppended) {
                        this.appendIndentRow(detailTr, option.groupBySortDescriptors.length);
                        indentsAreAppended = true;
                    }

                    addClass(detailTr, "tgrid-details");
                    detailTd.setAttribute("colspan", "{{item.detailsColspan}}");
                    detailTd.setAttribute("ng-hide", "item.showDetailFor.item != item || item.showDetailFor.column !=".concat(i.toString()));
                    option.columns[i].cellDetail.applyTemplate(detailTd);
                    detailTr.appendChild(detailTd);
                }
            }
            return detailTr;
        }

        public updateTableDetailRow(options: Options, container: HTMLElement, item: ItemViewModel, isDetailsAdded: boolean) {
           
        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel): void {
            //if there isn't footer template in grid
            if (option.tableFooterTemplate == null && option.enablePaging) {
                this.buildDefaultTableFooterElement(option, footer, totalItemsCount);
            } else if (option.tableFooterTemplate != null) {
                if (!footer.hasChildNodes()) {
                    var footerContainer = document.createElement("div");
                    footerContainer.className = "tgrid-footer-container";
                    footerContainer.setAttribute("ng-controller", "tgrid-footer-controller");
                    option.tableFooterTemplate.applyTemplate(footerContainer);

                    angular.bootstrap(footerContainer, [(<AngularFooterViewModel>footerModel).angularModuleName]);
                    footer.appendChild(footerContainer);
                }
                else
                {
                    (<AngularFooterViewModel>footerModel).apply();
                }
            } else {
                footer.innerHTML = "";
            }
        }

        public updateFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {
            if (option.filterPopup == null) {
                var filterPopupContainer = document.createElement("div");
                filterPopupContainer.className = "tgrid-filter-popup-container";
                filterPopupContainer.setAttribute("ng-controller", "tgrid-filter-popup-controller");
                this.buildDefaultFilteringPopUp(option, filterPopupContainer);
                angular.bootstrap(filterPopupContainer, [(<AngularFilterPopupViewModel>filterPopupModel).angularModuleName]);

                filterPopup.appendChild(filterPopupContainer);
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
        private addArrows(sortArrowContainer: Node, option: Options, columnNumber: number): Node {
            if (option.sortDescriptor.asc) {
                var up = document.createElement("div");
                addClass(up,"tgrid-arrow-up");
                sortArrowContainer.appendChild(up);
            }
            if (!option.sortDescriptor.asc) {
                var down = document.createElement("div");
                addClass(down, "tgrid-arrow-down");
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
            var appModule = angular.module("TGrid1", []);
            var angularItemsViewModel = new TesserisPro.TGrid.AngularItemsViewModel(items, option, selected);
            appModule
                .controller("TableCtrl", ['$scope', function ($scope) {
                    angularItemsViewModel.setScope($scope);
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
            var rowsContainer = document.createElement('div');
            var mobileContainer = document.createElement('div');
            rowsContainer.setAttribute("ng-controller", "TableCtrl");
            mobileContainer = this.appendMobileTableElement(option, container, items, 0, selected);
            mobileContainer.setAttribute("ng-repeat-start", "item in items");
            mobileContainer.setAttribute("ng-class", "{'tgrid-mobile-row' : !item.isGroupHeader, 'tgrid-mobile-group-header':  item.isGroupHeader,'tgrid-mobile-row selected': !item.isGroupHeader && item.isSelected }");
            mobileContainer.setAttribute("ng-click", "item.select($event, item, $parent.items)")
            rowsContainer.appendChild(mobileContainer);
            var detailsRow = this.buildMobileDetailsRow(option);
            rowsContainer.appendChild(detailsRow);

            angular.bootstrap(rowsContainer, ["TGrid1"]);
            container.appendChild(rowsContainer);
           
            //Hide table on mobile devices
            addClass(container, "mobile");
            option.showDetailFor.column = -1;
        }

        public appendMobileTableElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLDivElement {
            var mobileRow = document.createElement('div');
            if (items.length > 0) {
                if (option.enableGrouping) {
                    if (items[0].isGroupHeader) {
                        this.buildMobileGroupHeaderRow(option, items[0].item, mobileRow);
                    }
                }
                this.buildMobileRowElement(option, items[0].item, container, selected, mobileRow);
            }
            return mobileRow;
        }

        private buildMobileGroupHeaderRow(option: Options, item: any, mobileRow: HTMLDivElement){
            this.appendIndentMobileGroupHeader(mobileRow, option.columns.length);

            var headerDiv = document.createElement("div");
            headerDiv.setAttribute("ng-hide", "!item.isGroupHeader");
            if (option.enableCollapsing) {
                addClass(headerDiv, "collapsing");
                headerDiv.setAttribute("ng-click", "item.toggleGroupCollapsing($event, item)");
            }

            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerDiv);
            } else {
                this.createDefaultGroupHeader(headerDiv);
            }

            addClass(headerDiv, 'tgrid-mobile-group-header-container');
            mobileRow.appendChild(headerDiv);
        }
        public appendIndentMobileGroupHeader(target: HTMLElement, level: number) {
            for (var i = 0; i < level; i++) {
                var indentDiv = document.createElement("div");
                indentDiv.className = "tgrid-mobile-group-indent-div";
                indentDiv.setAttribute("ng-hide", "!item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                target.appendChild(indentDiv);
            }
        }

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean, mobileRow: HTMLDivElement) {
            this.appendIndentMobileRow(mobileRow, option.groupBySortDescriptors.length);

            var rowTemplate = document.createElement("div");
            rowTemplate.setAttribute("ng-hide", "item.isGroupHeader");
            rowTemplate.className = "tgrid-mobile-div";

            if (option.mobileTemplateHtml != null) {
                option.mobileTemplateHtml.applyTemplate(rowTemplate);
            } else {
                rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option);
            }
            mobileRow.appendChild(rowTemplate);

            mobileRow["dataContext"] = item.item;
        }
        
        private appendIndentMobileRow(target: HTMLElement, level: number){
            for (var i = 0; i < level; i++) {
                var indentDiv = document.createElement("div");
                indentDiv.className = "tgrid-mobile-row-indent-div";
                indentDiv.setAttribute("ng-hide", "item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                target.appendChild(indentDiv);
            }
        }

        private buildMobileDetailsRow(option: Options): HTMLDivElement {
            var mobileDetailsContainer = document.createElement("div");
            mobileDetailsContainer.setAttribute("ng-repeat-end", "");
            mobileDetailsContainer.setAttribute("ng-hide", "!item.showDetail");
            addClass(mobileDetailsContainer, "tgrid-mobile-details");
            var indentsAreAppended = false;
            if (isNotNull(option.detailsTemplateHtml)) {
                var detailRowMobile = document.createElement("div");
                this.appendIndentMobileRow(mobileDetailsContainer, option.groupBySortDescriptors.length);
                indentsAreAppended = true;
                detailRowMobile.setAttribute("ng-hide", "item.showDetailFor.item != item || item.showDetailFor.column != -1");
                option.detailsTemplateHtml.applyTemplate(detailRowMobile);
                mobileDetailsContainer.appendChild(detailRowMobile);
            }
            for (var i = 0; i < option.columns.length; i++) {
                if (isNotNull(option.columns[i].cellDetail)) {
                    var detailCellMobile = document.createElement("div");
                    if (!indentsAreAppended) {
                        this.appendIndentMobileRow(mobileDetailsContainer, option.groupBySortDescriptors.length);
                        indentsAreAppended = true;
                    }

                    addClass(mobileDetailsContainer, "tgrid-details");
                    detailCellMobile.setAttribute("ng-hide", "item.showDetailFor.item != item || item.showDetailFor.column !=".concat(i.toString()));
                    option.columns[i].cellDetail.applyTemplate(detailCellMobile);
                    mobileDetailsContainer.appendChild(detailCellMobile);
                }
            }
            return mobileDetailsContainer;
        }

        public createDefaultGroupHeader(tableRowElement: any) {
            var groupHeaderContainer = document.createElement("div");
            var groupHeaderName = document.createElement("span");
            groupHeaderName.innerHTML = "{{item.item.value}}";
            groupHeaderContainer.appendChild(groupHeaderName);
            tableRowElement.appendChild(groupHeaderContainer);
            return tableRowElement;
        }

        private createDefaultCell(cell: HTMLElement, defaultCellBindingName: string) {
            var spanForCell = document.createElement("span");
            var textBinding = "{{item.item.".concat(defaultCellBindingName).concat("}}");
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
                        columnData.innerHTML = ": {{item.item." + option.columns[i].member +"}}";
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
        private buildDefaultFilteringPopUp(option: Options, filterPopupContainer: HTMLElement) {
            var columnNameContainer = document.createElement("div");
            var columnName = document.createElement("span");
            columnName.innerHTML = "{{path}}";
            columnNameContainer.appendChild(columnName);
            filterPopupContainer.appendChild(columnNameContainer);

            var filterCondition = document.createElement("select");
            // append filter conditions
            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.None.toString();
            selectOption.text = "None";
            filterCondition.appendChild(selectOption);

            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.Equals.toString();
            selectOption.text = "Equals";
            filterCondition.appendChild(selectOption);

            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.NotEquals.toString();
            selectOption.text = "Not equals";
            filterCondition.appendChild(selectOption);
            // end append filter conditions
            filterPopupContainer.appendChild(filterCondition);
            filterCondition.selectedIndex = 1;

            var filterText = document.createElement("input");
            filterText.type = "text";
            filterText.className = 'tgrid-filter-input-text';
            filterText.setAttribute("value", "");
            filterText.style.width = '150px';
            filterPopupContainer.appendChild(filterText);

            filterPopupContainer.innerHTML += "<br>";

            var applyButton = document.createElement("div");
            applyButton.className = "tgrid-filter-popup-button";
            applyButton.style.width = '70px';
            applyButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onApply();
            };
            (<HTMLElement>applyButton).innerHTML = "OK";
            filterPopupContainer.appendChild(applyButton);


            var clearButton = document.createElement("div");
            clearButton.className = 'tgrid-filter-popup-button';
            clearButton.style.width = '70px';
            clearButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onClose();
                filterText.setAttribute("value", "");
            };
            (<HTMLElement>clearButton).innerHTML = 'Cancel';
            filterPopupContainer.appendChild(clearButton);
        }

        private appendIndentRow(target: HTMLElement, level: number) {
            for (var i = 0; i < level; i++) {
                var cell = document.createElement("td");
                cell.className = "tgrid-table-indent-cell";
                cell.setAttribute("ng-hide", "item.isGroupHeader");
                var indentContent = document.createElement("div");
                indentContent.className = "tgrid-table-indent-cell-content";
                cell.appendChild(indentContent);
                target.appendChild(cell);
            }
        }
        private appendIndentGroupHeader(target: HTMLElement, level: number) {
            for (var i = 0; i < level; i++) {
                var cell = document.createElement("td");
                cell.className = "tgrid-table-indent-cell";
                cell.setAttribute("ng-hide", "!item.isGroupHeader || ".concat(i.toString()).concat(" >= item.item.level"));
                var indentContent = document.createElement("div");
                indentContent.className = "tgrid-table-indent-cell-content";
                cell.appendChild(indentContent);
                target.appendChild(cell);
            }
        }

    
    }
}