/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../IFooterViewModel.ts" />
/// <reference path="AngularFooterViewModel.ts" />
/// <reference path="IFooterModelScope.ts" />

module TGrid.Angular {

    export class FooterCtrl {
        private footerModel: TesserisPro.TGrid.AngularFooterViewModel;

        public static $inject = [
            '$scope'
        ];

        constructor(
            private $scope: TesserisPro.TGrid.IFooterModelScope) {
                this.footerModel = $scope.footerModel = new TesserisPro.TGrid.AngularFooterViewModel(1,1,1,1);               
        }

    }

}