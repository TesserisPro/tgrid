####groupBySortDescriptors

Defines current grouping of grid. Is type of array of SortDescrptors.
Every element in array sets grouping by column and sorting direction(default direction - ascending). 
Grid can be grouped by some columns. Needs grid setting **enableGrouping** setted to *true*

To create groupBySortDescriptors use following code:

<!--Start the highlighter-->
<pre class="brush: js">
	var groupBySortDescriptors = [new TesserisPro.TGrid.SortDescriptor(path, asc)];
</pre>
#####
where 

*path*  - is type of string, it's value should be [**data-g--member** in columns definitions](#!/ColumnsDefinitions/data-g-member)

*asc* - is type of boolean, defines ascending or descending sorting. If *true* - ascending, if *false* - descending sorting.

Example of dynamic change **groupBySortDescriptors** grid setting:

#####For Knockout
In HTML define **options** setting and button with binding function "setGrouping":

<pre class="brush: html">
	<input type="button" value="Set Group by" data-bind="click: setGrouping"/>
	<div data-bind="tgrid:{provider:itemsProvider, options:gridOptions, enableGrouping:true}">
		<script type="text/html">
            <column  data-g-member="Name"> 
            </column>
		</script>
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **sortDescriptor**
can be changed using function 'setGrouping'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.setGrouping = function () {
        self.gridOptions().groupBySortDescriptors 
		    = [new TesserisPro.TGrid.SortDescriptor("Name", true)];
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML define **options** setting and button with binding function "setGrouping":
<pre class="brush: html">
<div ng-app="SampleModule">
  <div ng-controller="ctrl">
	<input type="button" value="Set Group by" ng-click="setGrouping();"/>
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions" enablegrouping="true">
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
You can change grid options dynamically after grid loading. In example below grid setting **groupBySortDescriptors**
can be changed using function 'setGrouping'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.setGrouping = function () {
            $scope.gridOptions.groupBySortDescriptors 
			    = [new TesserisPro.TGrid.SortDescriptor("Name", true)];
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>