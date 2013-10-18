/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="ISortableItemProvider.ts" />
/// <reference path="IFilterableItemProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="angular/AngularHtmlProvider.ts" />
/// <reference path="GroupHeaderDescriptor.ts" />

module TesserisPro.TGrid {

    export class Grid {
        private targetElement: HTMLElement;
        private headerContainer: HTMLElement;
        private tableBody: HTMLElement;
        private tableBodyContainer: HTMLElement;
        private tableFooter: HTMLElement;
        private tableHeader: HTMLElement;
        private mobileContainer: HTMLElement;
        private mobileHeader: HTMLElement;
        private htmlProvider: IHtmlProvider;
        private itemProvider: IItemProvider;
        private filterProvider: IFilterableItemProvider;
        private options: Options;

        private firstVisibleItemIndex: number;
        private totalItemsCount: number;
        private preloadedPage: Array<any>;
        private visibleItems: Array<any>;
        private visibleViewModels: Array<ItemViewModel>;
        private isPreloading: boolean;
        

        constructor(element: HTMLElement, options: Options, provider: IItemProvider) {
            element.grid = this;
            this.targetElement = element;
            this.options = options;
            this.itemProvider = provider;
            this.htmlProvider = this.getHtmlProvider(this.options);

            this.headerContainer = document.createElement("div");
            this.headerContainer.className = "tgrid-tableheadercontainer";
            var headerTable = document.createElement("table");
            headerTable.className = "tgrid-table";
            this.headerContainer.appendChild(headerTable);

            // Header
            this.mobileHeader = document.createElement("div");
            this.mobileHeader.setAttribute("class", "tgrid-mobile-header mobile");
            this.targetElement.appendChild(this.mobileHeader);
                        
            this.tableHeader = document.createElement("thead");
            this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
            headerTable.appendChild(this.tableHeader);
            this.targetElement.appendChild(this.headerContainer);


            // Body
            this.tableBodyContainer = document.createElement("div");
            this.tableBodyContainer.className = "tgrid-tablebodycontainer";
            this.tableBodyContainer.onscroll = () => this.scrollTable();

            var bodyTable = document.createElement("table");
            bodyTable.className = "tgrid-table";

            this.tableBodyContainer.appendChild(bodyTable);

            this.tableBody = document.createElement("tbody");
            bodyTable.appendChild(this.tableBody);
            this.targetElement.appendChild(this.tableBodyContainer);
                        

            this.mobileContainer = document.createElement("div");
            this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");
            this.targetElement.appendChild(this.mobileContainer);

            // Footer
            this.tableFooter = document.createElement("div");
            this.tableFooter.setAttribute("class", "tgrid-footer");
            this.targetElement.appendChild(this.tableFooter);

            if (this.options.groupBy == "") {
                this.refreshHeader();
                this.refreshBody();
                if (this.options.pageSize != 0) {
                    this.refreshFooter();
                }
            } else {
                this.sortBy(this.options.groupBySortDescriptor[0].column);
                if (this.options.pageSize != 0) {
                    this.refreshFooter();
                }
            }
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

        private getPreviousPageFirsItemIndex(): number {
            var result = this.firstVisibleItemIndex - this.options.batchSize;
            if (result < 0) {
                result = 0;
            }

            return result;
        }

        private getPreviousPageSize(): number {
            var perviousPageFirstItemsNumber = this.firstVisibleItemIndex - this.options.batchSize;
            if (perviousPageFirstItemsNumber < 0) {
                return this.options.batchSize + perviousPageFirstItemsNumber;
            }

            return this.options.batchSize;
        }

        private getNextPageFirstItemIndex(): number {
            return this.firstVisibleItemIndex + this.visibleItems.length;
        }

        private getNextPageSize(): number {
            return this.options.batchSize;
        }


        public scrollTable(): void {


            if (!this.isPreloading){

                if (this.tableBodyContainer.scrollTop > this.tableBodyContainer.scrollHeight / 4 * 3) {
                    this.isPreloading = true;
                    this.itemProvider.getItems(
                        this.getNextPageFirstItemIndex(),
                        this.getNextPageSize(),
                        (items, first, count, total) => this.preloadedPage = items);
                }

                if (this.tableBody.scrollTop < this.tableBodyContainer.scrollHeight / 4) {
                    this.isPreloading = true;
                    var nextPageFirstItem = 

                    this.itemProvider.getItems(
                        this.getPreviousPageFirsItemIndex(),
                        this.getPreviousPageSize(),
                        (items, first, count, total) => this.preloadedPage = items);
                }
            }

            if (this.tableBodyContainer.scrollTop + this.tableBodyContainer.clientHeight >= this.tableBodyContainer.scrollHeight) {
                this.visibleItems.splice(0, this.options.batchSize);
                var firstNewItem = this.preloadedPage[0];
                this.visibleItems = this.visibleItems.concat(this.preloadedPage);
                this.visibleViewModels = this.buildViewModels(this.visibleItems);

                this.updateVisibleItems();
                               
                var skipItems = new Array<ItemViewModel>();
                for (var i = 0; i < this.visibleViewModels.length; i++) {
                    skipItems.push(this.visibleViewModels[i]);
                    if (this.visibleViewModels[i].item == firstNewItem) {
                        break;
                    }
                }
                
                var skipSize = this.htmlProvider.getElemntsSize(this.tableBodyContainer, skipItems);
               
                this.tableBodyContainer.scrollTop = skipSize - this.tableBodyContainer.clientHeight;
                this.isPreloading = false;
            }
        }

        

        public sortBy(name: string): void {
            if (this.isSortable()) {
                if (this.options.groupBy == "" || this.options.groupBy.indexOf(name) != -1) {
                    var i;
                    for (i = 0; i < this.options.groupBySortDescriptor.length; i++) {
                        if (this.options.groupBySortDescriptor[i].column == name) break;
                    }

                    if (name == this.options.sortDescriptor.column) {
                        this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                    } else {
                        this.options.sortDescriptor.column = name;
                        this.options.sortDescriptor.asc = false;
                    }
                    this.options.groupBySortDescriptor[i].asc = this.options.sortDescriptor.asc;
                    this.options.groupBySortDescriptor[i].column = this.options.sortDescriptor.column;
                    (<ISortableItemProvider><any>this.itemProvider).sort(this.options.groupBySortDescriptor);
                    this.refreshHeader();
                    this.refreshBody();
                } else {
                    if (name == this.options.sortDescriptor.column) {
                        this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                    } else {
                        this.options.sortDescriptor.column = name;
                        this.options.sortDescriptor.asc = false;
                    }
                    (<ISortableItemProvider><any>this.itemProvider).sort(this.options.groupBySortDescriptor.concat(this.options.sortDescriptor));
                    this.refreshHeader();
                    this.refreshBody();
                }
            }
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
                this.options.showDetailFor.item = this.options.selection[0];
            }

            this.refreshBody();
            return true;
        }
        
