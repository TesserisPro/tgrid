##TGrid settings

Grid settings are defined in knockout binding or in angular directive.
Some of TGrid settings have default values and this is not required to define them in template. One required setting is **provider**.

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider">
	</t-grid>
</pre>

#####

Values of *provider* should be defined in view model in Knockout and in controller in Angular.

Simple **Knockout view model** in JavaScript:

<pre class="brush: js">
    function vm() {
        var self = this;
        self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    };
</pre>
#####
In **Angular** you define **main module** with controller, where dataProvider is intantiated.

<pre class="brush: js">
    var sampleModule = angular.module("SampleModule", ['TGrid'])
		 .controller("ctrl", function ctrl($scope) {
		 	$scope.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
		 })
</pre>
#####
*items* is array in JavaScript:

<pre class="brush: js">
    var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
    ];
</pre>
#####

TGrid with many grid settings:

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, enableFiltering: true }">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" enablefiltering ="true" enablesorting ="true">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>

