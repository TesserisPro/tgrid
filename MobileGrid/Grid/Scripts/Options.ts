/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />

module TesserisPro.TGrid {

	export class Options {
		public data: any;
		public columnHeaders: Array<string>;
		public dataProvider: (fromItem: number, toItem: number) => Array<any>;
		public mobileViewMaxWidth: number;
		public pageSize: number;
		public currentPage: number;

		constructor(element: JQuery) {
            this.data = element;
		}
	}

}