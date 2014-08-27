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
/// <reference path="../utils.ts" />
/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="AngularFooterViewModel.ts" />
/// <reference path="AngularItemViewModel.ts" />

module TesserisPro.TGrid {

    export class AngularHtmlProvider extends BaseHtmlProvider {
        // Table Methods

        public getElementsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            var size = 0;
            var children = container.children;

            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                if (!containsClass(child, "ng-hide")) {
                    var viewModel = <any>angular.element(child).scope() != undefined ? (<any>angular.element(child).scope()["viewModel"]) : null;

                    if (isNotNoU(viewModel) && (items == null || items.indexOf(viewModel) >= 0)) {
                        size += child.offsetHeight;
                    }
                }
            }

            return size;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            var size = 0;
            var children = container.children;

            for (var i = 0, j = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                if (!containsClass(child, "ng-hide")) {
                    var viewModel = <any>angular.element(child).scope() != undefined ? (<any>angular.element(child).scope()).viewModel : null;
                    if (isNotNoU(viewModel) && items.indexOf(viewModel) >= 0) {
                        size += child.offsetHeight;

                        if (size > scrollTop) {
                            return viewModel;
                        }
                    }
                }
            }

            return null;
        }

        public getVisibleItemsCount(container: HTMLElement, view: HTMLElement, scrollTop: number, skipGroupHeaders: boolean): number {
            var size = 0;
            var visibleItemsCount = 0;
            var children = container.children;

            var visibleItemsSize = 0;
            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                                
                if (!containsClass(child, "ng-hide")) {
                    size += child.offsetHeight;

                    if (size > scrollTop) {
                        if (!skipGroupHeaders || !containsClass(child, "tgrid-table-group-header")) {
                            visibleItemsCount++;
                        }
                        visibleItemsSize += child.offsetHeight;
                    }
                }

                if (visibleItemsSize >= view.clientHeight) {
                    break;
                }
            }

            return visibleItemsCount;
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
         
        public getFilterPopupViewModel(container: HTMLElement): AngularFilterPopupViewModel {
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
                        headerButtons.className = "tgrid-header-cell-buttons";
                        headerMainContainer.appendChild(headerContent);
                        headerMainContainer.appendChild(headerButtons);
                        headerCell.appendChild(headerMainContainer);

                        if (!option.columns[i].notSized) {
                            headerCell.style.width = option.columns[i].width.toString() + "px";
                        } else {
                            option.columns[i].resizable = false;
                        }

                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(headerContent);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                            this.buildDefaultHeader(headerContent, headerText);
                        }

                        if (option.enableSorting && option.columns[i].enableSorting) {
                            // Method changing sorting
                            (function (i) {
                                headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(option.columns[i].sortMemberPath);
                            })(i);

                            // Arrows
                            if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                <HTMLTableHeaderCellElement>this.addArrows(headerButtons, option, i);
                            }
                        }
                        if (option.enableFiltering && option.columns[i].enableFiltering) {
                            //filter
                            this.addFilterButton(option, header, filterPopupContainer, headerButtons, i);
                        }
                        if (option.columns[i].resizable) {
                            var columnResize = document.createElement("div");
                            columnResize.className = "tgrid-header-column-resize";

                            columnResize.onclick = e => e.stopImmediatePropagation();
                            var self = this;
                            (function (i, headerCell, columnResize) {
                                var documentMouseMove = null;
                                var position = 0;
                                columnResize.onmousedown = e => {
                                    e.stopImmediatePropagation();
                                    position = e.screenX;
                                    documentMouseMove = document.onmousemove;
                                    document.onmousemove = m => {
                                        if (position != 0) {
                                            if (option.columns[i].width.indexOf("%") == -1) {
                                                var width = parseInt(option.columns[i].width);
                                            } else {
                                                var gridWidth = self.getGridWidth(header);
                                                var percentInt = parseInt(option.columns[i].width.substring(0, option.columns[i].width.indexOf("%")));
                                                var width = gridWidth * percentInt / 100;
                                            }
                                            option.columns[i].width = (width + m.screenX - position).toString();
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
                        if (option.hasAnyNotSizedColumn) {
                            header.parentElement.style.tableLayout = "fixed";
                        }
                        head.appendChild(headerCell);
                    }
                }
            }         
            
            var scrollWidth = this.getScrollWidth();
            var placeholderColumn = document.createElement("th");
            if (option.hasAnyNotSizedColumn) {
                addClass(placeholderColumn, "tgrid-placeholder-width");
                placeholderColumn.style.width = (scrollWidth - 3).toString() + 'px';
            } else {
                addClass(placeholderColumn, "tgrid-placeholder");
                placeholderColumn.style.minWidth = (scrollWidth).toString() + 'px';
            }
            head.appendChild(placeholderColumn);

            header.innerHTML = "";
            header.appendChild(head);
        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            container.innerHTML = "";

            if (option.hasAnyNotSizedColumn) {
                var tgridTableBodyContainer = container.parentElement.parentElement;
                var tgridTable = container.parentElement;
                tgridTable.style.tableLayout = "fixed";
                tgridTableBodyContainer.style.overflowY = "scroll";
            }
                                    
            var scope = angular.element(container).scope();
            
            //foreach
            for (var i = 0; i < items.length; i++) {
                // Prepare child scope
                var childScope = this.buildRowScope(option, scope, items[i]);
                angular.extend(childScope, { item: items[i].item, viewModel: items[i] });

                if (items[i].isGroupHeader) {
                    var rowTemplate = this.buildGroupHeaderRow(option, items[i].item);
                    var row = <HTMLTableRowElement>rowTemplate(childScope)[0];

                    if (option.enableCollapsing) {
                        addClass(row, "collapsing");
                        if (!items[i].item.collapse) {
                            row.onclick = (e) => {
                                var item = angular.element(e.target).scope()["item"];
                                TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(item.filterDescriptor);
                            }
                        } else {
                            row.onclick = (e) => {
                                var item = angular.element(e.target).scope()["item"];
                                TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(item.filterDescriptor);
                            }
                        }
                    }
                     
                    container.appendChild(row);
                } else {
                    var rowTemplate = this.buildRowTemplate(option, items[i]);
                    
                    var row = <HTMLTableRowElement>rowTemplate(childScope)[0];  //this.appendTableElement(option, container, items[i], 0, selected);

                    row["dataContext"] = items[i].item;
                    //row.setAttribute("ng-repeat-start", "item in items");
                    addClass(row, "tgrid-table-body-row");
               
                    if (option.isSelected(items[i].item)) {
                        addClass(row, "selected");
                    }

                    if (isNull(option.rowClick)) {
                        (function (item) {
                            row.onclick = function (e) {
                                if (option.selectionMode != SelectionMode.None) {
                                    var itemViewModel = angular.element(e.target).scope()["viewModel"];
                                    selected(itemViewModel, e.ctrlKey);
                                }
                            };
                        })(items[i].item);
                    } 

                    container.appendChild(row);
                }
        
            }
            //foreach end
            var phase = scope.$$phase;
            if (phase != '$apply' && phase != '$digest') {
                scope.$apply();
            }
            //Hide table on mobile devices
            addClass(container, "desktop");
            return container;
        }

        private buildRowScope(options: Options, parentScope: any, viewModel: ItemViewModel): any {
            var childScope = parentScope.$new(true);
            angular.extend(
                childScope,
                {
                    item: viewModel.item,
                    viewModel: viewModel,
                    options: options
                });

            return childScope;
        }

        private buildRowTemplate(option: Options, item: ItemViewModel): any {
            var row = document.createElement('tr');
            this.appendIndent(row, option.groupBySortDescriptors.length, false);
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("desktop") != -1) {
                    var cell = document.createElement("td");
                    //cell.setAttribute("ng-hide", "item.isGroupHeader");
                    cell.className = "tgrid-table-data-cell";
                    var cellContent = document.createElement("div");
                    cellContent.className = "tgrid-cell-content";
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

            if (!option.hasAnyNotSizedColumn) {
                var placeholderColumn = document.createElement("td");
                addClass(placeholderColumn, "tgrid-placeholder");
                addClass(placeholderColumn, "tgrid-table-data-cell");
                placeholderColumn.setAttribute("ng-hide", "item.isGroupHeader");
                row.appendChild(placeholderColumn);
            }

            if (isNotNull(option.rowClick)) {
                row.setAttribute("ng-click", "viewModel.model.".concat(option.rowClick).concat("(item ,$event)"));
            }

            return (<any>option).compile(row.outerHTML);
        }
        
        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): any {
            var groupRow = document.createElement("tr");
            this.appendIndent(groupRow, groupHeaderDescriptor.level, false);
            var headerTd = document.createElement("td");
            var colspan = option.columns.length + 1 + option.groupBySortDescriptors.length - groupHeaderDescriptor.level;
            headerTd.setAttribute("colspan", colspan.toString());
            addClass(headerTd, "tgrid-table-group-header");
            addClass(groupRow, "tgrid-table-group-header");
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerTd);
            } else {
                headerTd = this.createDefaultGroupHeader(headerTd);
            }

            groupRow.appendChild(headerTd);
            return (<any>option).compile(groupRow.outerHTML);
        }

        private buildDetailsRow(option: Options, template: Template): HTMLTableRowElement {

            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            this.appendIndent(detailTr, option.groupBySortDescriptors.length, false);

            addClass(detailTr, "tgrid-details");
            var detailsColspan = option.hasAnyNotSizedColumn ? option.columns.length : option.columns.length + 1;
            detailTd.setAttribute("colspan", detailsColspan.toString());

            template.applyTemplate(detailTd)

            detailTr.appendChild(detailTd);
                        
            return detailTr;
        }

        public updateTableDetailRow(options: Options, container: HTMLElement, item: ItemViewModel) {
            var detailRow = container.getElementsByClassName("tgrid-details");
            if (detailRow.length > 0) {
                var itemWithDetails = angular.element(detailRow[0]).scope()["item"];
                if (options.showDetailFor.item != itemWithDetails|| options.showDetailFor.item == item.item) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (angular.element(<HTMLElement>container.children.item(i)).scope()["item"] == item.item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item.item)) {
                    addClass(targetRow, "selected");
                }
                else {
                    removeClass(targetRow, "selected");
                }

                //var detailRow = container.getElementsByClassName("tgrid-details");
                if (options.showDetailFor.item == item.item) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildDetailsRow(options, detailsTemplate);
                        var childScope = this.buildRowScope(options, angular.element(container).scope(), item);
                        insertAfter(targetRow, (<any>options).compile(details.outerHTML)(childScope)[0]);
                    }
                }
            }
            //

            //this.angularItemsViewModel.setItemSelection(item, options.isSelected(item.item));
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
              
        // Mobile Methods
        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
           
            var scope = angular.element(container).scope();

            for (var i = 0; i < items.length; i++) {
                this.appendMobileElement(option, container, items[i], 0, selected, scope);
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

            var phase = scope.$$phase;
            if (phase != '$apply' && phase != '$digest') {
                scope.$apply();
            }
        }


        private appendMobileElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean, scope): void {
            // Prepare child scope
            var childScope = this.buildRowScope(option, scope, item);
            angular.extend(childScope, { item: item.item, viewModel: item });

            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;
            if (item.isGroupHeader) {
                var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                var rowTemplate = (<any>option).compile(mobileGroupHeader.outerHTML);
                var rowElement = rowTemplate(childScope)[0];
                if (option.enableCollapsing) {
                    if (!item.item.collapse) {
                        rowElement.onclick = (e) => {
                            var item = angular.element(e.target).scope()["item"];
                            TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(item.filterDescriptor);
                        }
                    } else {
                        rowElement.onclick = (e) => {
                            var item = angular.element(e.target).scope()["item"];
                            TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(item.filterDescriptor);
                        }
                    }
                }
                container.appendChild(rowElement);
            } else {
                var row = this.buildMobileRowElement(option, item, container, selected, scope);
                container.appendChild(row);
            }
        }
               
        public updateMobileDetailRow(options: Options, container: HTMLElement, item: ItemViewModel): void {

            var scope = angular.element(container).scope();
            var childScope = this.buildRowScope(options, scope, item);
            angular.extend(childScope, { item: item.item, viewModel: item });

            var detailRow = container.getElementsByClassName("tgrid-mobile-details");
            if (detailRow.length > 0) {
                var itemWithDetails = angular.element(detailRow[0]).scope()["item"];
                if (options.showDetailFor.item != itemWithDetails || options.showDetailFor.item == item.item) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (angular.element(<HTMLElement>container.children.item(i)).scope()["item"] == item.item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item.item)) {
                    addClass(targetRow, "selected");
                }
                else {
                    removeClass(targetRow, "selected");
                }

                // if (shouldAddDetails) {
                if (options.showDetailFor.item == item.item) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildMobileDetailsRow(options, detailsTemplate, childScope);
                            
                        insertAfter(targetRow, details);
                        var scope = angular.element(container).scope();
                        var phase = scope.$$phase;
                        if (phase != '$apply' && phase != '$digest') {
                            scope.$apply();
                        }              
                    }
                }
            }
        }
               
        private appendIndentMobileGroupHeader(target: HTMLElement, level: number) {
            for (var i = 0; i < level; i++) {
                var indentDiv = document.createElement("div");
                indentDiv.className = "tgrid-mobile-group-indent-div";
                indentDiv.setAttribute("ng-hide", "!item.isGroupHeader || ".concat(i.toString()).concat(" >= item.level"));
                target.appendChild(indentDiv);
            }
        }

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean, scope: any): HTMLElement {

            // Prepare child scope
            var childScope = this.buildRowScope(option, scope, item);
            angular.extend(childScope, { item: item.item, viewModel: item });

            var rowElement = document.createElement("div");
            addClass(rowElement, "tgrid-mobile-row");
            if (isNotNull(option.rowClick)) {
                rowElement.setAttribute("ng-click", "$parent.".concat(option.rowClick).concat("(item, $event);"));
            }

            if (option.isSelected(item.item)) {
                addClass(rowElement, "selected");
            }

            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                rowElement.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
            }

            var rowContent = document.createElement("div");
            addClass(rowContent, 'tgrid-mobile-div');
            if (option.mobileTemplateHtml != null) {
                option.mobileTemplateHtml.applyTemplate(rowContent);
            } else {
                this.createDefaultMobileTemplate(rowContent, option);
            }
                        
            rowElement.appendChild(rowContent);

            var rowTemplate = (<any>option).compile(rowElement.outerHTML);

            var row = rowTemplate(childScope)[0];

            if (isNull(option.rowClick)) {
                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectionMode != SelectionMode.None) {
                            var s = container;
                            selected(item, e.ctrlKey);
                        }
                    };
                })(item);
            }

            return row;
        }
            
        private buildMobileDetailsRow(option: Options, template: Template, childScope: any): HTMLDivElement {
            var detailDiv = document.createElement("div");
            addClass(detailDiv, "tgrid-mobile-details");
            template.applyTemplate(detailDiv);
            return (<any>option).compile(detailDiv.outerHTML)(childScope)[0];
        }

        public createDefaultGroupHeader(tableRowElement: any) {
            var groupHeaderContainer = document.createElement("div");
            var groupHeaderName = document.createElement("span");
            groupHeaderName.innerHTML = "{{item.value}}";
            groupHeaderContainer.appendChild(groupHeaderName);
            tableRowElement.appendChild(groupHeaderContainer);
            return tableRowElement;
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
                        columnData.innerHTML = ": {{item." + option.columns[i].member +"}}";
                        columnData.appendChild(columnBinding);
                    } else {
                        columnData.innerHTML = ": ";
                    }
                    mobileColumnContainer.appendChild(mobileColumnName);
                    mobileColumnContainer.appendChild(columnData);
                    rowTemplate.appendChild(mobileColumnContainer);
                }
            }
        }

        private buildDefaultFilteringPopUp(option: Options, filterPopupContainer: HTMLElement) {

            var filterHeader = document.createElement("div");
            filterHeader.className = "filterHeader";
            filterPopupContainer.appendChild(filterHeader);

            var filterName = document.createElement("span");
            filterName.appendChild(document.createTextNode("{{path }}"));
            filterHeader.appendChild(filterName);

            var closeConteiner = document.createElement("div");
            closeConteiner.className = "closeConteiner";
            closeConteiner.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onClose();
            };
            filterHeader.appendChild(closeConteiner);

            var filterCondition = document.createElement("select");
            filterCondition.setAttribute("ng-model", "condition");
            filterCondition.setAttribute("ng-options", "condition.value as condition.name for condition in availableConditions");
            filterCondition.className = "grid-filter-popup-options";
            filterPopupContainer.appendChild(filterCondition);

            var filterText = document.createElement("input");
            filterText.type = "text";
            filterText.setAttribute("ng-model", "value");
            filterText.className = "grid-filter-popup-path";
            filterPopupContainer.appendChild(filterText);

            var caseSensitiveInput = document.createElement("input");
            caseSensitiveInput.type = "checkbox";
            caseSensitiveInput.setAttribute("ng-model", "caseSensitive");
            caseSensitiveInput.className = "grid-filter-popup-casesens";

            var caseSensitiveLabel = document.createElement("label");
            caseSensitiveLabel.className = "grid-filter-popup-casesens-label";
            caseSensitiveLabel.appendChild(caseSensitiveInput);
            caseSensitiveLabel.appendChild(document.createTextNode("Case sensitive"));
            filterPopupContainer.appendChild(caseSensitiveLabel);

            var buttonsContainer = document.createElement("div");
            buttonsContainer.className = "tgrid-filter-popup-buttons-container";

            var applyButton = document.createElement("div");
            applyButton.className = "tgrid-filter-popup-button";
            applyButton.style.width = '70px';
            applyButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onApply();
            };
            (<HTMLElement>applyButton).innerHTML = "Filter";

            var clearButton = document.createElement("div");
            clearButton.className = 'tgrid-filter-popup-button';
            clearButton.style.width = '70px';
            clearButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onClear();
            };
            (<HTMLElement>clearButton).innerHTML = 'Clear';

            buttonsContainer.appendChild(applyButton);
            buttonsContainer.appendChild(clearButton);
            

            filterPopupContainer.appendChild(buttonsContainer);
            
        }
    }
}