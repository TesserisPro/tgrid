####sortDescriptor

Defines current sorting of grid. Column for sorting and sorting direction. Needs grid setting **enableSorting** setted to *true*

To create sortDescriptor use following code:

<!--Start the highlighter-->
<pre class="brush: js">
	var sortDescriptor = new TesserisPro.TGrid.SortDescriptor(path, asc);
</pre>
#####
where 

*path* is type of string, it's value should be [**data-g--member** in columns definitions](#!/ColumnsDefinitions/data-g-member)

*asc* - is type of boolean, defines ascending or descending sorting. If *true* - ascending, if *false* - descending sorting.

Example of dynamic change **sortDescriptor** grid setting:

#####For Knockout
In HTML define **options** setting and button with binding function "setSortDescriptor":

<pre class="brush: html">
<input type="button" value="Set Sort Descriptor" data-bind="click: setSortDescriptor"/>
<div data-bind="tgrid:{provider:itemsProvider, options:gridOptions, enableSorting:true}">
	<script type="text/html">
        <column  data-g-member="Name"> 
        </column>
	</script>
</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **sortDescriptor**
can be changed using function 'setSortDescriptor'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.setSortDescriptor = function () {
        self.gridOptions().sortDescriptor = new TesserisPro.TGrid.SortDescriptor("Name", true);
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML define **options** setting and button with binding function "setSortDescriptor":
<pre class="brush: html">
<div ng-app="SampleModule">
  <div ng-controller="ctrl">
	<input type="button" value="Set Sort Descriptor" ng-click="setSortDescriptor();"/>
	<t-grid provider="dataProvider" options="gridOptions" enableSorting="true">
		<script type="text/html">
           <column  data-g-member="Name"> 
           </column>
		</script>
	</t-grid>
  </div>
</div>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **sortDescriptor**
can be changed using function 'setSortDescriptor'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.setSortDescriptor = function () {
            $scope.gridOptions.sortDescriptor 
				= new TesserisPro.TGrid.SortDescriptor("Name", true);
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
