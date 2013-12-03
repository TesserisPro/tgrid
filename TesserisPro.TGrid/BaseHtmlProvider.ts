/// <reference path="IHtmlProvider.ts" />
/// <reference path="ItemViewModel.ts" />
/// <reference path="IFooterViewModel.ts"/>
/// <reference path="IFilterPopupViewModel.ts" />

module TesserisPro.TGrid {

    export class BaseHtmlProvider implements IHtmlProvider {

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public bindData(option: Options, elementForBinding: HTMLElement) {

        }

        public getElemntsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            return 0;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            return null;
        }

        public getFooterViewModel() {
        }

        public getFilterPopupViewModel(container: HTMLElement) {
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean, columnsResized: (c: ColumnInfo) => void) {

        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel) {
        }

        public updateGroupedTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateColumnWidth(option: Options, header: HTMLElement, body: HTMLElement, footer: HTMLElement): void {
            var headers = header.getElementsByTagName("th");

            var tableRows = body.getElementsByTagName("tr");
            var firstDataRow: HTMLElement;

            for (var i = 0; i < tableRows.length; i++) {
                if (tableRows.item(i).classList.contains("table-body-row")) {
                    firstDataRow = tableRows.item(i);
                    break;
                }
            }
            var columnNumber = 0;
            while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                columnNumber++;
            }
            for (var i = 0; i < headers.length - 1; i++) {

                while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                    columnNumber++;
                }

                if (columnNumber >= option.columns.length) {
                    columnNumber = option.columns.length - 1;
                    break;
                }

