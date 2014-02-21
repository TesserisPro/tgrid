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


/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="knockout/KnockoutFilterPopupViewModel.ts"/>
/// <reference path="angular/AngularFilterPopupViewModel.ts"/>
/// <reference path="angular/AngularHtmlProvider.ts" />
/// <reference path="angular/AngularItemViewModel.ts"/>
/// <reference path="GroupHeaderDescriptor.ts" />
/// <reference path="utils.ts" />
/// <reference path="IFooterViewModel.ts"/>
/// <reference path="scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="scripts/typings/knockout/knockout.d.ts"/>

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

        private bodyAndHeaderContainer: HTMLElement;

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

        private collapsedGroupFilterDescriptors: FilterDescriptor[];

        private enablePreload: boolean = true;

        private manualScrollTimeoutToken: any;

        private isBuisy: boolean = false;

        constructor(element: HTMLElement, options: Options, provider: IItemProvider) {
            element.grid = this;
            this.targetElement = element;
            this.options = options;

            this.collapsedGroupFilterDescriptors = new Array<FilterDescriptor>();
            //for (var i = 0; i < this.options.columns.length; i++) {
            //    this.collapsedFilterGroup.push(new Array<FilterDescriptor>());
            //}

            this.itemProvider = provider;
            var self = this;
            this.itemProvider.actionAfterAddingItem = function () {
                if (!self.options.enableVirtualScroll) {
                    self.options.firstLoadSize++;
                }
                self.refreshBody();
            }
            this.itemProvider.actionAfterDeletingItem = function () {
                if (!self.options.enableVirtualScroll) {
                    self.options.firstLoadSize--;
                }
                self.refreshBody();
            }
            this.htmlProvider = this.getHtmlProvider(this.options);

            this.footerViewModel = this.htmlProvider.getFooterViewModel(this);

            this.rootElement = document.createElement("div");
            this.rootElement.className = "tgrid-root";

            this.groupByElement = document.createElement("div");
            this.groupByElement.className = "tgrid-group-by-panel desktop";
            this.rootElement.appendChild(this.groupByElement);

            this.headerContainer = document.createElement("div");
            this.headerContainer.className = "tgrid-tableheadercontainer desktop";
            this.headerContainer.style.overflowX = "hidden";
            var headerTable = document.createElement("table");
            headerTable.className = "tgrid-table";
            this.headerContainer.appendChild(headerTable);
            
            // filter popup
            if (this.options.enableFiltering) {
                this.filterPopUp = document.createElement("div");
                this.filterPopUp.setAttribute("class", "tgrid-filter-popup");
                this.filterPopUp.style.display = "none";
                this.targetElement.appendChild(this.filterPopUp);
                this.filterPopupViewModel = this.htmlProvider.getFilterPopupViewModel(this.filterPopUp);
                this.htmlProvider.updateFilteringPopUp(this.options, this.filterPopUp, this.filterPopupViewModel);
            }


            this.bodyAndHeaderContainer = document.createElement("div");
            this.bodyAndHeaderContainer.className = "tgrid-body-and-header-container";
            this.bodyAndHeaderContainer.style.position = "relative";
            this.bodyAndHeaderContainer.style.overflowX = "auto";
            this.bodyAndHeaderContainer.style.width = "100%";

            // Header
            this.mobileHeader = document.createElement("div");
            this.mobileHeader.className = "tgrid-mobile-header mobile";
            this.bodyAndHeaderContainer.appendChild(this.mobileHeader);

            this.tableHeader = document.createElement("thead");
            this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
            headerTable.appendChild(this.tableHeader);
            this.bodyAndHeaderContainer.appendChild(this.headerContainer);

            // Body
            this.tableBodyContainer = document.createElement("div");
            this.tableBodyContainer.className = "tgrid-tablebodycontainer desktop";
            this.tableBodyContainer.style.overflowX = "auto";
            this.tableBodyContainer.onscroll = () => this.headerContainer.scrollLeft = this.tableBodyContainer.scrollLeft;

            this.mobileContainer = document.createElement("div");
            this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");

            if (options.enableVirtualScroll) {
                this.tableBodyContainer.onscroll = () => this.scrollTable();
                this.mobileContainer.onscroll = () => this.scrollTable();
            } else {
                this.itemProvider.getTotalItemsCount(options.filterDescriptor, (total) => { this.options.firstLoadSize = total; });
            }

            var bodyTable = document.createElement("table");
            bodyTable.className = "tgrid-table";

            this.tableBodyContainer.appendChild(bodyTable);

            this.tableBody = document.createElement("tbody");
            bodyTable.appendChild(this.tableBody);

            if (options.enableVirtualScroll) {
                this.scrollBar = document.createElement("div");
                this.scrollBar.className = "tgrid-scroll";
                this.scrollBar.style.overflowX = "hidden";
                this.scrollBar.style.overflowY = "scroll";

                var scrollContent = document.createElement("div");
                scrollContent.style.height = "10000px";
                scrollContent.style.width = "1px";
                this.scrollBar.appendChild(scrollContent);
                this.bodyAndHeaderContainer.appendChild(this.scrollBar);

                this.scrollBar.onscroll = () => this.onManualScroll();

            }

            this.bodyAndHeaderContainer.appendChild(this.tableBodyContainer);
            this.bodyAndHeaderContainer.appendChild(this.mobileContainer);
            this.rootElement.appendChild(this.bodyAndHeaderContainer);

            // Footer
            this.tableFooter = document.createElement("div");
            this.tableFooter.setAttribute("class", "tgrid-footer");
            this.rootElement.appendChild(this.tableFooter);


            this.targetElement.appendChild(this.rootElement);
            this.tableBodyContainer.scrollTop = 0;

            if (this.options.groupBySortDescriptors.length > 0) {
                this.refreshHeader();
                this.refreshBody(options.enableVirtualScroll);
            } else {
                this.sortBy(this.options.sortDescriptor.path);
            }
            this.refreshFooter();

            this.buisyIndicator = document.createElement("div");
            this.buisyIndicator.className = "tgrid-buisy-indicator";
            this.rootElement.appendChild(this.buisyIndicator);

            this.rootElement.onmousewheel = e => this.mouseWheel(e);

            this.rootElement.tabIndex = 0;
            this.rootElement.onkeydown = e => this.keyPress(e);
            
            this.tableBodyContainer.onmousedown = e => {
                if (e.button == 1) {
                    e.preventDefault();
                }
            }

            this.hideBuisyIndicator();
        }

        public static getGridObject(element: HTMLElement): Grid {
            if (element == null) {
                return null;
            }
            if (element.grid == undefined || element.grid == null) {
                if (element.parentElement == document.body) {
                    return null;
                }

                return Grid.getGridObject(element.parentElement);
            }

            return element.grid;
        }

        public columnsResized(c: ColumnInfo) {
            if (parseInt(c.width) < this.options.columnMinWidth) {
                c.width = this.options.columnMinWidth.toString();
            }
            this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
        }

        private mouseWheel(e: MouseWheelEvent) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            this.tableBodyContainer.scrollTop = this.tableBodyContainer.scrollTop - e.wheelDelta;
            this.mobileContainer.scrollTop = this.mobileContainer.scrollTop - e.wheelDelta;
        }

        private keyPress(e: KeyboardEvent): void{
            switch (e.keyCode)
            {
                case 38: //Up arrow
                    e.preventDefault();
                    this.selectPreviousItem();
                    break;
                case 40: // Down arrow
                    e.preventDefault();
                    this.selectNextItem();
                    break;
            }
        }

        private selectNextItem() {
            var selectedItem: ItemViewModel;
            if (this.options.selection.length > 0) {
                var item = this.options.selection[this.options.selection.length - 1];
                for (var i = 0; i < this.visibleViewModels.length; i++) {
                    if (this.visibleViewModels[i].item == item) {
                        while (i < this.visibleViewModels.length-1 && this.visibleViewModels[i+1].isGroupHeader) {
                            i++;
                        }
                        if (i < this.visibleViewModels.length-1 && !this.visibleViewModels[i+1].isGroupHeader) {
                            selectedItem = this.visibleViewModels[i + 1];
                            break;
                        }
                        if (i == this.visibleViewModels.length - 1) {
                            if (!this.visibleViewModels[i].isGroupHeader) {
                                selectedItem = this.visibleViewModels[i];
                                break;
                            } else {
                                while(i >= 0 && this.visibleViewModels[i].isGroupHeader) {
                                    i--;
                                }
                                selectedItem = this.visibleViewModels[i];
                                break;
                            }
                        }
                    }
                }
            }
            if (selectedItem == null && this.visibleViewModels.length != 0) {
                selectedItem = this.visibleViewModels[0];
            }
            if (selectedItem != null) {
                this.selectItem(selectedItem, false);
            }
        }

        private selectPreviousItem() {
            var selectedItem: ItemViewModel;
            if (this.options.selection.length > 0) {
                var item = this.options.selection[this.options.selection.length - 1];
                for (var i = this.visibleViewModels.length-1; i >= 0; i--) {
                    if (this.visibleViewModels[i].item == item) {
                        while (i > 0 && this.visibleViewModels[i - 1].isGroupHeader) {
                            i--;
                        }
                        if (i > 0 && !this.visibleViewModels[i - 1].isGroupHeader) {
                            selectedItem = this.visibleViewModels[i - 1];
                            break;
                        }
                        if (i == 0) {
                            if (!this.visibleViewModels[i].isGroupHeader) {
                                selectedItem = this.visibleViewModels[i];
                                break;
                            } else {
                                while (i < this.visibleViewModels.length - 1 && this.visibleViewModels[i].isGroupHeader) {
                                    this.scrollIntoView(this.visibleViewModels[i].item);
                                    i++;
                                }
                                selectedItem = this.visibleViewModels[i];
                                break;
                            }
                        }
                    }
                }
            }
            if (selectedItem == null && this.visibleViewModels.length != 0) {
                selectedItem = this.visibleViewModels[0];
            }
            if (selectedItem != null) {
                this.selectItem(selectedItem, false);
            }
        }

        private getPreviousPageFirsItemIndex(): number {
            var result = this.firstVisibleItemIndex - this.options.batchSize;
            if (result < 0) {
                result = 0;
            }

            return result;
        }

        private isDesktopMode(): boolean {
            return this.tableBodyContainer.clientWidth != 0;
        }

        private getPreviousPageSize(): number {
            var realBatchSize = this.options.batchSize;

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

        private getEffectiveFiltering(): FilterDescriptor {
            return this.options.filterDescriptor;
        }

        private getCollapsedGroupFilter(): Array<FilterDescriptor> {
            return this.collapsedGroupFilterDescriptors;
        }

        public scrollTable(): void {
            if (this.isDesktopMode) {
                this.headerContainer.scrollLeft = this.tableBodyContainer.scrollLeft;
            }
            var container = this.isDesktopMode() ? this.tableBodyContainer : this.mobileContainer;

            if (!this.isPreloadingNext && this.enablePreload) {
                if (container.scrollTop > ((container.scrollHeight - container.clientHeight) / 4 * 3) && this.nextPage == null) {
                    this.preloadNextPage();
                }
            }

            if (!this.isPreloadingPrevious && this.enablePreload) {
                if (container.scrollTop < ((container.scrollHeight - container.clientHeight) / 4) && this.previousPage == null) {
                    this.preloadPreviousPage();
                }
            }

            if (this.totalItemsCount > this.firstVisibleItemIndex + this.visibleItems.length) {
                if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                    this.showNextPage();
                }
            }

            if (this.firstVisibleItemIndex > 0) {
                if (container.scrollTop <= 10) {
                    this.showPreviousPage();
                }
            }

            if (this.isDesktopMode()) {
                this.updateGlobalScroll();
            }
            else {
                //this.updateGlobalScrollMobile();
            }
        }

        private updateGlobalScroll() {
            
            if (this.tableBodyContainer.scrollTop == this.tableBodyContainer.scrollHeight - this.tableBodyContainer.clientHeight
                && this.firstVisibleItemIndex + this.visibleItems.length == this.totalItemsCount) {
                    this.scrollBar.scrollTop = this.scrollBar.scrollHeight - this.scrollBar.clientHeight;
                    return;    
            }

            var firstItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
            if (firstItem != null) {
                var visibleItemIndex = this.firstVisibleItemIndex;
                for (var i = 0; i < this.visibleItems.length; i++) {
                    if (firstItem.item == this.visibleItems[i]) {
                        visibleItemIndex = this.firstVisibleItemIndex + i;
                        break;
                    }
                }
                
                this.scrollBar.onscroll = null;
                var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex+10;
                this.scrollBar.onscroll = () => { this.scrollBar.onscroll = () => this.onManualScroll(); };
                this.scrollBar.scrollTop = scrollPosition;
            }
        }


        private updateGlobalScrollMobile() {
            if (this.mobileContainer.scrollTop == this.mobileContainer.scrollHeight - this.mobileContainer.clientHeight
                && this.firstVisibleItemIndex + this.visibleItems.length == this.totalItemsCount) {
                this.scrollBar.scrollTop = this.scrollBar.scrollHeight - this.scrollBar.clientHeight;
                return;
            }

            var firstItem = this.htmlProvider.getFirstVisibleItem(this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
            if (firstItem != null) {
                var visibleItemIndex = this.firstVisibleItemIndex;
                for (var i = 0; i < this.visibleItems.length; i++) {
                    if (firstItem.item == this.visibleItems[i]) {
                        visibleItemIndex = this.firstVisibleItemIndex + i;
                        break;
                    }
                }

                this.scrollBar.onscroll = null;
                var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.mobileContainer, this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex;
                this.scrollBar.onscroll = () => { this.scrollBar.onscroll = () => this.onManualScroll(); };
                this.scrollBar.scrollTop = scrollPosition;
            }
        }

        private onManualScroll() {
            if (this.manualScrollTimeoutToken != null) {
                clearTimeout(this.manualScrollTimeoutToken);
            }

            this.manualScrollTimeoutToken = setTimeout(() => {
                this.manualScrollTimeoutToken = null;
                var visibleItemsCount
                if (this.isDesktopMode()) {
                        visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                    }
                    else {
                        visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.mobileContainer, this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                    }
                    var itemSize = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount);
                    var itemNumber = this.scrollBar.scrollTop / itemSize;
                    this.showBuisyIndicator();
                    this.previousPage = null;
                    this.nextPage = null;
                    var scrollBottom = false;

                    if (itemNumber + this.options.firstLoadSize > this.totalItemsCount) {
                        itemNumber = this.totalItemsCount - this.options.firstLoadSize;
                        scrollBottom = true;
                    }

                    this.itemProvider.getItems(
                        itemNumber,
                        this.options.firstLoadSize,
                        this.getEffectiveSorting(),
                        this.getEffectiveFiltering(),
                        this.getCollapsedGroupFilter(),
                        (items, first, count) => {
                            if (itemNumber == 0) {
                                this.scrollTableContainer(0);
                            }
                            else {
                                this.scrollTableContainer(48);
                            }
                            this.firstVisibleItemIndex = first;
                            this.visibleItems = items;
                            this.visibleViewModels = this.buildViewModels(this.visibleItems);
                            this.updateVisibleItems();
                            this.hideBuisyIndicator();
                            if (scrollBottom) {
                                this.silentScrollTableContainer(this.tableBody.offsetHeight - this.tableBodyContainer.clientHeight);
                            }
                        });
                },
                400);
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
                if (this.firstVisibleItemIndex == 0) {
                    this.hideBuisyIndicator();
                    return;
                }
                this.showBuisyIndicator();
                if (!this.isPreloadingPrevious) {
                    this.preloadPreviousPage();
                }
                setTimeout(
                    () => {
                        this.showPreviousPage();
                    },
                    10);
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


                var skipItems = new Array<ItemViewModel>();
                for (var i = 0; i < this.visibleViewModels.length - 1; i++) {
                    skipItems.push(this.visibleViewModels[i]);
                    if (this.visibleViewModels[i].item == firstNewItem) {
                        skipItems.push(this.visibleViewModels[i + 1]);
                        break;
                    }
                }

                var skipSize = this.htmlProvider.getElementsSize(this.tableBody, skipItems);

                this.scrollTableContainer(skipSize);
                this.previousPage = null;
                this.nextPage = null;
                this.enablePreload = true;

            }
        }

        private showNextPage(): void {
            if (this.nextPage == null) {
                if (this.totalItemsCount <= this.firstVisibleItemIndex + this.visibleItems.length) {
                    this.hideBuisyIndicator();
                    return;
                }
                this.showBuisyIndicator();
                if (!this.isPreloadingNext) {
                    this.preloadNextPage();
                }
                setTimeout(
                    () => {
                        this.showNextPage();
                    },
                    10);
            }
            else if (this.nextPage != null && this.nextPage.length > 0) {
                this.hideBuisyIndicator();
                this.enablePreload = false;
                var item;
                if (this.isDesktopMode()) {
                     item = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                }
                else {
                    item = this.htmlProvider.getFirstVisibleItem(this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                }
                var itemNumber = 0;

                for (var i = 0; i < this.visibleItems.length; i++) {
                    if (item.item == this.visibleItems[i]) {
                        itemNumber = i;
                        break;
                    }
                }

                var itemsToRemove = itemNumber - this.options.batchSize;

                if (itemsToRemove > 0) {
                    this.visibleItems.splice(0, itemsToRemove);
                    this.firstVisibleItemIndex += itemsToRemove;
                }

                var firstNewItem = item;
                for (var i = 0; i < this.visibleItems.length - 1; i++) {
                    if (item.item == this.visibleItems[i]) {
                        firstNewItem = this.visibleItems[i + 1];
                        break;
                    }
                }

                this.visibleItems = this.visibleItems.concat(this.nextPage);
                this.visibleViewModels = this.buildViewModels(this.visibleItems);

                this.updateVisibleItems();


                var skipItems = new Array<ItemViewModel>();
                for (var i = 0; i < this.visibleViewModels.length; i++) {
                    skipItems.push(this.visibleViewModels[i]);
                    if (this.visibleViewModels[i].item == firstNewItem) {
                        break;
                    }
                }

                var skipSize = this.isDesktopMode() ? this.htmlProvider.getElementsSize(this.tableBody, skipItems) : this.htmlProvider.getElementsSize(this.mobileContainer, skipItems);

                this.scrollTableContainer(skipSize);
                this.nextPage = null;
                this.previousPage = null;
                this.enablePreload = true;
                this.rootElement.focus();
            }
        }

        private scrollTableContainer(scrollTop: number) {
            this.tableBodyContainer.scrollTop = scrollTop;
            this.mobileContainer.scrollTop = scrollTop <= 0 ? 2 : scrollTop;
        }

        private silentScrollTableContainer(scrollTop: number) {
            this.tableBodyContainer.onscroll = null;
            this.mobileContainer.onscroll = null;
            this.tableBodyContainer.scrollTop = scrollTop;
            this.mobileContainer.scrollTop = scrollTop <= 0 ? 2 : scrollTop;
            setTimeout(() =>
            {
                this.tableBodyContainer.onscroll = () => this.scrollTable();
                this.mobileContainer.onscroll = () => this.scrollTable();
            }, 10);
        }

        public addGroupDescriptor(name: string, asc: boolean): void {
            this.options.groupBySortDescriptors.push(new SortDescriptor(name, asc));
            this.refreshHeader();
            this.refreshBody();
        }

        public toggleGroupDescriptor(name: string): void {
            for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                if (this.options.groupBySortDescriptors[i].path == name) {
                    this.removeGroupDescriptor(name);
                    return;
                }
            }
            this.addGroupDescriptor(name, true);
        }

        public removeGroupDescriptor(path: string): void {
            for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                if (this.options.groupBySortDescriptors[i].path == path) {
                    this.options.groupBySortDescriptors.splice(i, 1);
                    break;
                }
            }
            var removed = true;
            while (removed) {
                removed = false;
                for (var i = 0; !removed && i < this.collapsedGroupFilterDescriptors.length; i++) {
                    for (var j = 0; !removed && j < this.collapsedGroupFilterDescriptors[i].children.length; j++) {
                        if (this.collapsedGroupFilterDescriptors[i].children[j].path == path) {
                            this.collapsedGroupFilterDescriptors.splice(i, 1);
                            removed = true;
                        }
                    }
                }
            }

            this.refreshHeader();
            this.refreshBody();
        }

        public showFilterPopup(column: ColumnInfo, pageX: number, pageY: number, isForDesktop: boolean) {
            this.options.filterPopupForColumn = column;
            this.filterPopupViewModel.onOpen(this.options, column);
            if (isForDesktop) {
                this.filterPopUp.style.left = pageX.toString() + "px";
                this.filterPopUp.style.top = pageY.toString() + "px";
            }
            unhideElement(this.filterPopUp);
        }

        public hideFilterPopup() {
            hideElement(this.filterPopUp);
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
            //if (this.options.tableFooterTemplate == null) {
                this.refreshFooter();
            //}
        }

        public selectItem(item: ItemViewModel, multi: boolean): boolean {
            var oldSelection = new Array<any>();
            for (var i = 0; i < this.options.selection.length; i++) {
                oldSelection.push(this.options.selection[i]);
            }

            if (this.options.selectionMode == SelectionMode.Multi) {
                if (multi) {
                    if (this.options.isSelected(item.item)) {
                        this.options.selection.splice(i, 1);
                    }
                    else {
                        this.options.selection.push(item.item);
                    }
                }
                else {
                    this.options.selection = [item.item];
                }
            } else if (this.options.selectionMode == SelectionMode.Single) {
                if (this.options.selection[0] == item.item && this.options.shouldAddDetailsOnSelection) {
                   this.options.shouldAddDetailsOnSelection = false;
                } else {
                    this.options.shouldAddDetailsOnSelection = true;
                }
                this.options.selection = [item.item];
            } else {
                this.options.selection = new Array<any>();
            }

            if (this.options.openDetailsOnSelection) {
                if (this.options.selection.length == 1) {
                    this.options.showDetailFor = new ShowDetail();
                    this.options.showDetailFor.item = this.options.selection[0];
                }
                
            } else {
                this.options.showDetailFor = new ShowDetail();
            }

            for (var i = 0; i < oldSelection.length; i++) {
                this.updateRow(oldSelection[i], this.options.shouldAddDetailsOnSelection);
            }

            for (var i = 0; i < this.options.selection.length; i++) {
                this.updateRow(this.options.selection[i], this.options.shouldAddDetailsOnSelection);
            }
            this.scrollIntoView(item.item);
            this.updateFooterViewModel();
            return true;
        }


        public scrollIntoView(item: any): void {
            var viewModels: Array<ItemViewModel> = new Array<ItemViewModel>();
            var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.visibleViewModels, this.tableBodyContainer.scrollTop);

            var firstVisibleItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);

            visibleItemsCount--;

            var visibleItemsArea: boolean = false;
            
            for (var i = 0; i < this.visibleViewModels.length; i++){
                if (i > 0 && firstVisibleItem == this.visibleViewModels[i-1]) {
                    visibleItemsArea = true;
                }
                if (visibleItemsArea) {
                    visibleItemsCount--;
                }
                if (visibleItemsCount < 0) {
                    visibleItemsArea = false;
                }
                if (this.visibleViewModels[i].item == item) {
                    if (visibleItemsArea) {
                        return;
                    }
                    break;
                }
                viewModels.push(this.visibleViewModels[i]);
            }

            var scrollTo = this.htmlProvider.getElementsSize(this.tableBody, viewModels);
            
            this.tableBodyContainer.scrollTop = scrollTo;
        }

        public updateRow(item: any, shouldAddDetails: boolean): void {
            this.htmlProvider.updateTableDetailRow(this.options, this.tableBodyContainer.getElementsByTagName("tbody")[0], item, shouldAddDetails);
            this.htmlProvider.updateMobileDetailRow(this.options, this.mobileContainer, item, shouldAddDetails);
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

            var collapsed = false;
            var colapsedGroupLevel = this.options.groupBySortDescriptors.length;
            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < colapsedGroupLevel; j++) {
                    var columnValue = getMemberValue(items[i], this.options.groupBySortDescriptors[j].path);
                    // New group found
                    if (currentGroupNames[j] !== columnValue) {
                        currentGroupNames[j] = columnValue;
                        collapsed = false;
                        colapsedGroupLevel = this.options.groupBySortDescriptors.length;

                        var filterDescriptor = new FilterDescriptor(
                            "",
                            "",
                            FilterCondition.None,
                            LogicalOperator.And,
                            LogicalOperator.And);

                        for (var k = 0; k <= j; k++) {
                            filterDescriptor.children.push(
                                new FilterDescriptor(this.options.groupBySortDescriptors[k].path, currentGroupNames[k], FilterCondition.Equals));
                        }

                        collapsed = this.isGroupCollapsedOrInsideCollapsed(filterDescriptor);

                        itemModels.push(new ItemViewModel(this.options.parentViewModel,
                            new GroupHeaderDescriptor(currentGroupNames[j], j, collapsed, filterDescriptor),
                            this,
                            true));

                        // clear name of group of deeper level
                        for (var k = j + 1; k < this.options.groupBySortDescriptors.length; k++) {
                            currentGroupNames[k] = "";
                        }

                        if (collapsed) {
                            colapsedGroupLevel = j + 1;
                            break;
                        }
                    }
                }
                if (!collapsed) {
                    itemModels.push(new ItemViewModel(this.options.parentViewModel, items[i], this, false));
                }
            }
            return itemModels;
        }

        private isEqualOrDeeperThanCollapsedFilter(collapsedFilter: FilterDescriptor, filter: FilterDescriptor): boolean {
            if (filter.children.length >= collapsedFilter.children.length) {
                for (var i = 0; i < collapsedFilter.children.length; i++) {
                    if ( filter.children[i].path !== collapsedFilter.children[i].path ||
                         filter.children[i].value !== collapsedFilter.children[i].value) {
                             return false;
                    }
                }
                return true;
            }
            return false;
        }

        private isGroupCollapsedOrInsideCollapsed(filterDescriptor: FilterDescriptor): boolean {
            for (var i = 0; i < this.collapsedGroupFilterDescriptors.length; i++) {
                if (this.isEqualOrDeeperThanCollapsedFilter(this.collapsedGroupFilterDescriptors[i], filterDescriptor)) {
                    return true;
                }
            }
            return false;
        }

        private updateVisibleItems(): void {

            this.tableBody.innerHTML = "";
            this.htmlProvider.updateTableBodyElement(
                this.options,
                this.tableBody,
                this.visibleViewModels,
                (x, m) => this.selectItem(x, m));
            this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
           
            this.mobileContainer.innerHTML = "";
            this.htmlProvider.updateMobileItemsList(
                this.options,
                this.mobileContainer,
                this.visibleViewModels,
                (x, m) => this.selectItem(x, m));

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
            if (this.options.enableGrouping) {
                unhideElement(this.groupByElement);
            }
            else {
                hideElement(this.groupByElement);
            }

            this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.groupByElement, this.filterPopUp, c => this.columnsResized(c));
            this.refreshMobileHeader();
        }

        public updateBody() {
            this.refreshBody();
        }

        private refreshBody(withBuisy: boolean = false) {
            if (withBuisy) {
                this.showBuisyIndicator();
            }

            if (!this.options.enablePaging) {
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
                                this.visibleViewModels = this.buildViewModels(this.visibleItems);
                                this.updateVisibleItems();
                                this.updateFooterViewModel();
                                if (withBuisy) {
                                    this.hideBuisyIndicator();

                                }

                                //to avoid infinite loop.
                                var elementsSize = this.isDesktopMode() ? this.htmlProvider.getElementsSize(this.tableBody, null) : this.htmlProvider.getElementsSize(this.mobileContainer, null);
                                if (elementsSize > 0 && this.options.firstLoadSize > 0 && isNotNoU(this.options.firstLoadSize)) {
                                    if (this.isDesktopMode() && elementsSize < (this.tableBodyContainer.clientHeight + 100) && (this.options.firstLoadSize < this.totalItemsCount)) {
                                        this.options.firstLoadSize *= 2;
                                        if (this.options.firstLoadSize > this.totalItemsCount) {
                                            this.options.firstLoadSize = this.totalItemsCount;
                                        }
                                        this.refreshBody();
                                    }

                                    if (!this.isDesktopMode() && this.htmlProvider.getElementsSize(this.mobileContainer, null) < (this.mobileContainer.clientHeight + 100) && (this.options.firstLoadSize < this.totalItemsCount)) {
                                        this.options.firstLoadSize *= 2;
                                        if (this.options.firstLoadSize > this.totalItemsCount) {
                                            this.options.firstLoadSize = this.totalItemsCount;
                                        }
                                        this.refreshBody();
                                    }
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
            this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount, this.footerViewModel);
        }

        private updateFooterViewModel() {
            if (this.footerViewModel != null) {
                this.footerViewModel.setCurrentPage(this.options.currentPage + 1);
                this.footerViewModel.setSelectedItem(this.options.selection[0]);
                this.footerViewModel.setTotalCount(this.totalItemsCount);
                if (this.options.enablePaging) {
                    this.footerViewModel.setTotalPages(Math.ceil(this.totalItemsCount / this.options.pageSize));
                } else {
                    this.footerViewModel.setTotalPages(1);
                }

            }
        }

        private showBuisyIndicator() {
            this.isBuisy = true;
            this.buisyIndicator.removeAttribute("style");
        }

        private hideBuisyIndicator() {
            this.buisyIndicator.setAttribute("style", "display: none;");
            this.isBuisy = false;
        }

        public setCollapsedFilters(filterDescriptor: FilterDescriptor) {
            this.collapsedGroupFilterDescriptors.push(filterDescriptor);
            this.refreshBody();
        }

        public removeCollapsedFilters(filterDescriptor: FilterDescriptor) {
            for (var i = 0; i < this.collapsedGroupFilterDescriptors.length; i++) {
                if (this.isEqualOrDeeperThanCollapsedFilter(this.collapsedGroupFilterDescriptors[i], filterDescriptor)) {
                    this.collapsedGroupFilterDescriptors.splice(i, 1);
                }
            }

            this.refreshBody();
        }

        public applyFilters() {
            this.refreshHeader();
            this.refreshBody();
            this.refreshFooter();
        }

        private refreshMobileHeader() {
            this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.filterPopUp);
        }

        public afterOptionsChange() {
            this.refreshHeader();
            this.refreshBody();
            this.refreshFooter();
        }
        
    }
}