####enablePaging

Enables or disables paging.

**Value:** *true* or *false*.

**Default value:** *false*.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, enablePaging: true}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" enablePaging="true">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>