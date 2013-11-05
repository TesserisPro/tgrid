var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Scripts/typings/jquery/jquery.d.ts" />
    /// <reference path="SortDescriptor.ts" />
    /// <reference path="FilterDescriptor.ts" />
    (function (TGrid) {
        (function (Framework) {
            Framework[Framework["Knockout"] = 0] = "Knockout";
            Framework[Framework["Angular"] = 1] = "Angular";
        })(TGrid.Framework || (TGrid.Framework = {}));
        var Framework = TGrid.Framework;
        (function (SelectionMode) {
            SelectionMode[SelectionMode["None"] = 0] = "None";
            SelectionMode[SelectionMode["Single"] = 1] = "Single";
            SelectionMode[SelectionMode["Multi"] = 2] = "Multi";
        })(TGrid.SelectionMode || (TGrid.SelectionMode = {}));
        var SelectionMode = TGrid.SelectionMode;
        (function (FilterCondition) {
            FilterCondition[FilterCondition["None"] = 0] = "None";
            FilterCondition[FilterCondition["Equals"] = 1] = "Equals";
            FilterCondition[FilterCondition["NotEquals"] = 2] = "NotEquals";
        })(TGrid.FilterCondition || (TGrid.FilterCondition = {}));
        var FilterCondition = TGrid.FilterCondition;
        (function (FilterOperation) {
            FilterOperation[FilterOperation["And"] = 0] = "And";
            FilterOperation[FilterOperation["Or"] = 1] = "Or";
        })(TGrid.FilterOperation || (TGrid.FilterOperation = {}));
        var FilterOperation = TGrid.FilterOperation;
        ;

        var ColumnInfo = (function () {
            function ColumnInfo() {
            }
            return ColumnInfo;
        })();
        TGrid.ColumnInfo = ColumnInfo;

        var ShowDetail = (function () {
            function ShowDetail() {
                this.column = -1;
                this.item = null;
                this.isDetailColumn = false;
            }
            return ShowDetail;
        })();
        TGrid.ShowDetail = ShowDetail;

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
                this.batchSize = 10;
                this.firstLoadSize = 20;
                this.currentPage = 0;
                this.groupBySortDescriptor = [];
                this.filterDescriptors = [];
                this.selection = [];
                this.target = element;
                this.framework = framework;

                //this.filterDescriptors.push(new TesserisPro.TGrid.FilterDescriptor("name", "a1", 1));
                //this.filterDescriptors.push(new TesserisPro.TGrid.FilterDescriptor("key", "b1", 1));
                //this.filterDescriptors.push(new TesserisPro.TGrid.FilterDescriptor("key", "c1", 1));
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
                var text = $(this.target).find("script")[0].innerHTML;
                var optionsElement = $("<div>" + text + "</div");

                var headers = optionsElement.find("header");
                var cells = optionsElement.find("cell");
                var cellDetails = optionsElement.find("celldetail");
                var columns = optionsElement.find("column");

                if (!(headers.length == columns.length && cells.length == columns.length && cellDetails.length == columns.length)) {
                    throw " Columns not fully described ";
                }

                for (var i = 0; i < columns.length; i++) {
                    var column = new ColumnInfo();

                    var header = new Template(headers[i]);
                    column.header = header;

                    var cell = new Template(cells[i]);
                    column.cell = cell;

                    var cellDetail = cellDetails[i];
                    column.cellDetail = cellDetail.innerHTML;

                    column.sortMemberPath = columns[i].attributes['data-g-sort-member'].nodeValue;
                    column.groupMemberPath = columns[i].attributes['data-g-group-member'].nodeValue;
                    column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                    column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";

                    this.columns.push(column);
                }
                this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, true);

                var mobileTemplate = optionsElement.find("mobile");
                this.mobileTemplateHtml = mobileTemplate.length == 1 ? mobileTemplate[0].innerHTML : "Default mobileTemplate";

                var groupHeaderTemplate = optionsElement.find("groupheader");
                this.groupHeaderTemplate = groupHeaderTemplate.length == 1 ? groupHeaderTemplate[0].innerHTML : "Default groupHeaderTemplate";

                var detailsTemplate = optionsElement.find("details");
                this.detailsTemplateHtml = detailsTemplate.length == 1 ? detailsTemplate[0].innerHTML : "Default detailsTemplate";

                this.showDetailFor = new ShowDetail();

                var footer = optionsElement.find("footer");

                if (footer != undefined) {
                    this.tableFooterTemplate = new Template(footer[0]);
                } else {
                    this.tableFooterTemplate = null;
                }
            };
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
