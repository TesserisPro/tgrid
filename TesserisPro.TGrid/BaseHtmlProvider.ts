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

        public updateTableFooterElementDefault(option: Options, footer: HTMLElement, totalItemsCount: number): void {
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

        public createDefaultHeader(container: HTMLElement, headerName: string) {
            var defaultHeader = document.createElement("span");
            var defaultName = document.createTextNode(headerName);
            defaultHeader.appendChild(defaultName);
            container.appendChild(defaultHeader);
        }

        public addGroupBy(option: Options, header: HTMLElement, groupByContainer: HTMLElement) {
            if (option.isEnableGrouping) {
                groupByContainer.classList.add('show');
                this.addGroupByElements(option, groupByContainer);
                this.showGroupByElements(option, groupByContainer, Grid.getGridObject(header))

            var listButtonContainerElement = document.createElement("div");
                listButtonContainerElement.setAttribute("class", "list-button-container");
                var listGroupByElement = document.createElement("ul");
                listGroupByElement.setAttribute("class", "group-by-ul");
                var groupByButtonElement = document.createElement("a");
                groupByButtonElement.setAttribute("class", "button-group-by");

                var self = this;
                groupByButtonElement.onclick = (e) => {
                    if (listGroupByElement.classList.contains('show')) {
                        listGroupByElement.classList.remove('show');
                    } else {
                        listGroupByElement.classList.add('show');
                    }
                    self.hideElementOnClickAnywhereElse(listGroupByElement, 'list-button-container');
                    //Grid.getGridObject(<HTMLElement>e.target).showHideListOnClick((<HTMLElement>e.target).nextElementSibling);
                }
            listButtonContainerElement.appendChild(groupByButtonElement);

                var listGroupByToChooseFrom = this.addListGroupByItems(option, listGroupByElement);
                this.showListGroupByItems(option, listGroupByToChooseFrom, Grid.getGridObject(header));

                listButtonContainerElement.appendChild(listGroupByElement);
                groupByContainer.appendChild(listButtonContainerElement);
            } else {
                Grid.getGridObject(groupByContainer).hideElement(groupByContainer);
            }
        }

        public showNeededIntends(target: HTMLElement, level: number, grid: TGrid.Grid) {
            var visibleIntentsNumber = level;
            var cells = target.getElementsByClassName("tgrid-table-indent-cell");

            for (var i = 0; i < cells.length; i++) {
                grid.hideElement(<Element>cells[i]);
            }
            //check that number of existing intent-cells is not more than number of needed intent-cells
            if (cells.length < level) {
                visibleIntentsNumber = cells.length;
            }

            for (var i = 0; i < visibleIntentsNumber; i++) {
                grid.showTableCellElement(<Element>cells[i]);
            }
        }

        public addFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {

        }

        public defaultFiltringPopUp(option: Options, filterPopupContainer: HTMLElement) {
            var filterCondition = document.createElement("select");
            // append filter conditions

            //var selectOption = document.createElement("option");
            //selectOption.value = FilterCondition.None.toString();
            //selectOption.text = "none";
            //filterCondition.appendChild(selectOption);

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
                Grid.getGridObject(<HTMLElement>e.target).addFilter(option.filterPath,
                    filterPopupContainer.getElementsByTagName("input")[0].value,
                    <FilterCondition>filterPopupContainer.getElementsByTagName("select")[0].selectedIndex,
                    filterPopupContainer);
            };
            filterPopupContainer.appendChild(applyButton);

            var clearButton = document.createElement("button");
            clearButton.innerText = "Clear";
            clearButton.onclick = (e) => {
                Grid.getGridObject(<HTMLElement>e.target).clearFilter(option.filterPath, filterPopupContainer);
            };
            filterPopupContainer.appendChild(clearButton);

            var exitButton = document.createElement("button");
            exitButton.innerText = "Close";
            exitButton.onclick = (e) => {
                Grid.getGridObject(<HTMLElement>e.target).hideElement(<Element>filterPopupContainer);
            };
            filterPopupContainer.appendChild(exitButton);
        }

        private addGroupByElements(option: Options, groupByContainer: HTMLElement) {
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].groupMemberPath != null) {
                    var groupByHeaderElement = document.createElement("div");
                    if (option.columns[i].header != null) {
                        option.columns[i].header.applyTemplate(groupByHeaderElement);
                    } else {
                        var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                        this.createDefaultHeader(groupByHeaderElement, headerText);
                    }

                    groupByHeaderElement.setAttribute("class", "condition-group-by");
                    groupByHeaderElement["data-group-by"] = option.columns[i].groupMemberPath;

                    //create deleteGroupByElement
                    var deleteGroupByElement = document.createElement("input");
                    deleteGroupByElement.setAttribute("type", "button");
                    deleteGroupByElement.setAttribute("class", "delete-condition-group-by");
                    deleteGroupByElement.setAttribute("value", "x");
                    deleteGroupByElement["data-delete-groupby"] = new SortDescriptor(option.columns[i].groupMemberPath, true);

                    //adding function to delete GroupBy condition by clicking on close button
                    deleteGroupByElement.onclick = (e) => {
                        var groupByElement = <SortDescriptor>e.target["data-delete-groupby"];
                        Grid.getGridObject(<HTMLElement>e.target).deleteGroupBy(groupByElement.path, groupByElement.asc);
                    }

                    groupByHeaderElement.appendChild(deleteGroupByElement);
                    this.bindData(option, groupByHeaderElement);
                    groupByContainer.appendChild(groupByHeaderElement);
                }
            }
        }

        public updateGroupByElements(option: Options, header: HTMLElement, groupByContainer: HTMLElement) {
            if (option.isEnableGrouping) {
                this.showGroupByElements(option, groupByContainer, Grid.getGridObject(header));

                var listButtonContainer = groupByContainer.getElementsByClassName("list-button-container");
                (<HTMLElement>listButtonContainer[0]).appendChild(this.showListGroupByItems(option, <HTMLUListElement>((<HTMLElement>listButtonContainer[0]).children[1]), Grid.getGridObject(header)));
            } else {
                Grid.getGridObject(groupByContainer).hideElement(groupByContainer);
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

        private showGroupByElements(option: Options, groupByContainer: HTMLElement, grid: TGrid.Grid) {
            var groupByElements = groupByContainer.getElementsByClassName("condition-group-by");

            for (var j = 0; j < groupByElements.length; j++) {
                grid.hideElement(<Element>groupByElements[j]);
            }

            for (var i = option.groupBySortDescriptor.length - 1; i > -1; i--) {
                for (var j = 0; j < groupByElements.length; j++) {
                    if (groupByElements[j]["data-group-by"] == option.groupBySortDescriptor[i].path) {
                        grid.showDivElement(<Element>groupByElements[j]);
                        groupByContainer.insertBefore(groupByElements[j], groupByContainer.firstChild);
                        continue;
                    }
                }
            }
        }

        private addListGroupByItems(option: Options, listGroupByElement: HTMLUListElement) {
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].groupMemberPath != null) {
                    var listItemGroupByItems = document.createElement("li");

                    listItemGroupByItems.onclick = (e) => {
                        //get top ancestor, because event fires on the last nested element
                        var el = <Node>e.target;
                        while (el && el.nodeName !== 'LI') {
                            el = el.parentNode
                            }
                        Grid.getGridObject(<HTMLElement>e.target).addGroupBy((<string>el["data-group-by-condition"]), true);
                        (<HTMLElement>el.parentNode).classList.remove('show');
                        Grid.getGridObject(<HTMLElement>e.target).hideElement(<Element>el.parentNode);
                    }
                    if (option.columns[i].header != null) {
                        option.columns[i].header.applyTemplate(listItemGroupByItems);
                    } else {
                        var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                        this.createDefaultHeader(listItemGroupByItems, headerText);
                    }
                    listItemGroupByItems["data-group-by-condition"] = option.columns[i].groupMemberPath;

                    listGroupByElement.appendChild(listItemGroupByItems);
                }
            }
            this.bindData(option, listGroupByElement);
            return listGroupByElement;
        }

        public bindData(option: Options, elementForBinding: HTMLElement) {

        }

        private showListGroupByItems(option: Options, listGroupByElement: HTMLUListElement, grid: TGrid.Grid) {
            var listGroupByItems = listGroupByElement.getElementsByTagName("li");

            for (var i = 0; i < listGroupByItems.length; i++) {
                if (listGroupByItems[i].getAttribute("style") == "display:block;") {
                    grid.hideElement(<Element>listGroupByItems[i]);
                }
                var hasNotGroupBy = true;
                for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                    if (option.groupBySortDescriptor[j].path == listGroupByItems[i]["data-group-by-condition"]) {
                        hasNotGroupBy = false;
                        continue;
                    }
                }
                if (hasNotGroupBy) {
                    grid.showDivElement(<Element>listGroupByItems[i]);
                }
            }
            return listGroupByElement;
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

        public addFilterButton(option: Options, header: HTMLElement, filterPopupContainer: HTMLElement, headerButtons: HTMLElement, i: number) {
            if (option.isEnableFiltering) {
                var filter = document.createElement("div");
                filter.classList.add("tgrid-filter-button");
                var self = this;
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
                        //hide filter on click anywhere else
                        self.hideElementOnClickAnywhereElse(filterPopupContainer, 'tgrid-filter-popup');                        
                        if (filterPopupContainer.hasAttribute('style')) {
                            filterPopupContainer.removeAttribute('style');
                        } else {
                            Grid.getGridObject(<HTMLElement>e.target).showFilterBox(<Element>(filterPopupContainer), option.columns[i].filterMemberPath, left);
                        }
                        e.cancelBubble = true;
                    };
                })(i);

                headerButtons.appendChild(filter);
            }
        }

        public updateMobileHeadElement(option: Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean): void {
            if (mobileHeader.innerHTML != null && mobileHeader.innerHTML != "") {
                this.updateMobileConditionList(option, mobileHeader, isSortable);
            } else {
                // Create mobile header
                this.createMobileConditionButton(option, mobileHeader, filterPopupContainer, isSortable);
            }
            this.updateMobileConditionShowList(option, mobileHeader, isSortable);
        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateMobileConditionList(option: Options, mobileConditionContainer: HTMLElement, isSortable: boolean) {
            var filterConditions = mobileConditionContainer.getElementsByClassName('mobile-filter-condition');
            var groupByConditions = mobileConditionContainer.getElementsByClassName('mobile-group-by-condition');
            var sortConditions = mobileConditionContainer.getElementsByClassName('mobile-sort-condition');

            for (var i = 0; i < option.columns.length; i++) {
                if (option.isEnableFiltering && filterConditions[i]!= undefined) {
                   
                    if (this.checkIsInArray(option.filterDescriptors, option.columns[i].filterMemberPath)) {
                        if (!(<HTMLElement>filterConditions[i]).classList.contains('filtered')) {
                            (<HTMLElement>filterConditions[i]).classList.add('filtered');
                        }
                    } else {
                        if ((<HTMLElement>filterConditions[i]).classList.contains('filtered')) {
                            (<HTMLElement>filterConditions[i]).classList.remove('filtered');
                        }
                    }
                }
                if (option.isEnableGrouping && groupByConditions[i] != undefined) {
                    
                    if (this.checkIsInArray(option.groupBySortDescriptor, option.columns[i].groupMemberPath)) {
                        if (!(<HTMLElement>groupByConditions[i]).classList.contains('active')) {
                            (<HTMLElement>groupByConditions[i]).classList.add('active');
                        }
                    } else {
                        if ((<HTMLElement>groupByConditions[i]).classList.contains('active')) {
                            (<HTMLElement>groupByConditions[i]).classList.remove('active');
                        }
                    }

                }
                if (isSortable && sortConditions[i] != undefined) {
                    
                    if (option.sortDescriptor.path == option.columns[i].sortMemberPath) {
                        for (var j = 0; j < sortConditions.length; j++) {
                            (<HTMLElement>sortConditions[j]).classList.remove('asc');
                            (<HTMLElement>sortConditions[j]).classList.remove('desc');
                        }
                        if (option.sortDescriptor.asc == true) {
                            if (!(<HTMLElement>sortConditions[i]).classList.contains('asc')) {
                                (<HTMLElement>sortConditions[i]).classList.add('asc');
                            }
                        } else {
                            if (!(<HTMLElement>sortConditions[i]).classList.contains('desc')) {
                                (<HTMLElement>sortConditions[i]).classList.add('desc');
                            }
                        }
                    } else {
                        if ((<HTMLElement>sortConditions[i]).classList.contains('asc')) {
                            (<HTMLElement>sortConditions[i]).classList.remove('asc');
                        }
                        if ((<HTMLElement>sortConditions[i]).classList.contains('desc')) {
                            (<HTMLElement>sortConditions[i]).classList.remove('desc');
                        }
                    }
                }
            }
        }

        public updateMobileConditionShowList(option: Options, mobileConditionContainer: HTMLElement, isSortable: boolean) {
            var mobileConditionsShow = mobileConditionContainer.getElementsByClassName("mobile-condition-show-div");
            if (<HTMLElement>mobileConditionsShow[0] != undefined && (<HTMLElement>mobileConditionsShow[0]).parentElement != undefined) {
                (<HTMLElement>mobileConditionsShow[0]).parentElement.innerHTML = "";
            }
            if (option.isEnableFiltering || option.isEnableGrouping || isSortable) {
                var listContainer = document.createElement('div');
                listContainer.classList.add('mobile-condition-show-container');
                var listColumnsElement = document.createElement("div");
                listColumnsElement.classList.add("mobile-condition-show-div");
                this.addMobileConditionShowListItems(option, listColumnsElement, mobileConditionContainer, isSortable);
                listContainer.appendChild(listColumnsElement);
                mobileConditionContainer.insertBefore(listContainer, mobileConditionContainer.firstChild);
            }
        }

        public createMobileConditionButton(option: Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean) {
            if (option.isEnableGrouping || option.isEnableFiltering || isSortable) {             
                var listButtonContainerElement = document.createElement("div");
                listButtonContainerElement.classList.add("mobile-list-button-container");
                var listColumnsElement = document.createElement("ul");
                listColumnsElement.classList.add("mobile-condition-ul");
                var columnsButtonElement = document.createElement("a");
                columnsButtonElement.classList.add("mobile-condition-button");

                var self = this;
                columnsButtonElement.onclick = (e) => {
                    Grid.getGridObject(<HTMLElement>e.target).showHideListOnClick((<HTMLElement>e.target).nextElementSibling);
                    self.hideElementOnClickAnywhereElse(listColumnsElement, 'mobile-list-button-container');
                }
                listButtonContainerElement.appendChild(columnsButtonElement);

                this.addMobileConditionListItems(option, listColumnsElement, filterPopupContainer, isSortable);

                listButtonContainerElement.appendChild(listColumnsElement);
                mobileHeader.appendChild(listButtonContainerElement);
            } 
        }

        private addMobileConditionListItems(option: Options, listMobileConditionElement: HTMLUListElement, filterPopupContainer: HTMLElement, isSortable: boolean) {

            for (var i = 0; i < option.columns.length; i++) {                
                var listColumnItem = document.createElement("li");
                var listColumnName = document.createElement('span');
                listColumnItem.onclick = (e) => {
                    //get top ancestor, because event fires on the last nested element
                    var el = <Node>e.target;
                    while (el && el.nodeName !== 'LI') {
                        el = el.parentNode
                        }
                    Grid.getGridObject(<HTMLElement>e.target).hideElement(<Element>el.parentNode);
                    e.stopPropagation();
                }
                if (option.columns[i].header != null) {
                    option.columns[i].header.applyTemplate(listColumnName);
                } else {
                    var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                    this.createDefaultHeader(listColumnName, headerText);
                }
                listColumnItem.appendChild(listColumnName);

                if (option.columns[i].groupMemberPath != null) {
                    listColumnItem.appendChild(this.createMobileGroupByItem(option, i, false));
                }
                if (option.columns[i].sortMemberPath != null) {
                    listColumnItem.appendChild(this.createMobileSortItem(option, i, false));
                }

                if (option.columns[i].filterMemberPath != null) {
                    listColumnItem.appendChild(this.createMobileFilterItem(option, i, filterPopupContainer, false));
                }
                listMobileConditionElement.appendChild(listColumnItem);
            }
            this.bindData(option, listMobileConditionElement);
            return listMobileConditionElement;
        }

        private addMobileConditionShowListItems(option: Options, listColumnsElement: HTMLElement, mobileConditionContainer: HTMLElement, isSortable: boolean) {
            var groupColumns = [];
            for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                for (var i = 0; i < option.columns.length; i++) {
                    if (option.columns[i].groupMemberPath == option.groupBySortDescriptor[j].path) {
                        var listColumnItem = document.createElement("span");
                        listColumnsElement.appendChild(this.getMobileConditionListItem(option, listColumnItem, null, true, i));
                        groupColumns.push(option.columns[i]);
                        i = option.columns.length;                       
                    }
                }
            }
            for (var i = 0; i < option.columns.length; i++) {
                var isGrouped = false;
                for (var j = 0; j < groupColumns.length; j++) {
                    if (option.columns[i] == groupColumns[j]) {
                        isGrouped = true;
                        j = groupColumns.length;
                    }
                }
                if (!isGrouped) {
                    var listColumnItem = document.createElement("span");
                    var isConditionOnColumn = false;
                    if (option.columns[i].sortMemberPath == option.sortDescriptor.path) {
                        isConditionOnColumn = true;
                        var listColumnName = document.createElement("span");
                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(listColumnName);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                            this.createDefaultHeader(listColumnName, headerText);
                        }
                        listColumnItem.appendChild(listColumnName);
                       
                        listColumnItem.appendChild(this.createMobileSortItem(option, i, true));
                    }
                    for (var j = 0; j < option.filterDescriptors.length; j++) {
                        if (option.columns[i].filterMemberPath == option.filterDescriptors[j].path) {
                            if (!isConditionOnColumn) {
                                var listColumnName = document.createElement("span");
                                if (option.columns[i].header != null) {
                                    option.columns[i].header.applyTemplate(listColumnName);
                                } else {
                                    var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                                    this.createDefaultHeader(listColumnName, headerText);
                                }
                                listColumnItem.appendChild(listColumnName);
                            }
                            isConditionOnColumn = true;
                            listColumnItem.appendChild(this.createMobileFilterItem(option, i, null, true));
                        }
                    }
                    if (isConditionOnColumn) listColumnsElement.appendChild(listColumnItem);
                }
            }
            
            this.bindData(option,listColumnsElement);
            return listColumnsElement;
        }

        private getMobileConditionListItem(option: Options, listColumnItem: HTMLElement, filterPopupContainer: HTMLElement, forShow: boolean, i: number):HTMLElement {
            
            var listColumnName = document.createElement('span');

            if (option.columns[i].header != null) {
                option.columns[i].header.applyTemplate(listColumnName);
            } else {
                var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                this.createDefaultHeader(listColumnName, headerText);
            }
            listColumnItem.appendChild(listColumnName);
            listColumnItem.appendChild(this.createMobileGroupByItem(option, i, forShow));

            if (option.columns[i].sortMemberPath == option.sortDescriptor.path) {
                listColumnItem.appendChild(this.createMobileSortItem(option, i, forShow));
            }
            for (var j = 0; j < option.filterDescriptors.length; j++) {
                if (option.columns[i].filterMemberPath == option.filterDescriptors[j].path) {
                    listColumnItem.appendChild(this.createMobileFilterItem(option, i, filterPopupContainer, forShow));
                }
            }
            return listColumnItem;
        }

        private createMobileGroupByItem(option: Options, i: number, forShow: boolean): HTMLElement {
            var listItemGroupBy = document.createElement('span');
            listItemGroupBy.classList.add('mobile-group-by-condition');
            listItemGroupBy["data-group-by-condition"] = option.columns[i].groupMemberPath;
            if (!forShow) {
                for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                    if (option.groupBySortDescriptor[j].path == option.columns[i].groupMemberPath) {
                        listItemGroupBy.classList.add('active');
                    }
                }
                listItemGroupBy.onclick = (e) => {
                    var isNotGroupedBy = true;
                    for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                        if (option.groupBySortDescriptor[j].path == e.target["data-group-by-condition"]) {
                            isNotGroupedBy = false;
                            j = option.groupBySortDescriptor.length;
                        }
                    }
                    if (isNotGroupedBy) {
                        Grid.getGridObject(<HTMLElement>e.target).addGroupBy((<string>e.target["data-group-by-condition"]), true);
                        (<HTMLElement>e.target).classList.add('active');
                    } else {
                        Grid.getGridObject(<HTMLElement>e.target).deleteGroupBy((<string>e.target["data-group-by-condition"]), true);
                        (<HTMLElement>e.target).classList.remove('active');
                    }

                }
                }
            return listItemGroupBy;
        }

        private createMobileSortItem(option: Options, i: number, forShow: boolean): HTMLElement {
            var listItemSort = document.createElement('span');
            listItemSort.classList.add('mobile-sort-condition');
            if (option.sortDescriptor.path == option.columns[i].sortMemberPath) {
                if (option.sortDescriptor.asc) {
                    listItemSort.classList.add('asc');
                } else {
                    listItemSort.classList.add('desc');
                }
            }
            listItemSort["data-sort-condition"] = option.columns[i].sortMemberPath;
            if(!forShow){
                listItemSort.onclick = (e) => {
                    var columnIsNotSorted = true;
                    if (option.sortDescriptor.path == e.target["data-sort-condition"]) {
                        columnIsNotSorted = false;
                    }
                    var conditionListItems = (<HTMLElement>e.target).parentElement.parentElement.getElementsByClassName('mobile-sort-condition');

                    if (columnIsNotSorted) {
                        var mobileConditionListItems = (<HTMLElement>e.target).parentElement.parentElement.getElementsByClassName('asc');
                        for (var k = 0; k < mobileConditionListItems.length; k++) {
                            (<HTMLElement>mobileConditionListItems[k]).classList.remove('asc');
                        }
                        mobileConditionListItems = (<HTMLElement>e.target).parentElement.parentElement.getElementsByClassName('desc');
                        for (var k = 0; k < mobileConditionListItems.length; k++) {
                            (<HTMLElement>mobileConditionListItems[k]).classList.remove('desc');
                        }

                        Grid.getGridObject(<HTMLElement>e.target).mobileSortBy((<string>e.target["data-sort-condition"]), true);
                        (<HTMLElement>e.target).classList.add('asc');
                    } else {
                        if (option.sortDescriptor.asc) {
                            Grid.getGridObject(<HTMLElement>e.target).mobileSortBy((<string>e.target["data-sort-condition"]), false);
                            (<HTMLElement>e.target).classList.remove('asc');
                            (<HTMLElement>e.target).classList.add('desc');
                        } else {
                            if ((<HTMLElement>e.target).classList.contains('desc')) {
                                Grid.getGridObject(<HTMLElement>e.target).mobileSortBy((<string>e.target["data-sort-condition"]), null);
                                (<HTMLElement>e.target).classList.remove('desc');
                            } else {
                                (<HTMLElement>e.target).classList.add('asc');
                            }
                        }
                    }
                }
            }
            return listItemSort;
        }

        private createMobileFilterItem(option: Options, i: number, filterPopupContainer: HTMLElement, forShow: boolean): HTMLElement {
            var listItemFilter = document.createElement('span');
            listItemFilter.classList.add('mobile-filter-condition');
            listItemFilter["data-filter-condition"] = option.columns[i].filterMemberPath;
            var isFiltered = this.checkIsInArray(option.filterDescriptors, option.columns[i].sortMemberPath);
            if (isFiltered) {
                listItemFilter.classList.add('filtered');
            }
            if (!forShow) {
                (function (i) {
                    listItemFilter.onclick = (e) => {
                        var filterItem = <HTMLElement>e.target;
                        //hide filter on click anywhere else
                        document.onclick = (e) => {
                            var isFilterElement = false;
                            var el = <HTMLElement>e.target;
                            while (!(el.tagName == 'BODY' || isFilterElement)) {
                                el = el.parentElement;
                                if (el.classList.contains('tgrid-filter-popup')) {
                                    isFilterElement = true;
                                }
                            }
                            if (!isFilterElement) {
                                Grid.getGridObject(filterItem).hideFilter(<Element>(filterPopupContainer));
                            }
                        }
                    Grid.getGridObject(filterItem).showFilterBox(<Element>(filterPopupContainer), option.columns[i].filterMemberPath, 0);
                    };
                })(i);
            }
            return listItemFilter;
        }
      
        private checkIsInArray(arrayToCheck: Array<any>, isWanted: any): boolean {
            var isInArray = false;
            for (var j = 0; j < arrayToCheck.length; j++) {
                if (arrayToCheck[j].path == isWanted) {
                    isInArray = true;
                    j = arrayToCheck.length;
                }
            }
            return isInArray;
        }

        private hideElementOnClickAnywhereElse(elementToHide: HTMLElement, elementToClickClass: string) {
            document.onclick = (e) => {
                var isFilterElement = false;
                var el = <HTMLElement>e.target;
                while (!(el.tagName == 'BODY' || isFilterElement)) {
                    el = el.parentElement;
                    if (el.classList.contains(elementToClickClass)) {
                        isFilterElement = true;
                    }
                }
                if (!isFilterElement) {
                    elementToHide.classList.remove('show');
                    elementToHide.removeAttribute('style');
                    document.onclick = null;
                }
            }
        }
    }
}