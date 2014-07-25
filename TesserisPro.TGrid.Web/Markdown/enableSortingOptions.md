####enableSorting

Enables or disables Sorting. 

**Value:** *true* or *false*.

**Default value:** *false*.

[enableSorting in Grid Settings](#!/GridSettings/enableSorting)

Example of a dynamic change the **enableSorting** grid setting:

#####For Knockout
In HTML you should define the **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In JavaScript in the knockout view model you should have the observable variable with the name equals the **options** settings value. 
You can change grid options dynamically after grid loading. In example below, the grid setting **enableSorting**
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
}
</pre>

#####For Angular
In HTML you should define the **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In JavaScript in the angular controller you should have variable with the name equals the **options** setting value. 
You can change grid options dynamically after grid loading. In example below, the grid setting **enableSorting**
can be changed using the function 'enableSorting'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enableSorting = function () {
            $scope.gridOptions.enableSorting = true;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>