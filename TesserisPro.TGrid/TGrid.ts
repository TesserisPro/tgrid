/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="ISortableItemProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="angular/AngularHtmlProvider.ts" />

module TesserisPro.TGrid {

    export class Grid {
        private targetElement: HTMLElement;
        private table: HTMLElement;
        private tableBody: HTMLElement;
        private htmlProvider: IHtmlProvider;
        private itemProvider: IItemProvider;
        private options: Options;
                
        constructor(element: HTMLElement, options: Options, provider: IItemProvider) {
            element.grid = this;
            this.targetElement = element;
            this.options = options;
            this.itemProvider = provider;

            this.htmlProvider = this.getHtmlProvider(this.options);
            this.table = this.htmlProvider.getTableElement(this.options);
            this.table.appendChild(this.htmlProvider.getTableHeadElement(this.options));
            this.tableBody = document.createElement("tbody");
            this.table.appendChild(this.tableBody);

            
            
            this.table.appendChild(this.htmlProvider.getTableFooterElement(this.options));

            element.appendChild(this.table);
        }

        public sortBy(columnName: string): void {
            if ((<ISortableItemProvider><any>this.itemProvider).sort != undefined) {
                (<ISortableItemProvider><any>this.itemProvider).sort(columnName);
                this.refreshTableBody();
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

        

        private getFirstItemNumber(): number {
            return this.options.pageSize * this.options.currentPage;
        }

        private getPageSize(): number {
            return this.options.pageSize;
        }

        private updateItems(items: Array<any>, firstItem: number, itemsNumber: number): void {
            var itemModels: Array<ItemViewModel> = [];

            for (var i = 0; i < items.length; i++) {
                itemModels.push(new ItemViewModel(null, items[i]));
            }
            setTimeout(() => this.htmlProvider.updateTableBodyElement(this.options, this.tableBody, itemModels), 1);
        }

        private getHtmlProvider(options: Options): IHtmlProvider {
            if (options.framework == Framework.Knockout) {
                return new KnockoutHtmlProvider();
            }

            if (options.framework == Framework.Angular) {
                return new AngularHtmlProvider();
            }
        }

        private refreshTableBody() {
            this.itemProvider.getItems(this.getFirstItemNumber(), this.getPageSize(), (items, first, count) => this.updateItems(items, first, count));
        }
    }
}