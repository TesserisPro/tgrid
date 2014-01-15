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
            this.$scope.path = this.path;
            this.$scope.onApply = () => this.onApply();
            this.$scope.onClear = () => this.onClear();
            this.$scope.onClose = () => this.onClose();
        }

        constructor(container: HTMLElement, onCloseFilterPopup:() => void) {
            this.container = container;
            this.onCloseFilterPopup = onCloseFilterPopup;
        }

        public onCloseFilterPopup() {

        }

        public onApply() {
            this.condition = <FilterCondition>(<HTMLSelectElement>this.container.getElementsByTagName("select")[0]).selectedIndex;
            if (this.condition != FilterCondition.None) {
                this.value = (<HTMLInputElement>this.container.getElementsByTagName("input")[0]).value;
                var filterDescriptor = new FilterDescriptor(this.$scope.path, this.value, this.condition);
                var grid = Grid.getGridObject(this.container);
                grid.setFilters(filterDescriptor, this.$scope.path);
            } else {
                Grid.getGridObject(this.container).removeFilters(this.$scope.path);
            }
           
            hideElement(this.container);
            this.onCloseFilterPopup();
        }

        public onClear() {
            Grid.getGridObject(this.container).removeFilters(this.$scope.path);
            hideElement(this.container);
            this.onCloseFilterPopup();
        }

        public onClose() {
            hideElement(this.container);
            this.onCloseFilterPopup();
        }

        public onOpen(options: Options, column: ColumnInfo) {
            Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
            this.$scope.path = column.filterMemberPath;
            this.columnInfo = column;
            for (var i = 0; i < options.filterDescriptors.length; i++) {
                if (options.filterDescriptors[i].path == column.filterMemberPath) {
                    (<HTMLInputElement>this.container.getElementsByTagName("input")[0]).value = options.filterDescriptors[i].value;
                    (<HTMLSelectElement>this.container.getElementsByTagName("select")[0]).selectedIndex = options.filterDescriptors[i].condition;
                }
            }
            this.$scope.$apply();
        }

        public getColumnInfo(): ColumnInfo {
            return this.columnInfo;
        }
    }
}