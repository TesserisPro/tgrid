module TesserisPro.TGrid {

    export class AngularFilterPopupViewModel implements IFilterPopupViewModel {
        private $scope: any;

        container: HTMLElement;
        path: string;
        value: string;
        condition: FilterCondition;

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
            var path = Grid.getGridObject(this.container).options.filterPath;
            var filterDescriptor = new FilterDescriptor(path, value, condition);
            Grid.getGridObject(this.container).setFilters(filterDescriptor);
        }

        public onClear() {
            Grid.getGridObject(this.container).removeFilters();
        }

        public onClose() {
            Grid.getGridObject(this.container).hideElement(this.container);
        }
    }
}