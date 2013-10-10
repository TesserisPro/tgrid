/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="ISortableItemProvider.ts" />
/// <reference path="IGroupableItemProvider.ts" />
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
        private options: Options;
        private totalItemsCount: number;
                
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

            if (options.groupByDescriptor.length > 0) {
                this.groupBy(options.groupByDescriptor[0]);
            }

            this.refereshTableHeader();
            this.refreshTableBody();
            this.refreshTableFooter();
        }

        public sortBy(name: string): void {
            if (this.isSortable()) {
                if (name == this.options.sortDescriptor.column) {
                    this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                } else {
                    this.options.sortDescriptor.column = name;
                    this.options.sortDescriptor.asc = false;
                }
                (<ISortableItemProvider><any>this.itemProvider).sort(this.options.sortDescriptor);
                this.refereshTableHeader();
                this.refreshTableBody();
            }
        }

        public isSortable(): boolean {
            return (<ISortableItemProvider><any>this.itemProvider).sort != undefined ? true : false;
        }

        public groupBy(name: string): void {
            if (this.isGroupable()) {
                (<IGroupableItemProvider><any>this.itemProvider).group([this.options.groupByDescriptor]);
                this.refereshTableHeader();
                this.refreshTableBody();
            }
        }

        public isGroupable(): boolean {
            return (<IGroupableItemProvider><any>this.itemProvider).group != undefined ? true : false;
        }

        public isCellDetails(): boolean {
            return (<any>this.itemProvider).openCellDetails != undefined ? true : false;
        }

        public selectPage(page: number): void {
            this.options.currentPage = page;
            this.refereshTableHeader();
            this.refreshTableBody();
            this.refreshTableFooter();
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

        private updateItems(items: Array<any>, firstItem: number, itemsNumber: number, total: number): void {
            var itemModels: Array<ItemViewModel> = [];

            for (var i = 0; i < items.length; i++) {
                itemModels.push(new ItemViewModel(null, items[i], this));
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
        }

        public selectItem(item: ItemViewModel, multi: boolean): boolean {
            if (this.options.selectMode == SelectMode.Multi) {
                if (multi) {
                    for (var i = 0; i < this.options.selection.length; i++) {
                        if (item.item == this.options.selection[i]) {
                            this.options.selection.splice(i, 1);
                            this.refreshTableBody();
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

            this.refreshTableBody();
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

        private refereshTableHeader() {
            this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.isSortable());
            this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.isSortable());
        }

        private refreshTableBody() {
            this.itemProvider.getItems(this.getFirstItemNumber(), this.getPageSize(), (items, first, count, total) => this.updateItems(items, first, count, total));
        }

        private refreshTableFooter() {
            this.itemProvider.getTotalItemsCount((total: number) => {
                this.tableFooter.innerHTML = "";
                this.totalItemsCount = total;
                this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount);
            });
        }
    }
}