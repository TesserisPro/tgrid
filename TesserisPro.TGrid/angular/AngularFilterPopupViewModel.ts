module TesserisPro.TGrid {

    export class AngularFilterPopupViewModel implements IFilterPopupViewModel {
        private $scope: any;

        container: HTMLElement;
        path: string;
        value: string;
        condition: FilterCondition;
        columnInfo: ColumnInfo;

        public angularModuleName: string;

        public setScope(scope: any) {
            this.$scope = scope;
            this.$scope.onApply = () => this.onApply();
            this.$scope.onClear = () => this.onClear();
            this.$scope.onClose = () => this.onClose();
        }

        constructor(container: HTMLElement) {
            this.container = container;
        }

        public onApply() {
            var condition = <FilterCondition>(<HTMLSelectElement>this.container.getElementsByTagName("select")[0]).selectedIndex;
            var value = (<HTMLInputElement>this.container.getElementsByTagName("input")[0]).value;
            var filterDescriptor = new FilterDescriptor(this.path, value, condition);
            var grid = Grid.getGridObject(this.container);
            grid.setFilters(filterDescriptor, this.path);
            grid.setDefaultFilterPopUpValues();
            hideElement(this.container);
        }

        public onClear() {
            Grid.getGridObject(this.container).removeFilters(this.path);
            Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
            hideElement(this.container);
        }

        public onClose() {
            Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
            hideElement(this.container);
        }

        public onOpen(options: Options, column: ColumnInfo) {
            this.path = column.filterMemberPath;
            this.columnInfo = column;
        }

        public getColumnInfo(): ColumnInfo {
            return this.columnInfo;
        }
    }
}