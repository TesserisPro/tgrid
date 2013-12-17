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
            this.condition = <FilterCondition>(<HTMLSelectElement>this.container.getElementsByTagName("select")[0]).selectedIndex;
            if (this.condition != FilterCondition.None) {
                this.value = (<HTMLInputElement>this.container.getElementsByTagName("input")[0]).value;
                var filterDescriptor = new FilterDescriptor(this.path, this.value, this.condition);
                var grid = Grid.getGridObject(this.container);
                grid.setFilters(filterDescriptor, this.path);
            } else {
                Grid.getGridObject(this.container).removeFilters(this.path);
            }
            
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
            Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
            this.path = column.filterMemberPath;
            this.columnInfo = column;
            for (var i = 0; i < options.filterDescriptors.length; i++) {
                if (options.filterDescriptors[i].path == column.filterMemberPath) {
                    (<HTMLInputElement>this.container.getElementsByTagName("input")[0]).value = options.filterDescriptors[i].value;
                    (<HTMLSelectElement>this.container.getElementsByTagName("select")[0]).selectedIndex = options.filterDescriptors[i].condition;
                }
            }
        }

        public getColumnInfo(): ColumnInfo {
            return this.columnInfo;
        }
    }
}