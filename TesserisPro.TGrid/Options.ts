/// <reference path="Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="SortDescriptor.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }
    export enum EditMode { None, Single, Multi }//0,1,2

    export class ColumnInfo {
        public header: Template;
        public cell: Template;
        public width: string;
        public device: string;
        public sortMemberPath: string;
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

        public mobileTemplateHtml: string;

        public framework: Framework;
        public target: JQuery;
        public pageSize: number;
        public pageSlide: number = 1;
        public currentPage: number = 0;
        public sortDescriptor: SortDescriptor;
        public editMode: EditMode;

        public selection: Array<any> = [];

        constructor(element: HTMLElement, framework: Framework) {
			this.target = $(element);
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
            var pageSizeAtt = this.target.attr("data-g-page-size");
            this.pageSize = parseInt(pageSizeAtt);
            if (isNaN(this.pageSize)) {
                this.pageSize = 5;
            }

            var editModeAtt = this.target.attr("data-g-edit-mode");
            this.editMode = parseInt(editModeAtt);
            if (isNaN(this.editMode)) {
                this.editMode = 2;
            }

			var text = this.target.find("script")[0].innerHTML;
			var optionsElement = $("<div>" + text + "</div");

            var headers = optionsElement.find("header");
			var cells = optionsElement.find("cell");
            var columns = optionsElement.find("column");

            for (var i = 0; i < headers.length; i++) {
                var column = new ColumnInfo();

                var header = new Template(headers[i]);
                column.header = header;

                var cell = new Template(cells[i]);
                column.cell = cell;

                column.sortMemberPath = columns[i].attributes['data-g-sort-member'].nodeValue;
                column.width = columns[i].attributes['data-g-width'] != null ? columns[i].attributes['data-g-width'].nodeValue : 100;
                column.device = columns[i].attributes['data-g-views'] != null ? columns[i].attributes['data-g-views'].nodeValue : "mobile,desktop";

                this.columns.push(column);
            }
            this.sortDescriptor = new TesserisPro.TGrid.SortDescriptor(this.columns[0].sortMemberPath, false);

            var mobileTemplate = optionsElement.find("mobile");
            this.mobileTemplateHtml = mobileTemplate[0].innerHTML;
        }
    }
}