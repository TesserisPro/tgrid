##TGrid properties

Some of TGrid properties has default values and this is not required to define them in template.


####itemsProvider
    
Defines item provider for grid.

**Value:** JavaScript object that contains item provider functions.

**Default value:** there isn't any default value.


####captureScroll
    
Enables or disables scroll capturing

**Value:** *true* or *false*

**Default value:** *true*

####hideHeader

You can choose do not render grid header. If is set to *true*, grid header isn't rendered.

**Value:** *true* or *false*

**Default value:** *false*

####enableCollapsing

Enables or disables groups collapsing.

**Value:** *true* or *false*. 

**Default value:** *false*

####enableFiltering

Enables or disables filtering.

**Value:** *true* or *false*.

**Default value:** *false*.

####enableGrouping

Enables or disables grouping

**Value:** *true* or *false*.

**Default value:** *false*.

####enablePaging

Enables or disables paging.

**Value:** *true* or *false*.

**Default value:** *false*.

####enableSorting

Enables or disables sorting.

**Value:** *true* or *false*.

**Default value:** *false*.

####enableVirtualScroll

Enables or disables virtual scrolling.

**Value:** *true* or *false*.

**Default value:** *false*.

####options

Defines variable name for accessing grid options from knockout/angular view model. TGrid properties and TGrid column properties can be changed dynamically, TGrid columns can be changed, added/removed.

**Value:** any acceptable name for variable.

**Default value:** don't have default value.

####pageSize.

Defines how many items are displayed on 1 page.

**Value:** number from 1 to total items count.

**Default value:** *10*.

####pageSlide

Sets how many pages should be visible (to the left and to the right from current) in pager.

**Value:** number from 1 to  total items count.

**Default value:** *10*.

####ready

Sets grid after loading handler function, which will be used in your sample view model to set actions after grid loading. Handler function has 1 parameter: *options*. *options* is an object of TesserisPro.TGrid.Options type with initialized TGrid options inside.

In case Knockout: If **ready** is defined, you should add function in your sample view model, with name, which is the same as **ready** value. If you don't do this, the exception "Unable to process binding" occurs. 

**Value:** any acceptable for function name.

**Default value:** don't have default value.

####rowClick

Sets row click handler function name, which can be used in your sample view model to set your action on row click. Handler function has 2 parameters: *item* and *event*. *Item* is an element of your itemsProvider array, binded to clicked row. *Event* is mouse event click.

If **rowClick** is defined, then **selectionMode** is set to 'none' and **showDetailsOnSelection** is set to 'false'.

**Value:** any string.

**Default value:** null.

####selectionMode

Defines how many items can be selected in TGrid. If **rowClick** is defined, is set to  *'none'*.

**Value:**
+ "none" - you can't select any item,
 
+ "single" - you can select only one item, 

+ "multi" - you can select more, then one item. For selecting more then one item, press key 'Ctrl'.

**Default value:** *single*.

####showDetailsOnSelection.

Enables or disables details on selection. If **rowClick** is defined, is set to *false*.

**Value:** *true* or *false*.

**Default value:** *false*.
    
To make details working on selection you should define html details template in TGrid description.

