####pageSize.

Defines how many items are displayed on 1 page.

**Value:** a number from 1 to the total items count.

**Default value:** *10*.

An example of the dynamic change the **pageSize** grid setting:

#####For Knockout
In HTML you should define an **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in a knockout view model you should have an observable variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **pageSize**
can be changed to *7* using the function 'pageSize'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.pageSize = function () {
        self.gridOptions().pageSize = 7;
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML you should define an **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in an angular controller you should have a variable with a name equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **pageSize**
can be changed to *7* using the function 'pageSize'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.pageSize = function () {
            $scope.gridOptions.pageSize = 7;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>