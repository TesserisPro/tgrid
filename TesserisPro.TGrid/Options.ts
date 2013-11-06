/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
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
        public isEnableVirtualScroll: boolean;  
        public isEnablePaging: boolean;
        public isEnableCollapsing: boolean;
        public isEnableGrouping: boolean;
        public isEnableFiltering: boolean;

        public filterPath: string;

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

        public filterDescriptors: Array<FilterDescriptor> = [];
        public tableFooterTemplate: Template;

        public ctrlKey: boolean;
        public selectedRow: HTMLElement;

        public showDetailFor: ShowDetail;
        public selection: Array<any> = [];

        constructor(element: HTMLElement, framework: Framework) {
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

            if (!(headers.length == columns.length && cells.length == columns.length && cellDetails.length == columns.length)) {
                throw " Columns not fully described ";
            }

            for (var i = 0; i < columns.length; i++) {
                var column = new ColumnInfo();

                var header = new Template(headers[i]);
                column.header = header;

                var cell = new Template(cells[i]);
                column.cell = cell;

                var cellDetail = cellDetails[i];
                column.cellDetail = cellDetail.innerHTML;

                column.sortMemberPath = columns[i].attributes['data-g-sort-member'] != undefined ? columns[i].attributes['data-g-sort-member'].nodeValue : null;
                column.groupMemberPath = columns[i].attributes['data-g-group-member'] !== undefined ? columns[i].attributes['data-g-group-member'].nodeValue : null;
                column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";

                this.columns.push(column);
            }
            this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, true);

            var mobileTemplate = optionsElement.find("mobile");
            this.mobileTemplateHtml = mobileTemplate.length == 1 ? mobileTemplate[0].innerHTML : "Default mobileTemplate";

            var groupHeaderTemplate = optionsElement.find("groupheader");
            this.groupHeaderTemplate = groupHeaderTemplate.length == 1 ? groupHeaderTemplate[0].innerHTML : "Default groupHeaderTemplate";

            var detailsTemplate = optionsElement.find("details");
            this.detailsTemplateHtml = detailsTemplate.length == 1 ? detailsTemplate[0].innerHTML : "Default detailsTemplate";

            this.showDetailFor = new ShowDetail();

            var footer = optionsElement.find("footer"); 

            if (footer.length != 0) {
                this.tableFooterTemplate = new Template(footer[0]);
            } else {
                this.tableFooterTemplate = null;
            }
        }
    }
}