declare module TesserisPro.TGrid {
    class SortDescriptor {
        constructor(path: string, asc: boolean);
        public path: string;
        public asc: boolean;
    }
}
declare module TesserisPro.TGrid {
    class FilterDescriptor {
        public path: string;
        public value: string;
        public condition: TGrid.FilterCondition;
        public children: FilterDescriptor[];
        public parentChildUnionOperator: TGrid.LogicalOperator;
        public childrenUnionOperator: TGrid.LogicalOperator;
        constructor(path: string, values: string, condition: TGrid.FilterCondition, parentChildOperator?: TGrid.LogicalOperator, childOperator?: TGrid.LogicalOperator, children?: FilterDescriptor[]);
        public addChild(filter: FilterDescriptor): void;
        public removeChildByPath(path: string): void;
        static getEmpty(): FilterDescriptor;
    }
}
declare module TesserisPro.TGrid {
    enum Framework {
        Knockout = 0,
        Angular = 1,
    }
    enum SelectionMode {
        None = 0,
        Single = 1,
        Multi = 2,
    }
    enum FilterCondition {
        None = 0,
        Equals = 1,
        NotEquals = 2,
    }
    enum LogicalOperator {
        And = 0,
        Or = 1,
    }
    class ColumnInfo {
        public header: Template;
        public cell: Template;
        public cellDetail: Template;
        public width: string;
        public device: string;
        public sortMemberPath: string;
        public groupMemberPath: string;
        public member: string;
        public resizable: boolean;
        public filterMemberPath: string;
        public notSized: boolean;
    }
    class ShowDetail {
        public item: any;
        public column: number;
        constructor();
    }
    class Template {
        private content;
        constructor(prototype: HTMLElement);
        public applyTemplate(element: HTMLElement): void;
        public getContent(): string;
    }
    class Options {
        public columns: ColumnInfo[];
        public enableVirtualScroll: boolean;
        public enablePaging: boolean;
        public enableCollapsing: boolean;
        public enableSorting: boolean;
        public enableGrouping: boolean;
        public enableFiltering: boolean;
        public filterPath: string;
        public mobileTemplateHtml: Template;
        public detailsTemplateHtml: Template;
        public groupHeaderTemplate: Template;
        public filterPopup: Template;
        public framework: Framework;
        public target: HTMLElement;
        public pageSize: number;
        public pageSlide: number;
        public batchSize: number;
        public firstLoadSize: number;
        public currentPage: number;
        public sortDescriptor: TGrid.SortDescriptor;
        public groupBySortDescriptors: TGrid.SortDescriptor[];
        public selectionMode: SelectionMode;
        public openDetailsOnSelection: boolean;
        public filterDescriptor: TGrid.FilterDescriptor;
        public tableFooterTemplate: Template;
        public showDetailFor: ShowDetail;
        public selection: any[];
        public shouldAddDetailsOnSelection: boolean;
        public showCustomDetailFor: ShowDetail;
        public parentViewModel: any;
        public filterPopupForColumn: ColumnInfo;
        public columnMinWidth: number;
        public apply: () => void;
        public hasAnyNotSizedColumn: boolean;
        public rowClick: string;
        constructor(element: HTMLElement, framework: Framework);
        public isSelected(item: any): boolean;
        private initialize();
        public applyHandler();
    }
}
declare module TGrid.Angular {
    function Directive(): any;
    function registerTGrid(appModule: any): void;
}
declare module TesserisPro.TGrid {
    class ItemViewModel {
        public model: any;
        public item: any;
        public grid: any;
        public isGroupHeader: boolean;
        constructor(model: any, item: any, grid: any, isGroupHeader: boolean);
        public toggleDetailsForCell(columnIndex: any): void;
        public openDetailsForCell(columnIndex: any): void;
        public closeDetailsForCell(columnIndex: any): void;
        public setItemValue(item: any): void;
    }
}
declare module TesserisPro.TGrid {
    interface IFooterViewModel {
        setTotalCount(totalCount: number): any;
        setSelectedItem(selectedItem: any): any;
        setCurrentPage(currentPage: number): any;
        setTotalPages(totalPages: number): any;
        changePage(pageNumber: string): any;
        goToPreviousPagesBlock(): any;
        goToNextPagesBlock(): any;
        goToFirstPage(): any;
        goToLastPage(): any;
    }
}
declare module TesserisPro.TGrid {
    interface IHtmlProvider {
        getElementsSize(container: HTMLElement, items: any[]): number;
        getFirstVisibleItem(container: HTMLElement, items: TGrid.ItemViewModel[], scrollTop: number): TGrid.ItemViewModel;
        getVisibleItemsCount(container: HTMLElement, view: HTMLElement, items: TGrid.ItemViewModel[], scrollTop: number): number;
        getFooterViewModel(grid: any): any;
        getFilterPopupViewModel(container: HTMLElement): any;
        getTableElement(option: TGrid.Options): HTMLElement;
        updateTableHeadElement(option: TGrid.Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: TGrid.ColumnInfo) => void): any;
        updateTableBodyElement(option: TGrid.Options, body: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): HTMLElement;
        updateTableFooterElement(option: TGrid.Options, footer: HTMLElement, totalItemsCount: number, footerModel: TGrid.IFooterViewModel): void;
        updateMobileItemsList(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): void;
        updateMobileHeadElement(option: TGrid.Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement): void;
        updateTableDetailRow(option: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, shouldAddDetails: boolean): void;
        updateMobileDetailRow(option: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, shouldAddDetails: boolean): void;
        updateFilteringPopUp(option: TGrid.Options, filterPopupContainer: HTMLElement, filterPopupModel: TGrid.IFilterPopupViewModel): void;
        updateColumnWidth(option: TGrid.Options, header: HTMLElement, body: HTMLElement, footer: HTMLElement): void;
    }
}
declare module TesserisPro.TGrid {
    interface IFilterPopupViewModel {
        onOpen(options: TGrid.Options, column: TGrid.ColumnInfo): any;
        onApply(): any;
        onClear(): any;
        onClose(): any;
        getColumnInfo(): TGrid.ColumnInfo;
        onCloseFilterPopup(): any;
    }
}
declare module TesserisPro.TGrid {
    class BaseHtmlProvider implements TGrid.IHtmlProvider {
        static oldOnClick: (ev: MouseEvent) => any;
        public getTableElement(option: TGrid.Options): HTMLElement;
        public bindData(option: TGrid.Options, elementForBinding: HTMLElement): void;
        public getElementsSize(container: HTMLElement, items: TGrid.ItemViewModel[]): number;
        public getFirstVisibleItem(container: HTMLElement, items: TGrid.ItemViewModel[], scrollTop: number): TGrid.ItemViewModel;
        public getVisibleItemsCount(container: HTMLElement, view: HTMLElement, items: TGrid.ItemViewModel[], scrollTop: number): number;
        public getFooterViewModel(grid: any): void;
        public getFilterPopupViewModel(container: HTMLElement): void;
        public updateTableHeadElement(option: TGrid.Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: TGrid.ColumnInfo) => void): void;
        public updateTableBodyElement(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): HTMLElement;
        public updateTableFooterElement(option: TGrid.Options, footer: HTMLElement, totalItemsCount: number, footerModel: TGrid.IFooterViewModel): void;
        public updateGroupedTableBodyElement(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): void;
        public updateColumnWidth(option: TGrid.Options, header: HTMLElement, body: HTMLElement, footer: HTMLElement): void;
        public buildDefaultTableFooterElement(option: TGrid.Options, footer: HTMLElement, totalItemsCount: number): void;
        public getActualDetailsTemplate(option: TGrid.Options): TGrid.Template;
        public updateTableDetailRow(option: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, shouldAddDetails: boolean): void;
        public updateMobileDetailRow(option: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, shouldAddDetails: boolean): void;
        public buildDefaultHeader(container: HTMLElement, headerName: string): void;
        public onCloseFilterPopup(): void;
        public updateGroupByPanel(option: TGrid.Options, groupByPanel: HTMLElement): void;
        public showNeededIndents(target: HTMLElement, level: number, grid: TGrid.Grid): void;
        public updateFilteringPopUp(option: TGrid.Options, filterPopup: HTMLElement, filterPopupModel: TGrid.IFilterPopupViewModel): void;
        private addActualGroupByElements(option, groupByContainer);
        private updateGroupByMenuContent(option, menu);
        public buildGroupMobileHeaderRow(option: TGrid.Options, groupHeaderDescriptor: TGrid.GroupHeaderDescriptor): HTMLElement;
        public bindMobileGroupHeader(headerContainer: HTMLElement, item: any, headerDiv: HTMLElement): void;
        public createDefaultGroupHeader(tableRowElement: any): void;
        public addFilterButton(option: TGrid.Options, header: HTMLElement, filterPopupContainer: HTMLElement, headerButtons: HTMLElement, culumnNumber: number): void;
        public updateMobileHeadElement(option: TGrid.Options, mobileHeader: HTMLElement, filterPopupContainer: HTMLElement): void;
        public updateMobileItemsList(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): void;
        public createMobileButton(option: TGrid.Options, mobileHeader: HTMLElement, filterPopUp: HTMLElement): void;
        private addMobileMenuItems(option, menu, filterPopUp);
        public doOnClickOutside(target: HTMLElement, action: () => void): void;
        public appendIndent(target: HTMLElement, level: number, isHeader: boolean): void;
        private buildColumnHeader(column);
        private buildMobileMenuColumnHeader(column);
        private anyConditionIsApplied(options);
        private detachDocumentClickEvent();
    }
}
declare module TesserisPro.TGrid {
    interface IItemProvider {
        onAdd: () => void;
        onRemove: () => void;
        onAddArray: () => void;
        onClear: () => void;
        getItems(skip: number, take: number, sort: TGrid.SortDescriptor[], filter: TGrid.FilterDescriptor, collapsedGroupFilters: TGrid.FilterDescriptor[], callback: (items: any[], firstItem: number, itemsNumber: number) => void): void;
        getTotalItemsCount(filter: TGrid.FilterDescriptor, callback: (total: number) => void): void;
        removeItem(item: any): any;
        addItem(item: any): any;
        getFirstItem(): any;
        addArray(array: Array<any>): void;
        clear(): void;
    }
}

