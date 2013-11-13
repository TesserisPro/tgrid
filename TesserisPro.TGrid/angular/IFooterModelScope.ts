/// <reference path="../scripts/typings/angularjs/angular.d.ts"/>
/// <reference path="AngularFooterViewModel.ts" />

module TesserisPro.TGrid {
    export interface IFooterModelScope extends ng.IScope {
        footerModel: AngularFooterViewModel;
    }
}