/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="knockout/KnockoutFilterPopupViewModel.ts"/>
/// <reference path="angular/AngularFilterPopupViewModel.ts"/>
/// <reference path="angular/AngularHtmlProvider.ts" />
/// <reference path="GroupHeaderDescriptor.ts" />
/// <reference path="utils.ts" />
/// <reference path="IFooterViewModel.ts"/>
/// <reference path="scripts/typings/angularjs/angular.d.ts"/>

module TesserisPro.TGrid {

    export class Grid {
        private parentElement: HTMLElement;
        private targetElement: HTMLElement;
        private rootElement: HTMLElement;
        private headerContainer: HTMLElement;
        private tableBody: HTMLElement;
        private tableBodyContainer: HTMLElement;

        private tableFooter: HTMLElement;

        private tableHeader: HTMLElement;
        private mobileContainer: HTMLElement;
        private mobileHeader: HTMLElement;
        private buisyIndicator: HTMLElement;
        private scrollBar: HTMLElement;
        private groupByElement: HTMLElement;
        private filterPopUp: HTMLElement;

        private htmlProvider: IHtmlProvider;
        private itemProvider: IItemProvider;

        public filterPopupViewModel: IFilterPopupViewModel;
        public options: Options;

        private firstVisibleItemIndex: number;
        private totalItemsCount: number;
        private previousPage: Array<any>;
        private nextPage: Array<any>;
        private visibleItems: Array<any>;
        private visibleViewModels: Array<ItemViewModel>;
        private isPreloadingNext: boolean = false;
        private isPreloadingPrevious: boolean = false;

        private footerViewModel: IFooterViewModel;

        

        private collapsedFilterGroup: FilterDescriptor[][];

        private enablePreload: boolean = true;

        constructor(element: HTMLElement, options: Options, provider: IItemProvider) {
            element.grid = this;
            this.targetElement = element;
            this.options = options;

            this.collapsedFilterGroup = new Array<FilterDescriptor[]>();
            for (var i = 0; i < this.options.columns.length; i++) {
                this.collapsedFilterGroup.push(new Array<FilterDescriptor>());
            }

            this.itemProvider = provider;
            this.htmlProvider = this.getHtmlProvider(this.options);

            this.footerViewModel = this.htmlProvider.getFooterViewModel();

            this.rootElement = document.createElement("div");
            this.rootElement.className = "tgrid-root";
           
            this.groupByElement = document.createElement("div");
            this.groupByElement.className = "tgrid-group-by-panel desktop";
            this.rootElement.appendChild(this.groupByElement);

            this.headerContainer = document.createElement("div");
            this.headerContainer.className = "tgrid-tableheadercontainer desktop";
            var headerTable = document.createElement("table");
            headerTable.className = "tgrid-table";
            this.headerContainer.appendChild(headerTable);
            
            // filter popup
            if (this.options.isEnableFiltering) {
                this.filterPopUp = document.createElement("div");
                this.filterPopUp.setAttribute("class", "tgrid-filter-popup");
                this.rootElement.appendChild(this.filterPopUp);
                this.filterPopupViewModel = this.htmlProvider.getFilterPopupViewModel(this.filterPopUp);
                this.htmlProvider.updateFilteringPopUp(this.options, this.filterPopUp, this.filterPopupViewModel);
            }

            // Header
            this.mobileHeader = document.createElement("div");
            this.mobileHeader.className = "tgrid-mobile-header mobile";
            this.rootElement.appendChild(this.mobileHeader);

            this.tableHeader = document.createElement("thead");
            this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
            headerTable.appendChild(this.tableHeader);
            this.rootElement.appendChild(this.headerContainer);

            // Body
            this.tableBodyContainer = document.createElement("div");
            this.tableBodyContainer.className = "tgrid-tablebodycontainer desktop";

            if (options.isEnableVirtualScroll) {
                this.tableBodyContainer.onscroll = () => this.scrollTable();
            } else {
                this.itemProvider.getTotalItemsCount(options.filterDescriptors, (total) => { this.options.firstLoadSize = total; });
            }

            var bodyTable = document.createElement("table");
            bodyTable.className = "tgrid-table";

            this.tableBodyContainer.appendChild(bodyTable);

            this.tableBody = document.createElement("tbody");
            bodyTable.appendChild(this.tableBody);
            this.rootElement.appendChild(this.tableBodyContainer);

            this.mobileContainer = document.createElement("div");
            this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");
            this.rootElement.appendChild(this.mobileContainer);

            // Footer
            this.tableFooter = document.createElement("div");
            this.tableFooter.setAttribute("class", "tgrid-footer");
            this.rootElement.appendChild(this.tableFooter);
            

                        
            if (options.isEnableVirtualScroll) {
                this.buisyIndicator = document.createElement("div");
                this.buisyIndicator.className = "tgrid-buisy-indicator";
                this.rootElement.appendChild(this.buisyIndicator);

                this.scrollBar = document.createElement("div");
                this.scrollBar.className = "tgrid-scroll";
                var scrollContent = document.createElement("div");
                scrollContent.style.height = "1000px";
                this.scrollBar.appendChild(scrollContent);
                this.rootElement.appendChild(this.scrollBar);

                this.scrollBar.onmouseup = () => this.onManualScroll();
            }

            this.targetElement.appendChild(this.rootElement);
            this.tableBodyContainer.scrollTop = 0;

            if (this.options.groupBySortDescriptors.length > 0) {
                this.refreshHeader();
                this.refreshBody(options.isEnableVirtualScroll);
            } else {
                this.sortBy(this.options.sortDescriptor.path);
            }
            this.refreshFooter();
        }

