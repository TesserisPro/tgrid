/// <reference path="scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="Options.ts"/>
module TesserisPro.TGrid {

    // Class
    export class FooterDirective {
        private directive: ng.IDirective = {};
        constructor(footer:any) {
            this.directive.restrict = 'E';
            this.directive.template = footer;
            this.directive.link = function (scope, element, attrs) {
                scope.totalCount = 69; 
            }

        return this.directive;
        }
    }

}