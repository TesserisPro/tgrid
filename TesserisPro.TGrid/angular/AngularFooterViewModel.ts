/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../IFooterViewModel.ts" />

module TesserisPro.TGrid {

    export class AngularFooterViewModel implements IFooterViewModel {
        public totalCount: number;
        public selectedItem: any;
        public currentPage: number;
        public totalPages: number;


        constructor(totalCount: number, selectedItem: any, currentPage: number, totalPages: number) {
            this.totalCount = totalCount;
            this.selectedItem = selectedItem;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
        }

        public setTotalCount(totalCount: number) {
            this.totalCount = totalCount;
        }

        public setSelectedItem(selectedItem: any) {
            this.selectedItem=selectedItem;
        }

        public setCurrentPage(currentPage: number) {
            this.currentPage = currentPage;
        }

        public setTotalPages(totalPages: number) {
            this.totalPages = totalPages;
        }
    }
}