        public static getGridObject(element: HTMLElement): Grid {
            if (element.grid == undefined || element.grid == null) {
                if (element.parentElement == document.body) {
                    return null;
                }

                return Grid.getGridObject(element.parentElement);
            }

            return element.grid;
        }

        public columnsResized(c: ColumnInfo) {
            if (parseInt(c.width) < 5) {
                c.width = "5";
            }
            this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
        }

        private getPreviousPageFirsItemIndex(): number {
            var result = this.firstVisibleItemIndex - this.options.batchSize;
            if (result < 0) {
                result = 0;
            }

            return result;
        }

        private getPreviousPageSize(): number {
            var realBatchSize = this.options.batchSize + (this.options.firstLoadSize - this.visibleItems.length);

            var perviousPageFirstItemsNumber = this.firstVisibleItemIndex - realBatchSize;
            if (perviousPageFirstItemsNumber < 0) {
                return realBatchSize + perviousPageFirstItemsNumber;
            }

            return realBatchSize;
        }

        private getNextPageFirstItemIndex(): number {
            return this.firstVisibleItemIndex + this.visibleItems.length;
        }

        private getNextPageSize(): number {
            return this.options.batchSize;
        }

        private getEffectiveSorting(): Array<SortDescriptor> {
            var result: Array<SortDescriptor> = new Array<SortDescriptor>();
            var foundSortDescriptor = false;
            var otherSorting: Array<SortDescriptor> = new Array<SortDescriptor>();

            for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                var found = false;
                for (var i = 0; i < result.length; i++) {
                    if (this.options.sortDescriptor.path == this.options.groupBySortDescriptors[j].path) {
                        foundSortDescriptor = true;
                    }
                    if (result[i].path == this.options.groupBySortDescriptors[j].path) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    if (this.options.groupBySortDescriptors[j].path == this.options.sortDescriptor.path) {
                        this.options.groupBySortDescriptors[j].asc = this.options.sortDescriptor.asc;
                    }
                    result.push(this.options.groupBySortDescriptors[j]);
                }

            }
            if (!foundSortDescriptor) {
                result.push(this.options.sortDescriptor);
            }

           
            return result;
        }

