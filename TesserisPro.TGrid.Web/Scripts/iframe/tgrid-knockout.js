//!=====================================================================================
//!
//! The Tesseris Free License
//!
//! Copyright(c) 2014 Tesseris Pro LLC
//!
//! Permission is hereby granted, free of charge, to any person obtaining a copy of this 
//! software and associated documentation files(the "Software"), to deal in the Software 
//! without restriction, including without limitation the rights to use, copy, modify,
//! merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
//! permit persons to whom the Software is furnished to do so, subject to the following
//! conditions:
//!
//! 1. The above copyright notice and this permission notice shall be included in all 
//!    copies or substantial portions of the Software.
//!
//! 2. Any software that fully or partially contains or uses materials covered by 
//!    this license shall notify users about this notice and above copyright.The 
//!    notification can be made in "About box" and / or site main web - page footer.The 
//!    notification shall contain name of Tesseris Pro company and name of the Software 
//!    covered by current license.
//!
//! THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
//! INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
//! PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
//! HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
//! OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
//! SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//!
//!=====================================================================================
;
var __extends = this.__extends || function(d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d
        }
        __.prototype = b.prototype;
        d.prototype = new __
    };
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var KnockoutHtmlProvider = (function(_super) {
                __extends(KnockoutHtmlProvider, _super);
                function KnockoutHtmlProvider() {
                    _super.apply(this, arguments)
                }
                KnockoutHtmlProvider.prototype.getTableElement = function(option) {
                    var table = document.createElement("table");
                    table.className = "tgrid-table";
                    return table
                };
                KnockoutHtmlProvider.prototype.getElementsSize = function(container, items) {
                    var size = 0;
                    var children = container.children;
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        var viewModel = (ko.contextFor(child).$root);
                        if (viewModel != null && (items == null || items.indexOf(viewModel) >= 0)) {
                            size += child.offsetHeight
                        }
                    }
                    return size
                };
                KnockoutHtmlProvider.prototype.getFirstVisibleItem = function(container, items, scrollTop) {
                    var size = 0;
                    var children = container.children;
                    for (var i = 0; i < children.length; i++) {
                        var child = children.item(i);
                        var viewModel = (ko.contextFor(child).$root);
                        if (viewModel != null && items.indexOf(viewModel) >= 0) {
                            size += child.offsetHeight
                        }
                        if (size > scrollTop) {
                            return viewModel
                        }
                    }
                    return null
                };
                KnockoutHtmlProvider.prototype.getFooterViewModel = function(grid) {
                    var knockoutFooterViewModel = new TGrid.KnockoutFooterViewModel(0, 0, 0, 0, grid);
                    return knockoutFooterViewModel
                };
                KnockoutHtmlProvider.prototype.getFilterPopupViewModel = function(container) {
                    var filterPopupViewModel = new TGrid.KnockoutFilterPopupViewModel(container, this.onCloseFilterPopup);
                    return filterPopupViewModel
                };
                KnockoutHtmlProvider.prototype.updateTableHeadElement = function(option, header, groupByContainer, filterPopupContainer, columnsResized) {
                    if (option.columns.length <= 0) {
                        var grid = TesserisPro.TGrid.Grid.getGridObject(header);
                        grid.setColumnsFromItemsProvider()
                    }
                    this.updateGroupByPanel(option, groupByContainer);
                    var head = document.createElement("tr");
                    this.appendIndent(head, option.columns.length, true);
                    this.showNeededIndents(head, option.groupBySortDescriptors.length, TGrid.Grid.getGridObject(header));
                    var hasNotSizedColumn = false;
                    if (option.columns.length > 0) {
                        for (var i = 0; i < option.columns.length; i++) {
                            if (option.columns[i].device.indexOf("desktop") != -1) {
                                var headerCell = document.createElement("th");
                                headerCell.className = "tgrid-header-cell";
                                headerCell.draggable = false;
                                var headerMainContainer = document.createElement("div");
                                headerMainContainer.className = "tgrid-header-cell-container";
                                var headerContent = document.createElement("div");
                                headerContent.style.overflow = "hidden";
                                var headerButtons = document.createElement("div");
                                headerContent.className = "tgrid-header-cell-content";
                                headerButtons.className = "tgrid-header-cell-buttons";
                                headerMainContainer.appendChild(headerContent);
                                headerMainContainer.appendChild(headerButtons);
                                headerCell.appendChild(headerMainContainer);
                                if (!option.columns[i].notSized) {
                                    headerCell.style.width = option.columns[i].width.toString() + "px"
                                }
                                else {
                                    option.columns[i].resizable = false;
                                    hasNotSizedColumn = true
                                }
                                if (option.columns[i].header != null) {
                                    option.columns[i].header.applyTemplate(headerContent)
                                }
                                else {
                                    var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                                    this.buildDefaultHeader(headerContent, headerText)
                                }
                                if (option.enableSorting && option.columns[i].enableSorting) {
                                    (function(i) {
                                        headerCell.onclick = function(e) {
                                            return TGrid.Grid.getGridObject(e.target).sortBy(option.columns[i].sortMemberPath)
                                        }
                                    })(i);
                                    if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                        this.addArrows(headerButtons, option, i)
                                    }
                                }
                                if (option.enableFiltering && option.columns[i].enableFiltering) {
                                    this.addFilterButton(option, header, filterPopupContainer, headerButtons, i)
                                }
                                if (option.columns[i].resizable) {
                                    var columnResize = document.createElement("div");
                                    columnResize.className = "tgrid-header-column-resize";
                                    columnResize.onclick = function(e) {
                                        return e.stopImmediatePropagation()
                                    };
                                    (function(i, headerCell, columnResize) {
                                        var documentMouseMove = null;
                                        var position = 0;
                                        columnResize.onmousedown = function(e) {
                                            e.stopImmediatePropagation();
                                            position = e.screenX;
                                            documentMouseMove = document.onmousemove;
                                            document.onmousemove = function(m) {
                                                if (position != 0) {
                                                    option.columns[i].width = (parseInt(option.columns[i].width) + m.screenX - position).toString();
                                                    position = m.screenX;
                                                    columnsResized(option.columns[i])
                                                }
                                            }
                                        };
                                        document.onmouseup = function(e) {
                                            document.onmousemove = documentMouseMove;
                                            position = 0
                                        }
                                    })(i, headerCell, columnResize);
                                    headerButtons.appendChild(columnResize)
                                }
                                if (hasNotSizedColumn) {
                                    header.parentElement.style.tableLayout = "fixed"
                                }
                                head.appendChild(headerCell)
                            }
                        }
                    }
                    var placeholderColumn = document.createElement("th");
                    addClass(placeholderColumn, "tgrid-placeholder");
                    if (hasNotSizedColumn) {
                        addClass(placeholderColumn, "tgrid-placeholder-width")
                    }
                    head.appendChild(placeholderColumn);
                    header.innerHTML = "";
                    header.appendChild(head);
                    ko.applyBindings(option.parentViewModel, head)
                };
                KnockoutHtmlProvider.prototype.updateTableBodyElement = function(option, container, items, selected) {
                    for (var i = 0; i < items.length; i++) {
                        this.appendTableElement(option, container, items[i], 0, selected)
                    }
                    addClass(container, "desktop");
                    return container
                };
                KnockoutHtmlProvider.prototype.updateTableDetailRow = function(options, container, item, shouldAddDetails) {
                    var detailRow = container.getElementsByClassName("tgrid-details");
                    if (detailRow.length > 0) {
                        detailRow[0].parentNode.removeChild(detailRow[0])
                    }
                    var targetRow;
                    for (var i = 0; i < container.children.length; i++) {
                        if (ko.contextFor(container.children.item(i)).$data.item == item) {
                            targetRow = container.children.item(i);
                            break
                        }
                    }
                    if (targetRow != null) {
                        if (options.isSelected(item)) {
                            addClass(targetRow, "selected")
                        }
                        else {
                            removeClass(targetRow, "selected")
                        }
                        if (shouldAddDetails) {
                            var detailsTemplate = this.getActualDetailsTemplate(options);
                            if (detailsTemplate != null) {
                                var details = this.buildDetailsRow(options, detailsTemplate);
                                insertAfter(targetRow, details);
                                ko.applyBindings(options.showDetailFor, details)
                            }
                        }
                    }
                };
                KnockoutHtmlProvider.prototype.updateTableFooterElement = function(option, footer, totalItemsCount, footerModel) {
                    if (option.tableFooterTemplate == null && option.enablePaging) {
                        this.buildDefaultTableFooterElement(option, footer, totalItemsCount)
                    }
                    else if (option.tableFooterTemplate != null) {
                        if (!footer.hasChildNodes()) {
                            var footerContainer = document.createElement("div");
                            option.tableFooterTemplate.applyTemplate(footerContainer);
                            ko.applyBindings(footerModel, footerContainer);
                            footer.appendChild(footerContainer)
                        }
                    }
                    else {
                        footer.innerHTML = ""
                    }
                };
                KnockoutHtmlProvider.prototype.updateFilteringPopUp = function(option, filterPopup, filterPopupModel) {
                    if (option.filterPopup == null) {
                        this.buildDefaultFilteringPopUp(option, filterPopup)
                    }
                    else {
                        var filterContainer = document.createElement("div");
                        filterContainer.className = "tgrid-filter-popup-container";
                        option.filterPopup.applyTemplate(filterContainer);
                        filterPopup.innerHTML = "";
                        filterPopup.appendChild(filterContainer)
                    }
                    ko.applyBindings(filterPopupModel, filterPopup)
                };
                KnockoutHtmlProvider.prototype.appendTableElement = function(option, container, item, groupLevel, selected) {
                    var itemWithDetails;
                    var rowWithDetail;
                    if (item.isGroupHeader) {
                        var groupHeader = this.buildGroupHeaderRow(option, item.item);
                        container.appendChild(groupHeader);
                        ko.applyBindings(item, groupHeader)
                    }
                    else {
                        var row = this.buildRowElement(option, item, container, selected);
                        container.appendChild(row);
                        ko.applyBindings(item, row)
                    }
                };
                KnockoutHtmlProvider.prototype.buildRowElement = function(option, item, container, selected) {
                    var row = document.createElement("tr");
                    if (isNotNull(option.rowClick)) {
                        row.setAttribute("data-bind", "click:function(){model.".concat(option.rowClick).concat("(item, event);}"))
                    }
                    addClass(row, "tgrid-table-body-row");
                    if (option.isSelected(item.item)) {
                        addClass(row, "selected")
                    }
                    this.appendIndent(row, option.groupBySortDescriptors.length, false);
                    var hasNotSizedColumn = false;
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("desktop") != -1) {
                            if (option.columns[i].notSized) {
                                hasNotSizedColumn = true
                            }
                            var cell = document.createElement("td");
                            addClass(cell, "tgrid-table-data-cell");
                            var cellContent = document.createElement("div");
                            cellContent.className = "tgrid-cell-content";
                            cellContent.style.overflow = "hidden";
                            cell.appendChild(cellContent);
                            if (option.columns[i].cell != null) {
                                option.columns[i].cell.applyTemplate(cellContent)
                            }
                            else {
                                if (option.columns[i].member != null) {
                                    this.createDefaultCell(cellContent, option.columns[i].member)
                                }
                            }
                            row.appendChild(cell)
                        }
                    }
                    if (hasNotSizedColumn) {
                        container.parentElement.style.tableLayout = "fixed";
                        container.parentElement.parentElement.style.overflowY = "scroll"
                    }
                    else {
                        var placeholderColumn = document.createElement("td");
                        addClass(placeholderColumn, "tgrid-placeholder");
                        addClass(placeholderColumn, "tgrid-table-data-cell");
                        row.appendChild(placeholderColumn)
                    }
                    if (isNull(option.rowClick)) {
                        (function(item) {
                            row.onclick = function(e) {
                                if (option.selectionMode != 0) {
                                    var wasSelected = false;
                                    if (option.shouldAddDetailsOnSelection == item.item) {
                                        wasSelected = true
                                    }
                                    selected(item, e.ctrlKey, wasSelected)
                                }
                            }
                        })(item)
                    }
                    return row
                };
                KnockoutHtmlProvider.prototype.buildDetailsRow = function(option, template) {
                    var detailTr = document.createElement("tr");
                    var detailTd = document.createElement("td");
                    this.appendIndent(detailTr, option.groupBySortDescriptors.length, false);
                    addClass(detailTr, "tgrid-details");
                    detailTd.setAttribute("colspan", (option.columns.length + 1).toString());
                    template.applyTemplate(detailTd);
                    detailTr.appendChild(detailTd);
                    return detailTr
                };
                KnockoutHtmlProvider.prototype.buildGroupHeaderRow = function(option, groupHeaderDescriptor) {
                    var headerTr = document.createElement("tr");
                    var headerTd = document.createElement("td");
                    this.appendIndent(headerTr, groupHeaderDescriptor.level, false);
                    var colspan = option.columns.length + 1 + option.groupBySortDescriptors.length - groupHeaderDescriptor.level;
                    headerTd.setAttribute("colspan", colspan.toString());
                    addClass(headerTd, "tgrid-table-group-header");
                    addClass(headerTr, "tgrid-table-group-header");
                    if (option.enableCollapsing) {
                        addClass(headerTr, "collapsing");
                        if (!groupHeaderDescriptor.collapse) {
                            headerTd.onclick = function(e) {
                                TesserisPro.TGrid.Grid.getGridObject(e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor)
                            }
                        }
                        else {
                            headerTd.onclick = function(e) {
                                TesserisPro.TGrid.Grid.getGridObject(e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor)
                            }
                        }
                    }
                    if (option.groupHeaderTemplate != null) {
                        option.groupHeaderTemplate.applyTemplate(headerTd)
                    }
                    else {
                        this.createDefaultGroupHeader(headerTd)
                    }
                    headerTr.appendChild(headerTd);
                    return headerTr
                };
                KnockoutHtmlProvider.prototype.addArrows = function(sortArrowContainer, option, columnNumber) {
                    if (option.sortDescriptor.asc) {
                        var up = document.createElement("div");
                        addClass(up, "tgrid-arrow-up");
                        sortArrowContainer.appendChild(up)
                    }
                    if (!option.sortDescriptor.asc) {
                        var down = document.createElement("div");
                        addClass(down, "tgrid-arrow-down");
                        sortArrowContainer.appendChild(down)
                    }
                    return sortArrowContainer
                };
                KnockoutHtmlProvider.prototype.removeArrows = function(htmlNode) {
                    var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
                    for (var i = 0; i < element.length; i++) {
                        element[i].parentNode.removeChild(element[i]);
                        i--
                    }
                    var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
                    for (var i = 0; i < element.length; i++) {
                        element[i].parentNode.removeChild(element[i]);
                        i--
                    }
                };
                KnockoutHtmlProvider.prototype.removeFilterButtons = function(container) {
                    var elements = container.getElementsByClassName("tgrid-filter-button");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].parentNode.removeChild(elements[i]);
                        i--
                    }
                    var elements = container.getElementsByClassName("tgrid-filter-button-active");
                    for (var i = 0; i < elements.length; i++) {
                        elements[i].parentNode.removeChild(elements[i]);
                        i--
                    }
                };
                KnockoutHtmlProvider.prototype.updateMobileItemsList = function(option, container, items, selected) {
                    for (var i = 0; i < items.length; i++) {
                        this.appendMobileElement(option, container, items[i], 0, selected)
                    }
                    var bodyClass = container.getAttribute("class");
                    if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                        bodyClass = "mobile"
                    }
                    else {
                        if (bodyClass.indexOf("mobile") == -1) {
                            bodyClass += " mobile"
                        }
                    }
                    container.setAttribute("class", bodyClass)
                };
                KnockoutHtmlProvider.prototype.updateMobileDetailRow = function(options, container, item, shouldAddDetails) {
                    var detailRow = container.getElementsByClassName("tgrid-mobile-details");
                    if (detailRow.length > 0) {
                        detailRow[0].parentNode.removeChild(detailRow[0])
                    }
                    var targetRow;
                    for (var i = 0; i < container.children.length; i++) {
                        if (ko.contextFor(container.children.item(i)).$data.item == item) {
                            targetRow = container.children.item(i);
                            break
                        }
                    }
                    if (targetRow != null) {
                        if (options.isSelected(item)) {
                            addClass(targetRow, "selected")
                        }
                        else {
                            removeClass(targetRow, "selected")
                        }
                        if (shouldAddDetails) {
                            var detailsTemplate = this.getActualDetailsTemplate(options);
                            if (detailsTemplate != null) {
                                var details = this.buildMobileDetailsRow(options, detailsTemplate);
                                insertAfter(targetRow, details);
                                ko.applyBindings(options.showDetailFor, details)
                            }
                        }
                    }
                };
                KnockoutHtmlProvider.prototype.appendMobileElement = function(option, container, item, groupLevel, selected) {
                    var itemWithDetails;
                    var rowWithDetail;
                    if (item.isGroupHeader) {
                        var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                        container.appendChild(mobileGroupHeader);
                        ko.applyBindings(item, mobileGroupHeader)
                    }
                    else {
                        var row = this.buildMobileRowElement(option, item, container, selected);
                        container.appendChild(row);
                        ko.applyBindings(item, row)
                    }
                };
                KnockoutHtmlProvider.prototype.buildMobileRowElement = function(option, item, container, selected) {
                    var row = document.createElement("div");
                    addClass(row, "tgrid-mobile-row");
                    if (option.isSelected(item.item)) {
                        addClass(row, "selected")
                    }
                    for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                        row.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
                    }
                    var rowTemplate = document.createElement("div");
                    addClass(rowTemplate, 'tgrid-mobile-div');
                    if (option.mobileTemplateHtml != null) {
                        option.mobileTemplateHtml.applyTemplate(rowTemplate)
                    }
                    else {
                        rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option)
                    }
                    row.appendChild(rowTemplate);
                    (function(item) {
                        row.onclick = function(e) {
                            if (option.selectionMode != 0) {
                                var s = container;
                                selected(item, e.ctrlKey)
                            }
                        }
                    })(item);
                    return row
                };
                KnockoutHtmlProvider.prototype.buildMobileDetailsRow = function(option, template) {
                    var detailDiv = document.createElement("div");
                    addClass(detailDiv, "tgrid-mobile-details");
                    template.applyTemplate(detailDiv);
                    return detailDiv
                };
                KnockoutHtmlProvider.prototype.createDefaultCell = function(cell, defaultCellBindingName) {
                    var spanForCell = document.createElement("span");
                    var textBinding = "text: item.".concat(defaultCellBindingName);
                    spanForCell.setAttribute("data-bind", textBinding);
                    cell.appendChild(spanForCell)
                };
                KnockoutHtmlProvider.prototype.createDefaultGroupHeader = function(tableRowElement) {
                    var groupHeaderContainer = document.createElement("div");
                    var groupHeaderName = document.createElement("span");
                    groupHeaderName.setAttribute("data-bind", "text: item.value");
                    groupHeaderContainer.appendChild(groupHeaderName);
                    tableRowElement.appendChild(groupHeaderContainer)
                };
                KnockoutHtmlProvider.prototype.createDefaultMobileTemplate = function(rowTemplate, option) {
                    for (var i = 0; i < option.columns.length; i++) {
                        if (option.columns[i].device.indexOf("mobile") != -1) {
                            var mobileColumnContainer = document.createElement("div");
                            var mobileColumnName = document.createElement("span");
                            if (option.columns[i].member != null) {
                                mobileColumnName.innerHTML = option.columns[i].member
                            }
                            else if (option.columns[i].sortMemberPath != null) {
                                mobileColumnName.innerHTML = option.columns[i].sortMemberPath
                            }
                            else if (option.columns[i].groupMemberPath != null) {
                                mobileColumnName.innerHTML = option.columns[i].groupMemberPath
                            }
                            else {
                                mobileColumnName.innerHTML = ""
                            }
                            var columnData = document.createElement("span");
                            if (option.columns[i].member != null) {
                                var columnBinding = document.createElement('span');
                                columnBinding.setAttribute("data-bind", 'text:item.'.concat(option.columns[i].member));
                                columnData.innerHTML = ": ";
                                columnData.appendChild(columnBinding)
                            }
                            else {
                                columnData.innerHTML = ": "
                            }
                            mobileColumnContainer.appendChild(mobileColumnName);
                            mobileColumnContainer.appendChild(columnData);
                            rowTemplate.appendChild(mobileColumnContainer)
                        }
                    }
                    return rowTemplate
                };
                KnockoutHtmlProvider.prototype.bindData = function(option, elementForBinding) {
                    var viewModel = ko.contextFor(option.target);
                    ko.applyBindings(viewModel, elementForBinding)
                };
                KnockoutHtmlProvider.prototype.buildDefaultFilteringPopUp = function(option, filterPopupContainer) {
                    var columnNameContainer = document.createElement("div");
                    var columnName = document.createElement("span");
                    columnName.setAttribute("data-bind", "text:path");
                    columnNameContainer.appendChild(columnName);
                    filterPopupContainer.appendChild(columnNameContainer);
                    var filterCondition = document.createElement("select");
                    var selectOption = document.createElement("option");
                    selectOption.value = 0..toString();
                    selectOption.text = "None";
                    filterCondition.appendChild(selectOption);
                    var selectOption = document.createElement("option");
                    selectOption.value = 1..toString();
                    selectOption.text = "Equals";
                    filterCondition.appendChild(selectOption);
                    var selectOption = document.createElement("option");
                    selectOption.value = 2..toString();
                    selectOption.text = "Not equals";
                    filterCondition.appendChild(selectOption);
                    filterPopupContainer.appendChild(filterCondition);
                    filterCondition.selectedIndex = 1;
                    var filterText = document.createElement("input");
                    filterText.type = "text";
                    filterText.className = 'tgrid-filter-input-text';
                    filterText.setAttribute("value", "");
                    filterText.style.width = '150px';
                    filterPopupContainer.appendChild(filterText);
                    filterPopupContainer.innerHTML += "<br>";
                    var applyButton = document.createElement("div");
                    applyButton.className = "tgrid-filter-popup-button";
                    applyButton.style.width = '70px';
                    applyButton.onclick = function(e) {
                        var grid = TGrid.Grid.getGridObject(e.target);
                        grid.filterPopupViewModel.onApply()
                    };
                    applyButton.innerHTML = "OK";
                    filterPopupContainer.appendChild(applyButton);
                    var clearButton = document.createElement("div");
                    clearButton.className = 'tgrid-filter-popup-button';
                    clearButton.style.width = '70px';
                    clearButton.onclick = function(e) {
                        var grid = TGrid.Grid.getGridObject(e.target);
                        grid.filterPopupViewModel.onClose();
                        filterText.setAttribute("value", "")
                    };
                    clearButton.innerHTML = 'Cancel';
                    filterPopupContainer.appendChild(clearButton)
                };
                return KnockoutHtmlProvider
            })(TGrid.BaseHtmlProvider);
        TGrid.KnockoutHtmlProvider = KnockoutHtmlProvider
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
var TGridBindingHandler = (function() {
        function TGridBindingHandler(){}
        TGridBindingHandler.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = TGridBindingHandler.getOptions(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
            setTimeout(function() {
                var grid = new TesserisPro.TGrid.Grid(element, options, valueAccessor().provider);
                if (valueAccessor().options != undefined) {
                    options.apply = function() {
                        grid.afterOptionsChange()
                    };
                    valueAccessor().options(options)
                }
                if (valueAccessor().bindingReady != undefined && typeof valueAccessor().bindingReady == 'function') {
                    valueAccessor().bindingReady(options)
                }
            }, 1)
        };
        TGridBindingHandler.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var grid = TesserisPro.TGrid.Grid.getGridObject(element);
            if (grid != null) {
                var options = TGridBindingHandler.getOptions(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                grid.options = options;
                grid.updateBody()
            }
        };
        TGridBindingHandler.getOptions = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var options = new TesserisPro.TGrid.Options(element, 0);
            options.parentViewModel = viewModel;
            var groupBySortDescriptor = "";
            if (isObservable(valueAccessor().groupBy)) {
                groupBySortDescriptor = valueAccessor().groupBy()
            }
            else {
                groupBySortDescriptor = valueAccessor().groupBy
            }
            if (groupBySortDescriptor != undefined) {
                for (var i = 0; i < groupBySortDescriptor.length; i++) {
                    options.groupBySortDescriptors.push(new TesserisPro.TGrid.SortDescriptor(groupBySortDescriptor[i], true))
                }
            }
            if (isObservable(valueAccessor().enablePaging)) {
                if (typeof valueAccessor().enablePaging() == "boolean") {
                    options.enablePaging = valueAccessor().enablePaging()
                }
                else {
                    options.enablePaging = valueAccessor().enablePaging == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().enablePaging == "boolean") {
                    options.enablePaging = valueAccessor().enablePaging
                }
                else {
                    options.enablePaging = valueAccessor().enablePaging == "true" ? true : false
                }
            }
            if (isObservable(valueAccessor().pageSize)) {
                options.pageSize = valueAccessor().pageSize()
            }
            else {
                options.pageSize = valueAccessor().pageSize
            }
            options.pageSize = (isNaN(options.pageSize) || options.pageSize < 1) ? 10 : options.pageSize;
            if (isObservable(valueAccessor().selectMode)) {
                options.selectionMode = valueAccessor().selectMode()
            }
            else {
                options.selectionMode = valueAccessor().selectMode
            }
            if (isNaN(options.selectionMode)) {
                options.selectionMode = 1
            }
            if (isObservable(valueAccessor().enableVirtualScroll)) {
                if (typeof valueAccessor().enableVirtualScroll() == "boolean") {
                    options.enableVirtualScroll = valueAccessor().enableVirtualScroll()
                }
                else {
                    options.enableVirtualScroll = valueAccessor().enableVirtualScroll == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().enableVirtualScroll == "boolean") {
                    options.enableVirtualScroll = valueAccessor().enableVirtualScroll
                }
                else {
                    options.enableVirtualScroll = valueAccessor().enableVirtualScroll == "true" ? true : false
                }
            }
            if (isObservable(valueAccessor().enableCollapsing)) {
                if (typeof valueAccessor().enableCollapsing() == "boolean") {
                    options.enableCollapsing = valueAccessor().enableCollapsing()
                }
                else {
                    options.enableCollapsing = valueAccessor().enableCollapsing == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().enableCollapsing == "boolean") {
                    options.enableCollapsing = valueAccessor().enableCollapsing
                }
                else {
                    options.enableCollapsing = valueAccessor().enableCollapsing == "true" ? true : false
                }
            }
            if (isObservable(valueAccessor().showDetailsOnSelection)) {
                if (typeof valueAccessor().showDetailsOnSelection() == "boolean") {
                    options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection()
                }
                else {
                    options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().showDetailsOnSelection == "boolean") {
                    options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection
                }
                else {
                    options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection == "true" ? true : false
                }
            }
            var selectionMode = isObservable(valueAccessor().selectionMode) ? valueAccessor().selectionMode() : valueAccessor().selectionMode;
            if (selectionMode == "multi") {
                options.selectionMode = 2
            }
            if (selectionMode == "single") {
                options.selectionMode = 1
            }
            if (selectionMode == "none") {
                options.selectionMode = 0
            }
            if (isObservable(valueAccessor().enableSorting)) {
                if (typeof valueAccessor().enableSorting() == "boolean") {
                    options.enableSorting = valueAccessor().enableSorting()
                }
                else {
                    options.enableSorting = valueAccessor().enableSorting == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().enableSorting == "boolean") {
                    options.enableSorting = valueAccessor().enableSorting
                }
                else {
                    options.enableSorting = valueAccessor().enableSorting == "true" ? true : false
                }
            }
            if (isObservable(valueAccessor().enableGrouping)) {
                if (typeof valueAccessor().enableGrouping() == "boolean") {
                    options.enableGrouping = valueAccessor().enableGrouping()
                }
                else {
                    options.enableGrouping = valueAccessor().enableGrouping == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().enableGrouping == "boolean") {
                    options.enableGrouping = valueAccessor().enableGrouping
                }
                else {
                    options.enableGrouping = valueAccessor().enableGrouping == "true" ? true : false
                }
            }
            if (isObservable(valueAccessor().enableFiltering)) {
                if (typeof valueAccessor().enableFiltering() == "boolean") {
                    options.enableFiltering = valueAccessor().enableFiltering()
                }
                else {
                    options.enableFiltering = valueAccessor().enableFiltering == "true" ? true : false
                }
            }
            else {
                if (typeof valueAccessor().enableFiltering == "boolean") {
                    options.enableFiltering = valueAccessor().enableFiltering
                }
                else {
                    options.enableFiltering = valueAccessor().enableFiltering == "true" ? true : false
                }
            }
            if (isObservable(valueAccessor().pageSlide)) {
                options.pageSlide = valueAccessor().pageSlide()
            }
            else {
                options.pageSlide = valueAccessor().pageSlide
            }
            options.pageSlide = (isNaN(options.pageSlide) || options.pageSlide < 1) ? 1 : options.pageSlide;
            if (isObservable(valueAccessor().rowClick)) {
                options.rowClick = valueAccessor().rowClick()
            }
            else {
                options.rowClick = valueAccessor().rowClick
            }
            options.rowClick = isNoU(options.rowClick) ? null : options.rowClick;
            if (isObservable(valueAccessor().captureScroll)) {
                if (typeof valueAccessor().captureScroll() == "boolean") {
                    options.captureScroll = valueAccessor().captureScroll()
                }
                else {
                    options.captureScroll = valueAccessor().captureScroll == "false" ? false : true
                }
            }
            else {
                if (typeof valueAccessor().captureScroll == "boolean") {
                    options.captureScroll = valueAccessor().captureScroll
                }
                else {
                    options.captureScroll = valueAccessor().captureScroll == "false" ? false : true
                }
            }
            if (valueAccessor().ready != undefined && typeof valueAccessor().ready == 'function') {
                options.ready = valueAccessor().ready
            }
            return options
        };
        return TGridBindingHandler
    })();
