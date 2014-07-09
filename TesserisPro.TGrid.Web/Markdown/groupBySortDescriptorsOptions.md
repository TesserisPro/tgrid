####groupBySortDescriptors

**groupBySortDescriptors** defines current grouping of the grid. It is for internal use. But you can change it dynamically. 
It is a type of an array of TesserisPro.Tgrid.SortDescrptors.
Every element in the array sets the column's grouping by property and the column's sorting direction(default direction - ascending). 
The grid can be grouped by some columns. **groupBySortDescriptors** can be applyed only if the grid setting **enableGrouping** is setted to *true*.

To create the **groupBySortDescriptors** you can use following code:

<!--Start the highlighter-->
<pre class="brush: js">
	var groupBySortDescriptors = [new TesserisPro.TGrid.SortDescriptor(path, asc)];
</pre>
#####
where 

*path*  - is a type of the string, it's value should be [**data-g-member** in columns definitions](#!/ColumnsDefinitions/data-g-member),

*asc* - is a type of the boolean, defines an ascending or a descending sorting. If is set to *true* - ascending, if is set to *false* - descending sorting.

An example of a dynamic change the **groupBySortDescriptors** grid setting:

#####For Knockout
In HTML you should define an **options** setting and a button with a binded function "setGrouping":

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
In Javascript in the knockout view model you should have observable variable with the name equals  the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below  the grid setting **sortDescriptor**
can be changed using the function 'setGrouping'.

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
In HTML you should define an **options** setting and a button with a binded function "setGrouping":
<pre class="brush: html">
<div ng-app="SampleModule">
  <div ng-controller="ctrl">
	<input type="button" value="Set Group by" ng-click="setGrouping();"/>
	<t-grid provider="dataProvider" options="gridOptions" enablegrouping="true">
		<script type="text/html">
            <column  data-g-member="Name"> 
            </column>
		</script>
	</t-grid>
  </div>
</div>
</pre>
#####
In Javascript in the angular controller you should have a variable with the name equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **groupBySortDescriptors**
can be changed using the function 'setGrouping'.

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