        private getEffectiveFiltering(): Array<FilterDescriptor> {
            var allFilter: Array<FilterDescriptor> = [];

            if (this.options.filterDescriptors != null || this.options.filterDescriptors.length > 0) {
                allFilter = allFilter.concat(this.options.filterDescriptors);
            }

            return allFilter;
        }

        private getCollapsedGroupFilter(): Array<FilterDescriptor> {
            var allFilter: Array<FilterDescriptor> = [];

            for (var i = 0; i < this.collapsedFilterGroup.length; i++) {
                if (this.collapsedFilterGroup[i] != null || this.collapsedFilterGroup[i].length > 0) {
                    allFilter = allFilter.concat(this.collapsedFilterGroup[i]);
                }
            }

            return allFilter;
        }

        public scrollTable(): void {
            if (!this.isPreloadingNext && this.enablePreload) {
                if (this.tableBodyContainer.scrollTop > ((this.tableBodyContainer.scrollHeight - this.tableBodyContainer.clientHeight) / 4 * 3) && this.nextPage == null) {
                    this.preloadNextPage();
                }
            }
            if (!this.isPreloadingPrevious && this.enablePreload) {
                if (this.tableBodyContainer.scrollTop < ((this.tableBodyContainer.scrollHeight - this.tableBodyContainer.clientHeight) / 4) && this.previousPage == null) {
                    this.preloadPreviousPage();
                }
            }

            if (this.totalItemsCount > this.firstVisibleItemIndex + this.visibleItems.length) {
                if (this.tableBodyContainer.scrollTop + this.tableBodyContainer.clientHeight >= this.tableBodyContainer.scrollHeight) {
                    this.showNextPage();
                }
            }

            if (this.firstVisibleItemIndex > 0) {
                if (this.tableBodyContainer.scrollTop == 0) {
                    this.showPreviousPage();
                }
            }
            this.updateGlobalScroll();
        }

        private updateGlobalScroll() {
            var firstItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
            if (firstItem != null) {
                var visibleItemNumber = this.firstVisibleItemIndex;
                for (var i = 0; i < this.visibleItems.length; i++) {
                    if (firstItem.item == this.visibleItems[i]) {
                        visibleItemNumber = this.firstVisibleItemIndex + i;
                        break;
                    }
                }

                var scrollPosition = (1000 / this.totalItemsCount) * visibleItemNumber;

                this.scrollBar.scrollTop = scrollPosition;
            }
        }

        private onManualScroll() {
            var itemSize = (1000 / this.totalItemsCount);
            var itemNumber = this.scrollBar.scrollTop / itemSize;
            this.showBuisyIndicator();
            this.previousPage = null;
            this.nextPage = null;
            this.itemProvider.getItems(
                itemNumber,
                this.options.firstLoadSize,
                this.getEffectiveSorting(),
                this.getEffectiveFiltering(),
                this.getCollapsedGroupFilter(),
                (items, first, count) => {
                    this.tableBodyContainer.scrollTop = 1;
                    this.firstVisibleItemIndex = first;
                    this.visibleItems = items;
                    this.visibleViewModels = this.buildViewModels(this.visibleItems);
                    this.updateVisibleItems();
                    this.hideBuisyIndicator();
                });
        }

        private preloadPreviousPage() {
            var size = this.getPreviousPageSize()
            if (size > 0) {
                this.isPreloadingPrevious = true;
                this.itemProvider.getItems(
                    this.getPreviousPageFirsItemIndex(),
                    size,
                    this.getEffectiveSorting(),
                    this.getEffectiveFiltering(),
                    this.getCollapsedGroupFilter(),
                    (items, first, count) => {
                        this.previousPage = items;
                        this.isPreloadingPrevious = false;
                    });
            }
        }

