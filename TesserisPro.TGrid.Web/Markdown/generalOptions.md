##Options

Grid settings and column definitions can be changed dynamically.

Below there are classes Options and ColumnInfo in TypeScript. 
So you can see types, expected for available options properties, which can be changed.
The options.columns is type of a TesserisPro.TGrid.ColumnInfo[]. 

<!--Start the highlighter-->
<pre class="brush: js">

class Options {
    public columns: ColumnInfo[];
    public enableVirtualScroll: boolean;
    public enablePaging: boolean;
    public enableCollapsing: boolean;
    public enableSorting: boolean;
    public enableGrouping: boolean;
    public enableFiltering: boolean;
    public mobileTemplateHtml: Template;
    public detailsTemplateHtml: Template;
    public groupHeaderTemplate: Template;
    public filterPopup: Template;
    public framework: Framework;
    public target: HTMLElement;
    public pageSize: number;
    public pageSlide: number;
    public batchSize: number;
    public firstLoadSize: number;
    public currentPage: number;
    public sortDescriptor: TGrid.SortDescriptor;
    public groupBySortDescriptors: TGrid.SortDescriptor[];
    public selectionMode: SelectionMode;
    public openDetailsOnSelection: boolean;
    public filterDescriptor: TGrid.FilterDescriptor;
    public tableFooterTemplate: Template;
    public showDetailFor: ShowDetail;
    public selection: any[];
    public shouldAddDetailsOnSelection: boolean;
    public showCustomDetailFor: ShowDetail;
    public parentViewModel: any;
    public filterPopupForColumn: ColumnInfo;
    public columnMinWidth: number;
    public apply: () => void;
    public hasAnyNotSizedColumn: boolean;
    public rowClick: string;
    public captureScroll: boolean;
    public ready: (options: Options) => void;
    constructor(element: HTMLElement, framework: Framework);
    public isSelected(item: any): boolean;
    private initialize();
    public applyHandler();
}
class ColumnInfo {
    public header: Template;
    public cell: Template;
    public cellDetail: Template;
    public width: string;
    public device: string;
    public sortMemberPath: string;
    public groupMemberPath: string;
    public member: string;
    public resizable: boolean;
    public filterMemberPath: string;
    public notSized: boolean;
    public enableFiltering: boolean;
    public enableSorting: boolean;
    public enableGrouping: boolean;
}

</pre>

#####
Grid settings and column definitions can be changed dynamically, you can see an example below.

#####For Knockout
In HTML:
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In a Javascript in the knockout view model you should have the observable variable with the name equals the **options** settings value. 
You can change grid options dynamically after grid loading. In an example below, grid setting **enableSorting**
can be changed using the function 'enableSorting'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.enableSorting = function () {
        self.gridOptions().enableSorting = true;
        self.gridOptions().applyHandler();
}
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in the angular controller you should have the variable with the name equals the **options** settings value. 
You can change the grid options dynamically after grid loading. In an example below the grid setting **enableSorting**
can be changed using the function 'enableSorting'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enableSorting = function () {
            $scope.gridOptions.enableSorting = true;
            $scope.gridOptions.applyHandler();
		})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>