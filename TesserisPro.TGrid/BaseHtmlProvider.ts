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

/// <reference path="IHtmlProvider.ts" />
/// <reference path="ItemViewModel.ts" />
/// <reference path="IFooterViewModel.ts"/>
/// <reference path="IFilterPopupViewModel.ts" />

module TesserisPro.TGrid {

    export class BaseHtmlProvider implements IHtmlProvider {

        static oldOnClick = document.onclick;

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public bindData(option: Options, elementForBinding: HTMLElement) {

        }

        public getElementsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            return 0;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            return null;
        }

        public getVisibleItemsCount(container: HTMLElement, view: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): number {
            var size = 0;
            var visibleItemsCount = 0;
            var children = container.children;
            var visibleItemsSize = 0;
            for (var i = 0; i < children.length; i++) {
                var child = <HTMLElement>children.item(i);
                if (child.style.display != "none" && child.style.visibility != "hidden") {
                    size += child.offsetHeight;

                    if (size > scrollTop) {
                        visibleItemsCount++;

                        visibleItemsSize += child.offsetHeight;
                    }
                }
           
                if (visibleItemsSize >= view.clientHeight) {
                    break;
                }
            }

            return visibleItemsCount;
        }

        public getFooterViewModel(grid: any) {
        }

        public getFilterPopupViewModel(container: HTMLElement) {
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: ColumnInfo) => void) {

        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            return container;
        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel) {
        }

        public updateGroupedTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateColumnWidth(option: Options, header: HTMLElement, body: HTMLElement, footer: HTMLElement): void {
            var headers = header.getElementsByTagName("th");

            var tableRows = body.getElementsByTagName("tr");
            var hasNotSizedColumn = false;
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].notSized && !option.enablePaging) {
                    hasNotSizedColumn = true;
                }
            }
            var columnsCount = hasNotSizedColumn ? headers.length - 1 : headers.length;
            var columnNumber = 0;
            while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                columnNumber++;
            } 

            for (var i = 0; i < columnsCount; i++) {

                while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                    columnNumber++;
                }

                if (columnNumber >= option.columns.length) {
                    columnNumber = option.columns.length - 1;
                    break;
                }

                if (!option.columns[columnNumber].notSized) {
                    (<HTMLElement>headers.item(i + option.columns.length)).style.width = option.columns[columnNumber].width.toString() + "px";
                    var headerContainer = (<HTMLElement>headers.item(i + option.columns.length)).getElementsByClassName("tgrid-header-cell-container").item(0);
                    (<HTMLElement>headerContainer).style.width = option.columns[columnNumber].width.toString() + "px";
                }
                columnNumber++;
            }

            var dataRow: HTMLElement;

            for (var i = 0; i < tableRows.length; i++) {
                if (containsClass(tableRows.item(i),"tgrid-table-body-row")) {
                    dataRow = tableRows.item(i);
                    if (dataRow != undefined) {
                        var columns = dataRow.getElementsByTagName("td");
                        columnNumber = 0;
                        for (var j = 0; j < columnsCount; j++) {

                            if (containsClass((<HTMLElement>columns.item(j)), "tgrid-table-indent-cell")) {
                                continue;
                            }

                            while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                                columnNumber++;
                            }

                            if (columnNumber >= option.columns.length) {
                                columnNumber = option.columns.length - 1;
                                break;
                            }

                            if (!option.columns[columnNumber].notSized) {
                                (<HTMLElement>columns.item(j)).style.width = option.columns[columnNumber].width.toString() + "px";
                                var cellContainer = (<HTMLElement>columns.item(j)).firstChild;
                                (<HTMLElement>cellContainer).style.width = option.columns[columnNumber].width.toString() + "px";
                            }
                            columnNumber++;
                        }
                    }
                }
            }
        }

        public buildDefaultTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number): void {
            var firstVisiblePage = option.currentPage - option.pageSlide;

            if (firstVisiblePage < 0) {
                firstVisiblePage = 0;
            }

            var lastVisiblePage = option.currentPage + option.pageSlide;
            var pageCount = Math.ceil(totalItemsCount / option.pageSize);

            if (lastVisiblePage >= pageCount) {
                lastVisiblePage = pageCount - 1;
            }

            var pagerElement = document.createElement("div");
            pagerElement.setAttribute("class", "tgrid-pagination");

            if (firstVisiblePage > 0) {
                pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + (firstVisiblePage - 1).toString() + ")' >...</span>";
            }

            for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                if (option.currentPage == i) {
                    pagerElement.innerHTML += "<span class='tgrid-page-current'>" + (i + 1) + "</span>";
                }
                else {
                    pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + i + ")' >" + (i + 1) + "</span>";
                }
            }

            if (lastVisiblePage < (pageCount - 1)) {
                pagerElement.innerHTML += "<span class='tgrid-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>";
            }

            var pages = footer.getElementsByClassName("tgrid-pagination");
            for (var i = 0; i < pages.length; i++) {
                footer.removeChild(pages[i]);
            }
            footer.appendChild(pagerElement);
        }

        public getActualDetailsTemplate(option: Options): Template {
            if (option.showDetailFor.item == null) {
                return null;
            }

            if (option.showDetailFor.column == -1) {
                return option.detailsTemplateHtml;
            }

            return option.columns[option.showDetailFor.column].cellDetail;
        }
 
        public updateTableDetailRow(option: Options, container: HTMLElement, item: ItemViewModel, shouldAddDetails: boolean): void {

        }

        public updateMobileDetailRow(option: Options, container: HTMLElement, item: ItemViewModel, shouldAddDetails: boolean): void {

        }

        public buildDefaultHeader(container: HTMLElement, headerName: string) {
            var defaultHeader = document.createElement("span");
            var defaultName = document.createTextNode(headerName);
            defaultHeader.appendChild(defaultName);
            container.appendChild(defaultHeader);
        }

        public onCloseFilterPopup() {
            document.onclick = BaseHtmlProvider.oldOnClick;
        }

        public updateGroupByPanel(option: Options, groupByPanel: HTMLElement) {
            groupByPanel.innerHTML = "";
            if (option.enableGrouping) {

                this.addActualGroupByElements(option, groupByPanel);
                               
                var groupButton = document.createElement("div");
                groupButton.setAttribute("class", "tgrid-goup-button");

                var groupByMenu = document.createElement("ul");
                groupByMenu.setAttribute("class", "tgrid-menu");
                hideElement(groupByMenu);

                var self = this;
                groupButton.onclick = (e) => {
                    e.cancelBubble = true;
                    self.updateGroupByMenuContent(option, groupByMenu);
                    unhideElement(groupByMenu);
                    self.doOnClickOutside(groupByMenu, () => hideElement(groupByMenu));
                }
                
                groupButton.appendChild(groupByMenu);
                groupByPanel.appendChild(groupButton);
            }
        }

        public showNeededIndents(target: HTMLElement, level: number, grid: TGrid.Grid) {
            var visibleIndentsNumber = level;
            var cells = target.getElementsByClassName("tgrid-table-indent-cell");

            for (var i = 0; i < cells.length; i++) {
                hideElement(<HTMLElement>cells[i]);
            }
            //check that number of existing indent-cells is not more than number of needed indent-cells
            if (cells.length < level) {
                visibleIndentsNumber = cells.length;
            }

            for (var i = 0; i < visibleIndentsNumber; i++) {
                unhideElement(<HTMLElement>cells[i]);
            }
        }

        public updateFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {

        }

        private addActualGroupByElements(option: Options, groupByContainer: HTMLElement) {
            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                for (var j = 0; j < option.columns.length; j++) {
                    if (option.columns[j].device.indexOf("desktop") != -1) {
                        var column = option.columns[j];
                        if (column.groupMemberPath == option.groupBySortDescriptors[i].path && column.groupMemberPath != null) {
                            var groupByHeaderElement = document.createElement("div");
                            var columnHeader = this.buildColumnHeader(column);

                            this.bindData(option, columnHeader);

                            groupByHeaderElement.className = "tgrid-group-by-element";
                            groupByHeaderElement["data-group-by"] = column.groupMemberPath;
                            groupByHeaderElement.appendChild(columnHeader);

                            //create deleteGroupByElement
                            var buttonsContainer = document.createElement("div");
                            buttonsContainer.className = "tgrid-header-cell-buttons";

                            var deleteGroupButton = document.createElement("div");
                            deleteGroupButton.className = "tgrid-delete-button";
                            deleteGroupButton["data-delete-group-by"] = option.groupBySortDescriptors[i];
                            deleteGroupButton["data-delete-group-by-number"] = i;
                            deleteGroupButton.onclick = (e) => {
                                e.cancelBubble = true;
                                Grid.getGridObject(<HTMLElement>e.target).removeGroupDescriptor((<SortDescriptor>e.target["data-delete-group-by"]).path);
                            };

                            buttonsContainer.appendChild(deleteGroupButton);

                            groupByHeaderElement.appendChild(buttonsContainer);

                            groupByContainer.appendChild(groupByHeaderElement);
                        }
                    }
                }
            }
        }

        private updateGroupByMenuContent(option: Options, menu: HTMLUListElement) {
            menu.innerHTML = "";
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("desktop") != -1) {
                    if (option.columns[i].groupMemberPath != null) {
                        var alreadyGrouped = false;
                        for (var j = 0; j < option.groupBySortDescriptors.length; j++) {
                            if (option.groupBySortDescriptors[j].path == option.columns[i].groupMemberPath) {
                                alreadyGrouped = true;
                            }
                        }

                        if (!alreadyGrouped) {
                            var groupMenuItem = document.createElement("li");
                            groupMenuItem["data-group-by-path"] = option.columns[i].groupMemberPath;
                            var columnHeader = this.buildColumnHeader(option.columns[i]);
                            this.bindData(option, columnHeader);
                            groupMenuItem.appendChild(columnHeader);
                            groupMenuItem.onclick = (e) => {
                                hideElement(menu);
                                Grid.getGridObject(<HTMLElement>e.target).addGroupDescriptor(<string>e.currentTarget["data-group-by-path"], true);
                            }

                        menu.appendChild(groupMenuItem);
                        }
                    }
                }
            }
        }

        public buildGroupMobileHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerContainer = document.createElement("div");
            var headerDiv = document.createElement("div");

            addClass(headerContainer, "tgrid-mobile-group-header");
            for (var i = 0; i < groupHeaderDescriptor.level; i++) {
                headerContainer.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
            }

            if (option.enableCollapsing) {
                addClass(headerContainer, "collapsing");
                if (!groupHeaderDescriptor.collapse) {
                    headerContainer.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                } else {
                    headerContainer.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                }
            }

            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerDiv);
            } else {
                this.createDefaultGroupHeader(headerDiv);
            }

            addClass(headerDiv,'tgrid-mobile-group-header-container');
            this.bindMobileGroupHeader(headerContainer, groupHeaderDescriptor.value, headerDiv);

            return headerContainer;
        }

        public bindMobileGroupHeader(headerContainer: HTMLElement, item: any, headerDiv: HTMLElement) {
            headerContainer.appendChild(headerDiv);
        }

        public createDefaultGroupHeader(tableRowElement: any) {
        }

        public addFilterButton(option: Options, header:HTMLElement, filterPopupContainer: HTMLElement, headerButtons: HTMLElement, culumnNumber: number) {
            if (option.enableFiltering) {
                var filter = document.createElement("div");
                var isActiveFilter = false;
                for (var j = 0; j < option.filterDescriptor.children.length; j++){
                    if (option.filterDescriptor.children[j].path == option.columns[culumnNumber].filterMemberPath) {
                        isActiveFilter = true;
                    }
                }
                if (isActiveFilter) {
                    addClass(filter,"tgrid-filter-button-active");
                } else {
                    addClass(filter,"tgrid-filter-button");
                }
                var self = this;
                (function (columnNumber) {
                    filter.onclick = (e) => {
                        var eventTarget = <HTMLElement>e.target;
                        var headerBottomY = header.getBoundingClientRect().bottom;
                        var eventTargetLeftX = eventTarget.getBoundingClientRect().left;
                        if (filterPopupContainer.style.display == "none" || option.filterPopupForColumn != option.columns[columnNumber]) {
                            Grid.getGridObject(eventTarget).showFilterPopup(option.columns[columnNumber], eventTargetLeftX, headerBottomY, true);
                            if ((eventTargetLeftX + filterPopupContainer.offsetWidth) > header.getBoundingClientRect().right) {
                                Grid.getGridObject(eventTarget).showFilterPopup(option.columns[columnNumber], eventTargetLeftX - filterPopupContainer.offsetWidth, headerBottomY, true);
                            }
                        } else {
                            Grid.getGridObject(eventTarget).hideFilterPopup();
                        }
                        self.doOnClickOutside(filterPopupContainer, () => {
                                var grid = Grid.getGridObject(eventTarget);
                                if (grid != null) {
                                    grid.hideFilterPopup()
                                }
                            });
                        e.cancelBubble = true;
                    };
                })(culumnNumber);

                headerButtons.appendChild(filter);
            }
        }

        public updateMobileHeadElement(option: Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement): void {
            mobileHeader.innerHTML = "";
            if (option.enableSorting || option.enableGrouping || option.enableFiltering) {
                this.createMobileButton(option, mobileHeader, filterPopupContainer);
            }
        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public createMobileButton(option: Options, mobileHeader: HTMLElement, filterPopUp: HTMLElement) {
            var button = document.createElement("div");
            if (this.anyConditionIsApplied(option)) {
                button.className = "tgrid-mobile-button-active";
            } else {
                button.className = "tgrid-mobile-button";
            }
                
            var self = this;
            button.onclick = (e) => {
                var menu = document.createElement("ul");
                menu.className = "tgrid-mobile-menu";
                this.addMobileMenuItems(option, menu, filterPopUp);

                button.innerHTML = "";
                button.appendChild(menu);                         
                self.doOnClickOutside(menu, () => { hideElement(menu); });
                e.cancelBubble = true; 
            }

            mobileHeader.appendChild(button);
        }

        private addMobileMenuItems(option: Options, menu: HTMLUListElement, filterPopUp: HTMLElement) {
            for (var i = 0; i < option.columns.length; i++) {
                var column = option.columns[i];

                if (column.member != null || column.sortMemberPath != null || column.filterMemberPath != null || column.groupMemberPath != null) {

                    var menuItem = document.createElement("li");

                    var columnHeader = this.buildMobileMenuColumnHeader(column);
                    this.bindData(option, columnHeader);

                    var columnContainer = document.createElement("div");
                    columnContainer.className = "tgrid-mobile-li-header-container";
                    columnContainer.appendChild(columnHeader);

                    var buttonsContainer = document.createElement("div");
                    buttonsContainer.className = "tgrid-header-cell-buttons";

                    if (option.enableSorting && column.sortMemberPath != null) {
                        var sortButton = document.createElement("div");

                        if (column.sortMemberPath == option.sortDescriptor.path) {
                            if (option.sortDescriptor.asc == null) {
                                sortButton.className = "tgrid-sort-button";
                            } else if (option.sortDescriptor.asc) {
                                sortButton.className = "tgrid-sort-button-asc";
                            } else {
                                sortButton.className = "tgrid-sort-button-desc";
                            }
                        } else {
                            sortButton.className = "tgrid-sort-button";
                        }

                        buttonsContainer.appendChild(sortButton);
                        sortButton["data-g-path"] = column.sortMemberPath;
                        sortButton.onclick = e => {
                            e.cancelBubble = true;
                            hideElement(menu);
                            Grid.getGridObject(<HTMLElement>e.target).sortBy(<string>e.target["data-g-path"]);
                        };
                    }
                    if (option.enableFiltering && column.filterMemberPath != null) {
                        var filterButton = document.createElement("div");
                        var isFiltered = false;

                        for (var j = 0; j < option.filterDescriptor.children.length; j++) {
                            if (option.filterDescriptor.children[j].path == column.filterMemberPath) {
                                filterButton.className = "tgrid-mobile-filter-button-active";
                                isFiltered = true;
                                break;
                            }
                        }

                        if (!isFiltered) {
                            filterButton.className = "tgrid-mobile-filter-button";
                        }

                        buttonsContainer.appendChild(filterButton);
                        filterButton["data-g-column"] = column;
                        var self = this;
                        filterButton.onclick = e => {
                            e.cancelBubble = true;
                            hideElement(menu);
                            self.doOnClickOutside(filterPopUp, () => { hideElement(filterPopUp); });
                            Grid.getGridObject(<HTMLElement>e.target).showFilterPopup(<ColumnInfo>e.target["data-g-column"], e.pageX, e.pageY, false);
                        };
                    }
                    if (option.enableGrouping && column.groupMemberPath != null) {
                        var groupButton = document.createElement("div");
                        var isGrouped = false;

                        for (var j = 0; j < option.groupBySortDescriptors.length; j++) {
                            if (option.groupBySortDescriptors[j].path == column.groupMemberPath) {
                                groupButton.className = "tgrid-group-button-active";
                                isGrouped = true;
                                break;
                            }
                        }

                        if (!isGrouped) {
                            groupButton.className = "tgrid-group-button";
                        }

                        buttonsContainer.appendChild(groupButton);
                        groupButton["data-g-path"] = column.groupMemberPath;
                        groupButton.onclick = e => {
                            e.cancelBubble = true;
                            hideElement(menu);
                            var grid = Grid.getGridObject(<HTMLElement>e.target);
                            grid.toggleGroupDescriptor(<string>e.target["data-g-path"]);
                        };
                    }
                    menuItem.appendChild(columnContainer);
                    menuItem.appendChild(buttonsContainer);
                    menu.appendChild(menuItem);
                }
            }
        }

        public doOnClickOutside(target: HTMLElement, action: () => void) {
            var eventListener = (e) => {
                var currentElement = <HTMLElement>e.target;

                while (currentElement != null && currentElement.tagName != 'BODY') {
                    if (currentElement == target) {
                        return;
                    }
                    currentElement = currentElement.parentElement;
                }
                document.removeEventListener("click", eventListener);
                action();
            };

            document.addEventListener("click", eventListener);
        }

        public appendIndent(target: HTMLElement, level: number, isHeader: boolean) {
            var tag = isHeader ? "th" : "td";
            for (var i = 0; i < level; i++) {
                var cell = document.createElement(tag);
                cell.className = "tgrid-table-indent-cell";
                var indentContent = document.createElement("div");
                indentContent.className = "tgrid-table-indent-cell-content";
                cell.appendChild(indentContent);
                target.appendChild(cell);
            }
        }

        private buildColumnHeader(column: ColumnInfo): HTMLElement {
            var headerElement = document.createElement("div");
            headerElement.className = "tgrid-header-cell-content";
            if (column.header != null) {
                column.header.applyTemplate(headerElement);
            } else {
                var headerText = column.member != null ? column.member : '';
                this.buildDefaultHeader(headerElement, headerText);
            }

            return headerElement;
        }

        private buildMobileMenuColumnHeader(column: ColumnInfo): HTMLElement {
            var headerElement = document.createElement("div");
            headerElement.className = "tgrid-mobile-menu-li-column-header";
            if (column.header != null) {
                column.header.applyTemplate(headerElement);
            } else {
                var headerText = column.member != null ? column.member : '';
                this.buildDefaultHeader(headerElement, headerText);
            }

            return headerElement;
        }

        private anyConditionIsApplied(options: Options): boolean {
            if (options.sortDescriptor.path != null ||
               (options.groupBySortDescriptors.length > 0 && options.groupBySortDescriptors[0].path != null) ||
                options.filterDescriptor.children.length > 0 ||
                options.filterDescriptor.condition != FilterCondition.None) {
                return true;
            } else {
                return false;
            }
        }

        private detachDocumentClickEvent() {
            document.onclick = BaseHtmlProvider.oldOnClick;
        }

       
       
    }
}