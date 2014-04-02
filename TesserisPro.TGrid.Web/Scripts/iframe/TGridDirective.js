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
var TGrid;
(function (TGrid) {
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
    /// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="../Options.ts"/>
    (function (Angular) {
        function Directive() {
            var directive = {};
            directive.restrict = 'E';
            directive.link = function (scope, element, attrs) {
                var options = new TesserisPro.TGrid.Options(element[0], 1);
                options.parentViewModel = scope;
                if (attrs["groupby"] != undefined) {
                    var groupBy = attrs["groupby"].split(' ');
                    if (groupBy.length > 0 && groupBy[0] != "") {
                        for (var i = 0; i < groupBy.length; i++) {
                            options.groupBySortDescriptors.push(new TesserisPro.TGrid.SortDescriptor(groupBy[i], true));
                        }
                    }
                }

                if (attrs["enablepaging"] == undefined) {
                    options.enablePaging = false;
                } else {
                    options.enablePaging = attrs["enablepaging"] == "true" ? true : false;
                }

                var pageSizeAtt = attrs["pagesize"];
                if (pageSizeAtt != undefined) {
                    options.pageSize = parseInt(pageSizeAtt);
                    if (this.isEnablePaging) {
                        options.pageSize = (isNaN(this.pageSize) || this.pageSize < 1) ? 10 : this.pageSize;
                    }
                }

                var pageSlideAttr = attrs["pageslide"];
                if (pageSlideAttr != undefined) {
                    options.pageSlide = parseInt(pageSlideAttr);
                    if (this.isEnablePaging) {
                        options.pageSlide = (isNaN(this.pageSlide) || this.pageSlide < 1) ? 1 : this.pageSlide;
                    }
                }

                var selectionModeAtt = attrs["selectionmode"];
                if (selectionModeAtt == "multi") {
                    options.selectionMode = 2;
                }

                if (selectionModeAtt == undefined || selectionModeAtt == "single") {
                    options.selectionMode = 1;
                }

                if (selectionModeAtt == "none") {
                    options.selectionMode = 0;
                }

                if (attrs["enablevirtualscroll"] == undefined) {
                    options.enableVirtualScroll = false;
                } else {
                    options.enableVirtualScroll = attrs["enablevirtualscroll"] == "true" ? true : false;
                }

                if (attrs["enablecollapsing"] == undefined) {
                    options.enableCollapsing = false;
                } else {
                    options.enableCollapsing = attrs["enablecollapsing"] == "true" ? true : false;
                }

                if (attrs["enablesorting"] == undefined) {
                    options.enableSorting = false;
                } else {
                    options.enableSorting = attrs["enablesorting"] == "true" ? true : false;
                }

                if (attrs["enablegrouping"] == undefined) {
                    options.enableGrouping = false;
                } else {
                    options.enableGrouping = attrs["enablegrouping"] == "true" ? true : false;
                }

                if (attrs["showdetailsonselection"] == undefined) {
                    options.openDetailsOnSelection = false;
                } else {
                    options.openDetailsOnSelection = attrs["showdetailsonselection"] == "true" ? true : false;
                }

                if (attrs["enablefiltering"] == undefined) {
                    options.enableFiltering = false;
                } else {
                    options.enableFiltering = attrs["enablefiltering"] == "true" ? true : false;
                }

                if (attrs["rowclick"] == undefined || attrs["rowclick"] == null) {
                    options.rowClick = null;
                } else {
                    options.rowClick = attrs["rowclick"];
                }

                var grid = new TesserisPro.TGrid.Grid(element[0], options, scope[attrs["provider"]]);
                if (attrs["options"] != undefined) {
                    options.apply = function () {
                        grid.afterOptionsChange();
                    };
                    scope[attrs["options"]] = options;
                }
            };

            return directive;
        }
        Angular.Directive = Directive;

        function registerTGrid(appModule) {
        }
        Angular.registerTGrid = registerTGrid;
    })(TGrid.Angular || (TGrid.Angular = {}));
    var Angular = TGrid.Angular;
})(TGrid || (TGrid = {}));
//# sourceMappingURL=TGridDirective.js.map
