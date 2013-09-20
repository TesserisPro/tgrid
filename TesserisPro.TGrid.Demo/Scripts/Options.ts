/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }

	

	export class Template {
		private content: string = "";
        private binding: string = "";	

        constructor(prototype: HTMLElement) {
            this.content = prototype.innerHTML == null ? prototype.innerText : prototype.innerHTML;
            this.binding = prototype.getAttribute("data-bind");
        }

        public apply(element: HTMLElement) {
            element.innerHTML = this.content != null ? this.content : "";
            if (this.binding != null && this.binding.length > 0) {
                element.setAttribute("data-bind", this.binding);
            }
        }
	}
		   
	export class Options {
		public mainBinding: string;
		public columnHeaders: Array<Template> = [];
		public columnDataField: Array<Template> = [];
		public columnWidth: Array<string> = [];
		public columnDevice: Array<string> = [];
		public framework: Framework;
		public target: HTMLElement;


		constructor(element: HTMLElement) {
			this.target = element;
			this.framework = Framework.Knockout;

			if (this.framework == Framework.Knockout) {
				this.initializeKnockout();
			}
		}

		private initializeKnockout(): void {
			this.mainBinding = this.target.getAttribute("data-bind");

			if (this.mainBinding == undefined) {
				this.mainBinding = "";
			}

            var text = this.target.getElementsByTagName("script").item(0).innerHTML;
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