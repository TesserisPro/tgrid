var TesserisPro;
(function (TesserisPro) {
    /// <reference path="SortDescriptor.ts" />
    /// <reference path="FilterDescriptor.ts" />
    (function (TGrid) {
        var ArrayItemsProvider = (function () {
            function ArrayItemsProvider(items) {
                this.items = items;
            }
            ArrayItemsProvider.prototype.getItems = function (firstItem, itemsNumber, sortDescriptors, filterDescriptors, collapsedFilterDescriptors, callback) {
                var oldItems = new Array();
                oldItems = oldItems.concat(this.items);
                this.sort(sortDescriptors);
                var self = this;
                setTimeout(function () {
                    callback(self.onFiltering(filterDescriptors, collapsedFilterDescriptors).slice(firstItem, firstItem + itemsNumber), firstItem, itemsNumber);
                    this.items = new Array();
                    this.items = this.items.concat(oldItems);
                }, 200);
            };

            ArrayItemsProvider.prototype.getTotalItemsCount = function (filterDescriptors, callback) {
                callback(this.onFiltering(filterDescriptors, null).length);
            };

            ArrayItemsProvider.prototype.sort = function (sortDescriptors) {
                if (sortDescriptors != null && sortDescriptors.length > 0 && isNotNull(sortDescriptors[0].path)) {
                    this.items.sort(function (a, b) {
                        return this.sortingRecursive(a, b, sortDescriptors, 0);
                    });
                }
            };

            ArrayItemsProvider.prototype.sortingRecursive = function (a, b, sortDescriptors, i) {
                if (i != sortDescriptors.length - 1) {
                    if (getMemberValue(a, sortDescriptors[i].path) > getMemberValue(b, sortDescriptors[i].path))
                        return this.sortingOrder(sortDescriptors[i]);
                    if (getMemberValue(b, sortDescriptors[i].path) > getMemberValue(a, sortDescriptors[i].path))
                        return this.sortingOrderDesc(sortDescriptors[i]);
                    return this.sortingRecursive(a, b, sortDescriptors, i + 1);
                } else {
                    return getMemberValue(a, sortDescriptors[i].path) > getMemberValue(b, sortDescriptors[i].path) ? this.sortingOrder(sortDescriptors[i]) : this.sortingOrderDesc(sortDescriptors[i]);
                }
            };

            ArrayItemsProvider.prototype.sortingOrder = function (sortDescriptor) {
                return sortDescriptor.asc ? 1 : -1;
            };

            ArrayItemsProvider.prototype.sortingOrderDesc = function (sortDescriptor) {
                return sortDescriptor.asc ? -1 : 1;
            };

            ArrayItemsProvider.prototype.onFiltering = function (filterDescriptors, collapsedFilterDescriptors) {
                if ((filterDescriptors == null || filterDescriptors.length == 0) && (collapsedFilterDescriptors == null || collapsedFilterDescriptors.length == 0)) {
                    return this.items;
                }

                if (collapsedFilterDescriptors == undefined) {
                    collapsedFilterDescriptors = [];
                }

                var isCollapsedItem = [];
                for (var c = 0; c < collapsedFilterDescriptors.length; c++) {
                    isCollapsedItem.push(false);
                }

                var filteredItems = [];
                for (var j = 0; j < this.items.length; j++) {
                    // filtering common filters
                    var isFiltered = 0;
                    for (var i = 0; i < filterDescriptors.length; i++) {
                        if (this.filter(this.items[j], filterDescriptors[i])) {
                            isFiltered++;
                        }
                    }

                    // filtering collapsed filter
                    var isCollapsedFiltered = false;
                    var numberfilter = -1;
                    for (var i = 0; i < collapsedFilterDescriptors.length; i++) {
                        if (this.filter(this.items[j], collapsedFilterDescriptors[i])) {
                            isCollapsedFiltered = true;
                            numberfilter = i;
                            i = collapsedFilterDescriptors.length;
                        }
                    }

                    if (isFiltered == 0 && !isCollapsedFiltered) {
                        filteredItems.push(this.items[j]);
                    } else {
                        if (isFiltered == 0) {
                            if (isCollapsedFiltered && !isCollapsedItem[numberfilter]) {
                                var fakeItem = {};
                                fakeItem["isFakeItem"] = true;
                                fakeItem[collapsedFilterDescriptors[numberfilter].path] = collapsedFilterDescriptors[numberfilter].value;
                                for (var i = 0; i < collapsedFilterDescriptors[numberfilter].children.length; i++) {
                                    fakeItem[collapsedFilterDescriptors[numberfilter].children[i].path] = collapsedFilterDescriptors[numberfilter].children[i].value;
                                }
                                filteredItems.push(fakeItem);
                                isCollapsedItem[numberfilter] = true;
                            }
                        }
                    }
                }

                return filteredItems;
            };

            ArrayItemsProvider.prototype.filter = function (item, filterDescriptor) {
                if (!this.isFiltering(item[filterDescriptor.path], filterDescriptor.value, filterDescriptor.condition)) {
                    if (filterDescriptor.children.length == 0) {
                        return true;
                    } else {
                        var result = 0;
                        for (var i = 0; i < filterDescriptor.children.length; i++) {
                            if (!this.isFiltering(item[filterDescriptor.children[i].path], filterDescriptor.children[i].value, filterDescriptor.children[i].condition)) {
                                result++;
                            }
                        }
                        if (result == filterDescriptor.children.length) {
                            return true;
                        }
                    }
                }

                return false;
            };

            ArrayItemsProvider.prototype.isFiltering = function (item, value, condition) {
                switch (condition) {
                    case 1:
                        return (item == value);
                    case 2:
                        return (item != value);
                }
                return false;
            };
            return ArrayItemsProvider;
        })();
        TGrid.ArrayItemsProvider = ArrayItemsProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ArrayItemsProvider.js.map
