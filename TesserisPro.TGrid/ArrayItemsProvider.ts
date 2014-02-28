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
//  
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
//
/// <reference path="SortDescriptor.ts" />
/// <reference path="FilterDescriptor.ts" />

module TesserisPro.TGrid {

    export class ArrayItemsProvider implements IItemProvider {
        private sourceItems: Array<any>;
        public onAdd: () => void;
        public onRemove: () => void;

        constructor(items: Array<any>) {
            if (isObservable(items)) {
                this.sourceItems = ko.unwrap(items);
            } else {
                this.sourceItems = items;
            }
        }

        public getItems(firstItem: number,
            itemsNumber: number,
            sortDescriptors: Array<SortDescriptor>,
            filterDescriptor: FilterDescriptor,
            collapsedFilterDescriptors: Array<FilterDescriptor>,
            callback: (items: Array<any>, firstItem: number, itemsNumber: number) => void): void
        {
            // Copy items
            var items = new Array();
            items = items.concat(this.sourceItems);

            // SortItems
            this.sort(items, sortDescriptors);

            // FilterItems
            items = this.filter(items, filterDescriptor, collapsedFilterDescriptors);

            // Apply paging
            items = items.slice(firstItem, firstItem + itemsNumber);

            // Return result
            callback(items, firstItem, itemsNumber);
        }

        public getTotalItemsCount(filterDescriptor: FilterDescriptor, callback: (total: number) => void): void {
            // For items count we just need to apply filter
            callback(this.filter(this.sourceItems, filterDescriptor, null).length);
        }

        public addItem(item: any) {
            this.sourceItems.push(item);
            this.onAdd();
        }

        public removeItem(item: any) {
            for (var i = 0; i < this.sourceItems.length; i++){
                if (this.sourceItems[i] == item) {
                    this.sourceItems.splice(i, 1);
                    break;
                }
            }
            this.onRemove();
        }

        public getFirstItem(): any{
            if (this.sourceItems.length > 0) {
                return this.sourceItems[0];
            } else {
                return null;
            }
        }

        private sort(items: Array<any>, sortDescriptors: Array<SortDescriptor>) {
            if (sortDescriptors != null && sortDescriptors.length > 0 && isNotNull(sortDescriptors[0].path)) {
                items.sort((a, b) => this.compareRecursive(a, b, sortDescriptors, 0));
            }
        }

        private compareRecursive(a, b, sortDescriptors: Array<SortDescriptor>, i) {
            if (i != sortDescriptors.length - 1) {
                if (getMemberValue(a, sortDescriptors[i].path) > getMemberValue(b, sortDescriptors[i].path))
                    return this.sortingOrder(sortDescriptors[i]);
                if (getMemberValue(b, sortDescriptors[i].path) > getMemberValue(a, sortDescriptors[i].path))
                    return this.sortingOrderDesc(sortDescriptors[i]);
                    return this.compareRecursive(a, b, sortDescriptors, i + 1)
                } else {
                return getMemberValue(a, sortDescriptors[i].path) > getMemberValue(b, sortDescriptors[i].path) ? this.sortingOrder(sortDescriptors[i]) : this.sortingOrderDesc(sortDescriptors[i]);
            }
        }

        private sortingOrder(sortDescriptor: SortDescriptor) {
            return sortDescriptor.asc ? 1 : -1;
        }

        private sortingOrderDesc(sortDescriptor) {
            return sortDescriptor.asc ? -1 : 1;
        }

        private filter(items: Array<any>, filterDescriptor: FilterDescriptor, collapsedFilterDescriptors): Array<any> {
            if (filterDescriptor == null && (collapsedFilterDescriptors == null || collapsedFilterDescriptors.length == 0)) {
                return items;
            }

            if (collapsedFilterDescriptors == undefined) {
                collapsedFilterDescriptors = [];
            }

            var collapsedFilterUsed = [];
            for (var c = 0; c < collapsedFilterDescriptors.length; c++) {
                collapsedFilterUsed.push(false);
            }

            var filteredItems = [];
            for (var j = 0; j < items.length; j++) {
                if (!this.isFilterSatisfied(items[j], filterDescriptor)) {
                    continue;
                }

                var isFilteredOut = false;
                for (var i = 0; i < collapsedFilterDescriptors.length; i++) {
                    if (this.isFilterSatisfied(items[j], collapsedFilterDescriptors[i])) {
                        if (!collapsedFilterUsed[i]) {
                            collapsedFilterUsed[i] = true;
                        }
                        else {
                            isFilteredOut = true;
                        }
                        break;
                    }
                }

                if (!isFilteredOut) {
                    filteredItems.push(items[j]);    
                }
            }

            return filteredItems;
        }

        private isFilterSatisfied(item, filterDescriptor: FilterDescriptor) {
            if (this.isFilterConditionSatisfied(item[filterDescriptor.path], filterDescriptor.value, filterDescriptor.condition)) {
                if (filterDescriptor.children.length == 0 || filterDescriptor.parentChildUnionOperator == LogicalOperator.Or) {
                    return true;
                } else {
                    return this.isChildFiltersSatisfied(item, filterDescriptor);
                }
            }
            else {
                if (filterDescriptor.parentChildUnionOperator == LogicalOperator.And) {
                    return false;
                }
                else
                {
                    return this.isChildFiltersSatisfied(item, filterDescriptor);
                }
            }
        }

        private isChildFiltersSatisfied(item, filterDescriptor: FilterDescriptor) {
            if (filterDescriptor.childrenUnionOperator == LogicalOperator.Or) {
                for (var i = 0; i < filterDescriptor.children.length; i++) {
                    if (this.isFilterConditionSatisfied(
                                        item[filterDescriptor.children[i].path],
                                        filterDescriptor.children[i].value,
                                        filterDescriptor.children[i].condition)) {
                        return true;
                    }
                }

                return false;
            }
            else {
                for (var i = 0; i < filterDescriptor.children.length; i++) {
                    if (!this.isFilterConditionSatisfied(
                                        item[filterDescriptor.children[i].path],
                                        filterDescriptor.children[i].value,
                                        filterDescriptor.children[i].condition)) {
                        return false;
                    }
                }

                return true;
            }
        }
        

        private isFilterConditionSatisfied(item: any, value: any, condition: FilterCondition): boolean {
            switch (condition) {
                case FilterCondition.None:
                    return true;
                case FilterCondition.Equals:
                    return (item == value);
                case FilterCondition.NotEquals:
                    return (item != value);
                default:
                    return false;
            }
        }
    }
}