declare module TesserisPro.TGrid {
    class KnockoutHtmlProvider extends TGrid.BaseHtmlProvider {
        public getTableElement(option: TGrid.Options): HTMLElement;
        public getElementsSize(container: HTMLElement, items: TGrid.ItemViewModel[]): number;
        public getFirstVisibleItem(container: HTMLElement, items: TGrid.ItemViewModel[], scrollTop: number): TGrid.ItemViewModel;
        public getFooterViewModel(grid: any);
        public getFilterPopupViewModel(container: HTMLElement)
        public updateTableHeadElement(option: TGrid.Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: TGrid.ColumnInfo) => void): HTMLElement;
        public updateTableBodyElement(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): HTMLElement;
        public updateTableDetailRow(options: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, shouldAddDetails: boolean): void;
        public updateTableFooterElement(option: TGrid.Options, footer: HTMLElement, totalItemsCount: number, footerModel: TGrid.IFooterViewModel): void;
        public updateFilteringPopUp(option: TGrid.Options, filterPopup: HTMLElement, filterPopupModel: TGrid.IFilterPopupViewModel): void;
        private appendTableElement(option, container, item, groupLevel, selected);
        private buildRowElement(option, item, container, selected);
        private buildDetailsRow(option, template);
        private buildGroupHeaderRow(option, groupHeaderDescriptor);
        private addArrows(sortArrowContainer, option, columnNumber);
        private removeArrows(htmlNode);
        private removeFilterButtons(container);
        public updateMobileItemsList(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): void;
        public updateMobileDetailRow(options: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, shouldAddDetails: boolean): void;
        private appendMobileElement(option, container, item, groupLevel, selected);
        private buildMobileRowElement(option, item, container, selected);
        private buildMobileDetailsRow(option, template);
        private createDefaultCell(cell, defaultCellBindingName);
        public createDefaultGroupHeader(tableRowElement: any): void;
        private createDefaultMobileTemplate(rowTemplate, option);
        public bindData(option: TGrid.Options, elementForBinding: HTMLElement): void;
        private buildDefaultFilteringPopUp(option, filterPopupContainer);
    }
}
declare module TesserisPro.TGrid {
    class AngularFilterPopupViewModel implements TGrid.IFilterPopupViewModel {
        private $scope;
        public container: HTMLElement;
        public path: string;
        public value: string;
        public condition: TGrid.FilterCondition;
        public columnInfo: TGrid.ColumnInfo;
        public angularModuleName: string;
        public setScope(scope: any): void;
        constructor(container: HTMLElement, onCloseFilterPopup: () => void);
        public onCloseFilterPopup(): void;
        public onApply(): void;
        public onClear(): void;
        public onClose(): void;
        public onOpen(options: TGrid.Options, column: TGrid.ColumnInfo): void;
        public getColumnInfo(): TGrid.ColumnInfo;
    }
}
declare module TesserisPro.TGrid {
    class AngularItemViewModel extends TGrid.ItemViewModel {
        private $scope;
        public angularControllerName: string;
        public setScope(scope: any): void;
    }
}
declare module TesserisPro.TGrid {
    class AngularItemsViewModel {
        private $scope;
        private items;
        private options;
        private selected;