ko.bindingHandlers.tgrid = new TGridBindingHandler;
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var KnockoutFooterViewModel = (function() {
                function KnockoutFooterViewModel(totalCount, selectedItem, currentPage, totalPages, grid) {
                    this.totalCount = ko.observable(totalCount);
                    this.selectedItem = ko.observable(selectedItem);
                    this.currentPage = ko.observable(currentPage);
                    this.totalPages = ko.observable(totalPages);
                    this.grid = grid
                }
                KnockoutFooterViewModel.prototype.setTotalCount = function(totalCount) {
                    this.totalCount(Math.floor(totalCount))
                };
                KnockoutFooterViewModel.prototype.setSelectedItem = function(selectedItem) {
                    this.selectedItem(selectedItem)
                };
                KnockoutFooterViewModel.prototype.setCurrentPage = function(currentPage) {
                    this.currentPage(Math.floor(currentPage))
                };
                KnockoutFooterViewModel.prototype.setTotalPages = function(totalPages) {
                    this.totalPages(Math.floor(totalPages))
                };
                KnockoutFooterViewModel.prototype.changePage = function(viewPageNumber) {
                    var _this = this;
                    (function() {
                        var pageNumber = parseInt(viewPageNumber);
                        if (isNaN(pageNumber)) {
                            return
                        }
                        if (_this.totalPages() != undefined && _this.totalPages() != null && pageNumber > _this.totalPages()) {
                            _this.grid.selectPage(_this.totalPages() - 1);
                            return
                        }
                        if (pageNumber < 1) {
                            _this.grid.selectPage(0)
                        }
                        else {
                            _this.grid.selectPage(pageNumber - 1)
                        }
                    })()
                };
                KnockoutFooterViewModel.prototype.goToPreviousPagesBlock = function() {
                    var previousBlockPage = this.currentPage() - this.grid.options.pageSlide - 1;
                    if (previousBlockPage > 0 && previousBlockPage != null && previousBlockPage != undefined) {
                        this.grid.selectPage(previousBlockPage)
                    }
                    else {
                        this.grid.selectPage(0)
                    }
                };
                KnockoutFooterViewModel.prototype.goToNextPagesBlock = function() {
                    var nextBlockPage = this.currentPage() + this.grid.options.pageSlide - 1;
                    if (nextBlockPage < this.totalPages() && nextBlockPage != null && nextBlockPage != undefined) {
                        this.grid.selectPage(nextBlockPage)
                    }
                    else {
                        this.grid.selectPage(this.totalPages() - 1)
                    }
                };
                KnockoutFooterViewModel.prototype.goToFirstPage = function() {
                    this.grid.selectPage(0)
                };
                KnockoutFooterViewModel.prototype.goToLastPage = function() {
                    this.grid.selectPage(this.totalPages() - 1)
                };
                return KnockoutFooterViewModel
            })();
        TGrid.KnockoutFooterViewModel = KnockoutFooterViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}));
