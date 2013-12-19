var TesserisPro;
(function (TesserisPro) {
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
                var text = this.target.getElementsByTagName("script")[0].innerHTML;
                var optionsElement = document.createElement("div");
                optionsElement.innerHTML = text;

                var headers = optionsElement.getElementsByTagName("header");
                var cells = optionsElement.getElementsByTagName("cell");
                var cellDetails = optionsElement.getElementsByTagName("celldetail");
                var columns = optionsElement.getElementsByTagName("column");

                for (var i = 0; i < columns.length; i++) {
                    var columnElement = $(columns[i]);
                    var header = columnElement.find("header");
                    var cell = columnElement.find("cell");

                    var column = new ColumnInfo();
                    column.member = columns[i].attributes['data-g-member'] != undefined ? columns[i].attributes['data-g-member'].nodeValue : null;

                    column.header = header.length > 0 ? new Template(header[0]) : null;
                    column.cell = header.length > 0 ? new Template(cell[0]) : null;

                    var cellDetail = columnElement.find("celldetail");
                    column.cellDetail = cellDetail.length == 1 ? new Template(cellDetail[0]) : null;

                    column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : column.member;
                    column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : column.member;
                    column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                    column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";
                    column.resizable = columns[i].attributes['data-g-resizable'] != undefined ? (columns[i].attributes['data-g-resizable'].nodeValue == 'false' ? false : true) : true;

                    this.columns.push(column);
                }

                this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, true);

                var filterPopup = optionsElement.getElementsByTagName("filterpopup");
                this.filterPopup = filterPopup.length == 1 ? new Template(filterPopup[0]) : null;

                var mobileTemplate = optionsElement.getElementsByTagName("mobile");

                this.mobileTemplateHtml = mobileTemplate.length == 1 ? new Template(mobileTemplate[0]) : null;

                var groupHeaderTemplate = optionsElement.getElementsByTagName("groupheader");

                this.groupHeaderTemplate = groupHeaderTemplate.length == 1 ? new Template(groupHeaderTemplate[0]) : null;

                var detailsTemplate = optionsElement.getElementsByTagName("details");
                this.detailsTemplateHtml = detailsTemplate.length == 1 ? new Template(detailsTemplate[0]) : null;

                this.showDetailFor = new ShowDetail();

                var footer = optionsElement.getElementsByTagName("footer");
                this.tableFooterTemplate = footer.length > 0 ? new Template(footer[0]) : null;

                if (footer.length != 0) {
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