        public angularControllerName: string;

        constructor(items: Array<any>, options: Options, selected: (item: ItemViewModel, multi: boolean) => boolean);
        public setScope(scope: any): void;
    }
}
declare module TesserisPro.TGrid {
    class GroupHeaderDescriptor {
        public value: string;
        public level: number;
        public collapse: boolean;
        public filterDescriptor: TGrid.FilterDescriptor;
        constructor(value: string, level: number, collapse: boolean, filterDescriptor: TGrid.FilterDescriptor);
    }
}
declare module TesserisPro.TGrid {
    class Grid {
        private parentElement;
        private targetElement;
        private rootElement;
        private headerContainer;
        private tableBody;
        private tableBodyContainer;
        private tableFooter;
        private tableHeader;
        private mobileContainer;
        private mobileHeader;
        private buisyIndicator;
        private scrollBar;
        private groupByElement;
        private filterPopUp;
        private bodyAndHeaderContainer;
        private htmlProvider;
        private itemProvider;
        public filterPopupViewModel: TGrid.IFilterPopupViewModel;
        public options: TGrid.Options;
        private firstVisibleItemIndex;
        private totalItemsCount;
        private previousPage;
        private nextPage;
        private visibleItems;
        private visibleViewModels;
        private isPreloadingNext;
        private isPreloadingPrevious;
        private footerViewModel;
        private collapsedGroupFilterDescriptors;
        private enablePreload;
        private manualScrollTimeoutToken;
        private isBuisy;
        constructor(element: HTMLElement, options: TGrid.Options, provider: TGrid.IItemProvider);
        static getGridObject(element: HTMLElement): Grid;
        public columnsResized(c: TGrid.ColumnInfo): void;
        private mouseWheel(e);
        private keyPress(e);
        private selectNextItem();
        private selectPreviousItem();
        private getPreviousPageFirsItemIndex();
        private isDesktopMode();
        private getPreviousPageSize();
        private getNextPageFirstItemIndex();
        private getNextPageSize();
        private getEffectiveSorting();
        private getEffectiveFiltering();
        private getCollapsedGroupFilter();
        public scrollTable(): void;
        private updateGlobalScroll();
        private updateGlobalScrollMobile();
        private onManualScroll();
        private preloadPreviousPage();
        private preloadNextPage();
        private showPreviousPage();
        private showNextPage();
        private scrollTableContainer(scrollTop);
        private silentScrollTableContainer(scrollTop);
        public addGroupDescriptor(name: string, asc: boolean): void;
        public toggleGroupDescriptor(name: string): void;
        public removeGroupDescriptor(path: string): void;
        public showFilterPopup(column: TGrid.ColumnInfo, pageX: number, pageY: number, isForDesktop: boolean): void;
        public hideFilterPopup(): void;
        public sortBy(name: string): void;
        public mobileSortBy(name: string, asc: boolean): void;
        public selectPage(page: number): void;
        public selectItem(item: TGrid.ItemViewModel, multi: boolean): boolean;
        public scrollIntoView(item: any): void;
        public updateRow(item: any, shouldAddDetails: boolean): void;
        private buildViewModels(items);
        private isEqualOrDeeperThanCollapsedFilter(collapsedFilter, filter);
        private isGroupCollapsedOrInsideCollapsed(filterDescriptor);
        private updateVisibleItems();
        private getHtmlProvider(options);
        private getFirstItemNumber();
        private getPageSize();
        private refreshHeader();
        public updateBody(): void;
        private refreshBody(withBuisy?);
        private refreshFooter();
        private updateFooterViewModel();
        private showBuisyIndicator();
        private hideBuisyIndicator();
        public setCollapsedFilters(filterDescriptor: TGrid.FilterDescriptor): void;
        public removeCollapsedFilters(filterDescriptor: TGrid.FilterDescriptor): void;
        public applyFilters(): void;
        private refreshMobileHeader();
        public afterOptionsChange(): void;
        public setColumnsFromItemsProvider(): void;
    }
}
declare module TesserisPro.TGrid {
    class AngularFooterViewModel implements TGrid.IFooterViewModel {
        private $scope;
        private totalCount;
        private selectedItem;
        private currentPage;
        private totalPages;
        private grid;
        public angularModuleName: string;
        constructor(grid: TGrid.Grid);
        public setScope(scope: any): void;
        public setTotalCount(totalCount: number): void;
        public setSelectedItem(selectedItem: any): void;
        public setCurrentPage(currentPage: number): void;
        public setTotalPages(totalPages: number): void;
        public changePage(viewPageNumber: string): void;
        public apply(): void;
        public goToPreviousPagesBlock(): void;
        public goToNextPagesBlock(): void;
        public goToFirstPage(): void;
        public goToLastPage(): void;
    }
}
declare module TesserisPro.TGrid {
    class AngularHtmlProvider extends TGrid.BaseHtmlProvider {
        public getElementsSize(container: HTMLElement, items: TGrid.ItemViewModel[]): number;
        public getFirstVisibleItem(container: HTMLElement, items: TGrid.ItemViewModel[], scrollTop: number): TGrid.ItemViewModel;
        public getTableElement(option: TGrid.Options): HTMLElement;
        static moduleFooterCounter: number;
        public getFooterViewModel(grid: any): TGrid.AngularFooterViewModel;
        public getFilterPopupViewModel(container: HTMLElement): TGrid.AngularFilterPopupViewModel;
        public updateTableHeadElement(option: TGrid.Options, header: HTMLElement, groupByContainer: HTMLElement, filterPopupContainer: HTMLElement, columnsResized: (c: TGrid.ColumnInfo) => void): void;
        public updateTableBodyElement(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): HTMLElement;
        private appendTableElement(option, container, items, groupLevel, selected, row);
        private buildRowElement(option, item, container, selected, row);
        private buildGroupHeaderRow(option, groupHeaderDescriptor, groupHeaderTr);
        private buildDetailsRow(option);
        public updateTableDetailRow(options: TGrid.Options, container: HTMLElement, item: TGrid.ItemViewModel, isDetailsAdded: boolean): void;
        public updateTableFooterElement(option: TGrid.Options, footer: HTMLElement, totalItemsCount: number, footerModel: TGrid.IFooterViewModel): void;
        public updateFilteringPopUp(option: TGrid.Options, filterPopup: HTMLElement, filterPopupModel: TGrid.IFilterPopupViewModel): void;
        private addArrows(sortArrowContainer, option, columnNumber);
        private removeArrows(htmlNode);
        private removeFilterButtons(container);
        public updateMobileItemsList(option: TGrid.Options, container: HTMLElement, items: TGrid.ItemViewModel[], selected: (item: TGrid.ItemViewModel, multi: boolean) => boolean): void;
        private appendMobileTableElement(option, container, item, groupLevel, selected);
        private buildMobileGroupHeaderRow(option, item, mobileRow);
        private appendIndentMobileGroupHeader(target, level);
        private buildMobileRowElement(option, item, container, selected, mobileRow);
        private appendIndentMobileRow(target, level);
        private buildMobileDetailsRow(option);
        public createDefaultGroupHeader(tableRowElement: any): any;
        private createDefaultCell(cell, defaultCellBindingName);
        private createDefaultMobileTemplate(rowTemplate, option);
        private buildDefaultFilteringPopUp(option, filterPopupContainer);
        private appendIndentRow(target, level);
        private appendIndentGroupHeader(target, level);

    }
}
declare module TesserisPro.TGrid {
    class ArrayItemsProvider implements TGrid.IItemProvider {
        private sourceItems;
        public onAdd: () => void;
        public onRemove: () => void;
        public onAddArray: () => void;
        public onClear: () => void;
        constructor(items: any[]);
        public getItems(firstItem: number, itemsNumber: number, sortDescriptors: TGrid.SortDescriptor[], filterDescriptor: TGrid.FilterDescriptor, collapsedFilterDescriptors: TGrid.FilterDescriptor[], callback: (items: any[], firstItem: number, itemsNumber: number) => void): void;
        public getTotalItemsCount(filterDescriptor: TGrid.FilterDescriptor, callback: (total: number) => void): void;
        public addItem(item: any): void;
        public removeItem(item: any): void;
        public getFirstItem(): any;
        public addArray(array: Array<any>): void;
        public clear(): void;
        private sort(items, sortDescriptors);
        private compareRecursive(a, b, sortDescriptors, i);
        private sortingOrder(sortDescriptor);
        private sortingOrderDesc(sortDescriptor);
        private filter(items, filterDescriptor, collapsedFilterDescriptors);
        private isFilterSatisfied(item, filterDescriptor);
        private isChildFiltersSatisfied(item, filterDescriptor);
        private isFilterConditionSatisfied(item, value, condition);
    }
}
declare module TesserisPro.TGrid {
    class ServerItemsProvider implements TGrid.IItemProvider {
        private urlGetItems;
        private urlGetTotalNumber;
        private items;
        private path;
        public onAdd: () => void;
        public onRemove: () => void;
        public onAddArray: () => void;
        public onClear: () => void;
        constructor(urlGetItems: string, urlGetTotalNumber: string, path: string);
        public getItems(firstItem: number, itemsNumber: number, sortDescriptors: TGrid.SortDescriptor[], filterDescriptors: TGrid.FilterDescriptor, collapsedFilterDescriptors: TGrid.FilterDescriptor[], callback: (items: any[], firstItem: number, itemsNumber: number) => void): void;
        public getTotalItemsCount(filterDescriptors: TGrid.FilterDescriptor, callback: (total: number) => void): void;
        public removeItem(item: any): void;
        public addItem(item: any): void;
        public getFirstItem(): any;
        public addArray(array: Array<any>): void;
        public clear(): void;
    }
}
