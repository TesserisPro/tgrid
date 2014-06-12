####enableCollapsing

Enables or disables groups collapsing.

**Value:** *true* or *false*. 

**Default value:** *false*

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, enableGrouping: true, enableCollapsing: true}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" enableGrouping="true" enableCollapsing="true">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>