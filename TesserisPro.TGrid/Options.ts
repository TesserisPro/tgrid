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
        public header: Template = null;
        public cell: Template = null;
        public cellDetail: Template = null;
        public width: string = "150";
        public device: string = "mobile,desktop";
        public sortMemberPath: string = null;
        public groupMemberPath: string = null;
        public member: string = null;
        public resizable: boolean = true;
        public filterMemberPath: string = null;
        public notSized: boolean = false;
        public enableFiltering: boolean = true;
        public enableSorting: boolean = true;
        public enableGrouping: boolean = true;
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

        public getContent(): string {
            return this.content;
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
        public hideHeader: boolean;

        public filterPath: string;

        public mobileTemplateHtml: Template = null;
        public detailsTemplateHtml: Template = null;
        public groupHeaderTemplate: Template = null;
        public filterPopup: Template = null;

        public framework: Framework;
        public target: HTMLElement;
        public pageSize: number = 10;
        public pageSlide: number = 1;
        public batchSize: number = 5;
        public firstLoadSize: number = 10;
        public currentPage: number = 0;
        public sortDescriptor: SortDescriptor;
        public groupBySortDescriptors: Array<SortDescriptor> = [];
        public selectionMode: SelectionMode = SelectionMode.Single;
        public openDetailsOnSelection: boolean;

        public filterDescriptor: FilterDescriptor = FilterDescriptor.getEmpty();
        public tableFooterTemplate: Template = null;

        public showDetailFor: ShowDetail;
        public selection: Array<any> = [];
        public shouldAddDetailsOnSelection: boolean;
        public showCustomDetailFor: ShowDetail;

        public parentViewModel: any;
        public filterPopupForColumn: ColumnInfo;
        public columnMinWidth: number = 5;
        public apply: () => void;
        public hasAnyNotSizedColumn: boolean = false;
        public rowClick: string;
        public captureScroll: boolean = true;

        public minItemsCountForVirtualization: number;

        public ready: (options: Options) => void;

        constructor(element: HTMLElement, framework: Framework) {
            this.target = element;
            this.framework = framework;
            this.initialize();
            this.minItemsCountForVirtualization = 100;
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
            if (this.target.getElementsByTagName("script").length > 0) {
                var text = this.target.getElementsByTagName("script")[0].innerHTML;

                var optionsElement = document.createElement("div");
                optionsElement.innerHTML = text;

                var headers = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("header");
                var cells = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("cell");
                var cellDetails = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("celldetail");
                var columns = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("column");

                for (var i = 0; i < columns.length; i++) {
                    var column = new ColumnInfo();
                    if (columns[i].attributes['data-g-member'] != undefined){
                        column.member = columns[i].attributes['data-g-member'].nodeValue;
                    }
                    var header = <NodeListOf<HTMLElement>>columns[i].getElementsByTagName("header");
                    if (header.length > 0) {
                        column.header = new Template(header[0]);
                    }
                    var cell = <NodeListOf<HTMLElement>>columns[i].getElementsByTagName("cell");
                    if (cell.length > 0) {
                        column.cell = new Template(cell[0]);
                    }
                    var cellDetail = <NodeListOf<HTMLElement>>columns[i].getElementsByTagName("celldetail");
                    if (cellDetail.length == 1){
                        column.cellDetail = new Template(cellDetail[0]);
                    } 
                    if (columns[i].attributes['data-g-width'] != null) {
                        column.width = columns[i].attributes['data-g-width'].nodeValue;
                    }
                    if (columns[i].attributes['data-g-views'] != null) {
                        column.device = columns[i].attributes['data-g-views'].nodeValue;
                    }
                    if (columns[i].attributes['data-g-resizable'] != undefined) {
                        column.resizable = columns[i].attributes['data-g-resizable'].nodeValue == 'false' ? false : true;
                    }
                    if (columns[i].attributes['data-g-not-sized'] != undefined) {
                        column.notSized = columns[i].attributes['data-g-not-sized'].nodeValue == 'true' ? true : false;
                        this.hasAnyNotSizedColumn = true;
                    }
                    if (columns[i].attributes['data-g-enable-filtering'] != undefined) {
                        column.enableFiltering = columns[i].attributes['data-g-enable-filtering'].nodeValue == 'false' ? false : true;
                    }
                    if (columns[i].attributes['data-g-enable-sorting'] != undefined) {
                        column.enableSorting = columns[i].attributes['data-g-enable-sorting'].nodeValue == 'false' ? false : true;
                    }
                    if (columns[i].attributes['data-g-enable-grouping'] != undefined) {
                        column.enableGrouping = columns[i].attributes['data-g-enable-grouping'].nodeValue == 'false' ? false : true;
                    }

                    column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : column.member;
                    column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : column.member;
                    column.filterMemberPath = columns[i].attributes['data-g-filter-member'] != undefined ? columns[i].attributes['data-g-filter-member'].nodeValue : column.member;

                    this.columns.push(column);
                }

                var filterPopup = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("filterpopup");
                if (filterPopup.length == 1) {
                    this.filterPopup = new Template(filterPopup[0]);
                }
                var mobileTemplate = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("mobile");
                if (mobileTemplate.length == 1) {
                    this.mobileTemplateHtml = new Template(mobileTemplate[0]);
                }
                var groupHeaderTemplate = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("groupheader");
                if (groupHeaderTemplate.length == 1) {
                    this.groupHeaderTemplate = new Template(groupHeaderTemplate[0]);
                }
                var detailsTemplate = <NodeListOf<HTMLElement>>optionsElement.getElementsByTagName("details");
                if (detailsTemplate.length == 1){
                    this.detailsTemplateHtml = new Template(detailsTemplate[0]);
                }
                var footer = optionsElement.getElementsByTagName("footer");
                if (footer.length != 0) {
                    this.tableFooterTemplate = new Template(footer[0]);
                }
            } 
            this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(null, null);
            this.showDetailFor = new ShowDetail();
            this.showCustomDetailFor = new ShowDetail();
            this.filterPopupForColumn = new ColumnInfo();
        }

        public applyHandler() {
            for (var i = 0; i < this.columns.length; i++) {
                if (isNotNoU(this.columns[i].member)) {
                    if (isNoU(this.columns[i].groupMemberPath)) {
                        this.columns[i].groupMemberPath = this.columns[i].member;
                    }
                    if (isNoU(this.columns[i].sortMemberPath)) {
                        this.columns[i].sortMemberPath = this.columns[i].member;
                    }
                    if (isNoU(this.columns[i].filterMemberPath)) {
                        this.columns[i].sortMemberPath = this.columns[i].member;
                    }
                }
            }
            this.apply();
        }
      
    }
}