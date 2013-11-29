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
            Grid.getGridObject(this.container).setFilters(filterDescriptor);
        }

        public onClear() {
            Grid.getGridObject(this.container).removeFilters();
        }

        public onClose() {
            Grid.getGridObject(this.container).hideElement(this.container);
        }

        onOpen(options: Options, column: ColumnInfo) {
            this.columnInfo = column;
            this.path = column.filterMemberPath;
        }

        getColumnInfo(): ColumnInfo {
            return this.columnInfo;
        }
    }
}