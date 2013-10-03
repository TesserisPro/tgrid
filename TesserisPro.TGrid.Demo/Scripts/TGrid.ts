/// <reference path="Scripts/typings/extenders.d.ts" />
/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="IItemProvider.ts" />
/// <reference path="ISortableItemProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="angular/AngularHtmlProvider.ts" />


module TesserisPro.TGrid {
    
    export class Grid {
        private table: HTMLElement; 
        private tableBody: HTMLElement;
        private htmlProvider: IHtmlProvider;
        public itemProvider: IItemProvider;
        public options: Options;
                
        constructor(element: JQuery, option: Options) {
            this.htmlProvider = this.getHtmlProvider(option);
            this.table = this.htmlProvider.getTableElement(option);
            this.table.appendChild(this.htmlProvider.getTableHeadElement(option));
            this.tableBody = document.createElement("tbody");
            this.table.appendChild(this.tableBody);
            
            this.itemProvider.getItems(this.getFirstItemNumber(), this.getPageSize(), (items, first, count) => this.updateItems(items, first, count));
            
            this.table.appendChild(this.htmlProvider.getTableFooterElement(option));

            element.append(this.table)

        }

        public sortBy(columnName: string): void {
            (<ISortableItemProvider><any>this.itemProvider).sort(columnName);
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
            this.htmlProvider.updateTableBodyElement(this.options, this.tableBody, items);
        }

        private getHtmlProvider(options: Options): IHtmlProvider {
            if (options.framework == Framework.Knockout) {
                return new KnockoutHtmlProvider();
            }

            if (options.framework == Framework.Angular) {
                return new AngularHtmlProvider();
            }
        }
    }
}