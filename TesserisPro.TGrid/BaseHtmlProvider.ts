/// <reference path="IHtmlProvider.ts" />
/// <reference path="ItemViewModel.ts" />
/// <reference path="FooterViewModel.ts"/>


module TesserisPro.TGrid {

    export class BaseHtmlProvider implements IHtmlProvider {

        public getTableElement(option: Options): HTMLElement {
            var table = document.createElement("table");
            table.className = "tgrid-table";
            return table;
        }

        public getElemntsSize(container: HTMLElement, items: Array<ItemViewModel>): number {
            return 0;
        }

        public getFirstVisibleItem(container: HTMLElement, items: Array<ItemViewModel>, scrollTop: number): ItemViewModel {
            return null;
        }

        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, isSortable: boolean){

        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number, footerModel: FooterViewModel) {
        }

        public updateTableFooterElementDefault(option: Options, footer: HTMLElement, totalItemsCount: number): void {
            var firstVisiblePage = option.currentPage - option.pageSlide;

            if (firstVisiblePage < 0) {
                firstVisiblePage = 0;
            }

            var lastVisiblePage = option.currentPage + option.pageSlide;
            var pageCount = Math.ceil(totalItemsCount / option.pageSize);

            if (lastVisiblePage >= pageCount) {
                lastVisiblePage = pageCount - 1;
            }

            var pagerElement = document.createElement("div");
            pagerElement.setAttribute("class", "tgird-pagination");

            if (firstVisiblePage > 0) {
                pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + (firstVisiblePage - 1).toString() + ")' >...</span>";
            }

            for (var i = firstVisiblePage; i <= lastVisiblePage; i++) {
                if (option.currentPage == i) {
                    pagerElement.innerHTML += "<span class='tgird-page-current'>" + (i + 1) + "</span>";
                }
                else {
                    pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + i + ")' >" + (i + 1) + "</span>";
                }
            }

            if (lastVisiblePage < (pageCount - 1)) {
                pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>";
            }
            footer.innerHTML = "";
            footer.appendChild(pagerElement);
        }
        
        public updateMobileHeadElement(option: Options, header: HTMLElement, isSortable: boolean): void {

        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            
        }

