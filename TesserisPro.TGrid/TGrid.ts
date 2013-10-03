/// <reference path="Options.ts" />
/// <reference path="IHtmlProvider.ts" />
/// <reference path="knockout/KnockoutHtmlProvider.ts" />
/// <reference path="angular/AngularHtmlProvider.ts" />

module TesserisPro.TGrid {

    export class Grid {
        public table: any; 

        constructor(element: JQuery, option: Options) {
            var htmlProvider: IHtmlProvider;

            htmlProvider = new KnockoutHtmlProvider();
            if (option.framework == TesserisPro.TGrid.Framework.Knockout)   {
                this.table = htmlProvider.getTableElement(option);

                this.table.appendChild(htmlProvider.getTableHeadElement(option));
                this.table.appendChild(htmlProvider.getTableBodyElement(option));
                this.table.appendChild(htmlProvider.getTableFooterElement(option));

                element.append(this.table)
            }

            htmlProvider = new AngularHtmlProvider();
            if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                this.table = htmlProvider.getTableElement(option);

                this.table.appendChild(htmlProvider.getTableHeadElement(option));
                this.table.appendChild(htmlProvider.getTableBodyElement(option));
                this.table.appendChild(htmlProvider.getTableFooterElement(option));

                element.append(this.table)
            }
        }
    }
}