module TesserisPro.TGrid {

    export class KnockoutFilterPopupViewModel implements IFilterPopupViewModel {
        container: HTMLElement;
        path: string;
        value: string;
        condition: FilterCondition;
        columnInfo: ColumnInfo;

        public angularModuleName: string;

        constructor(container: HTMLElement) {
            this.container = container;
        }

        public onApply() {
            var condition = <FilterCondition>(<HTMLSelectElement>this.container.getElementsByTagName("select")[0]).selectedIndex;
            var value = (<HTMLInputElement>this.container.getElementsByTagName("input")[0]).value;
            var filterDescriptor = new FilterDescriptor(this.path, value, condition);
            Grid.getGridObject(this.container).setFilters(filterDescriptor, this.path);
            hideElement(this.container);
        }

        public onClear() {
            Grid.getGridObject(this.container).removeFilters(this.path);
            hideElement(this.container);
        }

        public onClose() {
            hideElement(this.container);
        }

        public onOpen(options: Options, column: ColumnInfo) {
            this.columnInfo = column;
            this.path = column.filterMemberPath;
        }

        public getColumnInfo(): ColumnInfo {
            return this.columnInfo;
        }
    }
}