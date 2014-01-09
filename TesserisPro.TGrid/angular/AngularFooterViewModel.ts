/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../IFooterViewModel.ts" />

module TesserisPro.TGrid {

    export class AngularFooterViewModel implements IFooterViewModel  {
        private $scope: any;

        private totalCount: number = 0;
        private selectedItem: any = null;
        private currentPage: number = 1;
        private totalPages: number = 1;
        private grid: any;
        private viewPageNumber;

        public angularModuleName: string;

        constructor(grid: any) {
            this.grid = grid;
        }

        public setScope(scope: any) {
            this.$scope = scope;
            this.$scope.totalCount = this.totalCount;
            this.$scope.selectedItem = this.selectedItem;
            this.$scope.currentPage = this.currentPage;
            this.$scope.totalPages = this.totalPages;
            this.$scope.grid = this.grid;
            this.$scope.viewPageNumber = "";
            this.$scope.changePage = (pageNumber) => this.changePage(pageNumber);
        }

        public setTotalCount(totalCount: number) { 
            this.totalCount = totalCount;
            if (this.$scope != null) {
                this.$scope.totalCount = totalCount;
                this.$scope.$apply();
            }
        }

        public setSelectedItem(selectedItem: any) {             
            this.selectedItem = selectedItem;
            if (this.$scope != null) {
                this.$scope.selectedItem = selectedItem;
                this.$scope.$apply();
            }
        }

        public setCurrentPage(currentPage: number) {
            this.currentPage = currentPage;
            if (this.$scope != null) {
                this.$scope.currentPage = currentPage;
                this.$scope.$apply();
            }
        }

        public setTotalPages(totalPages: number) {
            this.totalPages = totalPages;
            if (this.$scope != null) {
                this.$scope.totalPages = totalPages;
                this.$scope.$apply();
            }
        }

        public changePage(viewPageNumber: number) {
            if (this.$scope.totalPages != undefined && this.$scope.totalPages != null && this.$scope.totalPages < viewPageNumber) {
                this.grid.selectPage(this.$scope.totalPages-1);
            } else if (viewPageNumber  < 1) {
                this.grid.selectPage(0);
            } else {
                this.grid.selectPage(viewPageNumber - 1);
            }
        }
    }
}