var TesserisPro;
(function (TesserisPro) {
    /// <reference path="scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="Options.ts"/>
    (function (TGrid) {
        // Class
        var FooterDirective = (function () {
            function FooterDirective(footer) {
                this.directive = {};
                this.directive.restrict = 'E';
                this.directive.template = footer;
                this.directive.link = function (scope, element, attrs) {
                    scope.totalCount = 69;
                };

                return this.directive;
            }
            return FooterDirective;
        })();
        TGrid.FooterDirective = FooterDirective;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=FooterDirective.js.map
