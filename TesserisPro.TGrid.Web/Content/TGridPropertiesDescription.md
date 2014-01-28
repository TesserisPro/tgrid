##TGrid properties

Some of TGrid properties has default values and are not required to be defined in template.

####itemsProvider
    
Defines item provider for grid.

**Value:** JavaScript object that contains item provide functions.

**Default value:** there is **no default value**

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

####pageSize.

Defines how many items are displayed on 1 page.

**Value:** number from 1 to total items count.

**Default value:** *10*.

####pageSlide

Sets how many pages should be visible (to the left and to the right from current) in pager.

**Value:** number from 1 to  total items count.

**Default value:** *10*.

####selectionMode

Defines how many items can be selected in TGrid.

**Value:**
+ "none" - you can't select any item,
 
+ "single" - you can select only one item, 

+ "multi" - you can select more, then one item. For selecting more then one item, press key 'Ctrl'.

**Default value:** *single*.

####showDetailsOnSelection.

Enables or disables details on selection. 

**Value:** *true* or *false*.

**Default value:** *false*.
    
To make details working on selection you should define html details template in TGrid description.