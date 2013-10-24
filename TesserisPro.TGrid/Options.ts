/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="SortDescriptor.ts" />
/// <reference path="FilterDescriptor.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }
    export enum SelectionMode { None, Single, Multi }//0,1,2
    export enum FilterCondition { None, Equals, NotEquals }

    export class ColumnInfo {
        public header: Template;
        public cell: Template;
        public cellDetail: string;
        public width: string;
        public device: string;
        public sortMemberPath: string;
        public groupMemberPath: string;
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
        public isEnableVirtualScroll: boolean = false;  
        public isEnablePaging: boolean = false;

        public mobileTemplateHtml: string;
        public detailsTemplateHtml: string;
        public groupHeaderTemplate: string;

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
        //public groupBy: string;
        public filterDescriptors: Array<FilterDescriptor> = [];

        public ctrlKey: boolean;
        public selectedRow: HTMLElement;

        public showDetailFor: ShowDetail;
        public selection: Array<any> = [];

        constructor(element: HTMLElement, valueAccessor: any, framework: Framework) {

            if (valueAccessor.groupBy != undefined) {
                for (var i = 0; i < valueAccessor.groupBy.length; i++) {
                    this.groupBySortDescriptor.push(new TesserisPro.TGrid.SortDescriptor(valueAccessor.groupBy[i], true));
                }
            }

            if (valueAccessor.enablePaging == undefined) {
                this.isEnablePaging = false;
            } else {
                this.isEnablePaging = valueAccessor.enablePaging == "true" ? true : false;
            }

            var pageSizeAtt = valueAccessor.pageSize;
            this.pageSize = parseInt(pageSizeAtt);
            if (this.isEnablePaging) {
                this.pageSize = (isNaN(this.pageSize) || this.pageSize < 1) ? 10 : this.pageSize;
            }

            var editModeAtt = valueAccessor.selectMode;
            this.selectionMode = parseInt(editModeAtt);
            if (isNaN(this.selectionMode)) {
                this.selectionMode = 1;
            }

            if (valueAccessor.enableVirtualScroll == undefined) {
                this.isEnableVirtualScroll =  false;
            } else {
                this.isEnableVirtualScroll = valueAccessor.enableVirtualScroll == "true" ? true : false;
            }

            this.target = element;
            this.framework = framework;
            //this.filterDescriptors.push(new TesserisPro.TGrid.FilterDescriptor("name", "a1", 1));
            //this.filterDescriptors.push(new TesserisPro.TGrid.FilterDescriptor("key", "b1", 1));
            //this.filterDescriptors.push(new TesserisPro.TGrid.FilterDescriptor("key", "c1", 1));
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

            var headers = optionsElement.find("header");
            var cells = optionsElement.find("cell");
            var cellDetails = optionsElement.find("celldetail");
            var columns = optionsElement.find("column");

            for (var i = 0; i < columns.length; i++) {
                var column = new ColumnInfo();

                var header = new Template(headers[i]);
                column.header = header;

                var cell = new Template(cells[i]);
                column.cell = cell;

                var cellDetail = cellDetails[i];
                column.cellDetail = cellDetail.innerHTML;

                column.sortMemberPath = columns[i].attributes['data-g-sort-member'].nodeValue;
                column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";

                this.columns.push(column);
            }
            this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, true);

            var mobileTemplate = optionsElement.find("mobile");
            this.mobileTemplateHtml = mobileTemplate[0].innerHTML;

            var groupHeaderTemplate = optionsElement.find("groupheader");
            this.groupHeaderTemplate = groupHeaderTemplate[0].innerHTML;

            var detailsTemplate = optionsElement.find("details");
            this.detailsTemplateHtml = detailsTemplate[0].innerHTML;

            this.showDetailFor = new ShowDetail();
        }
    }
}