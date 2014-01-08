/// <reference path="../IFooterViewModel.ts" />


module TesserisPro.TGrid {

    export class KnockoutFooterViewModel implements IFooterViewModel {
        public totalCount: KnockoutObservable<number>;
        public selectedItem: KnockoutObservable<any>;
        public currentPage: KnockoutObservable<number>;
        public totalPages: KnockoutObservable<number>;
        public grid: any


        constructor(totalCount: number, selectedItem: any, currentPage: number, totalPages: number, grid: any) {
            this.totalCount = ko.observable(totalCount);
            this.selectedItem = ko.observable(selectedItem);
            this.currentPage = ko.observable(currentPage);
            this.totalPages = ko.observable(totalPages);
            this.grid = grid;
        }

        public setTotalCount(totalCount: number) {
            this.totalCount(totalCount);
        }

        public setSelectedItem(selectedItem: any) {
            this.selectedItem(selectedItem);
        }

        public setCurrentPage(currentPage: number) {
            this.currentPage(currentPage);
        }

        public setTotalPages(totalPages: number) {
            this.totalPages(totalPages);
        }

        public changePage(pageNumber: number) {
            this.grid.selectPage(pageNumber - 1);
        }
    }
}