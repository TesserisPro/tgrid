//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files(the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
var TesserisPro;
(function (TesserisPro) {
    // 1. The above copyright notice and this permission notice shall be included in all
    //    copies or substantial portions of the Software.
    //
    // 2. Any software that fully or partially contains or uses materials covered by
    //    this license shall notify users about this notice and above copyright.The
    //    notification can be made in "About box" and / or site main web - page footer.The
    //    notification shall contain name of Tesseris Pro company and name of the Software
    //    covered by current license.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    // PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    // SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    //
    //=====================================================================================
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
        (function (LogicalOperator) {
            LogicalOperator[LogicalOperator["And"] = 0] = "And";
            LogicalOperator[LogicalOperator["Or"] = 1] = "Or";
        })(TGrid.LogicalOperator || (TGrid.LogicalOperator = {}));
        var LogicalOperator = TGrid.LogicalOperator;
        ;

        var ColumnInfo = (function () {
            function ColumnInfo() {
                this.header = null;
                this.cell = null;
                this.cellDetail = null;
                this.width = "150";
                this.device = "mobile,desktop";
                this.sortMemberPath = null;
                this.groupMemberPath = null;
                this.member = null;
                this.resizable = true;
                this.filterMemberPath = null;
                this.notSized = false;
                this.enableFiltering = true;
                this.enableSorting = true;
                this.enableGrouping = true;
            }
            return ColumnInfo;
        })();
        TGrid.ColumnInfo = ColumnInfo;

        var ShowDetail = (function () {
            function ShowDetail() {
                this.column = -1;
                this.item = null;
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

            Template.prototype.getContent = function () {
                return this.content;
            };
            return Template;
        })();
        TGrid.Template = Template;

        var Options = (function () {
            function Options(element, framework) {
                this.columns = [];
                this.mobileTemplateHtml = null;
                this.detailsTemplateHtml = null;
                this.groupHeaderTemplate = null;
                this.filterPopup = null;
                this.pageSize = 10;
                this.pageSlide = 1;
                this.batchSize = 5;
                this.firstLoadSize = 10;
                this.currentPage = 0;
                this.groupBySortDescriptors = [];
                this.selectionMode = 1 /* Single */;
                this.filterDescriptor = TGrid.FilterDescriptor.getEmpty();
                this.tableFooterTemplate = null;
                this.selection = [];
                this.columnMinWidth = 5;
                this.hasAnyNotSizedColumn = false;
                this.captureScroll = true;
                this.target = element;
                this.framework = framework;
                this.initialize();
                this.minItemsCountForVirtualization = 100;
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
                if (this.target.getElementsByTagName("script").length > 0) {
                    var text = this.target.getElementsByTagName("script")[0].innerHTML;

                    var optionsElement = document.createElement("div");
                    optionsElement.innerHTML = text;

                    var headers = optionsElement.getElementsByTagName("header");
                    var cells = optionsElement.getElementsByTagName("cell");
                    var cellDetails = optionsElement.getElementsByTagName("celldetail");
                    var columns = optionsElement.getElementsByTagName("column");

                    for (var i = 0; i < columns.length; i++) {
                        var column = new ColumnInfo();
                        if (columns[i].attributes['data-g-member'] != undefined) {
                            column.member = columns[i].attributes['data-g-member'].nodeValue;
                        }
                        var header = columns[i].getElementsByTagName("header");
                        if (header.length > 0) {
                            column.header = new Template(header[0]);
                        }
                        var cell = columns[i].getElementsByTagName("cell");
                        if (cell.length > 0) {
                            column.cell = new Template(cell[0]);
                        }
                        var cellDetail = columns[i].getElementsByTagName("celldetail");
                        if (cellDetail.length == 1) {
                            column.cellDetail = new Template(cellDetail[0]);
                        }
                        if (columns[i].attributes['data-g-width'] != null) {
                            column.width = columns[i].attributes['data-g-width'].nodeValue;
                        }
                        if (columns[i].attributes['data-g-views'] != null) {
                            column.device = columns[i].attributes['data-g-views'].nodeValue;
                        }
                        if (columns[i].attributes['data-g-resizable'] != undefined) {
                            column.resizable = columns[i].attributes['data-g-resizable'].nodeValue == 'false' ? false : true;
                        }
                        if (columns[i].attributes['data-g-not-sized'] != undefined) {
                            column.notSized = columns[i].attributes['data-g-not-sized'].nodeValue == 'true' ? true : false;
                            this.hasAnyNotSizedColumn = true;
                        }
                        if (columns[i].attributes['data-g-enable-filtering'] != undefined) {
                            column.enableFiltering = columns[i].attributes['data-g-enable-filtering'].nodeValue == 'false' ? false : true;
                        }
                        if (columns[i].attributes['data-g-enable-sorting'] != undefined) {
                            column.enableSorting = columns[i].attributes['data-g-enable-sorting'].nodeValue == 'false' ? false : true;
                        }
                        if (columns[i].attributes['data-g-enable-grouping'] != undefined) {
                            column.enableGrouping = columns[i].attributes['data-g-enable-grouping'].nodeValue == 'false' ? false : true;
                        }

                        //if (columns[i].attributes['data-g-width-percent'] != undefined) {
                        //    column.widthPercent = columns[i].attributes['data-g-width-percent'].nodeValue;
                        //}
                        column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : column.member;
                        column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : column.member;
                        column.filterMemberPath = columns[i].attributes['data-g-filter-member'] != undefined ? columns[i].attributes['data-g-filter-member'].nodeValue : column.member;

                        this.columns.push(column);
                    }

                    var filterPopup = optionsElement.getElementsByTagName("filterpopup");
                    if (filterPopup.length == 1) {
                        this.filterPopup = new Template(filterPopup[0]);
                    }
                    var mobileTemplate = optionsElement.getElementsByTagName("mobile");
                    if (mobileTemplate.length == 1) {
                        this.mobileTemplateHtml = new Template(mobileTemplate[0]);
                    }
                    var groupHeaderTemplate = optionsElement.getElementsByTagName("groupheader");
                    if (groupHeaderTemplate.length == 1) {
                        this.groupHeaderTemplate = new Template(groupHeaderTemplate[0]);
                    }
                    var detailsTemplate = optionsElement.getElementsByTagName("details");
                    if (detailsTemplate.length == 1) {
                        this.detailsTemplateHtml = new Template(detailsTemplate[0]);
                    }
                    var footer = optionsElement.getElementsByTagName("footer");
                    if (footer.length != 0) {
                        this.tableFooterTemplate = new Template(footer[0]);
                    }
                }
                this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(null, null);
                this.showDetailFor = new ShowDetail();
                this.showCustomDetailFor = new ShowDetail();
                this.filterPopupForColumn = new ColumnInfo();
            };

            Options.prototype.applyHandler = function () {
                for (var i = 0; i < this.columns.length; i++) {
                    if (isNotNoU(this.columns[i].member)) {
                        if (isNoU(this.columns[i].groupMemberPath)) {
                            this.columns[i].groupMemberPath = this.columns[i].member;
                        }
                        if (isNoU(this.columns[i].sortMemberPath)) {
                            this.columns[i].sortMemberPath = this.columns[i].member;
                        }
                        if (isNoU(this.columns[i].filterMemberPath)) {
                            this.columns[i].sortMemberPath = this.columns[i].member;
                        }
                    }
                }
                this.apply();
            };
            return Options;
        })();
        TGrid.Options = Options;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=Options.js.map