        public updateGroupedTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
                
        }

        public hasDetails(selectedElement: NodeList, option: Options) {
            if (selectedElement != null && selectedElement.length == 1) {
                if (option.showDetailFor.column == -1) {
                    if (option.detailsTemplateHtml != null) {
                        return true;
                    }
                } else if (option.columns[option.showDetailFor.column].cellDetail != null) {
                    return true;
                }
            }
            return false;
        }
             
        
        public updateTableDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void {
           
        }


        public updateMobileDetailRow(option: Options, container: HTMLElement, item: ItemViewModel): void {

        }

        public createDefaultHeader(headerCell: any, headerName: string) {
            var defaultHeader = document.createElement("span");
            var defaultName = document.createTextNode(headerName);
            defaultHeader.appendChild(defaultName);
            headerCell.appendChild(defaultHeader);
            return headerCell;
        }

        public addGroupBy(option: Options, header: HTMLElement, groupByContainer: HTMLElement) {
            if (option.isEnableGrouping) {
                Grid.getGridObject(groupByContainer).showDivElement(groupByContainer);
                this.addGroupByElements(option, groupByContainer);
                this.showGroupByElements(option, groupByContainer, Grid.getGridObject(header))

            var listButtonContainerElement = document.createElement("div");
                listButtonContainerElement.setAttribute("class", "list-button-container");
                var listGroupByElement = document.createElement("ul");
                listGroupByElement.setAttribute("class", "group-by-ul");
                var groupByButtonElement = document.createElement("a");
                groupByButtonElement.setAttribute("class", "button-group-by");

                groupByButtonElement.onclick = (e) => {
                    Grid.getGridObject(<HTMLElement>e.target).showHideListOnClick((<HTMLElement>e.target).nextElementSibling);
                }
            listButtonContainerElement.appendChild(groupByButtonElement);

                var listGroupByToChooseFrom = this.addListGroupByItems(option, listGroupByElement);
                this.showListGroupByItems(option, listGroupByToChooseFrom, Grid.getGridObject(header));

                listButtonContainerElement.appendChild(listGroupByElement);
                groupByContainer.appendChild(listButtonContainerElement);
            } else {
                Grid.getGridObject(groupByContainer).hideElement(groupByContainer);
            }
        }

        public showNeededIntends(target: HTMLElement, level: number, grid: TGrid.Grid) {
            var visibleIntentsNumber = level;
            var cells = target.getElementsByClassName("tgrid-table-indent-cell");

            for (var i = 0; i < cells.length; i++) {
                grid.hideElement(<Element>cells[i]);
            }
            //check that number of existing intent-cells is not more than number of needed intent-cells
            if (cells.length < level) {
                visibleIntentsNumber = cells.length;
            }

            for (var i = 0; i < visibleIntentsNumber; i++) {
                grid.showTableCellElement(<Element>cells[i]);
            }
        }

        public addFiltringPopUp(option: Options, filterPopupContainer: HTMLElement, filterPopupViewModel: FilterPopupViewModel) {

        }

        public defaultFiltringPopUp(option: Options, filterPopupContainer: HTMLElement) {
            var filterCondition = document.createElement("select");
            // append filter conditions
            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.None.toString();
            selectOption.text = "none";
            filterCondition.appendChild(selectOption);

            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.Equals.toString();
            selectOption.text = "=";
            filterCondition.appendChild(selectOption);

            var selectOption = document.createElement("option");
            selectOption.value = FilterCondition.NotEquals.toString();
            selectOption.text = "<>";
            filterCondition.appendChild(selectOption);
            // end append filter conditions
            filterPopupContainer.appendChild(filterCondition);
            filterCondition.selectedIndex = 1;

            filterPopupContainer.innerHTML += "<br>";

            var filterText = document.createElement("input");
            filterText.setAttribute("value", "c3");
            filterPopupContainer.appendChild(filterText);

            filterPopupContainer.innerHTML += "<br>";

            var applyButton = document.createElement("button");
            applyButton.innerText = "apply";
            applyButton.onclick = (e) => {
                Grid.getGridObject(<HTMLElement>e.target).addFilter(option.filterPath,
                    filterPopupContainer.getElementsByTagName("input")[0].value,
                    <FilterCondition>filterPopupContainer.getElementsByTagName("select")[0].selectedIndex,
                    filterPopupContainer);
            };
            filterPopupContainer.appendChild(applyButton);

            var clearButton = document.createElement("button");
            clearButton.innerText = "clear";
            clearButton.onclick = (e) => {
                Grid.getGridObject(<HTMLElement>e.target).clearFilter(option.filterPath, filterPopupContainer);
            };
            filterPopupContainer.appendChild(clearButton);

            var exitButton = document.createElement("button");
            exitButton.innerText = "exit";
            exitButton.onclick = (e) => {
                Grid.getGridObject(<HTMLElement>e.target).hideElement(<Element>filterPopupContainer);
            };
            filterPopupContainer.appendChild(exitButton);
        }        

        private addGroupByElements(option: Options, groupByContainer: HTMLElement) {
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].groupMemberPath != null) {
                    var groupByHeaderElement = document.createElement("div");
                    if (option.columns[i].header != null) {
                        option.columns[i].header.applyTemplate(groupByHeaderElement);
                    } else {
                        var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                        groupByHeaderElement = this.createDefaultHeader(groupByHeaderElement, headerText);
                    }

                    groupByHeaderElement.setAttribute("class", "condition-group-by");
                    groupByHeaderElement["data-group-by"] = option.columns[i].groupMemberPath;

                    //create deleteGroupByElement
                    var deleteGroupByElement = document.createElement("input");
                    deleteGroupByElement.setAttribute("type", "button");
                    deleteGroupByElement.setAttribute("class", "delete-condition-group-by");
                    deleteGroupByElement.setAttribute("value", "x");
                    deleteGroupByElement["data-delete-groupby"] = new SortDescriptor(option.columns[i].groupMemberPath, true);

                    //adding function to delete GroupBy condition by clicking on close button
                    deleteGroupByElement.onclick = (e) => {
                        var groupByElement = <SortDescriptor>e.target["data-delete-groupby"];
                        Grid.getGridObject(<HTMLElement>e.target).deleteGroupBy(groupByElement.path, groupByElement.asc);
                    }

                    groupByHeaderElement.appendChild(deleteGroupByElement);
                    groupByContainer.appendChild(groupByHeaderElement);
                }
            }
        }

        public updateGroupByElements(option: Options, header: HTMLElement, groupByContainer: HTMLElement) {
            if (option.isEnableGrouping) {
                this.showGroupByElements(option, groupByContainer, Grid.getGridObject(header));

                var listButtonContainer = groupByContainer.getElementsByClassName("list-button-container");
                (<HTMLElement>listButtonContainer[0]).appendChild(this.showListGroupByItems(option, <HTMLUListElement>((<HTMLElement>listButtonContainer[0]).children[1]), Grid.getGridObject(header)));
            } else {
                Grid.getGridObject(groupByContainer).hideElement(groupByContainer);
            }
        }

        public createDefaultMobileTemplate(rowTemplate: any, option: Options) {
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
                    columnData.innerHTML = ": ";
                    mobileColumnContainer.appendChild(mobileColumnName);
                    mobileColumnContainer.appendChild(columnData);
                    rowTemplate.appendChild(mobileColumnContainer);
                }
            }
            return rowTemplate;
        }
        
        private showGroupByElements(option: Options, groupByContainer: HTMLElement, grid: TGrid.Grid) {
            var groupByElements = groupByContainer.getElementsByClassName("condition-group-by");

            for (var j = 0; j < groupByElements.length; j++) {
                grid.hideElement(<Element>groupByElements[j]);
            }

            for (var i = option.groupBySortDescriptor.length - 1; i > -1; i--) {
                for (var j = 0; j < groupByElements.length; j++) {
                    if (groupByElements[j]["data-group-by"] == option.groupBySortDescriptor[i].path) {
                        grid.showDivElement(<Element>groupByElements[j]);
                        groupByContainer.insertBefore(groupByElements[j], groupByContainer.firstChild);
                        continue;
                    }
                }
            }
        }

        private addListGroupByItems(option: Options, listGroupByElement: HTMLUListElement) {
            for (var i = 0; i < option.columns.length; i++) {
                if (option.columns[i].groupMemberPath != null) {
                    var listItemGroupByItems = document.createElement("li");

                    listItemGroupByItems.onclick = (e) => {
                        //get top ancestor, because event fires on the last nested element
                        var el = <Node>e.target;
                        while (el && el.nodeName !== 'LI') {
                            el = el.parentNode
                            }
                        Grid.getGridObject(<HTMLElement>e.target).addGroupBy((<string>el["data-group-by-condition"]), true);
                        Grid.getGridObject(<HTMLElement>e.target).hideElement(<Element>el.parentNode);
                    }
                    if (option.columns[i].header != null) {
                        option.columns[i].header.applyTemplate(listItemGroupByItems);
                    } else {
                        var headerText = option.columns[i].member != null ? option.columns[i].member : option.columns[i].groupMemberPath;
                        listItemGroupByItems = this.createDefaultHeader(listItemGroupByItems, headerText);
                    }
                    listItemGroupByItems["data-group-by-condition"] = option.columns[i].groupMemberPath;
                    listGroupByElement.appendChild(listItemGroupByItems);
                }
            }

            return listGroupByElement;
        }

        private showListGroupByItems(option: Options, listGroupByElement: HTMLUListElement, grid: TGrid.Grid) {
            var listGroupByItems = listGroupByElement.getElementsByTagName("li");

            for (var i = 0; i < listGroupByItems.length; i++) {
                if (listGroupByItems[i].getAttribute("style") == "display:block;") {
                    grid.hideElement(<Element>listGroupByItems[i]);
                }
                var hasNotGroupBy = true;
                for (var j = 0; j < option.groupBySortDescriptor.length; j++) {
                    if (option.groupBySortDescriptor[j].path == listGroupByItems[i]["data-group-by-condition"]) {
                        hasNotGroupBy = false;
                        continue;
                    }
                }
                if (hasNotGroupBy) {
                    grid.showDivElement(<Element>listGroupByItems[i]);
                }
            }
            return listGroupByElement;
        }
    }
}