/// <reference path="SortDescriptor.ts" />
/// <reference path="FilterDescriptor.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }
    export enum SelectionMode { None, Single, Multi }//0,1,2
    export enum FilterCondition { None, Equals, NotEquals }
    export enum FilterOperation { And, Or };

    export class ColumnInfo {
        public header: Template;
        public cell: Template;
        public cellDetail: Template;
        public width: string;
        public device: string;
        public sortMemberPath: string;
        public groupMemberPath: string;
        public member: string;
    }

    export class ShowDetail {
        public item: any;
        public column: number;
        public isDetailColumn: boolean;
        constructor() {
            this.column = -1;
            this.item = null;
            this.isDetailColumn = false;
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
        public isEnableVirtualScroll: boolean;  
        public isEnablePaging: boolean;
        public isEnableCollapsing: boolean;
        public isEnableGrouping: boolean;
        public isEnableFiltering: boolean;

        public filterPath: string;

        public mobileTemplateHtml: Template;
        public detailsTemplateHtml: Template;
        public groupHeaderTemplate: Template;

        public framework: Framework;
        public target: HTMLElement;
        public pageSize: number;
        public pageSlide: number = 1;
        public batchSize: number = 10;
        public firstLoadSize: number = 20;
        public currentPage: number = 0;
        public sortDescriptor: SortDescriptor;
        public groupBySortDescriptor: Array<SortDescriptor> = [];
        public selectionMode: SelectionMode;

        public filterDescriptors: Array<FilterDescriptor> = [];
        public tableFooterTemplate: Template;

        public ctrlKey: boolean;
        public selectedRow: HTMLElement;

        public showDetailFor: ShowDetail;
        public selection: Array<any> = [];

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
			var text = $(this.target).find("script")[0].innerHTML;
            var optionsElement = $("<div>" + text + "</div");
            var columns = optionsElement.find("column");

            for (var i = 0; i < columns.length; i++) {
                var columnElement = $(columns[i]);
                var header = columnElement.find("header");
                var cell = columnElement.find("cell");

                var column = new ColumnInfo();
                column.member = columns[i].attributes['data-g-member'] != undefined ? columns[i].attributes['data-g-member'].nodeValue : null;

                column.header = header.length > 0 ? new Template(header[0]) : null;  
                column.cell = header.length > 0 ? new Template(cell[0]) : null;

                var cellDetail = columnElement.find("celldetail");
                column.cellDetail = cellDetail.length == 1 ? new Template(cellDetail[0]) : null;

                column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : column.member;
                column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : column.member;
                column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";

                this.columns.push(column);
            }

            this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, true);

            var mobileTemplate = optionsElement.find("mobile");
            this.mobileTemplateHtml = mobileTemplate.length == 1 ? new Template(mobileTemplate[0]) : null;

            var groupHeaderTemplate = optionsElement.find("groupheader");

            this.groupHeaderTemplate = groupHeaderTemplate.length == 1 ? new Template(groupHeaderTemplate[0]) :null;

            var detailsTemplate = optionsElement.find("details");
            this.detailsTemplateHtml = detailsTemplate.length == 1 ? new Template(detailsTemplate[0]) : null;

            this.showDetailFor = new ShowDetail();

            var footer = optionsElement.find("footer");
            this.tableFooterTemplate = footer.length == 1 ? new Template(footer[0]) : null;
            
        }
      
    }
}