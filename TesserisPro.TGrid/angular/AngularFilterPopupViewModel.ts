//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// software and associated documentation files(the "Software"), to deal in the Software 
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
  
// 1. The above copyright notice and this permission notice shall be included in all 
//    copies or substantial portions of the Software.
//
// 2. Any software that fully or partially contains or uses materials covered by 
//    this license shall notify users about this notice and above copyright.The 
//    notification can be made in "About box" and / or site main web - page footer.The 
//    notification shall contain name of Tesseris Pro company and name of the Software 
//    covered by current license.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//=====================================================================================


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