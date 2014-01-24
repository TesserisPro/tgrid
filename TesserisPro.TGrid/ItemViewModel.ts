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

    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: any;
        public isGroupHeader: boolean;

        constructor(model: any, item: any, grid: any, isGroupHeader:boolean) {
            this.model = model;
            this.item = item;
            this.grid = grid;
            this.isGroupHeader = isGroupHeader;
        }

        public toggleDetailsForCell(columnIndex: any) {
            if (this.grid.options.showCustomDetailFor.item != this.item || this.grid.options.showCustomDetailFor.item == this.item && this.grid.options.showDetailFor.column != columnIndex) {
                this.openDetailsForCell(columnIndex);
            } else {
                this.closeDetailsForCell(columnIndex);
            }
        }

        public openDetailsForCell(columnIndex: any): void {
            this.grid.options.showDetailFor.column = columnIndex;
            this.grid.options.showDetailFor.item = this.item;
            this.grid.updateRow(this.item, true);
            this.grid.options.showCustomDetailFor.item = this.item;
            this.grid.options.showCustomDetailFor.column = columnIndex;
            this.grid.options.shouldAddDetailsOnSelection = false;
        }

        public closeDetailsForCell(columnIndex: any): void {
            if (this.grid.options.showCustomDetailFor.item == this.item) {
                this.grid.updateRow(this.item, false);
                this.grid.options.showCustomDetailFor = new ShowDetail();
            }
        }

        public setItemValue(item: any): void {
            this.item = item;
        }
        
    }

}