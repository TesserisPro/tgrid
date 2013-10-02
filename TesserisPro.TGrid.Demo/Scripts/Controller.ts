/// <reference path="../Options.ts" />
module TesserisPro.TGrid {
    //export interface Dictionary {
    //    [key: string]: TesserisPro.TGrid.Template;
    //}


    export interface Scope {
        Headers: Array<TesserisPro.TGrid.Template>;
        Data: Array<TesserisPro.TGrid.Template>;
    }

    export class Controller {
        public $scope: Scope;

        constructor(element: JQuery, options: TesserisPro.TGrid.Options) {
            this.$scope.Headers = options.columnHeaders;
            this.$scope.Data = options.columnDataField;
        }

    }
}