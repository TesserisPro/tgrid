var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Scripts/typings/jquery/jquery.d.ts" />
    /// <reference path="SortDescriptor.ts" />
    (function (TGrid) {
        (function (Framework) {
            Framework[Framework["Knockout"] = 0] = "Knockout";
            Framework[Framework["Angular"] = 1] = "Angular";
        })(TGrid.Framework || (TGrid.Framework = {}));
        var Framework = TGrid.Framework;
        (function (EditMode) {
            EditMode[EditMode["None"] = 0] = "None";
            EditMode[EditMode["Single"] = 1] = "Single";
            EditMode[EditMode["Multi"] = 2] = "Multi";
        })(TGrid.EditMode || (TGrid.EditMode = {}));
        var EditMode = TGrid.EditMode;

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
                this.pageSlide = 1;
                this.currentPage = 0;
                this.selection = [];
                this.target = $(element);
                this.framework = framework;
                this.initialize();
            }
            Options.prototype.isSelected = function (item) {
                for (var i = 0; i < this.selection.length; i++) {
                    if (this.selection[i] == item) {
                        return true;
                    }
                }
                return false;
            };

            Options.prototype.initialize = function () {
                var pageSizeAtt = this.target.attr("data-g-page-size");
                this.pageSize = parseInt(pageSizeAtt);
                if (isNaN(this.pageSize)) {
                    this.pageSize = 5;
                }

                var editModeAtt = this.target.attr("data-g-edit-mode");
                this.editMode = parseInt(editModeAtt);
                if (isNaN(this.editMode)) {
                    this.editMode = 2;
                }

                var text = this.target.find("script")[0].innerHTML;
                var optionsElement = $("<div>" + text + "</div");

                var headers = optionsElement.find("header");
                var cells = optionsElement.find("cell");
                var columns = optionsElement.find("column");

                for (var i = 0; i < headers.length; i++) {
                    var column = new ColumnInfo();

                    var header = new Template(headers[i]);
                    column.header = header;

                    var cell = new Template(cells[i]);
                    column.cell = cell;

                    column.sortMemberPath = columns[i].attributes['data-g-sort-member'].nodeValue;
                    column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                    column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";

                    this.columns.push(column);
                }
                this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, false);

                var mobileTemplate = optionsElement.find("mobile");
                this.mobileTemplateHtml = mobileTemplate[0].innerHTML;

                var detailsTemplate = optionsElement.find("details");
                this.detailsTemplateHtml = detailsTemplate[0].innerHTML;
            };
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
