var TGrid;
(function (TGrid) {
    /// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="../IFooterViewModel.ts" />
    /// <reference path="AngularFooterViewModel.ts" />
    /// <reference path="IFooterModelScope.ts" />
    (function (Angular) {
        var FooterCtrl = (function () {
            function FooterCtrl($scope) {
                this.$scope = $scope;
                this.footerModel = $scope.footerModel = new TesserisPro.TGrid.AngularFooterViewModel(1, 1, 1, 1);
            }
            FooterCtrl.$inject = [
                '$scope'
            ];
            return FooterCtrl;
        })();
        Angular.FooterCtrl = FooterCtrl;
    })(TGrid.Angular || (TGrid.Angular = {}));
    var Angular = TGrid.Angular;
})(TGrid || (TGrid = {}));
//# sourceMappingURL=FooterCtrl.js.map
