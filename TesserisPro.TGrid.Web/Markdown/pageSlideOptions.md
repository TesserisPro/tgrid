####pageSlide

Sets how many pages should be visible (to the left and to the right from current) in pager in grid footer.

**Value:** number from 1 to  total pages count.

**Default value:** *1*.

Example of dynamic change **pageSlide** grid setting:

#####For Knockout
In HTML define **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **pageSlide**
can be changed using function 'pageSlide'.

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
In HTML define **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **pageSlide**
can be changed using function 'pageSlide'.

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