        private preloadNextPage() {
            this.isPreloadingNext = true;
            this.itemProvider.getItems(
                this.getNextPageFirstItemIndex(),
                this.getNextPageSize(),
                this.getEffectiveSorting(),
                this.getEffectiveFiltering(),
                this.getCollapsedGroupFilter(),
                (items, first, count) => {
                    this.nextPage = items;
                    this.isPreloadingNext = false;
                });
        }

        private showPreviousPage(): void {
            if (this.previousPage == null) {
                this.showBuisyIndicator();
                if (!this.isPreloadingPrevious) {
                    this.preloadNextPage();
                }
                setTimeout(
                    () => {
                        this.showPreviousPage();
                    },
                    100);
            }
            else if (this.previousPage != null && this.previousPage.length > 0) {
                this.hideBuisyIndicator();
                this.enablePreload = false;

                this.visibleItems.splice(this.visibleItems.length - this.options.batchSize, this.options.batchSize);
                this.firstVisibleItemIndex -= this.options.batchSize;

                if (this.firstVisibleItemIndex < 0) {
                    this.firstVisibleItemIndex = 0;
                }

                var firstNewItem = this.previousPage[this.previousPage.length - 1];
                this.visibleItems = this.previousPage.concat(this.visibleItems);
                this.visibleViewModels = this.buildViewModels(this.visibleItems);

                this.updateVisibleItems();

                setTimeout(() => {
                    var skipItems = new Array<ItemViewModel>();
                    for (var i = 0; i < this.visibleViewModels.length; i++) {
                        skipItems.push(this.visibleViewModels[i]);
                        if (this.visibleViewModels[i].item == firstNewItem) {
                            break;
                        }
                    }

                    var skipSize = this.htmlProvider.getElemntsSize(this.tableBody, skipItems);

                    this.tableBodyContainer.scrollTop = skipSize;
                    this.previousPage = null;
                    this.nextPage = null;
                    this.enablePreload = true;

                },
                    1);
            }
        }

        private showNextPage(): void {
            if (this.nextPage == null) {
                this.showBuisyIndicator();
                if (!this.isPreloadingNext) {
                    this.preloadNextPage();
                }
                setTimeout(
                    () => {
                        this.showNextPage();
                    },
                    100);
            }
            else if (this.nextPage != null && this.nextPage.length > 0) {
                this.hideBuisyIndicator();
                this.enablePreload = false;
                this.visibleItems.splice(0, this.options.batchSize);
                this.firstVisibleItemIndex += this.options.batchSize;

                var firstNewItem = this.nextPage[0];
                this.visibleItems = this.visibleItems.concat(this.nextPage);
                this.visibleViewModels = this.buildViewModels(this.visibleItems);

                this.updateVisibleItems();

                setTimeout(() => {
                    var skipItems = new Array<ItemViewModel>();
                    for (var i = 0; i < this.visibleViewModels.length; i++) {
                        skipItems.push(this.visibleViewModels[i]);
                        if (this.visibleViewModels[i].item == firstNewItem) {
                            break;
                        }
                    }

                    var skipSize = this.htmlProvider.getElemntsSize(this.tableBody, skipItems);

                    this.tableBodyContainer.scrollTop = skipSize - this.tableBodyContainer.clientHeight;
                    this.nextPage = null;
                    this.previousPage = null;
                    this.enablePreload = true;
                },
                    1);
            }
        }

        public addGroupDescriptor(name: string, asc: boolean): void {
            this.options.groupBySortDescriptors.push(new SortDescriptor(name, asc));
            this.refreshHeader();
            this.refreshBody();
        }