;
var TesserisPro;
(function(TesserisPro) {
    (function(TGrid) {
        var KnockoutFilterPopupViewModel = (function() {
                function KnockoutFilterPopupViewModel(container, onCloseFilterPopup) {
                    this.container = container;
                    this.onCloseFilterPopup = onCloseFilterPopup;
                    this.path = ko.observable("")
                }
                KnockoutFilterPopupViewModel.prototype.onCloseFilterPopup = function(){};
                KnockoutFilterPopupViewModel.prototype.onApply = function() {
                    this.condition = this.container.getElementsByTagName("select")[0].selectedIndex;
                    var grid = TGrid.Grid.getGridObject(this.container);
                    grid.options.filterDescriptor.removeChildByPath(this.path());
                    if (this.condition != 0) {
                        this.value = this.container.getElementsByTagName("input")[0].value;
                        grid.options.filterDescriptor.addChild(new TGrid.FilterDescriptor(this.path(), this.value, this.condition))
                    }
                    grid.applyFilters();
                    hideElement(this.container);
                    this.onCloseFilterPopup()
                };
                KnockoutFilterPopupViewModel.prototype.onClear = function() {
                    var grid = TGrid.Grid.getGridObject(this.container);
                    grid.options.filterDescriptor.removeChildByPath(this.path());
                    grid.applyFilters();
                    hideElement(this.container);
                    this.onCloseFilterPopup()
                };
                KnockoutFilterPopupViewModel.prototype.onClose = function() {
                    hideElement(this.container);
                    this.onCloseFilterPopup()
                };
                KnockoutFilterPopupViewModel.prototype.onOpen = function(options, column) {
                    this.columnInfo = column;
                    this.path(column.filterMemberPath);
                    for (var i = 0; i < options.filterDescriptor.children.length; i++) {
                        if (options.filterDescriptor.children[i].path == column.filterMemberPath) {
                            this.container.getElementsByTagName("input")[0].value = options.filterDescriptor.children[i].value;
                            this.container.getElementsByTagName("select")[0].selectedIndex = options.filterDescriptor.children[i].condition;
                            return
                        }
                    }
                    this.container.getElementsByTagName("input")[0].value = '';
                    this.container.getElementsByTagName("select")[0].selectedIndex = 0
                };
                KnockoutFilterPopupViewModel.prototype.getColumnInfo = function() {
                    return this.columnInfo
                };
                return KnockoutFilterPopupViewModel
            })();
        TGrid.KnockoutFilterPopupViewModel = KnockoutFilterPopupViewModel
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid
})(TesserisPro || (TesserisPro = {}))