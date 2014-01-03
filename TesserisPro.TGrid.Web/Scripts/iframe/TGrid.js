var TesserisPro;
(function (TesserisPro) {
    /// <reference path="Scripts/typings/extenders.d.ts" />
    /// <reference path="Options.ts" />
    /// <reference path="IHtmlProvider.ts" />
    /// <reference path="IItemProvider.ts" />
    /// <reference path="knockout/KnockoutHtmlProvider.ts" />
    /// <reference path="knockout/KnockoutFilterPopupViewModel.ts"/>
    /// <reference path="angular/AngularFilterPopupViewModel.ts"/>
    /// <reference path="angular/AngularHtmlProvider.ts" />
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

                this.collapsedFilterGroup = new Array();
                for (var i = 0; i < this.options.columns.length; i++) {
                    this.collapsedFilterGroup.push(new Array());
                }

                this.itemProvider = provider;
                this.htmlProvider = this.getHtmlProvider(this.options);

                this.footerViewModel = this.htmlProvider.getFooterViewModel();

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
                    this.itemProvider.getTotalItemsCount(options.filterDescriptors, function (total) {
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
                    this.scrollBar.style.position = "absolute";
                    this.scrollBar.style.right = "0px";
                    this.scrollBar.style.top = "0px";
                    this.scrollBar.style.bottom = "0px";
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

                this.tableBodyContainer.onmousedown = function (e) {
                    if (e.button == 1) {
                        e.preventDefault();
                    }
                };

                this.hideBuisyIndicator();
            }
            Grid.getGridObject = function (element) {
                if (element.grid == undefined || element.grid == null) {
                    if (element.parentElement == document.body) {
                        return null;
                    }

                    return Grid.getGridObject(element.parentElement);
                }

                return element.grid;
            };

            Grid.prototype.columnsResized = function (c) {
                if (parseInt(c.width) < 5) {
                    c.width = "5";
                }
                this.htmlProvider.updateColumnWidth(this.options, this.tableHeader, this.tableBody, this.tableFooter);
            };

            Grid.prototype.mouseWheel = function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                this.tableBodyContainer.scrollTop = this.tableBodyContainer.scrollTop - e.wheelDelta;
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
                var allFilter = [];

                if (this.options.filterDescriptors != null || this.options.filterDescriptors.length > 0) {
                    allFilter = allFilter.concat(this.options.filterDescriptors);
                }

                return allFilter;
            };

            Grid.prototype.getCollapsedGroupFilter = function () {
                var allFilter = [];

                for (var i = 0; i < this.collapsedFilterGroup.length; i++) {
                    if (this.collapsedFilterGroup[i] != null || this.collapsedFilterGroup[i].length > 0) {
                        allFilter = allFilter.concat(this.collapsedFilterGroup[i]);
                    }
                }

                return allFilter;
            };

            Grid.prototype.scrollTable = function () {
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
                    if (container.scrollTop <= 1) {
                        this.showPreviousPage();
                    }
                }
                if (this.isDesktopMode()) {
                    this.updateGlobalScroll();
                } else {
                    this.updateGlobalScrollMobile();
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
                    var visibleItemsCount = this.htmlProvider.getVisibleitemsCount(this.tableBody, this.tableBodyContainer, this.visibleViewModels, this.tableBodyContainer.scrollTop);
                    var scrollPosition = (this.scrollBar.scrollHeight - this.scrollBar.clientHeight) / (this.totalItemsCount - visibleItemsCount) * visibleItemIndex;
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
                    var visibleItemsCount = this.htmlProvider.getVisibleitemsCount(this.mobileContainer, this.mobileContainer, this.visibleViewModels, this.mobileContainer.scrollTop);
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
                        visibleItemsCount = _this.htmlProvider.getVisibleitemsCount(_this.tableBody, _this.tableBodyContainer, _this.visibleViewModels, _this.tableBodyContainer.scrollTop);
                    } else {
                        visibleItemsCount = _this.htmlProvider.getVisibleitemsCount(_this.mobileContainer, _this.mobileContainer, _this.visibleViewModels, _this.mobileContainer.scrollTop);
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
                            _this.silentScrollTableContainer(_this.tableBody.clientHeight - _this.tableBodyContainer.clientHeight);
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

                    var skipSize = this.htmlProvider.getElemntsSize(this.tableBody, skipItems);

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

                    var skipSize = this.isDesktopMode() ? this.htmlProvider.getElemntsSize(this.tableBody, skipItems) : this.htmlProvider.getElemntsSize(this.mobileContainer, skipItems);

                    this.scrollTableContainer(skipSize);
                    this.nextPage = null;
                    this.previousPage = null;
                    this.enablePreload = true;
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
                this.options.groupBySortDescriptors.push(new TGrid.SortDescriptor(name, asc));
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
                    }
                }
                this.refreshHeader();
                this.refreshBody();
            };

            Grid.prototype.showFilterPopup = function (column, pageX, pageY, isForDesktop) {
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

            Grid.prototype.setFilter = function (column, filter) {
                for (var i = 0; i < this.options.filterDescriptors.length; i++) {
                    if (this.options.filterDescriptors[i].path == column.filterMemberPath) {
                        this.options.filterDescriptors.splice(i, 1);
                    }
                }

                this.options.filterDescriptors.push(filter);
                this.refreshBody();
            };

            Grid.prototype.clearFilter = function (column) {
                for (var i = 0; i < this.options.filterDescriptors.length; i++) {
                    if (this.options.filterDescriptors[i].path == column.filterMemberPath) {
                        this.options.filterDescriptors.splice(i, 1);
                    }
                }

                this.refreshBody();
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
                    this.options.sortDescriptor = new TGrid.SortDescriptor(null, null);
                }
                this.refreshHeader();
                this.refreshBody();
            };

            Grid.prototype.selectPage = function (page) {
                this.options.currentPage = page;
                this.refreshHeader();
                this.refreshBody();
                this.refreshFooter();
            };

            Grid.prototype.selectItem = function (item, multi) {
                var oldSelection = new Array();
                for (var i = 0; i < this.options.selection.length; i++) {
                    oldSelection.push(this.options.selection[i]);
                }

                if (this.options.selectionMode == TGrid.SelectionMode.Multi) {
                    if (multi) {
                        if (this.options.isSelected(item.item)) {
                            this.options.selection.splice(i, 1);
                        } else {
                            this.options.selection.push(item.item);
                        }
                    } else {
                        this.options.selection = [item.item];
                    }
                } else if (this.options.selectionMode == TGrid.SelectionMode.Single) {
                    this.options.selection = [item.item];
                } else {
                    this.options.selection = new Array();
                }

                if (this.options.openDetailsOnSelection) {
                    if (this.options.selection.length == 1) {
                        this.options.showDetailFor = new TGrid.ShowDetail();
                        this.options.showDetailFor.item = this.options.selection[0];
                    }
                } else {
                    this.options.showDetailFor = new TGrid.ShowDetail();
                }

                for (var i = 0; i < oldSelection.length; i++) {
                    this.updateRow(oldSelection[i]);
                }

                for (var i = 0; i < this.options.selection.length; i++) {
                    this.updateRow(this.options.selection[i]);
                }

                this.updateFooterViewModel();
                return true;
            };

            Grid.prototype.updateRow = function (item) {
                this.htmlProvider.updateTableDetailRow(this.options, this.tableBodyContainer.getElementsByTagName("tbody")[0], item);
                this.htmlProvider.updateMobileDetailRow(this.options, this.mobileContainer, item);
            };

            Grid.prototype.buildViewModels = function (items) {
                var itemModels = [];
                var currentGroupNames = new Array();
                var isGroupHeader = new Array();

                for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                    currentGroupNames.push("");
                    isGroupHeader.push(false);
                }

                for (var i = 0; i < items.length; i++) {
                    var collapsed = false;
                    for (var j = 0; j < this.options.groupBySortDescriptors.length; j++) {
                        var columnValue = getMemberValue(items[i], this.options.groupBySortDescriptors[j].path);
                        if (currentGroupNames[j] !== columnValue) {
                            currentGroupNames[j] = columnValue;
                            var filterDescriptor = new TGrid.FilterDescriptor(this.options.groupBySortDescriptors[0].path, currentGroupNames[0], TGrid.FilterCondition.NotEquals);
                            for (var k = 1; k <= j; k++) {
                                filterDescriptor.children.push(new TGrid.FilterDescriptor(this.options.groupBySortDescriptors[k].path, currentGroupNames[k], TGrid.FilterCondition.NotEquals));
                            }
                            collapsed = this.isFilterInCollapsed(filterDescriptor);

                            itemModels.push(new TGrid.ItemViewModel(this.options.parentViewModel, new TGrid.GroupHeaderDescriptor(currentGroupNames[j], j, collapsed, filterDescriptor), this, true));

                            for (var k = j + 1; k < this.options.groupBySortDescriptors.length; k++) {
                                currentGroupNames[k] = "";
                            }

                            if (collapsed) {
                                j = this.options.groupBySortDescriptors.length;
                            }
                        }
                    }
                    if (!collapsed) {
                        itemModels.push(new TGrid.ItemViewModel(this.options.parentViewModel, items[i], this, false));
                    }
                }
                return itemModels;
            };

            Grid.prototype.isFiltersEquals = function (filter, deeperFilter) {
                if (filter.path == deeperFilter.path && filter.value == deeperFilter.value && filter.children.length <= deeperFilter.children.length) {
                    var count = 0;
                    for (var i = 0; i < filter.children.length; i++) {
                        if (filter.children[i].path == deeperFilter.children[i].path && filter.children[i].value == deeperFilter.children[i].value) {
                            count++;
                        }
                    }
                    if (count == filter.children.length) {
                        return true;
                    }
                }
                return false;
            };

            Grid.prototype.isFilterInCollapsed = function (filterDescriptor) {
                for (var i = 0; i < this.collapsedFilterGroup[filterDescriptor.children.length].length; i++) {
                    if (this.isFiltersEquals(filterDescriptor, this.collapsedFilterGroup[filterDescriptor.children.length][i])) {
                        return true;
                    }
                }

                return false;
            };

            Grid.prototype.filterDescriptorToArray = function (filterDescriptor) {
                var arr = new Array();
                arr = arr.concat(filterDescriptor.children);
                arr.push(new TGrid.FilterDescriptor(filterDescriptor.path, filterDescriptor.value, filterDescriptor.condition));
                return arr;
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
                if (options.framework == TGrid.Framework.Knockout) {
                    return new TGrid.KnockoutHtmlProvider();
                }

                if (options.framework == TGrid.Framework.Angular) {
                    return new TGrid.AngularHtmlProvider();
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

                            if (_this.isDesktopMode() && _this.htmlProvider.getElemntsSize(_this.tableBody, null) < (_this.tableBodyContainer.clientHeight + 100) && (_this.options.firstLoadSize < _this.totalItemsCount)) {
                                _this.options.firstLoadSize *= 2;
                                if (_this.options.firstLoadSize > _this.totalItemsCount) {
                                    _this.options.firstLoadSize = _this.totalItemsCount;
                                }
                                _this.refreshBody();
                            }

                            if (!_this.isDesktopMode() && _this.htmlProvider.getElemntsSize(_this.mobileContainer, null) < (_this.mobileContainer.clientHeight + 100) && (_this.options.firstLoadSize < _this.totalItemsCount)) {
                                _this.options.firstLoadSize *= 2;
                                if (_this.options.firstLoadSize > _this.totalItemsCount) {
                                    _this.options.firstLoadSize = _this.totalItemsCount;
                                }
                                _this.refreshBody();
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
                this.tableFooter.innerHTML = "";
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
                this.collapsedFilterGroup[filterDescriptor.children.length].push(filterDescriptor);
                this.refreshBody();
            };

            Grid.prototype.removeCollapsedFilters = function (filterDescriptor) {
                for (var i = 0; i < this.collapsedFilterGroup[filterDescriptor.children.length].length; i++) {
                    if (this.isFiltersEquals(this.collapsedFilterGroup[filterDescriptor.children.length][i], filterDescriptor)) {
                        this.collapsedFilterGroup[filterDescriptor.children.length].splice(i, 1);
                    }
                }
                this.refreshBody();
            };

            Grid.prototype.setFilters = function (filterDescriptor, filterPath) {
                this.removeFilters(filterPath, false);
                this.options.filterDescriptors.push(filterDescriptor);
                this.refreshMobileHeader();
                this.refreshBody();
            };

            Grid.prototype.removeFilters = function (filterPath, isRefresh) {
                if (typeof isRefresh === "undefined") { isRefresh = true; }
                for (var i = 0; i < this.options.filterDescriptors.length; i++) {
                    if (this.options.filterDescriptors[i].path == filterPath) {
                        this.options.filterDescriptors.splice(i, 1);
                    }
                }
                if (isRefresh) {
                    this.refreshMobileHeader();
                    this.refreshBody();
                }
            };

            Grid.prototype.refreshMobileHeader = function () {
                this.htmlProvider.updateMobileHeadElement(this.options, this.mobileHeader, this.filterPopUp);
            };

            Grid.prototype.setDefaultFilterPopUpValues = function () {
                for (var i = 0; i < this.filterPopUp.getElementsByTagName('input').length; i++) {
                    if (this.filterPopUp.getElementsByTagName('input')[i].type == 'text') {
                        this.filterPopUp.getElementsByTagName('input')[i].value = '';
                    }
                }
                for (var i = 0; i < this.filterPopUp.getElementsByTagName('select').length; i++) {
                    this.filterPopUp.getElementsByTagName("select")[i].selectedIndex = TGrid.FilterCondition.None;
                }
            };
            return Grid;
        })();
        TGrid.Grid = Grid;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=TGrid.js.map
