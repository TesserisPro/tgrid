/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../IFooterViewModel.ts" />
/// <reference path="IFooterModelScope.ts" />

module TesserisPro.TGrid {

    export class AngularFooterViewModel implements IFooterViewModel  {
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
            this.setScopeElementValue(totalCount, 0);
        }

        public setSelectedItem(selectedItem: any) {             
            this.setScopeElementValue(selectedItem, 1);
        }

        public setCurrentPage(currentPage: number) {
            this.setScopeElementValue(currentPage, 2);
        }

        public setTotalPages(totalPages: number) {
           this.setScopeElementValue(totalPages, 3);
        }

        private setScopeElementValue(value: any, forSwitch: number) {
            var elementFooter = document.getElementById('footerModel');
            if (elementFooter != null) {
                var footerScope = <IFooterModelScope>angular.element(elementFooter).scope();
                if (footerScope.footerModel != undefined) {
                    switch (forSwitch) {
                        case 0:
                            footerScope.$apply(function () {
                                footerScope.footerModel.totalCount = value;
                            });
                            break;
                        case 1:
                            footerScope.$apply(function () {
                                if (value == undefined) {
                                    value = "";
                                }
                                footerScope.footerModel.selectedItem = value;
                            });
                            break;
                        case 2:
                            footerScope.$apply(function () {
                                footerScope.footerModel.currentPage = value;
                            });
                            break;
                        case 3:
                            footerScope.$apply(function () {
                                footerScope.footerModel.totalPages = value;
                            });                             
                            break;
                    }
                }
            }
        }
    }
}