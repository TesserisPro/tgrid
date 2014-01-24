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

        public changePage(viewPageNumber: number) {
            if (this.totalPages() != undefined && this.totalPages() != null && this.totalPages() < viewPageNumber) {
                this.grid.selectPage(this.totalPages() - 1);
            } else if (viewPageNumber < 1) {
                this.grid.selectPage(0);
            } else {
                this.grid.selectPage(viewPageNumber - 1);
            }
        }
    }
}