####pageSlide

Sets how many pages should be visible (to the left and to the right from current) in a pager in the grid footer.

**Value:** a number from 1 to the total pages count.

**Default value:** *1*.

Example of a dynamic change a **pageSlide** grid setting:

#####For Knockout
In HTML you should define an **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In JavaScript in a knockout view model you should have an observable variable with a name that equals the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **pageSlide**
can be changed using the function 'pageSlide'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.pageSlide = function () {
        self.gridOptions().pageSlide = 5;
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
In JavaScript in an angular controller you should have a variable with a name that equals  to the **options** setting value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **pageSlide**
can be changed using the function 'pageSlide'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.pageSlide = function () {
            $scope.gridOptions.pageSlide = 5;
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>