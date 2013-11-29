
module TesserisPro.TGrid {

/// <reference path="IItemProvider.ts" />

export class ArrayBasedItemsProvider implements IItemProvider {

    public data: Array<any>;
    
    constructor() {

    }
        
    public isSortable() {
        return true;
    }

    public isFilterable() {
        return true;
    }

    
    public getItems(firstItem, itemsNumber, sortDescriptors, filterDescriptors, collapsedFilterDescriptors, callback) {
        var array = new Array();
        array.concat(this.data);
        this.sort(array, sortDescriptors);
        
        setTimeout(function () {
            callback(onFiltering(filterDescriptors, collapsedFilterDescriptors).slice(firstItem, firstItem + itemsNumber), firstItem, itemsNumber);
            items = new Array();
            items = items.concat(oldItems);
        }, 1);
    };

    public getTotalItemsCount(filterDescriptors, callback) {
        callback(onFiltering(filterDescriptors).length);
    };

    private filter(items: Array<any>, filterDescriptors: Array<FilterDescriptor>, collapsedFilterDescriptors: Array<FilterDescriptor>) {
        if ((filterDescriptors == null || filterDescriptors.length == 0) && (collapsedFilterDescriptors == null || collapsedFilterDescriptors.length == 0)) {
            return;
        }

        var filteredArray = new Array();

        if (collapsedFilterDescriptors == undefined) {
            collapsedFilterDescriptors = new Array<FilterDescriptor>();
        }

        var isCollapsedItem = [];
        for (var c = 0; c < collapsedFilterDescriptors.length; c++) {
            isCollapsedItem.push(false);
        }

        for (var j = 0; j < items.length; j++) {
            // filtering common filters
            var isFiltered = 0;
            for (var i = 0; i < filterDescriptors.length; i++) {
                if (filter(items[j], filterDescriptors[i])) {
                    isFiltered++;
                }
            }

            // filtering collapsed filter
            var isCollapsedFiltered = false;
            var numberfilter = -1;
            for (var i = 0; i < collapsedFilterDescriptors.length; i++) {
                if (filter(items[j], collapsedFilterDescriptors[i])) {
                    isCollapsedFiltered = true;
                    numberfilter = i;
                    i = collapsedFilterDescriptors.length;
                }
            }

            //add fake item for creating collapsing group
            if (isFiltered == 0 && !isCollapsedFiltered) {
                filterdItems.push(items[j]);
            } else {
                if (isFiltered == 0) {
                    if (isCollapsedFiltered && !isCollapsedItem[numberfilter]) {
                        var fakeItem = {};
                        fakeItem[collapsedFilterDescriptors[numberfilter].path] = collapsedFilterDescriptors[numberfilter].value;
                        for (var i = 0; i < collapsedFilterDescriptors[numberfilter].children.length; i++) {
                            fakeItem[collapsedFilterDescriptors[numberfilter].children[i].path] = collapsedFilterDescriptors[numberfilter].children[i].value;
                        }
                        filterdItems.push(fakeItem);
                        isCollapsedItem[numberfilter] = true;
                    }
                }
            }
        }

        return filterdItems;
    }

    private filter(item, filterDescriptors) {
        if (!isFiltering(item[filterDescriptors.path], filterDescriptors.value, filterDescriptors.condition)) {
            if (filterDescriptors.children.length == 0) {
                return true;
            } else {
                var result = 0
                    for (var i = 0; i < filterDescriptors.children.length; i++) {
                    if (!isFiltering(item[filterDescriptors.children[i].path], filterDescriptors.children[i].value, filterDescriptors.children[i].condition)) {
                        result++;
                    }
                }
                if (result == filterDescriptors.children.length) {
                    return true;
                }
            }
        }

        return false;
    }

    private satisfiesCondition(item, conditionValue, conditionType: FilterCondition) {
        switch (conditionType) {
            case FilterCondition.Equals:
                return (item == conditionValue);
            case FilterCondition.NotEquals:
                return (item != conditionValue);
        }

        return false;
    }

    private sort(items: Array<any>, sortDescriptors: Array<SortDescriptor>) {
        if (sortDescriptors != null && sortDescriptors.length > 0) {
            items.sort((a, b) => this.compare(a, b, sortDescriptors));
        }
    }

    private satisfiesFilter(item: any, filter: Array<FilterDescriptor>) {
        for (var i = 0; i < filter.length; i++) {
            this.satisfiesCondition(getMemberValue(item, filter[i].path), filter[i].condition
        }
    }

    private compare(a: any, b: any, sortDescriptors: Array<SortDescriptor>): number {
        for (var i = 0; i < sortDescriptors.length; i++) {
            var comparisonResult = this.compareMemebers(a, b, sortDescriptors[i]);
            if (comparisonResult != 0) {
                return comparisonResult;
            }
        }

        return 0;
    }

    private compareMemebers(a: any, b: any, sortDescriptor: SortDescriptor): number {
        if (getMemberValue(a, sortDescriptor.path) > getMemberValue(b, sortDescriptor.path)) {
            return sortDescriptor.asc ? 1 : -1;
        }
        if (getMemberValue(a, sortDescriptor.path) < getMemberValue(b, sortDescriptor.path)) {
            return sortDescriptor.asc ? -1 : 1;
        }

        return 0;
    }
}