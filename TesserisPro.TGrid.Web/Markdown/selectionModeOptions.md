####selectionMode

Defines how many items can be selected in TGrid. If **rowClick** is defined, is set to  *'none'*.

**Value:**

+ "none" - you can't select any item
 
+ "single" - you can select only one item 

+ "multi" - you can select more, then one item. For selecting more then one item, press key 'Ctrl'

**Default value:** *single*.

[selectionMode in Grid Settings](#!/GridSettings/selectionMode)

Example of dynamic change **selectionMode** grid setting:

#####For Knockout
In HTML you should define **options** setting:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
	</div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **selectionMode**
can be changed using function 'selectionMode'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.selectionMode = function () {
        self.gridOptions().selectionMode = "multi";
        self.gridOptions().applyHandler();
	}
}
</pre>

#####For Angular
In HTML you should define **options** setting:
<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
	</t-grid>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **selectionMode**
can be changed using function 'selectionMode'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.selectionMode = function () {
            $scope.gridOptions.selectionMode = "multi";
            $scope.gridOptions.applyHandler();
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>