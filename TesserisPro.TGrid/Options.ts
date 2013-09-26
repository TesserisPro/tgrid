/// <reference path="Scripts/typings/jquery/jquery.d.ts" />

module TesserisPro.TGrid {

	export enum Framework { Knockout, Angular }

	

	export class Template {
		private content: string = "";
        private binding: string = "";
        private innerBinding: string = "";	

        constructor(prototype: HTMLElement) {
            this.content = prototype.innerHTML == null ? prototype.innerText : prototype.innerHTML;
            if (prototype.firstElementChild != null && prototype.firstElementChild.hasAttribute("data-bind")){
                this.innerBinding = prototype.firstElementChild.getAttribute("data-bind");
            } else {
                this.binding = prototype.getAttribute("data-bind");
            }
        }

        public applyKnockout(element: HTMLElement) {
            element.innerHTML = this.content != null ? this.content : "";
            if (this.binding != null && this.binding.length > 0) {
                element.setAttribute("data-bind", this.binding);
            }
        }

        public applyAngular(element: HTMLElement, prefix: string) {
            element.innerHTML = this.content != null ? this.content : "";
            if (this.binding != null && this.binding.length > 0) {
                element.innerHTML = "{{" + prefix + this.binding.split(':')[1].trim() + "}}"
                }
            if (this.innerBinding != null && this.innerBinding.length > 0) {
                if (element.innerHTML != "") {
                    element.innerHTML = element.innerHTML.replace(this.innerBinding, "");
                    element.innerHTML = element.innerHTML.replace("</", "{{" + prefix + this.innerBinding.split(':')[1].trim() + "}}</")
                    } else {
                    element.innerHTML = "{{" + prefix + this.binding.split(':')[1].trim() + "}}"
                    }
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
		public target: JQuery;

        constructor(element: JQuery, framework: Framework) {
			this.target = element;
            this.framework = framework;

			if (this.framework == Framework.Knockout) {
				this.initializeKnockout();
            }
            if (this.framework == Framework.Angular) {
                this.initializeAngular();
            }
		}

		private initializeKnockout(): void {
			this.mainBinding = this.target.attr("data-bind");

			if (this.mainBinding == undefined) {
				this.mainBinding = "";
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

        private initializeAngular(): void {
            this.mainBinding = this.target.attr("data-bind");

            if (this.mainBinding == undefined) {
                this.mainBinding = "";
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