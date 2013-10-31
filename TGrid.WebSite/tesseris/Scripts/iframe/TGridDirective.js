var TGrid;
(function (TGrid) {
    /// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="../Options.ts"/>
    (function (Angular) {
        var ValueAccessor = (function () {
            function ValueAccessor() {
            }
            return ValueAccessor;
        })();
        Angular.ValueAccessor = ValueAccessor;

        var Directive = (function () {
            function Directive() {
                this.directive = {};
                this.directive.restrict = 'E';

                //this.directive.transclude = true;
                this.directive.link = function (scope, element, attrs) {
                    var valueAccessor = new ValueAccessor();
                    valueAccessor.provider = scope[attrs["provider"]];
                    valueAccessor.pageSize = attrs["pagesize"];
                    valueAccessor.selectMode = attrs["selectmode"];
                    valueAccessor.groupBy = (attrs["groupby"] != undefined) ? attrs["groupby"].split(' ') : undefined;
                    valueAccessor.enableVirtualScroll = attrs["enablevirtualscroll"];
                    valueAccessor.enablePaging = attrs["enablepaging"];

                    var options = new TesserisPro.TGrid.Options(element[0], valueAccessor, TesserisPro.TGrid.Framework.Angular);
                    var grid = new TesserisPro.TGrid.Grid(element[0], options, valueAccessor.provider);
                    //var strTemplate = "TGrid result Table";
                    //element.replaceWith(strTemplate);
                };
                return this.directive;
            }
            return Directive;
        })();
        Angular.Directive = Directive;
    })(TGrid.Angular || (TGrid.Angular = {}));
    var Angular = TGrid.Angular;
})(TGrid || (TGrid = {}));
//# sourceMappingURL=TGridDirective.js.map
