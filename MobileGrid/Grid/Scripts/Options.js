var TesserisPro;
(function (TesserisPro) {
    /// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />
    (function (TGrid) {
        var Options = (function () {
            //public dataProvider: (fromItem: number, toItem: number) => Array<any>;
            //public mobileViewMaxWidth: number;
            //public pageSize: number;
            //public currentPage: number;
            function Options(element) {
                //public data: JQuery;
                this.columnHeaders = [];
                this.columnDataField = [];
                this.columnWidth = [];
                this.columnDevice = [];
                //this.data = element;
                var text = element.find("script")[0].innerHTML;
                var JQ = $("<div>" + text + "</div");

                // Headers
                var headers = JQ.find("header");
                var header;
                for (var i = 0; i < headers.length; i++) {
                    if (headers[i].firstElementChild == null) {
                        header = headers[i].innerText;
                    } else {
                        header = headers[i].firstElementChild.firstChild.nodeValue;
                    }
                    this.columnHeaders.push(header);
                }

                // Cells
                var cells = JQ.find("cell");
                var cell;
                for (var i = 0; i < cells.length; i++) {
                    if (cells[i].firstElementChild == null) {
                        cell = cells[i].attributes['data-bind'].nodeValue;
                    } else {
                        cell = cells[i].firstElementChild.attributes['data-bind'].nodeValue;
                    }
                    this.columnDataField.push(cell);
                }

                // Columns width
                var columns = JQ.find("column");
                for (var i = 0; i < columns.length; i++) {
                    this.columnWidth.push(columns[i].attributes['data-g-width'].nodeValue);
                    this.columnDevice.push(columns[i].attributes['data-g-views'].nodeValue);
                }
            }
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
