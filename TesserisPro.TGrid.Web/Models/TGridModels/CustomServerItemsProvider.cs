using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
    public static class CustomServerItemsProvider
    {
        private static List<Item> items = new List<Item>();
        private static string Path;

        static CustomServerItemsProvider()
        {
            List<string> Brand = new List<string> { "MAN", "DAF", "Mercedes", "Iveco", "Volvo", "Scania", "Terberg", "Renault" };
            List<int> Hp = new List<int> { 460, 510, 410, 380, 360, 430, 480, 450, 460, 460, 410, 410, 400, 500, 310 };
            List<string> picturesPath = new List<string> {"truck1.png", "truck3.jpg", "truck4.png", "truck5.png", "truck6.png", "truck7.png",
                "truck8.png", "truck9.png", "truck10.jpg", "truck11.jpg", "truck12.png", "truck13.png", "truck14.png", "truck15.png",
                "truck16.png", "truck17.png", "truck18.png"};
            List<string> type0 = new List<string> { "TGX 18.440 XLX", "TGX 18.680 XXL", "TGS 33.480 LX", "TGA 33.400 L RHD", "TGA 18.440 XLX", "TGA 18.400 XXL", "TGA 18.480 M", "TGA 33.480 M", "TGA 18.460 LX" };
            List<string> type1 = new List<string> { "XF105.410", "XF105.460", "CF85.360", "XF105.410", "CF85.430", "CF85.460", "XF95.480" };
            List<string> cabin = new List<string> { "Sleepercab", "Super Space Cab", "Space Cab", "Active Space", "ActiveTime", "Comfort Cab", "Globetrotter", "Globetrotter XL", "Short", "Sleepercab", "Super Space Cab", "Space Cab" };
            Random rnd = new Random();
            Random rnd2 = new Random();
            for (int i = 1; i <= 20; i++)
            {
                int brandNumber = rnd.Next(0, Brand.Count);
                List<string> typeNumber = new List<string>();
                switch (brandNumber)
                {
                    case 0:
                        typeNumber = type0;
                        break;
                    default:
                        typeNumber = type1;
                        break;
                }
                Item item = new Item(i, Brand[brandNumber], typeNumber[rnd.Next(0, typeNumber.Count - 1)], rnd.Next(1996, 2014), Hp[rnd.Next(0, Hp.Count - 1)], cabin[rnd.Next(0, cabin.Count - 1)], CustomServerItemsProvider.Path + picturesPath[rnd.Next(0, picturesPath.Count - 1)]);
                CustomServerItemsProvider.items.Add(item);
            }
        }

        public static List<Item> getItems(int? firstItem, int? itemsNumber, List<SortDescriptor> sortDescriptors, List<FilterDescriptor> filterDescriptors, List<FilterDescriptor> collapsedFilterDescriptors)
        {
            return CustomServerItemsProvider.items;
           // return CustomServerItemsProvider.onFiltering(filterDescriptors, collapsedFilterDescriptors).Skip(firstItem ?? 0).Take(itemsNumber ?? 0).ToList();
        }

        public static int getTotalItemsCount(List<FilterDescriptor> filterDescriptors, List<FilterDescriptor> collapsedFilterDescriptors)
        {
            return CustomServerItemsProvider.OnFilter(filterDescriptors, collapsedFilterDescriptors).Count;
         }

        private static List<Item> OnFilter(List<FilterDescriptor> filterDescriptors, List<FilterDescriptor> collapsedFilterDescriptors){
            List<Item> filteredItems = new List<Item>();
            filteredItems = CustomServerItemsProvider.onFiltering(filterDescriptors, collapsedFilterDescriptors);
            return filteredItems; 
        }

        private static void Sort(List<SortDescriptor> sortDescriptors)
        {
            if (sortDescriptors != null && sortDescriptors.Count > 0 && sortDescriptors[0].Path != null) {
                //sortingRecursive(CustomServerItemsProvider.items[0].ToString(), CustomServerItemsProvider.items[1].ToString(), sortDescriptors, 0);
                 CustomServerItemsProvider.items.Sort();
                    //CustomServerItemsProvider.Sort(sortingRecursive(CustomServerItemsProvider.items[0].ToString(), CustomServerItemsProvider.items[1].ToString(), sortDescriptors, 0))
            }
            
        }

        private static int sortingRecursive(Item a, Item b, List<SortDescriptor> sortDescriptors, int i)
        {
            //if (i != sortDescriptors.Count - 1) {
            //    if (getMemberValue(a, sortDescriptors[i].Path).CompareTo(getMemberValue(b, sortDescriptors[i].Path)) > 0)
            //        return CustomServerItemsProvider.sortingOrder(sortDescriptors[i]);
            //    if (getMemberValue(b, sortDescriptors[i].Path).CompareTo(getMemberValue(a, sortDescriptors[i].Path)) > 0)
            //        return CustomServerItemsProvider.sortingOrderDesc(sortDescriptors[i]);
            //    return CustomServerItemsProvider.sortingRecursive(a, b, sortDescriptors, i + 1);
            //    } else {
            //    return getMemberValue(a, sortDescriptors[i].Path).CompareTo(getMemberValue(b, sortDescriptors[i].Path)) > 0 ? CustomServerItemsProvider.sortingOrder(sortDescriptors[i]) : CustomServerItemsProvider.sortingOrderDesc(sortDescriptors[i]);
            //}
            return 1;
        }

        private static int sortingOrder(SortDescriptor sortDescriptor)
        {
            return sortDescriptor.Acs ? 1 : -1;
        }

        private static int sortingOrderDesc(SortDescriptor sortDescriptor)
        {
            return sortDescriptor.Acs ? -1 : 1;
        }

        private static List<Item> onFiltering(List<FilterDescriptor> filterDescriptors, List<FilterDescriptor> collapsedFilterDescriptors)
        {
            if ((filterDescriptors == null || filterDescriptors.Count == 0) && (collapsedFilterDescriptors == null || collapsedFilterDescriptors.Count == 0)) {
                return CustomServerItemsProvider.items;
            }

            if (collapsedFilterDescriptors == null) {
                collapsedFilterDescriptors = new List<FilterDescriptor>();
            }

            List<bool> isCollapsedItem = new List<bool>();
            for (int c = 0; c < collapsedFilterDescriptors.Count; c++) {
                isCollapsedItem.Add(false);
            }

            List<Item> filteredItems = new List<Item>();
            for (var j = 0; j < CustomServerItemsProvider.items.Count; j++)
            {
                // filtering common filters
                var isFiltered = 0;
                for (var i = 0; i < filterDescriptors.Count; i++) {
                    if (CustomServerItemsProvider.filter(CustomServerItemsProvider.items[j], filterDescriptors[i]))
                    {
                        isFiltered++;
                    }
                }

                // filtering collapsed filter
                bool isCollapsedFiltered = false;
                var numberfilter = -1;
                for (var i = 0; i < collapsedFilterDescriptors.Count; i++) {
                    if (CustomServerItemsProvider.filter(CustomServerItemsProvider.items[j], collapsedFilterDescriptors[i]))
                    {
                        isCollapsedFiltered = true;
                        numberfilter = i;
                        i = collapsedFilterDescriptors.Count;
                    }
                }

                //add fake item for creating collapsing group
                if (isFiltered == 0 && !isCollapsedFiltered) {
                    filteredItems.Add(CustomServerItemsProvider.items[j]);
                } else {
                    if (isFiltered == 0) {
                        if (isCollapsedFiltered && !isCollapsedItem[numberfilter]) {
                            Item fakeItem = new Item();
                            fakeItem.collapsedValue.Add(collapsedFilterDescriptors[numberfilter].Path, collapsedFilterDescriptors[numberfilter].Value);
                            for (var i = 0; i < collapsedFilterDescriptors[numberfilter].Children.Count; i++) {
                                fakeItem.collapsedValue.Add(collapsedFilterDescriptors[numberfilter].Children[i].Path, collapsedFilterDescriptors[numberfilter].Children[i].Value);
                            }
                            filteredItems.Add(fakeItem);
                            isCollapsedItem[numberfilter] = true;
                        }
                    }
                }
            }

            return filteredItems;
        }

        private static bool filter(Item item, FilterDescriptor filterDescriptor)
        {
            string collapsed;
            bool hasValue = item.collapsedValue.TryGetValue(filterDescriptor.Path, out collapsed);
            
            if (hasValue)
            {
                if (!CustomServerItemsProvider.isFiltering(collapsed, filterDescriptor.Value, (int)filterDescriptor.condition))
                {
                    if (filterDescriptor.Children.Count == 0)
                    {
                        return true;
                    }
                    else
                    {
                        int result = 0;
                        for (var i = 0; i < filterDescriptor.Children.Count; i++)
                        {
                            if (!CustomServerItemsProvider.isFiltering(item.collapsedValue[filterDescriptor.Children[i].Path], filterDescriptor.Children[i].Value, (int)filterDescriptor.Children[i].condition))
                            {
                                result++;
                            }
                        }
                        if (result == filterDescriptor.Children.Count)
                        {
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        private static bool isFiltering(string item, string value, int condition)
        {
            // on false push to filtered items
            switch (condition) {
                case 1://equal
                    return (item == value);
                case 2://not equal
                    return (item != value);
            }
            return false;
        }

        private static string getMemberValue(string target, string path)
        {
            if (path == null || path.Length == 0) {
                return target;
            }

            List<string> pathNames = path.Split('.').ToList<string>();
            string value = target;
            while (pathNames.Count > 0) {
                value = pathNames[0];
                pathNames.RemoveAt(0);
            }
            return value;
        }
    }
}