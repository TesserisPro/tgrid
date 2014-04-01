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

/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../ItemViewModel.ts" />

module TesserisPro.TGrid {

    export class AngularItemsViewModel {
        private $scope: any;
        private items: Array<any>;
        private options: Options;
        private selected : (item: ItemViewModel, multi: boolean) => boolean;

        public angularControllerName: string;

        constructor(items: Array<any>, options: Options, selected: (item: ItemViewModel, multi: boolean) => boolean) {
            this.items = items;
            this.options = options;
            this.selected = selected;
        }
        public setScope(scope: any) {
            this.$scope = scope;
            this.$scope.items = this.items;
            for (var i = 0; i < this.items.length; i++) {
                this.$scope.items[i].model = this.items[i].model;
                this.$scope.items[i].item = this.items[i].item;
                this.$scope.items[i].grid = this.items[i].grid;
                this.$scope.items[i].isGroupHeader = this.items[i].isGroupHeader;
                this.$scope.items[i].setItemValue = (item) => this.items[i].setItemValue(item);
                this.$scope.items[i].colspan = this.options.columns.length + 1 + this.options.groupBySortDescriptors.length - this.items[i].item.level;
                this.$scope.items[i].detailsColspan = this.options.hasAnyNotSizedColumn ? this.options.columns.length : this.options.columns.length + 1;
                this.$scope.items[i].isSelected = this.options.isSelected(this.items[i].item);
                this.$scope.items[i].showDetail = false;
                this.$scope.items[i].toggleGroupCollapsing = (e, item) => {
                    if (item.item.collapse) {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(item.item.filterDescriptor);
                        item.item.collapse = false;
                    }
                    else {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(item.item.filterDescriptor);
                        item.item.collapse = true;
                    }

                }
                this.$scope.items[i].showDetailFor = new ShowDetail();
                this.$scope.items[i].toggleDetailsForCell = (columnIndex, item, items) => {
                    if (this.options.showCustomDetailFor.item != item || this.options.showCustomDetailFor.item == item && this.options.showDetailFor.column != columnIndex) {
                        item.openDetailsForCell(columnIndex, item, items);
                    } else {
                        item.closeDetailsForCell(columnIndex, item);
                    }
                };
                this.$scope.items[i].openDetailsForCell = (columnIndex, item, items) => {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].showDetail) {
                            if (items[i] != item) {
                                items[i].showDetail = false;
                            }
                        }
                    }
                    this.options.showDetailFor.column = columnIndex;
                    this.options.showDetailFor.item = item;
                    item.showDetailFor.item = item;
                    item.showDetailFor.column = columnIndex;
                    item.showDetail = true;
                    this.options.showCustomDetailFor.item = item;
                    this.options.showCustomDetailFor.column = columnIndex;
                    this.options.shouldAddDetailsOnSelection = false;
                };
                this.$scope.items[i].closeDetailsForCell = (columnIndex, item) => {
                    item.showDetail = false;
                    item.showDetailsFor = new ShowDetail();
                    this.options.showDetailFor = new ShowDetail();
                }
                this.$scope.items[i].select = (e, item, items) => {
                    if (this.options.selectionMode != SelectionMode.None) {
                        if (this.options.selectionMode == SelectionMode.Multi) {
                            if (!e.ctrlKey) {
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i].isSelected) {
                                        items[i].isSelected = false;
                                    }
                                }
                            }
                        } else if (this.options.selectionMode == SelectionMode.Single) {
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].isSelected) {
                                    items[i].isSelected = false;
                                    
                                }
                                if (items[i].showDetail) {
                                    if (items[i] != item || items[i] == item && item.showDetailFor.column != -1) {
                                        items[i].showDetail = false;
                                    }
                                }
                            }

                            if (this.options.openDetailsOnSelection) {
                                this.options.showDetailFor = new ShowDetail();
                                this.options.showDetailFor.item = item;
                                item.showDetailFor = new ShowDetail();
                                item.showDetailFor.item = item;
                                
                                if (item.showDetail) {
                                    item.showDetail = false;
                                } else {
                                    item.showDetail = true;
                                }
                            } else {
                                this.options.showDetailFor = new ShowDetail();
                            }
                        }
                        if (item.isSelected) {
                            item.isSelected = false;
                        } else {
                            item.isSelected = true;
                        }
                        
                    }
                }
            }
        }
    }
} 