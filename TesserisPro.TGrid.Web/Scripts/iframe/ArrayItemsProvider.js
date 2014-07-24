var TesserisPro;
(function (TesserisPro) {
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
    (function (TGrid) {
        var ArrayItemsProvider = (function () {
            function ArrayItemsProvider(items) {
                if (isObservable(items)) {
                    this.sourceItems = ko.unwrap(items);
                } else {
                    this.sourceItems = items;
                }
            }
            ArrayItemsProvider.prototype.getItems = function (firstItem, itemsNumber, sortDescriptors, filterDescriptor, collapsedFilterDescriptors, callback) {
                // Copy items
                var items = new Array();
                items = items.concat(this.sourceItems);

                // SortItems
                this.sort(items, sortDescriptors);

                // FilterItems
                items = this.filter(items, filterDescriptor, collapsedFilterDescriptors);

                if (typeof firstItem == "string" || isNaN(firstItem)) {
                    if (!isNaN(+firstItem)) {
                        firstItem = +firstItem;
                    } else {
                        firstItem = 0;
                    }
                }
                if (typeof itemsNumber == "string" || isNaN(itemsNumber)) {
                    if (!isNaN(+itemsNumber)) {
                        itemsNumber = +itemsNumber;
                    } else {
                        itemsNumber = items.length;
                    }
                }

                // Apply paging
                items = items.slice(firstItem, firstItem + itemsNumber);

                // Return result
                callback(items, firstItem, itemsNumber);
            };

            ArrayItemsProvider.prototype.getTotalItemsCount = function (filterDescriptor, callback) {
                // For items count we just need to apply filter
                callback(this.filter(this.sourceItems, filterDescriptor, null).length);
            };

            ArrayItemsProvider.prototype.addItem = function (item) {
                this.sourceItems.push(item);
                if (this.onAdd)
                    this.onAdd(item);
            };

            ArrayItemsProvider.prototype.removeItem = function (item) {
                for (var i = 0; i < this.sourceItems.length; i++) {
                    if (this.sourceItems[i] == item) {
                        this.sourceItems.splice(i, 1);
                        break;
                    }
                }

                if (this.onRemove)
                    this.onRemove(item);
            };

            ArrayItemsProvider.prototype.getFirstItem = function () {
                if (this.sourceItems.length > 0) {
                    return this.sourceItems[0];
                } else {
                    return null;
                }
            };

            ArrayItemsProvider.prototype.addArray = function (array) {
                this.sourceItems = this.sourceItems.concat(array);
                if (this.onReset)
                    this.onReset();
            };

            ArrayItemsProvider.prototype.clear = function () {
                this.sourceItems = new Array();
                if (this.onReset)
                    this.onReset();
            };

            ArrayItemsProvider.prototype.sort = function (items, sortDescriptors) {
                var _this = this;
                if (sortDescriptors != null && sortDescriptors.length > 0 && isNotNull(sortDescriptors[0].path)) {
                    items.sort(function (a, b) {
                        return _this.compareRecursive(a, b, sortDescriptors, 0);
                    });
                }
            };

            ArrayItemsProvider.prototype.compareRecursive = function (a, b, sortDescriptors, i) {
                if (i != sortDescriptors.length - 1) {
                    if (getMemberValue(a, sortDescriptors[i].path) > getMemberValue(b, sortDescriptors[i].path))
                        return this.sortingOrder(sortDescriptors[i]);
                    if (getMemberValue(b, sortDescriptors[i].path) > getMemberValue(a, sortDescriptors[i].path))
                        return this.sortingOrderDesc(sortDescriptors[i]);
                    return this.compareRecursive(a, b, sortDescriptors, i + 1);
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

            ArrayItemsProvider.prototype.filter = function (items, filterDescriptor, collapsedFilterDescriptors) {
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
                            } else {
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
            };

            ArrayItemsProvider.prototype.isFilterSatisfied = function (item, filterDescriptor) {
                if (this.isFilterConditionSatisfied(item[filterDescriptor.path], filterDescriptor.value, filterDescriptor.caseSensetive, filterDescriptor.condition)) {
                    if (filterDescriptor.children.length == 0 || filterDescriptor.parentChildUnionOperator == TGrid.LogicalOperator.Or) {
                        return true;
                    } else {
                        return this.isChildFiltersSatisfied(item, filterDescriptor);
                    }
                } else {
                    if (filterDescriptor.parentChildUnionOperator == TGrid.LogicalOperator.And) {
                        return false;
                    } else {
                        return this.isChildFiltersSatisfied(item, filterDescriptor);
                    }
                }
            };

            ArrayItemsProvider.prototype.isChildFiltersSatisfied = function (item, filterDescriptor) {
                if (filterDescriptor.childrenUnionOperator == TGrid.LogicalOperator.Or) {
                    for (var i = 0; i < filterDescriptor.children.length; i++) {
                        if (this.isFilterConditionSatisfied(item[filterDescriptor.children[i].path], filterDescriptor.children[i].value, filterDescriptor.children[i].caseSensetive, filterDescriptor.children[i].condition)) {
                            return true;
                        }
                    }

                    return false;
                } else {
                    for (var i = 0; i < filterDescriptor.children.length; i++) {
                        if (!this.isFilterConditionSatisfied(item[filterDescriptor.children[i].path], filterDescriptor.children[i].value, filterDescriptor.children[i].caseSensetive, filterDescriptor.children[i].condition)) {
                            return false;
                        }
                    }

                    return true;
                }
            };

            ArrayItemsProvider.prototype.isFilterConditionSatisfied = function (item, value, caseSensetive, condition) {
                if (!value) {
                    case TGrid.FilterCondition.None:
                    return true;
                    case TGrid.FilterCondition.Equals:

                var citem = item;
                var cvalue = value;
                if (caseSensetive) {
                    citem = (item || "").toString().toLowerCase();
                    cvalue = (value || "").toString().toLowerCase();
                }

                switch (condition) {
                    case 0 /* Contains */:
                        return (citem || "").toString().indexOf((cvalue || "").toString()) > -1;
                        return (citem == cvalue);
                    case TGrid.FilterCondition.NotEquals:
                        return (citem != cvalue);
                    default:
                        return false;
                }
            };
            return ArrayItemsProvider;
        })();
        TGrid.ArrayItemsProvider = ArrayItemsProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ArrayItemsProvider.js.map
