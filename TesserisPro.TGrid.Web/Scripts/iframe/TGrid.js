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
var TesserisPro;
(function (TesserisPro) {
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
    /// <reference path="Scripts/typings/extenders.d.ts" />
    /// <reference path="Options.ts" />
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="IItemProvider.ts" />
    /// <reference path="knockout/KnockoutHtmlProvider.ts" />
    /// <reference path="knockout/KnockoutFilterPopupViewModel.ts"/>
    /// <reference path="angular/AngularFilterPopupViewModel.ts"/>
    /// <reference path="angular/AngularHtmlProvider.ts" />
    /// <reference path="angular/AngularItemViewModel.ts"/>
    /// <reference path="GroupHeaderDescriptor.ts" />
    /// <reference path="utils.ts" />
    /// <reference path="IFooterViewModel.ts"/>
    /// <reference path="scripts/typings/angularjs/angular.d.ts"/>
    /// <reference path="scripts/typings/knockout/knockout.d.ts"/>
    (function (TGrid) {
        var Grid = (function () {
            function Grid(element, options, provider) {
                var _this = this;
                this.isPreloadingNext = false;
                this.isPreloadingPrevious = false;
                this.enablePreload = true;
                this.isBuisy = false;
                element.grid = this;
                this.targetElement = element;
                this.options = options;

                this.collapsedGroupFilterDescriptors = new Array();

                //for (var i = 0; i < this.options.columns.length; i++) {
                //    this.collapsedFilterGroup.push(new Array<FilterDescriptor>());
                //}
                this.itemProvider = provider;
                this.htmlProvider = this.getHtmlProvider(this.options);

                this.footerViewModel = this.htmlProvider.getFooterViewModel(this);

                this.rootElement = document.createElement("div");
                this.rootElement.className = "tgrid-root";

                this.groupByElement = document.createElement("div");
                this.groupByElement.className = "tgrid-group-by-panel desktop";
                this.rootElement.appendChild(this.groupByElement);

                this.headerContainer = document.createElement("div");
                this.headerContainer.className = "tgrid-tableheadercontainer desktop";
                this.headerContainer.style.overflowX = "hidden";
                var headerTable = document.createElement("table");
                headerTable.className = "tgrid-table";
                this.headerContainer.appendChild(headerTable);

                // filter popup
                if (this.options.enableFiltering) {
                    this.filterPopUp = document.createElement("div");
                    this.filterPopUp.setAttribute("class", "tgrid-filter-popup");
                    this.filterPopUp.style.display = "none";
                    this.targetElement.appendChild(this.filterPopUp);
                    this.filterPopupViewModel = this.htmlProvider.getFilterPopupViewModel(this.filterPopUp);
                    this.htmlProvider.updateFilteringPopUp(this.options, this.filterPopUp, this.filterPopupViewModel);
                }

                this.bodyAndHeaderContainer = document.createElement("div");
                this.bodyAndHeaderContainer.className = "tgrid-body-and-header-container";
                this.bodyAndHeaderContainer.style.position = "relative";
                this.bodyAndHeaderContainer.style.overflowX = "auto";
                this.bodyAndHeaderContainer.style.width = "100%";

                // Header
                this.mobileHeader = document.createElement("div");
                this.mobileHeader.className = "tgrid-mobile-header mobile";
                this.bodyAndHeaderContainer.appendChild(this.mobileHeader);

                this.tableHeader = document.createElement("thead");
                this.tableHeader.setAttribute("class", "tgrid-table-header desktop");
                headerTable.appendChild(this.tableHeader);
                this.bodyAndHeaderContainer.appendChild(this.headerContainer);

                // Body
                this.tableBodyContainer = document.createElement("div");
                this.tableBodyContainer.className = "tgrid-tablebodycontainer desktop";
                this.tableBodyContainer.style.overflowX = "auto";
                this.tableBodyContainer.onscroll = function () {
                    return _this.headerContainer.scrollLeft = _this.tableBodyContainer.scrollLeft;
                };

                this.mobileContainer = document.createElement("div");
                this.mobileContainer.setAttribute("class", "tgrid-mobile-container mobile");

                if (options.enableVirtualScroll) {
                    this.tableBodyContainer.onscroll = function () {
                        return _this.scrollTable();
                    };
                    this.mobileContainer.onscroll = function () {
                        return _this.scrollTable();
                    };
                } else {
                    this.itemProvider.getTotalItemsCount(options.filterDescriptor, function (total) {
                        _this.options.firstLoadSize = total;
                    });
                }

                var bodyTable = document.createElement("table");
                bodyTable.className = "tgrid-table";

                this.tableBodyContainer.appendChild(bodyTable);

                this.tableBody = document.createElement("tbody");
                bodyTable.appendChild(this.tableBody);

                if (options.enableVirtualScroll) {
                    this.scrollBar = document.createElement("div");
                    this.scrollBar.className = "tgrid-scroll";
                    this.scrollBar.style.overflowX = "hidden";
                    this.scrollBar.style.overflowY = "scroll";

                    var scrollContent = document.createElement("div");
                    scrollContent.style.height = "10000px";
                    scrollContent.style.width = "1px";
                    this.scrollBar.appendChild(scrollContent);
                    this.bodyAndHeaderContainer.appendChild(this.scrollBar);

                    this.scrollBar.onscroll = function () {
                        return _this.onManualScroll();
                    };
                }

                this.bodyAndHeaderContainer.appendChild(this.tableBodyContainer);
                this.bodyAndHeaderContainer.appendChild(this.mobileContainer);
                this.rootElement.appendChild(this.bodyAndHeaderContainer);

                // Footer
                this.tableFooter = document.createElement("div");
                this.tableFooter.setAttribute("class", "tgrid-footer");
                this.rootElement.appendChild(this.tableFooter);

                this.targetElement.appendChild(this.rootElement);
                this.tableBodyContainer.scrollTop = 0;

                if (this.options.groupBySortDescriptors.length > 0) {
                    this.refreshHeader();
                    this.refreshBody(options.enableVirtualScroll);
                } else {
                    this.sortBy(this.options.sortDescriptor.path);
                }
                this.refreshFooter();

                this.buisyIndicator = document.createElement("div");
                this.buisyIndicator.className = "tgrid-buisy-indicator";
                this.rootElement.appendChild(this.buisyIndicator);

                this.rootElement.onmousewheel = function (e) {
                    return _this.mouseWheel(e);
                };

                this.rootElement.tabIndex = 0;
                this.rootElement.onkeydown = function (e) {
                    return _this.keyPress(e);
                };

                this.tableBodyContainer.onmousedown = function (e) {
                    if (e.button == 1) {
                        e.preventDefault();
                    }
                };

                this.hideBuisyIndicator();
            }
            Grid.getGridObject = function (element) {
                if (element == null) {
                    return null;
                }
                if (element.grid == undefined || element.grid == null) {
                    if (element.parentElement == document.body) {
                        return null;
                    }

                    return Grid.getGridObject(element.parentElement);
                }

                return element.grid;
            };

            Grid.prototype.columnsResized = function (c) {
                if (parseInt(c.width) < this.options.columnMinWidth) {
                    c.width = this.options.columnMinWidth.toString();
                }
                this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
            };

            Grid.prototype.mouseWheel = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                this.tableBodyContainer.scrollTop = this.tableBodyContainer.scrollTop - e.wheelDelta;
                this.mobileContainer.scrollTop = this.mobileContainer.scrollTop - e.wheelDelta;
            };

            Grid.prototype.keyPress = function (e) {
                switch (e.keyCode) {
                    case 38:
                        e.preventDefault();
                        this.selectPreviousItem();
                        break;
                    case 40:
                        e.preventDefault();
                        this.selectNextItem();
                        break;
                }
            };

            Grid.prototype.selectNextItem = function () {
                var selectedItem;
                if (this.options.selection.length > 0) {
                    var item = this.options.selection[this.options.selection.length - 1];
                    for (var i = 0; i < this.visibleViewModels.length; i++) {
                        if (this.visibleViewModels[i].item == item) {
                            while (i < this.visibleViewModels.length - 1 && this.visibleViewModels[i + 1].isGroupHeader) {
                                i++;
                            }
                            if (i < this.visibleViewModels.length - 1 && !this.visibleViewModels[i + 1].isGroupHeader) {
                                selectedItem = this.visibleViewModels[i + 1];
                                break;
                            }
                            if (i == this.visibleViewModels.length - 1) {
                                if (!this.visibleViewModels[i].isGroupHeader) {
                                    selectedItem = this.visibleViewModels[i];
                                    break;
                                } else {
                                    while (i >= 0 && this.visibleViewModels[i].isGroupHeader) {
                                        i--;
                                    }
                                    selectedItem = this.visibleViewModels[i];
                                    break;
                                }
                            }
                        }
                    }
                }
                if (selectedItem == null && this.visibleViewModels.length != 0) {
                    selectedItem = this.visibleViewModels[0];
                }
                if (selectedItem != null) {
                    this.selectItem(selectedItem, false);
                }
            };

            Grid.prototype.selectPreviousItem = function () {
                var selectedItem;
                if (this.options.selection.length > 0) {
                    var item = this.options.selection[this.options.selection.length - 1];
                    for (var i = this.visibleViewModels.length - 1; i >= 0; i--) {
                        if (this.visibleViewModels[i].item == item) {
                            while (i > 0 && this.visibleViewModels[i - 1].isGroupHeader) {
                                i--;
                            }
                            if (i > 0 && !this.visibleViewModels[i - 1].isGroupHeader) {
                                selectedItem = this.visibleViewModels[i - 1];
                                break;
                            }
                            if (i == 0) {
                                if (!this.visibleViewModels[i].isGroupHeader) {
                                    selectedItem = this.visibleViewModels[i];
                                    break;
                                } else {
                                    while (i < this.visibleViewModels.length - 1 && this.visibleViewModels[i].isGroupHeader) {
                                        this.scrollIntoView(this.visibleViewModels[i].item);
                                        i++;
                                    }
                                    selectedItem = this.visibleViewModels[i];
                                    break;
                                }
                            }
                        }
                    }
                }
                if (selectedItem == null && this.visibleViewModels.length != 0) {
                    selectedItem = this.visibleViewModels[0];
                }
                if (selectedItem != null) {
                    this.selectItem(selectedItem, false);
                }
            };

            Grid.prototype.getPreviousPageFirsItemIndex = function () {
                var result = this.firstVisibleItemIndex - this.options.batchSize;
                if (result < 0) {
                    result = 0;
                }

                return result;
            };

            Grid.prototype.isDesktopMode = function () {
                return this.tableBodyContainer.clientWidth != 0;
            };

            Grid.prototype.getPreviousPageSize = function () {
                var realBatchSize = this.options.batchSize;

                var perviousPageFirstItemsNumber = this.firstVisibleItemIndex - realBatchSize;
                if (perviousPageFirstItemsNumber < 0) {
                    return realBatchSize + perviousPageFirstItemsNumber;
                }

                return realBatchSize;
            };

            Grid.prototype.getNextPageFirstItemIndex = function () {
                return this.firstVisibleItemIndex + this.visibleItems.length;
            };

            Grid.prototype.getNextPageSize = function () {
                return this.options.batchSize;
            };

            Grid.prototype.getEffectiveSorting = function () {
                var result = new Array();
                var foundSortDescriptor = false;
                var otherSorting = new Array();

                for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                    var found = false;
                    for (var i = 0; i < result.length; i++) {
                        if (this.options.sortDescriptor.path == this.options.groupBySortDescriptors[j].path) {
                            foundSortDescriptor = true;
                        }
                        if (result[i].path == this.options.groupBySortDescriptors[j].path) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        if (this.options.groupBySortDescriptors[j].path == this.options.sortDescriptor.path) {
                            this.options.groupBySortDescriptors[j].asc = this.options.sortDescriptor.asc;
                        }
                        result.push(this.options.groupBySortDescriptors[j]);
                    }
                }
                if (!foundSortDescriptor) {
                    result.push(this.options.sortDescriptor);
                }

                return result;
            };

            Grid.prototype.getEffectiveFiltering = function () {
                return this.options.filterDescriptor;
            };

            Grid.prototype.getCollapsedGroupFilter = function () {
                return this.collapsedGroupFilterDescriptors;
            };

            Grid.prototype.scrollTable = function () {
                if (this.isDesktopMode) {
                    this.headerContainer.scrollLeft = this.tableBodyContainer.scrollLeft;
                }
                var container = this.isDesktopMode() ? this.tableBodyContainer : this.mobileContainer;

                if (!this.isPreloadingNext && this.enablePreload) {
                    if (container.scrollTop > ((container.scrollHeight - container.clientHeight) / 4 * 3) && this.nextPage == null) {
                        this.preloadNextPage();
                    }
                }

                if (!this.isPreloadingPrevious && this.enablePreload) {
                    if (container.scrollTop < ((container.scrollHeight - container.clientHeight) / 4) && this.previousPage == null) {
                        this.preloadPreviousPage();
                    }
                }

                if (this.totalItemsCount > this.firstVisibleItemIndex + this.visibleItems.length) {
                    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 10) {
                        this.showNextPage();
                    }
                }

                if (this.firstVisibleItemIndex > 0) {
                    if (container.scrollTop <= 10) {
                        this.showPreviousPage();
                    }
                }

                if (this.isDesktopMode()) {
                    this.updateGlobalScroll();
                } else {
                    //this.updateGlobalScrollMobile();
                }
            };

            Grid.prototype.updateGlobalScroll = function () {
                var _this = this;
                if (this.tableBodyContainer.scrollTop == this.tableBodyContainer.scrollHeight - this.tableBodyContainer.clientHeight && this.firstVisibleItemIndex + this.visibleItems.length == this.totalItemsCount) {
                    this.scrollBar.scrollTop = this.scrollBar.scrollHeight - this.scrollBar.clientHeight;
                    return;
                }

                var firstItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                if (firstItem != null) {
                    var visibleItemIndex = this.firstVisibleItemIndex;
                    for (var i = 0; i < this.visibleItems.length; i++) {
                        if (firstItem.item == this.visibleItems[i]) {
                            visibleItemIndex = this.firstVisibleItemIndex + i;
                            break;
                        }
                    }

                    this.scrollBar.onscroll = null;
                    var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                    var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex + 10;
                    this.scrollBar.onscroll = function () {
                        _this.scrollBar.onscroll = function () {
                            return _this.onManualScroll();
                        };
                    };
                    this.scrollBar.scrollTop = scrollPosition;
                }
            };

            Grid.prototype.updateGlobalScrollMobile = function () {
                var _this = this;
                if (this.mobileContainer.scrollTop == this.mobileContainer.scrollHeight - this.mobileContainer.clientHeight && this.firstVisibleItemIndex + this.visibleItems.length == this.totalItemsCount) {
                    this.scrollBar.scrollTop = this.scrollBar.scrollHeight - this.scrollBar.clientHeight;
                    return;
                }

                var firstItem = this.htmlProvider.getFirstVisibleItem(this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                if (firstItem != null) {
                    var visibleItemIndex = this.firstVisibleItemIndex;
                    for (var i = 0; i < this.visibleItems.length; i++) {
                        if (firstItem.item == this.visibleItems[i]) {
                            visibleItemIndex = this.firstVisibleItemIndex + i;
                            break;
                        }
                    }

                    this.scrollBar.onscroll = null;
                    var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.mobileContainer, this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                    var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex;
                    this.scrollBar.onscroll = function () {
                        _this.scrollBar.onscroll = function () {
                            return _this.onManualScroll();
                        };
                    };
                    this.scrollBar.scrollTop = scrollPosition;
                }
            };

            Grid.prototype.onManualScroll = function () {
                var _this = this;
                if (this.manualScrollTimeoutToken != null) {
                    clearTimeout(this.manualScrollTimeoutToken);
                }

                this.manualScrollTimeoutToken = setTimeout(function () {
                    _this.manualScrollTimeoutToken = null;
                    var visibleItemsCount;
                    if (_this.isDesktopMode()) {
                        visibleItemsCount = _this.htmlProvider.getVisibleItemsCount(_this.tableBody, _this.tableBodyContainer, _this.visibleViewModels, _this.tableBodyContainer.scrollTop);
                    } else {
                        visibleItemsCount = _this.htmlProvider.getVisibleItemsCount(_this.mobileContainer, _this.mobileContainer, _this.visibleViewModels, _this.mobileContainer.scrollTop);
                    }
                    var itemSize = (_this.scrollBar.scrollHeight - _this.scrollBar.clientHeight) / (_this.totalItemsCount - visibleItemsCount);
                    var itemNumber = _this.scrollBar.scrollTop / itemSize;
                    _this.showBuisyIndicator();
                    _this.previousPage = null;
                    _this.nextPage = null;
                    var scrollBottom = false;

                    if (itemNumber + _this.options.firstLoadSize > _this.totalItemsCount) {
                        itemNumber = _this.totalItemsCount - _this.options.firstLoadSize;
                        scrollBottom = true;
                    }

                    _this.itemProvider.getItems(itemNumber, _this.options.firstLoadSize, _this.getEffectiveSorting(), _this.getEffectiveFiltering(), _this.getCollapsedGroupFilter(), function (items, first, count) {
                        if (itemNumber == 0) {
                            _this.scrollTableContainer(0);
                        } else {
                            _this.scrollTableContainer(48);
                        }
                        _this.firstVisibleItemIndex = first;
                        _this.visibleItems = items;
                        _this.visibleViewModels = _this.buildViewModels(_this.visibleItems);
                        _this.updateVisibleItems();
                        _this.hideBuisyIndicator();
                        if (scrollBottom) {
                            _this.silentScrollTableContainer(_this.tableBody.offsetHeight - _this.tableBodyContainer.clientHeight);
                        }
                    });
                }, 400);
            };

            Grid.prototype.preloadPreviousPage = function () {
                var _this = this;
                var size = this.getPreviousPageSize();
                if (size > 0) {
                    this.isPreloadingPrevious = true;
                    this.itemProvider.getItems(this.getPreviousPageFirsItemIndex(), size, this.getEffectiveSorting(), this.getEffectiveFiltering(), this.getCollapsedGroupFilter(), function (items, first, count) {
                        _this.previousPage = items;
                        _this.isPreloadingPrevious = false;
                    });
                }
            };

            Grid.prototype.preloadNextPage = function () {
                var _this = this;
                this.isPreloadingNext = true;
                this.itemProvider.getItems(this.getNextPageFirstItemIndex(), this.getNextPageSize(), this.getEffectiveSorting(), this.getEffectiveFiltering(), this.getCollapsedGroupFilter(), function (items, first, count) {
                    _this.nextPage = items;
                    _this.isPreloadingNext = false;
                });
            };

            Grid.prototype.showPreviousPage = function () {
                var _this = this;
                if (this.previousPage == null) {
                    if (this.firstVisibleItemIndex == 0) {
                        this.hideBuisyIndicator();
                        return;
                    }
                    this.showBuisyIndicator();
                    if (!this.isPreloadingPrevious) {
                        this.preloadPreviousPage();
                    }
                    setTimeout(function () {
                        _this.showPreviousPage();
                    }, 10);
                } else if (this.previousPage != null && this.previousPage.length > 0) {
                    this.hideBuisyIndicator();
                    this.enablePreload = false;

                    this.visibleItems.splice(this.visibleItems.length - this.options.batchSize, this.options.batchSize);
                    this.firstVisibleItemIndex -= this.options.batchSize;

                    if (this.firstVisibleItemIndex < 0) {
                        this.firstVisibleItemIndex = 0;
                    }

                    var firstNewItem = this.previousPage[this.previousPage.length - 1];
                    this.visibleItems = this.previousPage.concat(this.visibleItems);
                    this.visibleViewModels = this.buildViewModels(this.visibleItems);

                    this.updateVisibleItems();

                    var skipItems = new Array();
                    for (var i = 0; i < this.visibleViewModels.length - 1; i++) {
                        skipItems.push(this.visibleViewModels[i]);
                        if (this.visibleViewModels[i].item == firstNewItem) {
                            skipItems.push(this.visibleViewModels[i + 1]);
                            break;
                        }
                    }

                    var skipSize = this.htmlProvider.getElementsSize(this.tableBody, skipItems);

                    this.scrollTableContainer(skipSize);
                    this.previousPage = null;
                    this.nextPage = null;
                    this.enablePreload = true;
                }
            };

            Grid.prototype.showNextPage = function () {
                var _this = this;
                if (this.nextPage == null) {
                    if (this.totalItemsCount <= this.firstVisibleItemIndex + this.visibleItems.length) {
                        this.hideBuisyIndicator();
                        return;
                    }
                    this.showBuisyIndicator();
                    if (!this.isPreloadingNext) {
                        this.preloadNextPage();
                    }
                    setTimeout(function () {
                        _this.showNextPage();
                    }, 10);
                } else if (this.nextPage != null && this.nextPage.length > 0) {
                    this.hideBuisyIndicator();
                    this.enablePreload = false;
                    var item;
                    if (this.isDesktopMode()) {
                        item = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                    } else {
                        item = this.htmlProvider.getFirstVisibleItem(this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
                    }
                    var itemNumber = 0;

                    for (var i = 0; i < this.visibleItems.length; i++) {
                        if (item.item == this.visibleItems[i]) {
                            itemNumber = i;
                            break;
                        }
                    }

                    var itemsToRemove = itemNumber - this.options.batchSize;

                    if (itemsToRemove > 0) {
                        this.visibleItems.splice(0, itemsToRemove);
                        this.firstVisibleItemIndex += itemsToRemove;
                    }

                    var firstNewItem = item;
                    for (var i = 0; i < this.visibleItems.length - 1; i++) {
                        if (item.item == this.visibleItems[i]) {
                            firstNewItem = this.visibleItems[i + 1];
                            break;
                        }
                    }

                    this.visibleItems = this.visibleItems.concat(this.nextPage);
                    this.visibleViewModels = this.buildViewModels(this.visibleItems);

                    this.updateVisibleItems();

                    var skipItems = new Array();
                    for (var i = 0; i < this.visibleViewModels.length; i++) {
                        skipItems.push(this.visibleViewModels[i]);
                        if (this.visibleViewModels[i].item == firstNewItem) {
                            break;
                        }
                    }

                    var skipSize = this.isDesktopMode() ? this.htmlProvider.getElementsSize(this.tableBody, skipItems) : this.htmlProvider.getElementsSize(this.mobileContainer, skipItems);

                    this.scrollTableContainer(skipSize);
                    this.nextPage = null;
                    this.previousPage = null;
                    this.enablePreload = true;
                    this.rootElement.focus();
                }
            };

            Grid.prototype.scrollTableContainer = function (scrollTop) {
                this.tableBodyContainer.scrollTop = scrollTop;
                this.mobileContainer.scrollTop = scrollTop <= 0 ? 2 : scrollTop;
            };

            Grid.prototype.silentScrollTableContainer = function (scrollTop) {
                var _this = this;
                this.tableBodyContainer.onscroll = null;
                this.mobileContainer.onscroll = null;
                this.tableBodyContainer.scrollTop = scrollTop;
                this.mobileContainer.scrollTop = scrollTop <= 0 ? 2 : scrollTop;
                setTimeout(function () {
                    _this.tableBodyContainer.onscroll = function () {
                        return _this.scrollTable();
                    };
                    _this.mobileContainer.onscroll = function () {
                        return _this.scrollTable();
                    };
                }, 10);
            };

            Grid.prototype.addGroupDescriptor = function (name, asc) {
                this.options.groupBySortDescriptors.push(new TesserisPro.TGrid.SortDescriptor(name, asc));
                this.refreshHeader();
                this.refreshBody();
            };

            Grid.prototype.toggleGroupDescriptor = function (name) {
                for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                    if (this.options.groupBySortDescriptors[i].path == name) {
                        this.removeGroupDescriptor(name);
                        return;
                    }
                }
                this.addGroupDescriptor(name, true);
            };

            Grid.prototype.removeGroupDescriptor = function (path) {
                for (var i = 0; i < this.options.groupBySortDescriptors.length; i++) {
                    if (this.options.groupBySortDescriptors[i].path == path) {
                        this.options.groupBySortDescriptors.splice(i, 1);
                        break;
                    }
                }
                var removed = true;
                while (removed) {
                    removed = false;
                    for (var i = 0; !removed && i < this.collapsedGroupFilterDescriptors.length; i++) {
                        for (var j = 0; !removed && j < this.collapsedGroupFilterDescriptors[i].children.length; j++) {
                            if (this.collapsedGroupFilterDescriptors[i].children[j].path == path) {
                                this.collapsedGroupFilterDescriptors.splice(i, 1);
                                removed = true;
                            }
                        }
                    }
                }

                this.refreshHeader();
                this.refreshBody();
            };

            Grid.prototype.showFilterPopup = function (column, pageX, pageY, isForDesktop) {
                this.options.filterPopupForColumn = column;
                this.filterPopupViewModel.onOpen(this.options, column);
                if (isForDesktop) {
                    this.filterPopUp.style.left = pageX.toString() + "px";
                    this.filterPopUp.style.top = pageY.toString() + "px";
                }
                unhideElement(this.filterPopUp);
            };

            Grid.prototype.hideFilterPopup = function () {
                hideElement(this.filterPopUp);
            };

            Grid.prototype.sortBy = function (name) {
                if (name != null) {
                    if (name == this.options.sortDescriptor.path) {
                        if (this.options.sortDescriptor.asc) {
                            this.options.sortDescriptor.asc = !this.options.sortDescriptor.asc;
                        } else {
                            this.options.sortDescriptor.path = null;
                            this.options.sortDescriptor.asc = null;
                        }
                    } else {
                        this.options.sortDescriptor.path = name;
                        this.options.sortDescriptor.asc = true;
                    }
                }
                this.refreshHeader();
                this.refreshBody();
            };

            Grid.prototype.mobileSortBy = function (name, asc) {
                if (asc != null) {
                    this.options.sortDescriptor.path = name;
                    this.options.sortDescriptor.asc = asc;
                } else {
                    this.options.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(null, null);
                }
                this.refreshHeader();
                this.refreshBody();
            };

            Grid.prototype.selectPage = function (page) {
                this.options.currentPage = page;
                this.refreshHeader();
                this.refreshBody();

                //if (this.options.tableFooterTemplate == null) {
                this.refreshFooter();
                //}
            };

            Grid.prototype.selectItem = function (item, multi) {
                var oldSelection = new Array();
                for (var i = 0; i < this.options.selection.length; i++) {
                    oldSelection.push(this.options.selection[i]);
                }

                if (this.options.selectionMode == 2 /* Multi */) {
                    if (multi) {
                        if (this.options.isSelected(item.item)) {
                            this.options.selection.splice(i, 1);
                        } else {
                            this.options.selection.push(item.item);
                        }
                    } else {
                        this.options.selection = [item.item];
                    }
                } else if (this.options.selectionMode == 1 /* Single */) {
                    if (this.options.selection[0] == item.item && this.options.shouldAddDetailsOnSelection) {
                        this.options.shouldAddDetailsOnSelection = false;
                    } else {
                        this.options.shouldAddDetailsOnSelection = true;
                    }
                    this.options.selection = [item.item];
                } else {
                    this.options.selection = new Array();
                }

                if (this.options.openDetailsOnSelection) {
                    if (this.options.selection.length == 1) {
                        this.options.showDetailFor = new TesserisPro.TGrid.ShowDetail();
                        this.options.showDetailFor.item = this.options.selection[0];
                    }
                } else {
                    this.options.showDetailFor = new TesserisPro.TGrid.ShowDetail();
                }

                for (var i = 0; i < oldSelection.length; i++) {
                    this.updateRow(oldSelection[i], this.options.shouldAddDetailsOnSelection);
                }

                for (var i = 0; i < this.options.selection.length; i++) {
                    this.updateRow(this.options.selection[i], this.options.shouldAddDetailsOnSelection);
                }
                this.scrollIntoView(item.item);
                this.updateFooterViewModel();
                return true;
            };

            Grid.prototype.scrollIntoView = function (item) {
                var viewModels = new Array();
                var visibleItemsCount = this.htmlProvider.getVisibleItemsCount(this.tableBody, this.tableBodyContainer, this.visibleViewModels, this.tableBodyContainer.scrollTop);

                var firstVisibleItem = this.htmlProvider.getFirstVisibleItem(this.tableBody, this.visibleViewModels, this.tableBodyContainer.scrollTop);

                visibleItemsCount--;

                var visibleItemsArea = false;

                for (var i = 0; i < this.visibleViewModels.length; i++) {
                    if (i > 0 && firstVisibleItem == this.visibleViewModels[i - 1]) {
                        visibleItemsArea = true;
                    }
                    if (visibleItemsArea) {
                        visibleItemsCount--;
                    }
                    if (visibleItemsCount < 0) {
                        visibleItemsArea = false;
                    }
                    if (this.visibleViewModels[i].item == item) {
                        if (visibleItemsArea) {
                            return;
                        }
                        break;
                    }
                    viewModels.push(this.visibleViewModels[i]);
                }

                var scrollTo = this.htmlProvider.getElementsSize(this.tableBody, viewModels);

                this.tableBodyContainer.scrollTop = scrollTo;
            };

            Grid.prototype.updateRow = function (item, shouldAddDetails) {
                this.htmlProvider.updateTableDetailRow(this.options, this.tableBodyContainer.getElementsByTagName("tbody")[0], item, shouldAddDetails);
                this.htmlProvider.updateMobileDetailRow(this.options, this.mobileContainer, item, shouldAddDetails);
            };

            Grid.prototype.buildViewModels = function (items) {
                var itemModels = [];
                var currentGroupNames = new Array();
                var isGroupHeader = new Array();

                for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                    currentGroupNames.push("");
                    isGroupHeader.push(false);
                }

                var collapsed = false;
                var colapsedGroupLevel = this.options.groupBySortDescriptors.length;
                for (var i = 0; i < items.length; i++) {
                    for (var j = 0; j < colapsedGroupLevel; j++) {
                        var columnValue = getMemberValue(items[i], this.options.groupBySortDescriptors[j].path);

                        // New group found
                        if (currentGroupNames[j] !== columnValue) {
                            currentGroupNames[j] = columnValue;
                            collapsed = false;
                            colapsedGroupLevel = this.options.groupBySortDescriptors.length;

                            var filterDescriptor = new TesserisPro.TGrid.FilterDescriptor("", "", 0 /* None */, 0 /* And */, 0 /* And */);

                            for (var k = 0; k <= j; k++) {
                                filterDescriptor.children.push(new TesserisPro.TGrid.FilterDescriptor(this.options.groupBySortDescriptors[k].path, currentGroupNames[k], 1 /* Equals */));
                            }

                            collapsed = this.isGroupCollapsedOrInsideCollapsed(filterDescriptor);

                            itemModels.push(new TesserisPro.TGrid.ItemViewModel(this.options.parentViewModel, new TesserisPro.TGrid.GroupHeaderDescriptor(currentGroupNames[j], j, collapsed, filterDescriptor), this, true));

                            for (var k = j + 1; k < this.options.groupBySortDescriptors.length; k++) {
                                currentGroupNames[k] = "";
                            }

                            if (collapsed) {
                                colapsedGroupLevel = j + 1;
                                break;
                            }
                        }
                    }
                    if (!collapsed) {
                        itemModels.push(new TesserisPro.TGrid.ItemViewModel(this.options.parentViewModel, items[i], this, false));
                    }
                }
                return itemModels;
            };

            Grid.prototype.isEqualOrDeeperThanCollapsedFilter = function (collapsedFilter, filter) {
                if (filter.children.length >= collapsedFilter.children.length) {
                    for (var i = 0; i < collapsedFilter.children.length; i++) {
                        if (filter.children[i].path !== collapsedFilter.children[i].path || filter.children[i].value !== collapsedFilter.children[i].value) {
                            return false;
                        }
                    }
                    return true;
                }
                return false;
            };

            Grid.prototype.isGroupCollapsedOrInsideCollapsed = function (filterDescriptor) {
                for (var i = 0; i < this.collapsedGroupFilterDescriptors.length; i++) {
                    if (this.isEqualOrDeeperThanCollapsedFilter(this.collapsedGroupFilterDescriptors[i], filterDescriptor)) {
                        return true;
                    }
                }
                return false;
            };

            Grid.prototype.updateVisibleItems = function () {
                var _this = this;
                this.tableBody.innerHTML = "";
                this.htmlProvider.updateTableBodyElement(this.options, this.tableBody, this.visibleViewModels, function (x, m) {
                    return _this.selectItem(x, m);
                });
                this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);

                this.mobileContainer.innerHTML = "";
                this.htmlProvider.updateMobileItemsList(this.options, this.mobileContainer, this.visibleViewModels, function (x, m) {
                    return _this.selectItem(x, m);
                });
            };

            Grid.prototype.getHtmlProvider = function (options) {
                if (options.framework == 0 /* Knockout */) {
                    return new TesserisPro.TGrid.KnockoutHtmlProvider();
                }

                if (options.framework == 1 /* Angular */) {
                    return new TesserisPro.TGrid.AngularHtmlProvider();
                }
            };

            Grid.prototype.getFirstItemNumber = function () {
                return this.options.pageSize * this.options.currentPage;
            };

            Grid.prototype.getPageSize = function () {
                return this.options.pageSize;
            };

            Grid.prototype.refreshHeader = function () {
                var _this = this;
                if (this.options.enableGrouping) {
                    unhideElement(this.groupByElement);
                } else {
                    hideElement(this.groupByElement);
                }

                this.htmlProvider.updateTableHeadElement(this.options, this.tableHeader, this.groupByElement, this.filterPopUp, function (c) {
                    return _this.columnsResized(c);
                });
                this.refreshMobileHeader();
            };

            Grid.prototype.updateBody = function () {
                this.refreshBody();
            };

            Grid.prototype.refreshBody = function (withBuisy) {
                if (typeof withBuisy === "undefined") { withBuisy = false; }
                var _this = this;
                if (withBuisy) {
                    this.showBuisyIndicator();
                }

                if (!this.options.enablePaging) {
                    this.itemProvider.getTotalItemsCount(this.getEffectiveFiltering(), function (totalitemsCount) {
                        _this.totalItemsCount = totalitemsCount;
                        _this.itemProvider.getItems(_this.getFirstItemNumber(), _this.options.firstLoadSize, _this.getEffectiveSorting(), _this.getEffectiveFiltering(), _this.getCollapsedGroupFilter(), function (items, first, count) {
                            _this.firstVisibleItemIndex = first;
                            _this.visibleItems = items;
                            _this.visibleViewModels = _this.buildViewModels(_this.visibleItems);
                            _this.updateVisibleItems();
                            _this.updateFooterViewModel();
                            if (withBuisy) {
                                _this.hideBuisyIndicator();
                            }

                            //to avoid infinite loop.
                            var elementsSize = _this.isDesktopMode() ? _this.htmlProvider.getElementsSize(_this.tableBody, null) : _this.htmlProvider.getElementsSize(_this.mobileContainer, null);
                            if (elementsSize > 0 && _this.options.firstLoadSize > 0 && isNotNoU(_this.options.firstLoadSize)) {
                                if (_this.isDesktopMode() && elementsSize < (_this.tableBodyContainer.clientHeight + 100) && (_this.options.firstLoadSize < _this.totalItemsCount)) {
                                    _this.options.firstLoadSize *= 2;
                                    if (_this.options.firstLoadSize > _this.totalItemsCount) {
                                        _this.options.firstLoadSize = _this.totalItemsCount;
                                    }
                                    _this.refreshBody();
                                }

                                if (!_this.isDesktopMode() && _this.htmlProvider.getElementsSize(_this.mobileContainer, null) < (_this.mobileContainer.clientHeight + 100) && (_this.options.firstLoadSize < _this.totalItemsCount)) {
                                    _this.options.firstLoadSize *= 2;
                                    if (_this.options.firstLoadSize > _this.totalItemsCount) {
                                        _this.options.firstLoadSize = _this.totalItemsCount;
                                    }
                                    _this.refreshBody();
                                }
                            }
                        });
                    });
                } else {
                    this.itemProvider.getTotalItemsCount(this.getEffectiveFiltering(), function (totalitemsCount) {
                        _this.totalItemsCount = totalitemsCount;
                        _this.itemProvider.getItems(_this.getFirstItemNumber(), _this.getPageSize(), _this.getEffectiveSorting(), _this.getEffectiveFiltering(), _this.getCollapsedGroupFilter(), function (items, first, count) {
                            _this.firstVisibleItemIndex = first;
                            _this.visibleItems = items;
                            _this.visibleViewModels = _this.buildViewModels(_this.visibleItems);
                            _this.updateVisibleItems();
                            _this.updateFooterViewModel();
                            if (withBuisy) {
                                _this.hideBuisyIndicator();
                            }
                        });
                    });
                }
            };

            Grid.prototype.refreshFooter = function () {
                this.htmlProvider.updateTableFooterElement(this.options, this.tableFooter, this.totalItemsCount, this.footerViewModel);
            };

            Grid.prototype.updateFooterViewModel = function () {
                if (this.footerViewModel != null) {
                    this.footerViewModel.setCurrentPage(this.options.currentPage + 1);
                    this.footerViewModel.setSelectedItem(this.options.selection[0]);
                    this.footerViewModel.setTotalCount(this.totalItemsCount);
                    if (this.options.enablePaging) {
                        this.footerViewModel.setTotalPages(Math.ceil(this.totalItemsCount / this.options.pageSize));
                    } else {
                        this.footerViewModel.setTotalPages(1);
                    }
                }
            };

            Grid.prototype.showBuisyIndicator = function () {
                this.isBuisy = true;
                this.buisyIndicator.removeAttribute("style");
            };

            Grid.prototype.hideBuisyIndicator = function () {
                this.buisyIndicator.setAttribute("style", "display: none;");
                this.isBuisy = false;
            };

            Grid.prototype.setCollapsedFilters = function (filterDescriptor) {
                this.collapsedGroupFilterDescriptors.push(filterDescriptor);
                this.refreshBody();
            };

            Grid.prototype.removeCollapsedFilters = function (filterDescriptor) {
                for (var i = 0; i < this.collapsedGroupFilterDescriptors.length; i++) {
                    if (this.isEqualOrDeeperThanCollapsedFilter(this.collapsedGroupFilterDescriptors[i], filterDescriptor)) {
                        this.collapsedGroupFilterDescriptors.splice(i, 1);
                    }
                }

                this.refreshBody();
            };

            Grid.prototype.applyFilters = function () {
                this.refreshHeader();
                this.refreshBody();
                this.refreshFooter();
            };

            Grid.prototype.refreshMobileHeader = function () {
                this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.filterPopUp);
            };

            Grid.prototype.afterOptionsChange = function () {
                this.refreshHeader();
                this.refreshBody();
                this.refreshFooter();
            };
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
