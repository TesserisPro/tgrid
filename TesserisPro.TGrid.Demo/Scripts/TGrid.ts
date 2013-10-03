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
                
            // Create Table Knockout
            if (option.framework == TesserisPro.TGrid.Framework.Knockout)   {
                this.table = htmlProvider.getTableElement(option);

                this.table.appendChild(htmlProvider.getTableHeadElement(option));
                this.table.appendChild(htmlProvider.getTableBodyElement(option));
                this.table.appendChild(htmlProvider.getTableFooterElement(option));

                element.append(this.table)
            }
            htmlProvider = new AngularHtmlProvider();
        // Create Table Angular
            if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                var appName: string = "App";

                this.table = htmlProvider.getTableElement(option);


                // Angular desktop header
                this.table.appendChild(htmlProvider.getTableHeadElement(option));

                // Angular desktop cells
                this.table.appendChild(htmlProvider.getTableBodyElement(option));

                //var div = document.createElement("div");
                //div.setAttribute("ng-app", appName);
                //div.appendChild(table);
                //element.append(div);
                //this.table = table;

                // Angular desktop footer
                this.table.appendChild(htmlProvider.getTableFooterElement(option));

                element.append(this.table)
            }
        }
    }
}