        public isSortable(): boolean {
            return (<ISortableItemProvider><any>this.itemProvider).sort != undefined ? true : false;
        }

        public isFilterable(): boolean {
            return ((<IFilterableItemProvider><any>this.itemProvider).getFiltered != undefined) &&
                   ((<IFilterableItemProvider><any>this.itemProvider).getFilteredTotalItemsCount != undefined) ? true : false;
        }

        private buildViewModels(items: Array<any>): Array<ItemViewModel> {
            var itemModels: Array<ItemViewModel> = [];
            var groupNames: Array<string> = [];

            for (var j = 0; j < this.options.groupBySortDescriptor.length; j++) { groupNames.push(""); }

            for (var i = 0; i < items.length; i++) {
                for (var j = 0; j < this.options.groupBySortDescriptor.length; j++) {
                    if (groupNames[j] != items[i][this.options.groupBySortDescriptor[j].column]) {
                        groupNames[j] = items[i][this.options.groupBySortDescriptor[j].column];
                        itemModels.push(new ItemViewModel(null,
                            new GroupHeaderDescriptor(items[i][this.options.groupBySortDescriptor[j].column], j),
                            this,
                            true));
                    }
                }

                itemModels.push(new ItemViewModel(null, items[i], this, false));
            }
            
            return itemModels;
        }

        private updateVisibleItems(): void {
            setTimeout(() => {
                this.tableBody.innerHTML = "";
                this.htmlProvider.updateTableBodyElement(
                    this.options,
                    this.tableBody,
                    this.visibleViewModels,
                    (x,m) => this.selectItem(x, m))
                }, 1);
            
            setTimeout(() => {
                this.mobileContainer.innerHTML = "";
                this.htmlProvider.updateMobileItemsList(
                    this.options,
                    this.mobileContainer,
                    this.visibleViewModels,
                    (x,m) => this.selectItem(x, m))
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
            this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.isSortable());
            this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.isSortable());
        }

        private refreshBody() {
            if (!this.isFilterable() || this.options.filterDescriptors.length == 0) {
                if (this.options.pageSize == 0) {
                    this.itemProvider.getTotalItemsCount(totalitemsCount =>
                        this.itemProvider.getItems(
                            this.getFirstItemNumber(),
                            20, // todo - replace
                            (items, first, count) => {
                                this.visibleItems = items;
                                this.visibleViewModels = this.buildViewModels(this.visibleItems);
                                this.updateVisibleItems();
                            }));
                } else {
                    this.itemProvider.getItems(
                        this.getFirstItemNumber(),
                        this.getPageSize(),
                        (items, first, count) => {
                            this.visibleItems = items;
                            this.visibleViewModels = this.buildViewModels(this.visibleItems);
                            this.updateVisibleItems();
                        });
                }
            } else {
                if (this.options.pageSize == 0) {
                    (<IFilterableItemProvider><any>this.itemProvider).getFilteredTotalItemsCount(this.options.filterDescriptors, totalitemsCount =>
                        (<IFilterableItemProvider><any>this.itemProvider).getFiltered(this.getFirstItemNumber(), totalitemsCount, this.options.filterDescriptors, (items, first, count) => this.updateItems(items, first, count)));
                } else {
                    (<IFilterableItemProvider><any>this.itemProvider).getFiltered(this.getFirstItemNumber(), this.getPageSize(), this.options.filterDescriptors, (items, first, count) => this.updateItems(items, first, count));
                }
            }
        }

        private refreshFooter() {
            if (!this.isFilterable() || this.options.filterDescriptors.length == 0) {
                this.itemProvider.getTotalItemsCount((total: number) => {
                    this.tableFooter.innerHTML = "";
                    this.totalItemsCount = total;
                    this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount);
                });
            } else {
                (<IFilterableItemProvider><any>this.itemProvider).getFilteredTotalItemsCount(this.options.filterDescriptors,(total: number) => {
                    this.tableFooter.innerHTML = "";
                    this.totalItemsCount = total;
                    this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount);
                });
            }
        }
    }
}