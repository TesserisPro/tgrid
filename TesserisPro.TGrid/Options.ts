/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }

    export class ColumnInfo {
        public header: Template;
        public cell: Template;
        public width: string;
        public device: string;
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

        // TODO: remove
        public columnHeaders: Array<Template> = [];
		public columnDataField: Array<Template> = [];
		public columnWidth: Array<string> = [];
		public columnDevice: Array<string> = [];

        public framework: Framework;
        public target: JQuery;
        public pageSize: number;
        public pageSlide: number = 1;
        public currentPage: number = 1;

        constructor(element: HTMLElement, framework: Framework) {
			this.target = $(element);
            this.framework = framework;
            
    		this.initialize();
		}

        private initialize(): void {
            var rowsAtt = this.target.attr("data-g-page-size");
            this.pageSize = parseInt(rowsAtt);
            if (isNaN(this.pageSize)) {
                this.pageSize = 10;
            }

			var text = this.target.find("script")[0].innerHTML;
			var optionsElement = $("<div>" + text + "</div");

			// Headers
			var headers = optionsElement.find("header");
			for (var i = 0; i < headers.length; i++) {
                var template = new Template(headers[i]);
				this.columnHeaders.push(template);
			}

			// Cells
			var cells = optionsElement.find("cell");
			for (var i = 0; i < cells.length; i++) {
                var cell = new Template(cells[i]);
				this.columnDataField.push(cell);
			}

			// Columns width
			var columns = optionsElement.find("column");
			for (var i = 0; i < columns.length; i++) {
				this.columnWidth.push(columns[i].attributes['data-g-width'].nodeValue);
				this.columnDevice.push(columns[i].attributes['data-g-views'].nodeValue);
			}
        }
   }
}