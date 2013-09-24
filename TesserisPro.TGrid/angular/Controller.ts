/// <reference path="../Options.ts" />
module TesserisPro.TGrid {

    export interface Scope {
        Headers: Array<TesserisPro.TGrid.Template>;
        Data: Array<TesserisPro.TGrid.Template>;
    }

    export class Controller {

        constructor(element: JQuery, private $scope: Scope, options: TesserisPro.TGrid.Options) {
            this.$scope.Headers = options.columnHeaders;
            this.$scope.Data = options.columnDataField;
        }
    }
}