        public removeGroupDescriptor(path: string): void {
            for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                if (this.options.groupBySortDescriptors[i].path == path) {
                    this.options.groupBySortDescriptors.splice(i, 1);
                }
            }
            this.refreshHeader();
            this.refreshBody();
        }

        public showFilterPopup(column: ColumnInfo, pageX: number, pageY: number) {
            this.filterPopupViewModel.onOpen(this.options, column);
            this.filterPopUp.style.left = pageX.toString() + "px";
            this.filterPopUp.style.top = pageY.toString() + "px";
            unhideElement(this.filterPopUp);
        }

        public hideFilterPoup() {
            hideElement(this.filterPopUp);
        }

        public setFilter(column: ColumnInfo, filter: FilterDescriptor) {
            for (var i = 0; i < this.options.filterDescriptors.length; i++) {
                if (this.options.filterDescriptors[i].path == column.filterMemberPath) {
                    this.options.filterDescriptors.splice(i, 1);
                }
            }

            this.options.filterDescriptors.push(filter);
            this.refreshBody();
        }

        public clearFilter(column: ColumnInfo) {
            for (var i = 0; i < this.options.filterDescriptors.length; i++) {
                if (this.options.filterDescriptors[i].path == column.filterMemberPath) {
                    this.options.filterDescriptors.splice(i, 1);
                }
            }
            
            this.refreshBody();
        }

        public sortBy(name: string): void {
            if (name != null) {
                if (name == this.options.sortDescriptor.path) {
                    if (this.options.sortDescriptor.asc) {
                        this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                    } else {
                        this.options.sortDescriptor.path = null;
                        this.options.sortDescriptor.asc = null;
                    }
                } else {
                    this.options.sortDescriptor.path = name;
                    this.options.sortDescriptor.asc = true;
                }
            }
                this.refreshHeader();
                this.refreshBody();
            
        }

        public mobileSortBy(name: string, asc: boolean) {
            if (asc != null) {
                this.options.sortDescriptor.path = name;
                this.options.sortDescriptor.asc = asc;
            } else {
                this.options.sortDescriptor = new SortDescriptor(null, null);
            }
            this.refreshHeader();
            this.refreshBody();
        }

        public selectPage(page: number): void {
            this.options.currentPage = page;
            this.refreshHeader();
            this.refreshBody();
            this.refreshFooter();
        }

        public selectItem(item: ItemViewModel, multi: boolean): boolean {
            if (this.options.selectionMode == SelectionMode.Multi) {
                if (multi) {
                    for (var i = 0; i < this.options.selection.length; i++) {
                        if (item.item == this.options.selection[i]) {
                            this.options.selection.splice(i, 1);
                            this.refreshBody();
                            return false;
                        }
                    }

                    this.options.selection.push(item.item);
      
                }
                else {
                    this.options.selection = [item.item];                   
                }
            } else if (this.options.selectionMode == SelectionMode.Single) {
                this.options.selection = [item.item];
            } else {
                this.options.selection = null;
            }

            if (this.options.selection.length == 1) {
                this.options.showDetailFor = new ShowDetail();
                this.options.showDetailFor.item = this.options.selection[0];
            }

            this.htmlProvider.updateTableDetailRow(this.options, this.tableBodyContainer.getElementsByTagName("tbody")[0], this.options.showDetailFor.item);
            this.htmlProvider.updateMobileDetailRow(this.options, this.mobileContainer, this.options.showDetailFor.item);
            this.updateFooterViewModel();
            return true;
        }

        private buildViewModels(items: Array<any>): Array<ItemViewModel> {
            var itemModels: Array<ItemViewModel> = [];
            var currentGroupNames: Array<string> = new Array<string>();
            var isGroupHeader: Array<boolean> = new Array<boolean>();

            //items = this.addFakeItems(items);

            for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                currentGroupNames.push("");
                isGroupHeader.push(false);
            }

            for (var i = 0; i < items.length; i++) {
                var collapsed = false;
                for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                    var columnValue = getMemberValue(items[i], this.options.groupBySortDescriptors[j].path);
                    if (currentGroupNames[j] !== columnValue) {
                        currentGroupNames[j] = columnValue;
                        var filterDescriptor = new FilterDescriptor(this.options.groupBySortDescriptors[0].path, currentGroupNames[0], FilterCondition.NotEquals);
                        for (var k = 1; k <= j; k++) {
                            filterDescriptor.children.push(new FilterDescriptor(this.options.groupBySortDescriptors[k].path, currentGroupNames[k], FilterCondition.NotEquals));
                        }
                        collapsed = this.isFilterInCollapsed(filterDescriptor);

                        itemModels.push(new ItemViewModel(this.options.parentViewModel,
                            new GroupHeaderDescriptor(currentGroupNames[j], j, collapsed, filterDescriptor),
                            this,
                            true));
                        
                        // clear name of group of deeper level
                        for (var k = j + 1; k < this.options.groupBySortDescriptors.length; k++) {
                            currentGroupNames[k] = "";
                        }

                        if (collapsed) {
                            j = this.options.groupBySortDescriptors.length;
                        }
                    }
                }
                if (!collapsed) {
                    itemModels.push(new ItemViewModel(this.options.parentViewModel, items[i], this, false));
                }
            }
            return itemModels;
        }

        private isFiltersEquals(filter: FilterDescriptor, deeperFilter: FilterDescriptor) : boolean {
            // filter have less children then deeper filter
            if (filter.path == deeperFilter.path && filter.value == deeperFilter.value && filter.children.length <= deeperFilter.children.length) {
                var count = 0;
                for (var i = 0; i < filter.children.length; i++)
                {
                    if (filter.children[i].path == deeperFilter.children[i].path && filter.children[i].value == deeperFilter.children[i].value) {
                        count++;
                    }
                }
                if (count == filter.children.length) {
                    return true;
                }
            }
            return false;
        }

        private isFilterInCollapsed(filterDescriptor: FilterDescriptor): boolean {
            for (var i = 0; i < this.collapsedFilterGroup[filterDescriptor.children.length].length; i++) {
                if (this.isFiltersEquals(filterDescriptor, this.collapsedFilterGroup[filterDescriptor.children.length][i])) {
                    return true;
                }
            }

            return false;
        }
        
        private filterDescriptorToArray(filterDescriptor: FilterDescriptor): Array<FilterDescriptor>{
            var arr = new Array<FilterDescriptor>();
            arr = arr.concat(filterDescriptor.children);
            arr.push(new FilterDescriptor(filterDescriptor.path, filterDescriptor.value, filterDescriptor.condition));
            return arr;
        }

        private updateVisibleItems(): void {
            setTimeout(() => {
                this.tableBody.innerHTML = "";
                this.htmlProvider.updateTableBodyElement(
                    this.options,
                    this.tableBody,
                    this.visibleViewModels,
                    (x, m) => this.selectItem(x, m))
                this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
                }, 1);

            setTimeout(() => {
                this.mobileContainer.innerHTML = "";
                this.htmlProvider.updateMobileItemsList(
                    this.options,
                    this.mobileContainer,
                    this.visibleViewModels,
                    (x, m) => this.selectItem(x, m))
            }, 1);
        }

        private getHtmlProvider(options: Options): IHtmlProvider {
            if (options.framework == Framework.Knockout) {
                return new KnockoutHtmlProvider();
            }

            if (options.framework == Framework.Angular) {
                return new AngularHtmlProvider();
            }
        }

        private getFirstItemNumber(): number {
            return this.options.pageSize * this.options.currentPage;
        }

        private getPageSize(): number {
            return this.options.pageSize;
        }

        private refreshHeader() {
            if (this.options.isEnableGrouping) {
                unhideElement(this.groupByElement);
            }
            else {
                hideElement(this.groupByElement);
            }

            this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.groupByElement, this.filterPopUp, this.itemProvider.isSortable(), c => this.columnsResized(c));
            this.refreshMobileHeader();
        }

        public updateBody() {
            this.refreshBody();
        }

        private refreshBody(withBuisy: boolean = false) {
            if (withBuisy) {
                this.showBuisyIndicator();
            }

            if (!this.options.isEnablePaging) {
                this.itemProvider.getTotalItemsCount(
                    this.getEffectiveFiltering(),
                    totalitemsCount => {
                        this.totalItemsCount = totalitemsCount;
                        this.itemProvider.getItems(
                            this.getFirstItemNumber(),
                            this.options.firstLoadSize,
                            this.getEffectiveSorting(),
                            this.getEffectiveFiltering(),
                            this.getCollapsedGroupFilter(),
                            (items, first, count) => {
                                this.firstVisibleItemIndex = first;
                                this.visibleItems = items;
                                this.visibleViewModels = this.buildViewModels(this.visibleItems );
                                this.updateVisibleItems();
                                this.updateFooterViewModel();
                                if (withBuisy) {
                                    this.hideBuisyIndicator();
                                }
                            })
                    });
            } else {
                this.itemProvider.getTotalItemsCount(
                    this.getEffectiveFiltering(),
                    totalitemsCount => {
                        this.totalItemsCount = totalitemsCount;
                        this.itemProvider.getItems(
                            this.getFirstItemNumber(),
                            this.getPageSize(),
                            this.getEffectiveSorting(),
                            this.getEffectiveFiltering(),
                            this.getCollapsedGroupFilter(),
                            (items, first, count) => {
                                this.firstVisibleItemIndex = first;
                                this.visibleItems = items;
                                this.visibleViewModels = this.buildViewModels(this.visibleItems);
                                this.updateVisibleItems();
                                this.updateFooterViewModel();
                                if (withBuisy) {
                                    this.hideBuisyIndicator();
                                }
                            })
                        }
                    );
            }
        }

        private refreshFooter() {
            this.tableFooter.innerHTML = "";
            this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount, this.footerViewModel);
        }

        private updateFooterViewModel() {
            if (this.footerViewModel != null) {
                this.footerViewModel.setCurrentPage(this.options.currentPage +1);
                this.footerViewModel.setSelectedItem(this.options.selection[0]);
                this.footerViewModel.setTotalCount(this.totalItemsCount);
                if (this.options.isEnablePaging) {
                    this.footerViewModel.setTotalPages(Math.ceil(this.totalItemsCount / this.options.pageSize));
                } else {
                    this.footerViewModel.setTotalPages(1);
                }

            }
        }

        private showBuisyIndicator() {
            this.buisyIndicator.removeAttribute("style");
        }

        private hideBuisyIndicator() {
            this.buisyIndicator.setAttribute("style", "display: none;");
        }

        public setCollapsedFilters(filterDescriptor: FilterDescriptor) {
            this.collapsedFilterGroup[filterDescriptor.children.length].push(filterDescriptor);
            this.refreshBody();
        }

        public removeCollapsedFilters(filterDescriptor: FilterDescriptor) {
            for (var i = 0; i < this.collapsedFilterGroup[filterDescriptor.children.length].length; i++) {
                if (this.isFiltersEquals(this.collapsedFilterGroup[filterDescriptor.children.length][i], filterDescriptor)) {
                    this.collapsedFilterGroup[filterDescriptor.children.length].splice(i, 1);
                }
            }
            this.refreshBody();
       }

        public setFilters(filterDescriptor: FilterDescriptor) {
            this.removeFilters(false);
            this.options.filterDescriptors.push(filterDescriptor);
            this.refreshMobileHeader();
            this.refreshBody();
        }

        public removeFilters(isRefresh: boolean = true) {
            for (var i = 0; i < this.options.filterDescriptors.length; i++) {
                if (this.options.filterDescriptors[i].path == this.options.filterPath) {
                    this.options.filterDescriptors.splice(i, 1);
                }
            }
            if (isRefresh) {
                this.refreshMobileHeader();
                this.refreshBody();
            }
        }

        private refreshMobileHeader() {
            this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.filterPopUp, this.itemProvider.isSortable());
        }
    }
}