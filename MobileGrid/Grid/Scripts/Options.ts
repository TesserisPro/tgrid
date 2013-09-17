/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />

module TesserisPro.TGrid {

    export class Options {
        public mainBinding: string;
        public columnHeaders: Array<string> = [];
        public columnDataField: Array<string> = [];
        public columnWidth: Array<string> = [];
        public columnDevice: Array<string> = [];

        constructor(element: JQuery) {
            this.mainBinding = element.attr("data-bind");
            var text = element.find("script")[0].innerHTML;
            var JQ = $("<div>" + text + "</div");
            // Headers
            var headers = JQ.find("header");
            var header : string;
            for (var i = 0; i < headers.length; i++) {
                if (headers[i].firstElementChild == null) {
                    header = headers[i].innerText;
                } else {
                    header = headers[i].firstElementChild.firstChild.nodeValue;
                }
                this.columnHeaders.push(header);
            }
            // Cells
            var cells  = JQ.find("cell");
            var cell: string;
            for (var i = 0; i < cells.length; i++) {
                if (cells[i].firstElementChild == null) {
                    cell = cells[i].attributes['data-bind'].nodeValue;
                } else {
                    cell = cells[i].firstElementChild.attributes['data-bind'].nodeValue;
                }
                this.columnDataField.push(cell);
            }
            // Columns width
            var columns = JQ.find("column");
            for (var i = 0; i < columns.length; i++) {
                this.columnWidth.push(columns[i].attributes['data-g-width'].nodeValue);
                this.columnDevice.push(columns[i].attributes['data-g-views'].nodeValue);
            }

		}
	}

}