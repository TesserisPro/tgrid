####enableVirtualScroll

Enables or disables virtual scrolling.

**Value:** *true* or *false*.

**Default value:** *false*.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, enableVirtualScroll: true}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" enableVirtualScroll="true">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>