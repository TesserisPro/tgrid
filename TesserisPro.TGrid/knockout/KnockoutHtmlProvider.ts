/// <reference path="../TGrid.ts" />
/// <reference path="../IHtmlProvider.ts" />
/// <reference path="../BaseHtmlProvider.ts" />
/// <reference path="../ItemViewModel.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../IFooterViewModel.ts" />
/// <reference path="KnockoutFilterPopupViewModel.ts" />
/// <reference path="KnockoutFooterViewModel.ts" />


module TesserisPro.TGrid {

    export class KnockoutHtmlProvider extends BaseHtmlProvider {

        // Table Methods

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public getElemntsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = children.item(i);
                var viewModel = <ItemViewModel>(ko.contextFor(child).$root);

                if (viewModel != null && (items == null || items.indexOf(viewModel) > 0)) {
                    size += child.clientHeight;
                }
            }

            return size;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            var size = 0;
            var children = container.children;
            for (var i = 0; i < children.length; i++) {
                var child = children.item(i);
                var viewModel = <ItemViewModel>(ko.contextFor(child).$root);
                if (viewModel != null && items.indexOf(viewModel) >= 0) {
                    size += child.clientHeight;
                }
                if (size > scrollTop) {
                    return viewModel;
                }
            }

            return null;
        }

        public getFooterViewModel(grid: any) {
            var knockoutFooterViewModel = new KnockoutFooterViewModel(0, 0, 0, 0, grid);
            return knockoutFooterViewModel;
        }

        public getFilterPopupViewModel(container: HTMLElement) {
            var filterPopupViewModel = new KnockoutFilterPopupViewModel(container, this.onCloseFilterPopup);
            return filterPopupViewModel;
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: ColumnInfo) => void) {
            this.updateGroupByPanel(option, groupByContainer);

            if (header.innerHTML != null && header.innerHTML != "") {
                //add indents for groupBy
                this.showNeededIndents(header, option.groupBySortDescriptors.length, Grid.getGridObject(header));

                var element = header.getElementsByTagName("th");
                var indendsQuantity = option.columns.length;
                var columnsQuantity = option.columns.length;
                var headerElementsQuantity = element.length;

                // update table header
                if (option.enableSorting) {
                    this.removeArrows(header);
                    for (var headerElementNumber = indendsQuantity, j = 0; headerElementNumber < headerElementsQuantity, j < columnsQuantity; headerElementNumber, j++) {
                        if (option.columns[j].device.indexOf("desktop") != -1) {
                            if (option.sortDescriptor.path == option.columns[j].sortMemberPath && option.columns[j].sortMemberPath != null) {
                                this.addArrows(element[headerElementNumber].getElementsByClassName("tgrid-header-cell-buttons")[0], option, headerElementNumber);
                            }
                            headerElementNumber++;
                        } 
                    }
                }
                if (option.enableFiltering) {
                    this.removeFilterButtons(header);
                    for (var headerElementNumber = indendsQuantity, j = 0; headerElementNumber < headerElementsQuantity, j < columnsQuantity; headerElementNumber, j++) {
                        if (option.columns[j].device.indexOf("desktop") != -1) {
                            var isFilterApplied = false;
                            for (var i = 0; i < option.filterDescriptors.length; i++) {
                                if (option.filterDescriptors[i].path == option.columns[j].filterMemberPath && option.columns[j].filterMemberPath != null) {
                                    isFilterApplied = true;
                                    break;
                                }
                            }
                            var headerElementsButton = element[headerElementNumber].getElementsByClassName("tgrid-header-cell-buttons")[0];
                            this.addFilterButton(option, header, filterPopupContainer, <HTMLElement>headerElementsButton, j, isFilterApplied);
                            
                            headerElementNumber++;
                        }
                    }
                }

            } else {

                // Create table header
                var head = document.createElement("tr");
                this.appendIndent(head, option.columns.length, true);
                this.showNeededIndents(head, option.groupBySortDescriptors.length, Grid.getGridObject(header));

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

                        headerCell.style.width = option.columns[i].width.toString() + "px";

                        if (option.columns[i].header != null) {
                            option.columns[i].header.applyTemplate(headerContent);
                        } else {
                            var headerText = option.columns[i].member != null ? option.columns[i].member : "";
                            this.buildDefaultHeader(headerContent, headerText);
                        }

                        // Arrows
                        if (option.enableSorting) {
                            // Method changing sorting
                            (function (i) {
                                headerCell.onclick = (e) => Grid.getGridObject(<HTMLElement>e.target).sortBy(option.columns[i].sortMemberPath);
                            })(i);
                            if (option.sortDescriptor.path == option.columns[i].sortMemberPath && option.columns[i].sortMemberPath != null) {
                                this.addArrows(headerButtons, option, i);
                            }
                        }

                        // Filter
                        this.addFilterButton(option, header, filterPopupContainer, headerButtons, i, false);

                        if (option.columns[i].resizable) {
                            var columnResize = document.createElement("div");
                            columnResize.className = "tgrid-header-column-resize";

                            columnResize.onclick = e => e.stopImmediatePropagation();

                            (function (i, headerCell, columnResize) {
                                var documentMouseMove = null;
                                var position = 0;
                                columnResize.onmousedown = e => {
                                    e.stopImmediatePropagation();
                                    console.log("test");
                                    position = e.screenX;
                                    documentMouseMove = document.onmousemove;
                                    document.onmousemove = m => {
                                        if (position != 0) {
                                            option.columns[i].width = (parseInt(option.columns[i].width) + m.screenX - position).toString();
                                            position = m.screenX;
                                            columnsResized(option.columns[i]);
                                        }
                                    };
                                };

                                document.onmouseup = e => {
                                    document.onmousemove = documentMouseMove;
                                    position = 0;
                                }
                    })(i, headerCell, columnResize);


                            headerButtons.appendChild(columnResize);
                        }

                        head.appendChild(headerCell);
                    }
                }
                var placeholderColumn = document.createElement("th");
                placeholderColumn.classList.add("tgrid-placeholder");
                head.appendChild(placeholderColumn);

                header.appendChild(head);
                ko.applyBindings(option.parentViewModel, head);
            }
        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

            for (var i = 0; i < items.length; i++) {
                this.appendTableElement(option, container, items[i], 0, selected);
            }

            //Hide table on mobile devices
            container.classList.add("desktop");
        }

        public updateTableDetailRow(options: Options, container: HTMLElement, item: ItemViewModel, shouldAddDetails:boolean) {
            var detailRow = container.getElementsByClassName("tgrid-details");
            if (detailRow.length > 0) {
                detailRow[0].parentNode.removeChild(detailRow[0]);
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (ko.contextFor(<HTMLElement>container.children.item(i)).$data.item == item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item)) {
                    targetRow.classList.add("selected");
                }
                else {
                    targetRow.classList.remove("selected");
                }

                if (shouldAddDetails) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildDetailsRow(options, detailsTemplate);
                        insertAfter(targetRow, details);
                        ko.applyBindings(options.showDetailFor, details);
                    }
                }
            }
        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: IFooterViewModel): void {
            //if there isn't footer template in grid
            if (option.tableFooterTemplate == null && option.enablePaging) {
                this.buildDefaultTableFooterElement(option, footer, totalItemsCount);
            } else if (option.tableFooterTemplate != null) {
                var footerContainer = document.createElement("div");
                option.tableFooterTemplate.applyTemplate(footerContainer);
                ko.applyBindings(footerModel, footerContainer);

                footer.appendChild(footerContainer);

            }
        }

        public updateFilteringPopUp(option: Options, filterPopup: HTMLElement, filterPopupModel: IFilterPopupViewModel) {
            if (option.filterPopup == null) {
                this.buildDefaultFilteringPopUp(option, filterPopup);
            } else {
                var filterContainer = document.createElement("div");
                filterContainer.className = "tgrid-filter-popup-container";
                option.filterPopup.applyTemplate(filterContainer);
                filterPopup.innerHTML = "";
                filterPopup.appendChild(filterContainer);
            }
            ko.applyBindings(filterPopupModel, filterPopup);
        }

        private appendTableElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean, isDetailsAdded: boolean) => boolean): void {
            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;

            if (item.isGroupHeader) {
                var groupHeader = this.buildGroupHeaderRow(option, item.item);
                container.appendChild(groupHeader);
                ko.applyBindings(item, groupHeader);
            } else {
                var row = this.buildRowElement(option, item, container, selected);

                container.appendChild(row);
                ko.applyBindings(item, row);
            }
        }


        private buildRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean, isDetailsAdded: boolean) => boolean): HTMLElement {
            var row = document.createElement("tr");
            row.classList.add("table-body-row");

            if (option.isSelected(item.item)) {
                row.classList.add("selected");
            }

            this.appendIndent(row, option.groupBySortDescriptors.length, false);

            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("desktop") != -1) {
                    var cell = document.createElement("td");
                    var cellContent = document.createElement("div");
                    cellContent.className = "tgrid-cell-content";
                    cellContent.style.overflow = "hidden";
                    cell.appendChild(cellContent);

                    if (option.columns[i].cell != null) {
                        option.columns[i].cell.applyTemplate(cellContent);
                    } else {
                        if (option.columns[i].member != null) {
                            this.createDefaultCell(cellContent, option.columns[i].member);
                        }
                    }
                    row.appendChild(cell);
                }
            }

            var placeholderColumn = document.createElement("td");
            placeholderColumn.classList.add("tgrid-placeholder");
           
            row.appendChild(placeholderColumn);

            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        var wasSelected = false;
                        if (option.shouldAddDetailsOnSelection == item.item) {
                            wasSelected = true;
                        }
                        selected(item, e.ctrlKey, wasSelected);

                    }
                };
            })(item);

            return row;
        }

        private buildDetailsRow(option: Options, template: Template): HTMLElement {
            var detailTr = document.createElement("tr");
            var detailTd = document.createElement("td");

            this.appendIndent(detailTr, option.groupBySortDescriptors.length, false);

            detailTr.classList.add("tgrid-details");
            detailTd.setAttribute("colspan", (option.columns.length + 1).toString());

            template.applyTemplate(detailTd)

            detailTr.appendChild(detailTd);

            return detailTr;
        }

        private buildGroupHeaderRow(option: Options, groupHeaderDescriptor: GroupHeaderDescriptor): HTMLElement {

            var headerTr = document.createElement("tr");
            var headerTd = document.createElement("td");

            this.appendIndent(headerTr, groupHeaderDescriptor.level, false);

            var colspan = option.columns.length + 1 + option.groupBySortDescriptors.length - groupHeaderDescriptor.level;
            headerTd.setAttribute("colspan", colspan.toString());
            headerTd.classList.add("tgrid-table-group-header");
            headerTr.classList.add("tgrid-table-group-header");
            if (option.enableCollapsing) {
                if (!groupHeaderDescriptor.collapse) {
                    headerTd.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).setCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                } else {
                    headerTd.onclick = (e) => {
                        TesserisPro.TGrid.Grid.getGridObject(<HTMLElement>e.target).removeCollapsedFilters(groupHeaderDescriptor.filterDescriptor);
                    }
                }
            }
            if (option.groupHeaderTemplate != null) {
                option.groupHeaderTemplate.applyTemplate(headerTd);//(!groupHeaderDescriptor.collapse ? "close" : "open") +
            } else {
                this.createDefaultGroupHeader(headerTd);
            }


            headerTr.appendChild(headerTd);

            return headerTr;
        }

        private addArrows(sortArrowContainer: Node, option: Options, columnNumber: number) {
            if (option.sortDescriptor.asc) {
                var up = document.createElement("div");
                up.classList.add("tgrid-arrow-up");
                sortArrowContainer.appendChild(up);
            }
            if (!option.sortDescriptor.asc) {
                var down = document.createElement("div");
                down.classList.add("tgrid-arrow-down");
                sortArrowContainer.appendChild(down);
            }
            return sortArrowContainer;
        }

        private removeArrows(htmlNode: HTMLElement): void {
            var element = htmlNode.getElementsByClassName("tgrid-arrow-up");
            for (var i = 0; i < element.length; i++) {
                element[i].parentNode.removeChild(element[i]);
                i--;
            }
            var element = htmlNode.getElementsByClassName("tgrid-arrow-down");
            for (var i = 0; i < element.length; i++){
                element[i].parentNode.removeChild(element[i]);
                i--;
            }
        }

        private removeFilterButtons(container: HTMLElement): void {
            var elements = container.getElementsByClassName("tgrid-filter-button");
            for (var i = 0; i < elements.length; i++) {
                elements[i].parentNode.removeChild(elements[i]);
                i--;
            }
            var elements = container.getElementsByClassName("tgrid-filter-button-active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].parentNode.removeChild(elements[i]);
                i--;
            }
        }
               
        // Mobile Methods

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
           
            for (var i = 0; i < items.length; i++) {
                this.appendMobileElement(option, container, items[i], 0, selected);
            }

            //Hide table on mobile devices
            var bodyClass = container.getAttribute("class");
            if (bodyClass == null || bodyClass == undefined || bodyClass == '') {
                bodyClass = "mobile";
            }
            else {
                if (bodyClass.indexOf("mobile") == -1) {
                    bodyClass += " mobile";
                }
            }
            container.setAttribute("class", bodyClass);
        }

        public updateMobileDetailRow(options: Options, container: HTMLElement, item: ItemViewModel, shouldAddDetails: boolean): void {
            
            var detailRow = container.getElementsByClassName("tgrid-mobile-details");
            if (detailRow.length > 0) {
                detailRow[0].parentNode.removeChild(detailRow[0]);
            }

            var targetRow: HTMLElement;

            for (var i = 0; i < container.children.length; i++) {
                if (ko.contextFor(<HTMLElement>container.children.item(i)).$data.item == item) {
                    targetRow = <HTMLElement>container.children.item(i);
                    break;
                }
            }

            if (targetRow != null) {
                if (options.isSelected(item)) {
                    targetRow.classList.add("selected");
                }
                else {
                    targetRow.classList.remove("selected");
                }

                if (shouldAddDetails) {
                    var detailsTemplate = this.getActualDetailsTemplate(options);

                    // Insert row details after selected item
                    if (detailsTemplate != null) {
                        var details = this.buildMobileDetailsRow(options, detailsTemplate);
                        insertAfter(targetRow, details);
                        ko.applyBindings(options.showDetailFor, details);
                    }
                }
            }
        }

        private appendMobileElement(option: Options, container: HTMLElement, item: ItemViewModel, groupLevel: number, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            
            var itemWithDetails: any;
            var rowWithDetail: HTMLElement;
            if (item.isGroupHeader) {
                var mobileGroupHeader = this.buildGroupMobileHeaderRow(option, item.item);
                container.appendChild(mobileGroupHeader);
                ko.applyBindings(item, mobileGroupHeader);
            } else {
                var row = this.buildMobileRowElement(option, item, container, selected);

                container.appendChild(row);
                ko.applyBindings(item, row);
            }
        }

        private buildMobileRowElement(option: Options, item: ItemViewModel, container: HTMLElement, selected: (item: ItemViewModel, multi: boolean) => boolean): HTMLElement {
            var row = document.createElement("div");
            row.classList.add("tgrid-mobile-row");

            if (option.isSelected(item.item)) {
                row.classList.add("selected");
            }

            for (var i = 0; i < option.groupBySortDescriptors.length; i++) {
                row.innerHTML += "<div class='tgrid-mobile-group-indent-div'></div>"
            }

            var rowTemplate = document.createElement("div");
            rowTemplate.classList.add('tgrid-mobile-div');
            if (option.mobileTemplateHtml != null) {
                option.mobileTemplateHtml.applyTemplate(rowTemplate);
            } else {
                rowTemplate = this.createDefaultMobileTemplate(rowTemplate, option);
            }
            row.appendChild(rowTemplate);
                        
            (function (item) {
                row.onclick = function (e) {
                    if (option.selectionMode != SelectionMode.None) {
                        var s = container;
                        selected(item, e.ctrlKey);
                    }
                };
            })(item);

            return row;
        }

        private buildMobileDetailsRow(option: Options, template: Template): HTMLElement {
            var detailDiv = document.createElement("div");
            detailDiv.classList.add("tgrid-mobile-details");
            template.applyTemplate(detailDiv);
            return detailDiv;
        }

        private createDefaultCell(cell: HTMLElement, defaultCellBindingName: string): void {
            var spanForCell = document.createElement("span");
            var textBinding = "text: item.".concat(defaultCellBindingName)
            spanForCell.setAttribute("data-bind", textBinding);
            cell.appendChild(spanForCell);
        }

        public createDefaultGroupHeader(tableRowElement: any) {
            var groupHeaderContainer = document.createElement("div");
            var groupHeaderName = document.createElement("span");
            groupHeaderName.setAttribute("data-bind", "text: item.value");
            groupHeaderContainer.appendChild(groupHeaderName);
            tableRowElement.appendChild(groupHeaderContainer);
        }
        private createDefaultMobileTemplate(rowTemplate: any, option: Options) {
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].device.indexOf("mobile") != -1) {
                    var mobileColumnContainer = document.createElement("div");
                    var mobileColumnName = document.createElement("span");

                    if (option.columns[i].member != null) {
                        mobileColumnName.innerHTML = option.columns[i].member;
                    } else if (option.columns[i].sortMemberPath != null) {
                        mobileColumnName.innerHTML = option.columns[i].sortMemberPath;
                    } else if (option.columns[i].groupMemberPath != null) {
                        mobileColumnName.innerHTML = option.columns[i].groupMemberPath;
                    } else {
                        mobileColumnName.innerHTML = "";
                    }

                    var columnData = document.createElement("span");
                    if (option.columns[i].member != null) {
                        var columnBinding = document.createElement('span');
                        columnBinding.setAttribute("data-bind", 'text: item.'.concat(option.columns[i].member));
                        columnData.innerHTML = ": ";
                        columnData.appendChild(columnBinding);
                    } else {
                        columnData.innerHTML = ": ";
                    }
                    mobileColumnContainer.appendChild(mobileColumnName);
                    mobileColumnContainer.appendChild(columnData);
                    rowTemplate.appendChild(mobileColumnContainer);
                }
            }
            return rowTemplate;
        }

        public bindData(option: Options, elementForBinding: HTMLElement) {
            var viewModel = ko.contextFor(option.target);
            ko.applyBindings(viewModel, elementForBinding);
        }

        private buildDefaultFilteringPopUp(option: Options, filterPopupContainer: HTMLElement) {
            var columnNameContainer = document.createElement("div");
            var columnName = document.createElement("span");
            columnName.setAttribute("data-bind", "text:path");
            columnNameContainer.appendChild(columnName);
            filterPopupContainer.appendChild(columnNameContainer);

            var filterCondition = document.createElement("select");
            // append filter conditions
            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.None.toString();
            selectOption.text = "None";
            filterCondition.appendChild(selectOption);

            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.Equals.toString();
            selectOption.text = "Equals";
            filterCondition.appendChild(selectOption);

            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.NotEquals.toString();
            selectOption.text = "Not equals";
            filterCondition.appendChild(selectOption);
            // end append filter conditions
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
            applyButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onApply();
            };
            (<HTMLElement>applyButton).innerHTML = "OK";
            filterPopupContainer.appendChild(applyButton);


            var clearButton = document.createElement("div");
            clearButton.className = 'tgrid-filter-popup-button';
            clearButton.style.width = '70px';
            clearButton.onclick = (e) => {
                var grid = Grid.getGridObject(<HTMLElement>e.target);
                grid.filterPopupViewModel.onClose();
                filterText.setAttribute("value", "");
            };
            (<HTMLElement>clearButton).innerHTML = 'Cancel';
            filterPopupContainer.appendChild(clearButton);
        }
    }
}