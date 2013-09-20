/// <reference path="../Options.ts" />
export interface Dictionary {
    [key: string]: TesserisPro.TGrid.Template;
}


export interface Scope {
    Headers: Array<TesserisPro.TGrid.Template>;
    Data: Array<TesserisPro.TGrid.Template>;
}

export class controller {
    constructor(private $scope: Scope, options : TesserisPro.TGrid.Options) {
        this.$scope.Headers = options.columnHeaders;
        this.$scope.Data = options.columnDataField;
    }

}