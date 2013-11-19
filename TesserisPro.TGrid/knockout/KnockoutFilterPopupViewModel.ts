module TesserisPro.TGrid {

    export class KnockoutFilterPopupViewModel implements IFilterPopupViewModel {
        container: HTMLElement;
        path: string;
        value: string;
        condition: FilterCondition;

        public angularModuleName: string;

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