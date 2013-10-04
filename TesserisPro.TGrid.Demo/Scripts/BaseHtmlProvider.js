var TesserisPro;
(function (TesserisPro) {
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="ItemViewModel.ts" />
    (function (TGrid) {
        var BaseHtmlProvider = (function () {
            function BaseHtmlProvider() {
            }
            BaseHtmlProvider.prototype.getTableElement = function (option) {
                var table = document.createElement("table");
                table.className = "tgrid-table";
                return table;
            };

            BaseHtmlProvider.prototype.getTableHeadElement = function (option, isSortable) {
                return null;
            };

            BaseHtmlProvider.prototype.updateTableBodyElement = function (option, body, items) {
            };

            BaseHtmlProvider.prototype.getTableFooterElement = function (option) {
                var footer = document.createElement("tfoot");
                var footrow = document.createElement("tr");
                var footcell = document.createElement("td");
                footcell.setAttribute("align", "center");
                footcell.setAttribute("colspan", option.columns.length.toString());
                var data = document.createElement("div");

                // add paging hire
                data.innerHTML = "<div>Paging</div>";

                footcell.appendChild(data);
                footrow.appendChild(footcell);
                footer.appendChild(footrow);

                return footer;
            };
            return BaseHtmlProvider;
        })();
        TGrid.BaseHtmlProvider = BaseHtmlProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=BaseHtmlProvider.js.map
