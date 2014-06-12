####options

Defines variable name for accessing grid options from knockout/angular view model. TGrid properties and TGrid column properties can be changed dynamically, TGrid columns can be changed, added/removed.
After changing you should call applyHandler() for options.
#####For Knockout
<!--Start the highlighter-->
<pre class="brush:js">
    self.gridOptions().applyHandler()
</pre>
#####For Angular
<pre class="brush:js">
    $scope.gridOptions.applyHandler()
</pre>

**Value:** any acceptable name for variable.

**Default value:** don't have default value.

**Example:**

#####For Knockout
In HTML:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enableSorting**
can be changed using function 'enableSorting'.

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
	<t-grid id="test-angular" provider="itemsProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **enableSorting**
can be changed using function 'enableSorting'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.enableSorting = function () {
            $scope.gridOptions.enableSorting = true;
            $scope.gridOptions.applyHandler();
		}
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>