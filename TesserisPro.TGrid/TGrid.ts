/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="ISortableItemProvider.ts" />
/// <reference path="IFilterableItemProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="angular/AngularHtmlProvider.ts" />

module TesserisPro.TGrid {

    export class Grid {
        private targetElement: HTMLElement;
        private table: HTMLElement;
        private tableBody: HTMLElement;
        private tableFooter: HTMLElement;
        private tableHeader: HTMLElement;
        private mobileContainer: HTMLElement;
        private mobileHeader: HTMLElement;
        private htmlProvider: IHtmlProvider;
        private itemProvider: IItemProvider;
        private filterProvider: IFilterableItemProvider;
        private options: Options;
        private totalItemsCount: number;
        private groupNames: string = "";
        
        constructor(element: HTMLElement, options: Options, provider: IItemProvider) {
            element.grid = this;
            this.targetElement = element;
            this.options = options;
            this.itemProvider = provider;
            this.htmlProvider = this.getHtmlProvider(this.options);

            this.table = this.htmlProvider.getTableElement(this.options);

            this.mobileHeader = document.createElement("div");
            this.mobileHeader.setAttribute("class", "tgrid-mobile-header mobile");
            this.targetElement.appendChild(this.mobileHeader);

            this.tableHeader = document.createElement("thead");
            this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
            this.table.appendChild(this.tableHeader);

            this.tableBody = document.createElement("tbody");
            this.table.appendChild(this.tableBody);
            this.targetElement.appendChild(this.table);

            this.mobileContainer = document.createElement("div");
            this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");
            this.targetElement.appendChild(this.mobileContainer);

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
                this.sortBy(this.options.groupBy);
            }
        }

        public sortBy(name: string): void {
            if (this.isSortable()) {
                if (this.options.groupBy == "" || this.options.groupBy == name) {
                    if (name == this.options.sortDescriptor.column) {
                        this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                    } else {
                        this.options.sortDescriptor.column = name;
                        this.options.sortDescriptor.asc = false;
                    }
                    this.options.groupBySortDescriptor.asc = this.options.sortDescriptor.asc;
                    this.options.groupBySortDescriptor.column = this.options.sortDescriptor.column;
                    (<ISortableItemProvider><any>this.itemProvider).sort(this.options.sortDescriptor);
                    this.refreshHeader();
                    this.refreshBody();
                } else {
                    if (name == this.options.sortDescriptor.column) {
                        this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                    } else {
                        this.options.sortDescriptor.column = name;
                        this.options.sortDescriptor.asc = false;
                    }
                    (<ISortableItemProvider><any>this.itemProvider).sort(this.options.sortDescriptor, this.options.groupBySortDescriptor);
                    this.refreshHeader();
                    this.refreshBody();
                }
            }
        }

        public isSortable(): boolean {
            return (<ISortableItemProvider><any>this.itemProvider).sort != undefined ? true : false;
        }

        public isFilterable(): boolean {
            return ((<IFilterableItemProvider><any>this.itemProvider).getFiltered != undefined) &&
                   ((<IFilterableItemProvider><any>this.itemProvider).getFilteredTotalItemsCount != undefined) ? true : false;
        }

        public isCellDetails(): boolean {
            return (<any>this.itemProvider).openCellDetails != undefined ? true : false;
        }

        public selectPage(page: number): void {
            this.options.currentPage = page;
            this.refreshHeader();
            this.refreshBody();
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

        private getFirstItemNumber(): number {
            return this.options.pageSize * this.options.currentPage;
        }

        private getPageSize(): number {
            return this.options.pageSize;
        }

        private updateItems(items: Array<any>, firstItem: number, itemsNumber: number): void {
            var itemModels: Array<ItemViewModel> = [];

            for (var i = 0; i < items.length; i++) {
                if (this.options.groupBy != "" && this.groupNames.indexOf(items[i][this.options.groupBy]) == -1) {
                    this.groupNames = this.groupNames + items[i][this.options.groupBy] + " ";
                    itemModels.push(new ItemViewModel(null, items[i][this.options.groupBy], this, true));
                }

                itemModels.push(new ItemViewModel(null, items[i], this, false));
            }
                        
            setTimeout(() => {
                this.tableBody.innerHTML = "";
                this.htmlProvider.updateTableBodyElement(
                    this.options,
                    this.tableBody,
                    itemModels,
                    (x,m) => this.selectItem(x, m))
                }, 1);
            
            setTimeout(() => {
                this.mobileContainer.innerHTML = "";
                this.htmlProvider.updateMobileItemsList(
                    this.options,
                    this.mobileContainer,
                    itemModels,
                    (x,m) => this.selectItem(x, m))
            }, 1);
            this.groupNames="";
        }

        public selectItem(item: ItemViewModel, multi: boolean): boolean {
            if (this.options.selectMode == SelectMode.Multi) {
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
            } else if (this.options.selectMode == SelectMode.Single) {
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
        
        private getHtmlProvider(options: Options): IHtmlProvider {
            if (options.framework == Framework.Knockout) {
                return new KnockoutHtmlProvider();
            }

            if (options.framework == Framework.Angular) {
                return new AngularHtmlProvider();
            }
        }

        private refreshHeader() {
            this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.isSortable());
            this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.isSortable());
        }

        private refreshBody() {
            if (!this.isFilterable() || this.options.filterDescriptors.length == 0) {
                if (this.options.pageSize == 0) {
                    this.itemProvider.getTotalItemsCount( totalitemsCount =>
                        this.itemProvider.getItems(this.getFirstItemNumber(), totalitemsCount, (items, first, count) => this.updateItems(items, first, count)));
                } else {
                    this.itemProvider.getItems(this.getFirstItemNumber(), this.getPageSize(), (items, first, count) => this.updateItems(items, first, count));
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