                (<HTMLElement>headers.item(i + option.columns.length)).setAttribute("width", option.columns[columnNumber].width);
                columnNumber++;
            }

            var columnNumber = 0;
            while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                columnNumber++;
            }

            if (firstDataRow != undefined) {
                var columns = firstDataRow.getElementsByTagName("td");
                for (var i = 0; i < columns.length - 1; i++) {

                    if ((<HTMLElement>columns.item(i)).classList.contains("tgrid-table-indent-cell")) {
                        continue;
                    }

                    while (columnNumber < option.columns.length && option.columns[columnNumber].device.indexOf("desktop") == -1) {
                        columnNumber++;
                    }

                    if (columnNumber >= option.columns.length) {
                        columnNumber = option.columns.length - 1;
                        break;
                    }

                    (<HTMLElement>columns.item(i)).setAttribute("width", option.columns[columnNumber].width);
                    columnNumber++;
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
            pagerElement.setAttribute("class", "tgird-pagination");

            if (firstVisiblePage > 0) {
                pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + (firstVisiblePage - 1).toString() + ")' >...</span>";
            }

            for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                if (option.currentPage == i) {
                    pagerElement.innerHTML += "<span class='tgird-page-current'>" + (i + 1) + "</span>";
                }
                else {
                    pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + i + ")' >" + (i + 1) + "</span>";
                }
            }

            if (lastVisiblePage < (pageCount - 1)) {
                pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>";
            }

            var pages = footer.getElementsByClassName("tgird-pagination");
            for (var i = 0; i < pages.length; i++) {
                footer.removeChild(pages[i]);
            }
            footer.appendChild(pagerElement);
        }

        public hasDetails(selectedElement: NodeList, option: Options) {
            if (selectedElement != null && selectedElement.length == 1) {
                if (option.showDetailFor.column == -1) {
                    if (option.detailsTemplateHtml != null) {
                        return true;
                    }
                } else if (option.columns[option.showDetailFor.column].cellDetail != null) {
                    return true;
                }
            }
            return false;
        }

        public updateTableDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void {

        }

        public updateMobileDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void {

        }

        public buildDefaultHeader(container: HTMLElement, headerName: string) {
            var defaultHeader = document.createElement("span");
            var defaultName = document.createTextNode(headerName);
            defaultHeader.appendChild(defaultName);
            container.appendChild(defaultHeader);
        }

        public updateGroupByPanel(option: Options, groupByPanel: HTMLElement) {
            groupByPanel.innerHTML = "";
            if (option.isEnableGrouping) {

                this.addActualGroupByElements(option, groupByPanel);
                               
                var groupButton = document.createElement("div");
                groupButton.setAttribute("class", "tgrid-goup-button");

                var groupByMenu = document.createElement("ul");
                groupByMenu.setAttribute("class", "tgrid-menu");
                hideElement(groupByMenu);

                var self = this;
                groupButton.onclick = (e) => {
                    e.cancelBubble = true;
                    self.updateGoupByMenuContent(option, groupByMenu);
                    unhideElement(groupByMenu);
                    self.doOncCickOutside(groupByMenu, () => hideElement(groupByMenu));
                }
                
                groupButton.appendChild(groupByMenu);
                groupByPanel.appendChild(groupButton);
            }
        }

        public showNeededIntends(target: HTMLElement, level: number, grid: TGrid.Grid) {
            var visibleIntentsNumber = level;
            var cells = target.getElementsByClassName("tgrid-table-indent-cell");

            for (var i = 0; i < cells.length; i++) {
                hideElement(<HTMLElement>cells[i]);
            }
            //check that number of existing intent-cells is not more than number of needed intent-cells
            if (cells.length < level) {
                visibleIntentsNumber = cells.length;
            }

            for (var i = 0; i < visibleIntentsNumber; i++) {
                unhideElement(<HTMLElement>cells[i]);
            }
        }

        public updateFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {

        }

        public buildDefaultFiltringPopUp(option: Options, filterPopupContainer: HTMLElement) {
            var filterCondition = document.createElement("select");
            // append filter conditions
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
            filterText.setAttribute("value", "c3");
            filterPopupContainer.appendChild(filterText);

            filterPopupContainer.innerHTML += "<br>";

            var applyButton = document.createElement("button");
            applyButton.innerText = "Apply";
            applyButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                var column = grid.filterPopupViewModel.getColumnInfo();
                grid.setFilter(
                    column,
                    new FilterDescriptor(
                        column.filterMemberPath,
                        filterPopupContainer.getElementsByTagName("input")[0].value,
                        <FilterCondition>filterPopupContainer.getElementsByTagName("select")[0].selectedIndex));
            };
            filterPopupContainer.appendChild(applyButton);

            var clearButton = document.createElement("button");
            clearButton.innerText = "Clear";
            clearButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                var column = grid.filterPopupViewModel.getColumnInfo();
                grid.clearFilter(column);
            };
            filterPopupContainer.appendChild(clearButton);

            var exitButton = document.createElement("button");
            exitButton.innerText = "Close";
            exitButton.onclick = (e) => {
                Grid.getGridObject(<HTMLElement>e.target).hideFilterPoup();
            };
            filterPopupContainer.appendChild(exitButton);
        }

        private addActualGroupByElements(option: Options, groupByContainer: HTMLElement) {
            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                for (var j = 0; j < option.columns.length; j++) {
                    if (option.columns[j].groupMemberPath == option.groupBySortDescriptors[i].path) {
                        var column = option.columns[j];

                        var groupByHeaderElement = document.createElement("div");
                        var columnHeader = this.buildColumnHeader(column);

                        this.bindData(option, columnHeader);

                        groupByHeaderElement.className = "tgrid-group-by-element";
                        groupByHeaderElement["data-group-by"] = column.groupMemberPath
                        groupByHeaderElement.appendChild(columnHeader);

                        //create deleteGroupByElement
                        var buttonsContainer = document.createElement("div");
                        buttonsContainer.className = "tgrid-header-cell-buttons";

                        var deleteGroupButton = document.createElement("div");
                        deleteGroupButton.className = "tgrid-delete-button";
                        deleteGroupButton["data-delete-group-by"] = option.groupBySortDescriptors[i];
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

        private updateGoupByMenuContent(option: Options, menu: HTMLUListElement) {
            menu.innerHTML = "";
            for (var i = 0; i < option.columns.length; i++) {
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

        public createDefaultMobileTemplate(rowTemplate: any, option: Options) {
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
                        columnBinding.setAttribute("data-bind", 'text: item.'.concat(option.columns[i].member));
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

        public buildGroupMobileHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {
            var headerContainer = document.createElement("div");
            var headerDiv = document.createElement("div");

            headerContainer.classList.add("tgrid-mobile-group-header");
            for (var i = 0; i < groupHeaderDescriptor.level; i++) {
                headerContainer.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
            }

            if (option.isEnableCollapsing) {
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

            headerDiv.classList.add('tgrid-mobile-group-header-container');
            this.bindMobileGroupHeader(headerContainer, groupHeaderDescriptor.value, headerDiv);

            return headerContainer;
        }

        public bindMobileGroupHeader(headerContainer: HTMLElement, item: any, headerDiv: HTMLElement) {
            headerContainer.appendChild(headerDiv);
        }

        public createDefaultGroupHeader(tableRowElement: any) {
        }

        public addFilterButton(option: Options, header: HTMLElement, filterPopupContainer: HTMLElement, headerButtons: HTMLElement, culumnNumber: number) {
            if (option.isEnableFiltering) {
                var filter = document.createElement("div");
                filter.classList.add("tgrid-filter-button");
                var self = this;
                (function (columnNumber) {
                    filter.onclick = (e) => {
                        Grid.getGridObject(<HTMLElement>e.target).showFilterPopup(option.columns[columnNumber], e.pageX, e.pageY);
                        self.doOncCickOutside(filterPopupContainer, () => Grid.getGridObject(<HTMLElement>e.target).hideFilterPoup());
                        e.cancelBubble = true;
                    };
                })(culumnNumber);

                headerButtons.appendChild(filter);
            }
        }

        public updateMobileHeadElement(option: Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean): void {
            mobileHeader.innerHTML = "";
            this.updateMobileHeaderColumns(option, mobileHeader);
            this.createMobileButton(option, mobileHeader);
        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateMobileHeaderColumns(option: Options, mobileHeader: HTMLElement) {
            var addedColumns = new Array<ColumnInfo>();
            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                for (var j = 0; j < option.columns.length; j++) {
                    if (option.columns[j].groupMemberPath == option.groupBySortDescriptors[i].path) {
                        var column = option.columns[j];
                        addedColumns.push(column);

                        var groupByHeaderElement = document.createElement("div");
                        var columnHeader = this.buildColumnHeader(column);

                        this.bindData(option, columnHeader);

                        groupByHeaderElement.className = "tgrid-group-by-element";
                        groupByHeaderElement["data-group-by"] = column.groupMemberPath
                        groupByHeaderElement.appendChild(columnHeader);

                        //create deleteGroupByElement
                        var buttonsContainer = document.createElement("div");

                        var sortIndicator = document.createElement("div");
                        sortIndicator.className = "tgrid-group-indicator";
                        buttonsContainer.appendChild(sortIndicator);

                        for (var f = 0; f < option.filterDescriptors.length; f++) {
                            if (option.filterDescriptors[f].path == column.filterMemberPath) {
                                var filterIndicator = document.createElement("div");
                                filterIndicator.className = "tgrid-filter-indicator";
                                buttonsContainer.appendChild(filterIndicator);
                                break;
                            }
                        }

                        if (option.sortDescriptor.path == column.sortMemberPath) {
                            var sortIndicator = document.createElement("div");
                            sortIndicator.className = "tgrid-sort-indicator-" + (option.sortDescriptor.asc) ? "asc" : "desc";
                            buttonsContainer.appendChild(sortIndicator);
                        }

                        groupByHeaderElement.appendChild(buttonsContainer);
                        mobileHeader.appendChild(groupByHeaderElement);
                    }
                }

                for (var j = 0; j < option.columns.length; j++) {
                    var column = option.columns[j];
                    if (addedColumns.indexOf(column) < 0) {

                        var headerElement = document.createElement("div");
                        var columnHeader = this.buildColumnHeader(column);

                        this.bindData(option, columnHeader);

                        headerElement.className = "tgrid-group-by-element";
                        headerElement["data-group-by"] = column.groupMemberPath
                        headerElement.appendChild(columnHeader);

                        //create deleteGroupByElement
                        buttonsContainer = document.createElement("div");
                        buttonsContainer.className = "tgrid-header-cell-buttons";
           
                        for (var f = 0; f < option.filterDescriptors.length; f++) {
                            if (option.filterDescriptors[f].path == column.filterMemberPath) {
                                var filterIndicator = document.createElement("div");
                                filterIndicator.className = "tgrid-filter-indicator";
                                buttonsContainer.appendChild(filterIndicator);
                                break;
                            }
                        }

                        if (option.sortDescriptor.path == column.sortMemberPath) {
                            var sortIndicator = document.createElement("div");
                            sortIndicator.className = "tgrid-sort-indicator-" + (option.sortDescriptor.asc) ? "asc" : "desc";
                            buttonsContainer.appendChild(sortIndicator);
                        }

                        groupByHeaderElement.appendChild(buttonsContainer);
                        mobileHeader.appendChild(groupByHeaderElement);
                    }
                }
            }
        }

        public createMobileButton(option: Options, mobileHeader: HTMLElement) {
            var button = document.createElement("div");
            button.className = "tgrid-mobile-button";
                
            var self = this;
            button.onclick = (e) => {
                var menu = document.createElement("ul");
                menu.className = "tgrid-menu";
                this.addMobileMenuItems(option, menu);

                button.innerHTML = "";
                button.appendChild(menu);                         
                self.doOncCickOutside(mobileHeader, () => { e.cancelBubble = true; hideElement(menu); });
            }

            mobileHeader.appendChild(button);
        }

        private addMobileMenuItems(option: Options, menu: HTMLUListElement) {
            for (var i = 0; i < option.columns.length; i++) {
                var column = option.columns[i];

                var menuItem = document.createElement("li");

                var columnHeader = this.buildColumnHeader(column);
                this.bindData(option, columnHeader);

                var columnContainer = document.createElement("div");
                columnContainer.className = "tgrid-header-cell-content";
                columnContainer.appendChild(columnHeader);

                var buttonsContainer = document.createElement("div");
                buttonsContainer.className = "tgrid-header-cell-buttons";

                var sortButton = document.createElement("div");
                sortButton.className = "tgrid-sort-button";
                buttonsContainer.appendChild(sortButton);
                sortButton["data-g-path"] = column.sortMemberPath;
                sortButton.onclick = e => {
                    e.cancelBubble = true;
                    hideElement(menu);
                    Grid.getGridObject(<HTMLElement>e.target).sortBy(<string>e.target["data-g-path"]);
                };

                var filterButton = document.createElement("div");
                filterButton.className = "tgrid-filter-button";
                buttonsContainer.appendChild(filterButton);
                filterButton["data-g-column"] = column;
                filterButton.onclick = e => {
                    e.cancelBubble = true;
                    hideElement(menu);
                    Grid.getGridObject(<HTMLElement>e.target).showFilterPopup(<ColumnInfo>e.target["data-g-column"], e.pageX, e.pageY);
                };

                var groupButton = document.createElement("div");
                groupButton.className = "tgrid-group-button";
                buttonsContainer.appendChild(groupButton);
                groupButton["data-g-path"] = column.groupMemberPath;
                groupButton.onclick = e => {
                    e.cancelBubble = true;
                    hideElement(menu);
                    var grid = Grid.getGridObject(<HTMLElement>e.target);
                    grid.togleGroupDescriptor(<string>e.target["data-g-path"]);
                };

                columnContainer.appendChild(buttonsContainer);
                menuItem.appendChild(columnContainer);
                menuItem.appendChild(buttonsContainer);
                menu.appendChild(menuItem);
            }
        }

        public doOncCickOutside(target: HTMLElement, action: () => void) {
            var oldOnClick = document.onclick;
            document.onclick = (e) => {
                var currentElement = <HTMLElement>e.target;
                while (currentElement.tagName != 'BODY') {
                    if (currentElement == target) {
                        return;
                    }

                    currentElement = currentElement.parentElement;
                }
                document.onclick = oldOnClick;
                action();
            }
        }

        private buildColumnHeader(column: ColumnInfo): HTMLElement {
            var headerElement = document.createElement("div");
            headerElement.className = "tgrid-header-cell-content";
            if (column.header != null) {
                column.header.applyTemplate(headerElement);
            } else {
                var headerText = column.member;
                this.buildDefaultHeader(headerElement, column.member);
            }

            return headerElement;
        }
    }
}