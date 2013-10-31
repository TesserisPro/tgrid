/// <reference path="IHtmlProvider.ts" />
/// <reference path="ItemViewModel.ts" />

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

        public updateTableHeadElement(option: Options, header: HTMLElement, groupByContainer: HTMLElement, isSortable: boolean){

        }

        public updateTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {

        }

        public updateTableFooterElement(option: Options, footer: HTMLElement, totalItemsCount: number): void {
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
                    pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage("+ i +")' >" + (i + 1) + "</span>";
                }
            }

            if (lastVisiblePage < (pageCount - 1)) {
                pagerElement.innerHTML += "<span class='tgird-page-number' onclick='TesserisPro.TGrid.Grid.getGridObject(event.target).selectPage(" + lastVisiblePage.toString() + ")' >...</span>";
            }

            footer.appendChild(pagerElement);
        }
        
        public updateMobileHeadElement(option: Options, header: HTMLElement, isSortable: boolean): void {

        }

        public updateMobileItemsList(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
            
        }

        public updateGroupedTableBodyElement(option: Options, container: HTMLElement, items: Array<ItemViewModel>, selected: (item: ItemViewModel, multi: boolean) => boolean): void {
                
        }

        public updateGroupByElements(option: Options, header: HTMLElement, groupByContainer: HTMLElement) {           
            this.showGroupByElements(option, groupByContainer, Grid.getGridObject(header));

            var listButtonContainer = groupByContainer.getElementsByClassName("list-button-container");
            (<HTMLElement>listButtonContainer[0]).appendChild(this.showListGroupByItems(option, <HTMLUListElement>((<HTMLElement>listButtonContainer[0]).children[1]), Grid.getGridObject(header))); 
        }

        public addGroupBy(option: Options, header: HTMLElement, groupByContainer: HTMLElement) {  
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

        private addGroupByElements(option: Options, groupByContainer: HTMLElement) {
            for (var i = 0; i < option.columns.length; i++) {
                var groupByHeaderElement = document.createElement("div");
                option.columns[i].header.applyTemplate(groupByHeaderElement);

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
                    Grid.getGridObject(<HTMLElement>e.target).deleteGroupBy(groupByElement.column, groupByElement.asc);
                }

                groupByHeaderElement.appendChild(deleteGroupByElement);
                groupByContainer.appendChild(groupByHeaderElement);
            }
        }

        private showGroupByElements(option: Options, groupByContainer: HTMLElement, grid: TGrid.Grid) {
            var groupByElements = groupByContainer.getElementsByClassName("condition-group-by");

            for (var j = 0; j < groupByElements.length; j++) {
                grid.hideElement(<Element>groupByElements[j]);
            }

            for (var i = option.groupBySortDescriptor.length - 1; i > -1; i--) {
                for (var j = 0; j < groupByElements.length; j++) {
                    if (groupByElements[j]["data-group-by"] == option.groupBySortDescriptor[i].column) {
                        grid.showDivElement(<Element>groupByElements[j]);
                        groupByContainer.insertBefore(groupByElements[j], groupByContainer.firstChild);
                        continue;
                    }
                }
            }
        }

        private addListGroupByItems( option: Options, listGroupByElement: HTMLUListElement) {
            for (var i = 0; i < option.columns.length; i++) {
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

                option.columns[i].header.applyTemplate(listItemGroupByItems);
                listItemGroupByItems["data-group-by-condition"] = option.columns[i].groupMemberPath;
                listGroupByElement.appendChild(listItemGroupByItems);
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
                    if (option.groupBySortDescriptor[j].column == listGroupByItems[i]["data-group-by-condition"]) {
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