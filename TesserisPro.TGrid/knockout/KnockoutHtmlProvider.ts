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
/// <reference path="../IFooterViewModel.ts" />
/// <reference path="KnockoutFilterPopupViewModel.ts" />
/// <reference path="KnockoutFooterViewModel.ts" />


module TesserisPro.TGrid {

    export class KnockoutHtmlProvider extends BaseHtmlProvider {

        // Table Methods

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public getElementsSize (container: HTMLElement, items: Array<ItemViewModel>): number {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                var viewModel = <ItemViewModel>(ko.contextFor(child).$root);

                if (viewModel != null && (items == null || items.indexOf(viewModel) >= 0)) {
                    size += child.offsetHeight;
                }
            }

            return size;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                var viewModel = <ItemViewModel>(ko.contextFor(child).$root);
                if (viewModel != null && items.indexOf(viewModel) >= 0) {
                    size += child.offsetHeight;
                }
                if (size > scrollTop) {
                    return viewModel;
                }
            }

            return null;
        }

        public getFooterViewModel(grid: any) {
            var knockoutFooterViewModel = new KnockoutFooterViewModel(0, 0, 0, 0, grid);
            return knockoutFooterViewModel;
        }

        public getFilterPopupViewModel(container: HTMLElement) {
            var filterPopupViewModel = new KnockoutFilterPopupViewModel(container, this.onCloseFilterPopup);
            return filterPopupViewModel;
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

                        // Arrows
                        if (option.enableSorting && option.columns[i].enableSorting) {
                            // Method changing sorting
                            (function (i) {
                                headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(option.columns[i].sortMemberPath);
                            })(i);
                            if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                this.addArrows(headerButtons, option, i);
                            }
                        }
                        if (option.enableFiltering && option.columns[i].enableFiltering) {
                            // Filter
                            this.addFilterButton(option, header, filterPopupContainer, headerButtons, i);
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
                        if (option.hasAnyNotSizedColumn) {
                            header.parentElement.style.tableLayout = "fixed";
                        }
                        head.appendChild(headerCell);
                    }
                }
            }

           
            var placeholderColumn = document.createElement("th");            
            if (option.hasAnyNotSizedColumn) {
                addClass(placeholderColumn, "tgrid-placeholder-width");
            } else {
                addClass(placeholderColumn, "tgrid-placeholder");
            }
            head.appendChild(placeholderColumn);
            
            
            header.innerHTML = "";
            header.appendChild(head);
            ko.applyBindings(option.parentViewModel, head);

        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
           
            for (var i = 0; i < items.length; i++) {
                this.appendTableElement(option, container, items[i], 0, selected);
            }
            
            //Hide table on mobile devices
            addClass(container, "desktop");
            return container;
        }

        public updateTableDetailRow(options: Options, container: HTMLElement, item: ItemViewModel) {
             
            var detailRow = container.getElementsByClassName("tgrid-details");
            if (detailRow.length > 0) {
                var itemWithDetails = ko.contextFor(detailRow[0]).$data;
                if (options.showDetailFor.item != itemWithDetails.item || options.showDetailFor.item == item.item) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (ko.contextFor(<HTMLElement>container.children.item(i)).$data.item == item.item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item.item)) {
                    addClass(targetRow,"selected");
                }
                else {
                    removeClass(targetRow,"selected");
                }

                //var detailRow = container.getElementsByClassName("tgrid-details");
                if (options.showDetailFor.item == item.item) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildDetailsRow(options, detailsTemplate);
                        insertAfter(targetRow, details);
                        ko.applyBindings(item, details);
                    }
                }
            }
        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel): void {
            //if there isn't footer template in grid
            if (option.tableFooterTemplate == null && option.enablePaging) {
                this.buildDefaultTableFooterElement(option, footer, totalItemsCount);
            } else if (option.tableFooterTemplate != null) {
                if (!footer.hasChildNodes()) {
                    var footerContainer = document.createElement("div");
                    option.tableFooterTemplate.applyTemplate(footerContainer);
                    ko.applyBindings(footerModel, footerContainer);
                    footer.appendChild(footerContainer);
                }
            } else {
                footer.innerHTML = "";
            }
        }

        public updateFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {
            if (option.filterPopup == null) {
                this.buildDefaultFilteringPopUp(option, filterPopup);
            } else {
                var filterContainer = document.createElement("div");
                filterContainer.className = "tgrid-filter-popup-container";
                option.filterPopup.applyTemplate(filterContainer);
                filterPopup.innerHTML = "";
                filterPopup.appendChild(filterContainer);
            }
            ko.applyBindings(filterPopupModel, filterPopup);
        }

        private appendTableElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;

            if (item.isGroupHeader) {
                var groupHeader = this.buildGroupHeaderRow(option, item.item);
                container.appendChild(groupHeader);
                ko.applyBindings(item, groupHeader);
            } else {
                var row = this.buildRowElement(option, item, container, selected);

                container.appendChild(row);
                ko.applyBindings(item, row);
            }
        }


        private buildRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("tr");
            if (isNotNull(option.rowClick)) {
                row.setAttribute("data-bind", "click:function(event){model.".concat(option.rowClick).concat("(item, event);}"));
            }
            addClass(row,"tgrid-table-body-row");

            if (option.isSelected(item.item)) {
                addClass(row,"selected");
            }

            this.appendIndent(row, option.groupBySortDescriptors.length, false);
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("desktop") != -1) {
                    var cell = document.createElement("td");
                    addClass(cell, "tgrid-table-data-cell");
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
            if (option.hasAnyNotSizedColumn) {
                container.parentElement.style.tableLayout = "fixed";
                container.parentElement.parentElement.style.overflowY = "scroll";
            } else {
                var placeholderColumn = document.createElement("td");
                addClass(placeholderColumn, "tgrid-placeholder");
                addClass(placeholderColumn, "tgrid-table-data-cell");

                row.appendChild(placeholderColumn);
            }

            if (isNull(option.rowClick)) {
                (function (item) {
                    row.onclick = function (e) {
                        if (option.selectionMode != SelectionMode.None) {
                            selected(item, e.ctrlKey);
                        }
                    };
                })(item);
            }
            return row;
        }

        private buildDetailsRow(option: Options, template: Template): HTMLElement {
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

        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {

            var headerTr = document.createElement("tr");
            var headerTd = document.createElement("td");

            this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

            var colspan = option.columns.length + 1 + option.groupBySortDescriptors.length - groupHeaderDescriptor.level;
            headerTd.setAttribute("colspan", colspan.toString());
            addClass(headerTd,"tgrid-table-group-header");
            addClass(headerTr,"tgrid-table-group-header");
            if (option.enableCollapsing) {
                addClass(headerTr,"collapsing");
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
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerTd);//(!groupHeaderDescriptor.collapse ? "close" : "open") +
            } else {
                this.createDefaultGroupHeader(headerTd);
            }


            headerTr.appendChild(headerTd);

            return headerTr;
        }

        private addArrows(sortArrowContainer: Node, option: Options, columnNumber: number) {
            if (option.sortDescriptor.asc) {
                var up = document.createElement("div");
                addClass(up,"tgrid-arrow-up");
                sortArrowContainer.appendChild(up);
            }
            if (!option.sortDescriptor.asc) {
                var down = document.createElement("div");
                addClass(down,"tgrid-arrow-down");
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
            for (var i = 0; i < element.length; i++){
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
        }

        public updateMobileDetailRow(options: Options, container: HTMLElement, item: ItemViewModel): void {
            
            var detailRow = container.getElementsByClassName("tgrid-mobile-details");
            if (detailRow.length > 0) {
                var itemWithDetails = ko.contextFor(detailRow[0]).$data;
                if (options.showDetailFor.item != itemWithDetails.item || options.showDetailFor.item == item.item) {
                    detailRow[0].parentNode.removeChild(detailRow[0]);
                }
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (ko.contextFor(<HTMLElement>container.children.item(i)).$data.item == item.item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item.item)) {
                    addClass(targetRow,"selected");
                }
                else {
                    removeClass(targetRow,"selected");
                }

                // if (shouldAddDetails) {
                if (options.showDetailFor.item == item.item) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildMobileDetailsRow(options, detailsTemplate);
                        insertAfter(targetRow, details);
                        ko.applyBindings(item, details);
                    }
                }
                //}
            }
        }

        private appendMobileElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            
            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;
            if (item.isGroupHeader) {
                var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                container.appendChild(mobileGroupHeader);
                ko.applyBindings(item, mobileGroupHeader);
            } else {
                var row = this.buildMobileRowElement(option, item, container, selected);

                container.appendChild(row);
                ko.applyBindings(item, row);
            }
        }

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("div");
            addClass(row, "tgrid-mobile-row");
            if (isNotNull(option.rowClick)) {
                row.setAttribute("data-bind", "click:function(event){model.".concat(option.rowClick).concat("(item, event);}"));
            }

            if (option.isSelected(item.item)) {
                addClass(row, "selected");
            }

            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                row.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
            }

            var rowTemplate = document.createElement("div");
            addClass(rowTemplate, 'tgrid-mobile-div');
            if (option.mobileTemplateHtml != null) {
                option.mobileTemplateHtml.applyTemplate(rowTemplate);
            } else {
                rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option);
            }
            row.appendChild(rowTemplate);
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

        private buildMobileDetailsRow(option: Options, template: Template): HTMLElement {
            var detailDiv = document.createElement("div");
            addClass(detailDiv, "tgrid-mobile-details");
            template.applyTemplate(detailDiv);
            return detailDiv;
        }

        private createDefaultCell(cell: HTMLElement, defaultCellBindingName: string): void {
            var spanForCell = document.createElement("span");
            var textBinding = "text: item.".concat(defaultCellBindingName)
            spanForCell.setAttribute("data-bind", textBinding);
            cell.appendChild(spanForCell);
        }

        public createDefaultGroupHeader(tableRowElement: any) {
            var groupHeaderContainer = document.createElement("div");
            var groupHeaderName = document.createElement("span");
            groupHeaderName.setAttribute("data-bind", "text: item.value");
            groupHeaderContainer.appendChild(groupHeaderName);
            tableRowElement.appendChild(groupHeaderContainer);
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
                        columnBinding.setAttribute("data-bind", 'text:item.'.concat(option.columns[i].member));
                        columnData.innerHTML = ": ";
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

        public bindData(option: Options, elementForBinding: HTMLElement) {
            var viewModel = ko.contextFor(option.target);
            ko.applyBindings(viewModel, elementForBinding);
        }

        private buildDefaultFilteringPopUp(option: Options, filterPopupContainer: HTMLElement)
        {
            // Creating controls
            var filterCondition = document.createElement("select");
            filterCondition.setAttribute("data-bind", "options: availableConditions, value: condition, optionsText: 'name', optionsValue: 'value'");
            filterCondition.className = "grid-filter-popup-options";

            var filterText = document.createElement("input");
            filterText.type = "text";
            filterText.setAttribute("data-bind", "value: value");
            filterText.className = "grid-filter-popup-path";

            var caseSensetiveInput = document.createElement("input");
            caseSensetiveInput.type = "checkbox";
            caseSensetiveInput.setAttribute("data-bind", "checked: caseSensetive");
            caseSensetiveInput.className = "grid-filter-popup-casesens";

            var caseSensetiveLabel = document.createElement("label");
            caseSensetiveLabel.className = "grid-filter-popup-casesens-label";
            caseSensetiveLabel.appendChild(caseSensetiveInput);
            caseSensetiveLabel.appendChild(document.createTextNode("Case sensetive"));

            var buttonsContainer = document.createElement("div");
            buttonsContainer.className = "tgrid-filter-popup-buttons-container";
            
            var clearButton = document.createElement("button");
            clearButton.className = 'tgrid-filter-popup-button';
            clearButton.onclick = (e) =>
            {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onClose();
                filterText.setAttribute("value", "");
            };
            (<HTMLElement>clearButton).innerHTML = 'Clear';

            var filterButton = document.createElement("button");
            filterButton.className = "tgrid-filter-popup-button";
            filterButton.onclick = (e) =>
            {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onApply();
            };
            (<HTMLElement>filterButton).innerHTML = "Filter";


            // Combining controls
            filterPopupContainer.appendChild(filterCondition);
            filterPopupContainer.appendChild(caseSensetiveLabel);
            filterPopupContainer.appendChild(filterText);

            buttonsContainer.appendChild(clearButton);
            buttonsContainer.appendChild(filterButton);

            filterPopupContainer.appendChild(buttonsContainer);
        }
    }
}