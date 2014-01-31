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


/// <reference path="SortDescriptor.ts" />
/// <reference path="FilterDescriptor.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }
    export enum SelectionMode { None, Single, Multi }//0,1,2
    export enum FilterCondition { None, Equals, NotEquals }
    export enum LogicalOperator { And, Or };

    export class ColumnInfo {
        public header: Template;
        public cell: Template;
        public cellDetail: Template;
        public width: string;
        public device: string;
        public sortMemberPath: string;
        public groupMemberPath: string;
        public member: string;
        public resizable: boolean;
        public filterMemberPath: string;
    }

    export class ShowDetail {
        public item: any;
        public column: number;
        constructor() {
            this.column = -1;
            this.item = null;
        }
    }

	export class Template {
		private content: string = "";

        constructor(prototype: HTMLElement) {
            this.content = prototype.innerHTML == null ? prototype.innerText : prototype.innerHTML;
        }

        public applyTemplate(element: HTMLElement) {
            element.innerHTML = this.content != null ? this.content : "";
        }
    }
		   
    export class Options {
        public columns: Array<ColumnInfo> = [];
        public enableVirtualScroll: boolean;  
        public enablePaging: boolean;
        public enableCollapsing: boolean;
        public enableSorting: boolean;
        public enableGrouping: boolean;
        public enableFiltering: boolean;

        public filterPath: string;

        public mobileTemplateHtml: Template;
        public detailsTemplateHtml: Template;
        public groupHeaderTemplate: Template;
        public filterPopup: Template;

        public framework: Framework;
        public target: HTMLElement;
        public pageSize: number = 10;
        public pageSlide: number;
        public batchSize: number = 5;
        public firstLoadSize: number = 10;
        public currentPage: number = 0;
        public sortDescriptor: SortDescriptor;
        public groupBySortDescriptors: Array<SortDescriptor> = [];
        public selectionMode: SelectionMode;
        public openDetailsOnSelection: boolean;

        public filterDescriptor: FilterDescriptor = FilterDescriptor.getEmpty();
        public tableFooterTemplate: Template;

        public showDetailFor: ShowDetail;
        public selection: Array<any> = [];
        public shouldAddDetailsOnSelection: boolean;
        public showCustomDetailFor: ShowDetail;

        public parentViewModel: any;
        public filterPopupForColumn: ColumnInfo;
        public columnMinWidth:number = 5;

        constructor(element: HTMLElement, framework: Framework) {
            this.target = element;
            this.framework = framework;
            this.initialize();
        }

        public isSelected(item: any): boolean {
            for (var i = 0; i < this.selection.length; i++) {
                if (this.selection[i] == item) {
                    return true;
                }
            }
            return false;
        }

        private initialize(): void {
			var text = this.target.getElementsByTagName("script")[0].innerHTML;
            var optionsElement = document.createElement("div");
            optionsElement.innerHTML = text;
                       
            var headers = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("header");
            var cells = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("cell");
            var cellDetails = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("celldetail");
            var columns = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("column");

            for (var i = 0; i < columns.length; i++) {
                var columnElement = $(columns[i]);
                var header = columnElement.find("header");
                var cell = columnElement.find("cell");

                var column = new ColumnInfo();
                column.member = columns[i].attributes['data-g-member'] != undefined ? columns[i].attributes['data-g-member'].nodeValue : null;

                column.header = header.length > 0 ? new Template(header[0]) : null;  
                column.cell = cell.length > 0 ? new Template(cell[0]) : null;

                var cellDetail = columnElement.find("celldetail");
                column.cellDetail = cellDetail.length == 1 ? new Template(cellDetail[0]) : null;

                column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : column.member;
                column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : column.member;
                column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 150;
                column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";
                column.resizable = columns[i].attributes['data-g-resizable'] != undefined ? (columns[i].attributes['data-g-resizable'].nodeValue == 'false'? false : true) : true;
                column.filterMemberPath = columns[i].attributes['data-g-filter-member'] != undefined ? columns[i].attributes['data-g-filter-member'].nodeValue : column.member;

                this.columns.push(column);
            }

            this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(null, null);

            var filterPopup = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("filterpopup");
            this.filterPopup = filterPopup.length == 1 ? new Template(filterPopup[0]) : null;

            var mobileTemplate = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("mobile");
            
            this.mobileTemplateHtml = mobileTemplate.length == 1 ? new Template(mobileTemplate[0]) : null;

            var groupHeaderTemplate = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("groupheader");

            this.groupHeaderTemplate = groupHeaderTemplate.length == 1 ? new Template(groupHeaderTemplate[0]) :null;

            var detailsTemplate = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("details");
            this.detailsTemplateHtml = detailsTemplate.length == 1 ? new Template(detailsTemplate[0]) : null;

            this.showDetailFor = new ShowDetail();
            this.showCustomDetailFor = new ShowDetail();

            var footer = optionsElement.getElementsByTagName("footer"); 
            this.tableFooterTemplate = footer.length > 0 ? new Template(footer[0]) : null;
            
            if (footer.length != 0) {
                this.tableFooterTemplate = new Template(footer[0]);
            } else {
                this.tableFooterTemplate = null;
            }
            this.filterPopupForColumn = new ColumnInfo();
        }
      
    }
}