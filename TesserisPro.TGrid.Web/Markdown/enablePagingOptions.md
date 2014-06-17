####enablePaging

Enables or disables paging. 

**Value:** *true* or *false*.

**Default value:** *false*.

[enablePaging in Grid Settings](#!/GridSettings/enablePaging)

Example of a dynamic change the **enablePaging** grid setting:

#####For Knockout
In HTML you should define the **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in the knockout view model you should have the observable variable with the name equals the **options** setting value. 
You can change grid options dynamically after grid loading. In example below, the grid setting **enablePaging**
can be changed using the function 'enablePaging'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.enablePaging = function () {
        self.gridOptions().enablePaging = true;
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
In Javascript in the angular controller you should have variable with the name equals the **options** setting value. 
You can change grid options dynamically after grid loading. In example below the grid setting **enablePaging**
can be changed using the function 'enablePaging'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enablePaging = function () {
            $scope.gridOptions.enablePaging = true;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>