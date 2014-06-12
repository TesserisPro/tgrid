####pageSize.

Defines how many items are displayed on 1 page.

**Value:** number from 1 to total items count.

**Default value:** *10*.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, enablePaging: true, pageSize: 5}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" enablePaging="true" pageSize="5">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>