####rowClick

Sets row click handler function name, which can be used in your sample view model to set your action on row click. Handler function has 2 parameters: *item* and *event*. *Item* is an element of your itemsProvider array, binded to clicked row. *Event* is mouse event click.

If **rowClick** is defined, then **selectionMode** is set to 'none' and **showDetailsOnSelection** is set to 'false'.

**Value:** any string.

**Default value:** null.