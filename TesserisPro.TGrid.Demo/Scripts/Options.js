var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Scripts/typings/jquery/jquery.d.ts" />
    (function (TGrid) {
        (function (Framework) {
            Framework[Framework["Knockout"] = 0] = "Knockout";
            Framework[Framework["Angular"] = 1] = "Angular";
        })(TGrid.Framework || (TGrid.Framework = {}));
        var Framework = TGrid.Framework;

        var ColumnInfo = (function () {
            function ColumnInfo() {
            }
            return ColumnInfo;
        })();
        TGrid.ColumnInfo = ColumnInfo;

        var Template = (function () {
            function Template(prototype) {
                this.content = "";
                this.content = prototype.innerHTML == null ? prototype.innerText : prototype.innerHTML;
            }
            Template.prototype.applyTemplate = function (element) {
                element.innerHTML = this.content != null ? this.content : "";
            };
            return Template;
        })();
        TGrid.Template = Template;

        var Options = (function () {
            function Options(element, framework) {
                this.columns = [];
                // TODO: remove
                this.columnHeaders = [];
                this.columnDataField = [];
                this.columnWidth = [];
                this.columnDevice = [];
                this.pageSlide = 1;
                this.currentPage = 1;
                this.target = $(element);
                this.framework = framework;

                this.initialize();
            }
            Options.prototype.initialize = function () {
                var rowsAtt = this.target.attr("data-g-page-size");
                this.pageSize = parseInt(rowsAtt);
                if (isNaN(this.pageSize)) {
                    this.pageSize = 10;
                }

                var text = this.target.find("script")[0].innerHTML;
                var optionsElement = $("<div>" + text + "</div");

                // Headers
                var headers = optionsElement.find("header");
                for (var i = 0; i < headers.length; i++) {
                    var template = new Template(headers[i]);
                    this.columnHeaders.push(template);
                }

                // Cells
                var cells = optionsElement.find("cell");
                for (var i = 0; i < cells.length; i++) {
                    var cell = new Template(cells[i]);
                    this.columnDataField.push(cell);
                }

                // Columns width
                var columns = optionsElement.find("column");
                for (var i = 0; i < columns.length; i++) {
                    this.columnWidth.push(columns[i].attributes['data-g-width'].nodeValue);
                    this.columnDevice.push(columns[i].attributes['data-g-views'].nodeValue);
                }
            };
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
