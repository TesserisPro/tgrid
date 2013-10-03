var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Options.ts" />
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="knockout/KnockoutHtmlProvider.ts" />
    /// <reference path="angular/AngularHtmlProvider.ts" />
    (function (TGrid) {
        var Grid = (function () {
            function Grid(element, option) {
                var htmlProvider;

                htmlProvider = new TGrid.KnockoutHtmlProvider();

                if (option.framework == TesserisPro.TGrid.Framework.Knockout) {
                    this.table = htmlProvider.getTableElement(option);

                    this.table.appendChild(htmlProvider.getTableHeadElement(option));
                    this.table.appendChild(htmlProvider.getTableBodyElement(option));
                    this.table.appendChild(htmlProvider.getTableFooterElement(option));

                    element.append(this.table);
                }
                htmlProvider = new TGrid.AngularHtmlProvider();

                if (option.framework == TesserisPro.TGrid.Framework.Angular) {
                    var appName = "App";

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

                    element.append(this.table);
                }
            }
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
