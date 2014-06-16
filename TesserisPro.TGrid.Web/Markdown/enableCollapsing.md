####enableCollapsing

Enables or disables groups collapsing by click on group header. 
To enable groups collapsing **enableCollapsing** should be set to *true* and **enableGrouping** should be set to true. 

**Value:** *true* or *false*. 

**Default value:** *false*

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div data-bind="tgrid:{provider:itemsProvider, enableGrouping:true, enableCollapsing:true}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid provider="itemsProvider" enableGrouping="true" enableCollapsing="true">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>