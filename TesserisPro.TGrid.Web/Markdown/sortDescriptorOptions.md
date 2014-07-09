####sortDescriptor

Defines a current sorting of the grid. A column for a sorting and a sorting direction. Needs the grid setting **enableSorting** be setted to *true*

To create a sortDescriptor use following code:

<!--Start the highlighter-->
<pre class="brush: js">
	var sortDescriptor = new TesserisPro.TGrid.SortDescriptor(path, asc);
</pre>
#####
where 

*path* is a string, it's value should be [**data-g-member** in columns definitions](#!/ColumnsDefinitions/data-g-member),

*asc* - is a boolean, defines am ascending or a descending sorting. If it is set to *true* - ascending, if it is set to *false* - a descending sorting.

Example of a dynamic change the **sortDescriptor** grid setting:

#####For Knockout
In HTML you should define an **options** setting and a button with a binded function "setSortDescriptor":

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
In Javascript in a knockout view model you should have an observable variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **sortDescriptor**
can be changed using the function 'setSortDescriptor'.

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
In HTML you should define an **options** setting and a button with a binded function "setSortDescriptor":
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
In Javascript in an angular controller you should have a variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **sortDescriptor**
can be changed using the function 'setSortDescriptor'.

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
