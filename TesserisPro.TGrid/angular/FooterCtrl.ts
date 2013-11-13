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
                this.footerModel.totalCount = $scope.footerModel.totalCount = 0;
                this.footerModel.selectedItem = $scope.footerModel.selectedItem = 0;
                this.footerModel.currentPage =  $scope.footerModel.currentPage = 1;
                this.footerModel.totalPages =  $scope.footerModel.totalPages = 1;
        }

        public setTotalCount(totalCount:number) {
            this.$scope.footerModel.totalCount = totalCount;
        }


    }

}