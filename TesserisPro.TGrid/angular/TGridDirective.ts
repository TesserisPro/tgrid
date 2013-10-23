/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="../Options.ts"/>

module TGrid.Angular {
    export class ValueAccessor {
        provider: any;
        pageSize: string;
        selectMode: TesserisPro.TGrid.SelectionMode;
        groupBy: Array<string>;
        enableVirtualScroll: boolean;
    }

    export class Directive {
        private directive: ng.IDirective = {};
        constructor() {
            this.directive.restrict = 'E';
            //this.directive.transclude = true;
            this.directive.link = function (scope, element, attrs) {
                var valueAccessor = new ValueAccessor();
                valueAccessor.provider = scope[attrs["provider"]];
                valueAccessor.pageSize = attrs["pagesize"];
                valueAccessor.selectMode = attrs["selectmode"];
                valueAccessor.groupBy = (attrs["groupby"] != undefined) ? attrs["groupby"].split(' ') : undefined;
                valueAccessor.enableVirtualScroll = attrs["enablevirtualscroll"];

                var options = new TesserisPro.TGrid.Options(element[0], valueAccessor, TesserisPro.TGrid.Framework.Angular);
                var grid = new TesserisPro.TGrid.Grid(element[0], options, valueAccessor.provider);
                
                //var strTemplate = "TGrid result Table";
                //element.replaceWith(strTemplate);
            }
        return this.directive;
        }
    }
}

