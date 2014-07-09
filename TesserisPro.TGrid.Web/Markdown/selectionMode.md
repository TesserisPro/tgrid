####selectionMode

Defines how many items can be selected in the TGrid. If the **rowClick** is defined, the **selectionMode** is set to  *'none'*.

**Value:**

+ "none" - you can't select any item
 
+ "single" - you can select only one item

+ "multi" - you can select more, then one item. For selecting more then one item, press key 'Ctrl'

**Default value:** *single*.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, selectionMode: 'multi'}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" selectionMode="multi">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>