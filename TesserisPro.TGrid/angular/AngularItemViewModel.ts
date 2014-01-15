module TesserisPro.TGrid {

    export class AngularItemViewModel extends ItemViewModel {
        private $scope: any;

        public angularControllerName: string;

        public setScope(scope: any) {
            this.$scope = scope;
            this.$scope.model = this.model;
            this.$scope.item = this.item;
            this.$scope.grid = this.grid;
            this.$scope.isGroupHeader = this.isGroupHeader;
            this.$scope.openDetailsForCell = (columnIndex) => this.openDetailsForCell(columnIndex);
            this.$scope.closeDetailsForCell = (columnIndex) => this.closeDetailsForCell(columnIndex);
            this.$scope.toggleDetailsForCell = (columnIndex) => this.toggleDetailsForCell(columnIndex);
            this.$scope.setItemValue = (item) => this.setItemValue(item);
        }
    }
}