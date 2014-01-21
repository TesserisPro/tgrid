using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
   
    public static class CustomServerItemsProvider
    {
        private static List<Item> sendItems = new List<Item>();
        private static List<Item> items = new List<Item>(100000);
        private static string Path;
        private static List<SortDescriptor> sortDescriptors;
        private static int i;



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
            for (int i = 1; i <= 100000; i++)
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
            CustomServerItemsProvider.sendItems = new List<Item>(100000);
            foreach(var item in CustomServerItemsProvider.items){
                CustomServerItemsProvider.sendItems.Add(item);
            }
            CustomServerItemsProvider.sortDescriptors = new List<SortDescriptor>();
            if (sortDescriptors != null)
            {
                CustomServerItemsProvider.sortDescriptors = sortDescriptors;
            }
            if (sortDescriptors[CustomServerItemsProvider.i].asc != null)
            {
                bool isOrderAsc = sortDescriptors[CustomServerItemsProvider.i].asc ?? false;
                switch (sortDescriptors[CustomServerItemsProvider.i].path)
                {
                    case "Number":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.Number).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.Number).ToList();
                        }
                        break;
                    case "PictureName":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.PictureName).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.PictureName).ToList();
                        }
                        break;
                    case "Brand":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.Brand).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.Brand).ToList();
                        }
                        break;
                    case "Type":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.Type).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.Type).ToList();
                        }
                        break;
                    case "Year":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.Year).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.Year).ToList();
                        }
                        break;
                    case "EnginePower":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.EnginePower).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.EnginePower).ToList();
                        }
                        break;
                    case "Cabin":
                        if (isOrderAsc)
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderBy(x => x.Cabin).ToList();
                        }
                        else
                        {
                            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.OrderByDescending(x => x.Cabin).ToList();
                        }
                        break;
                }
            }
            CustomServerItemsProvider.sendItems = CustomServerItemsProvider.onFiltering(filterDescriptors, collapsedFilterDescriptors).Skip(firstItem ?? 0).ToList().Take(itemsNumber ?? 0).ToList();
           //CustomServerItemsProvider.sendItems = CustomServerItemsProvider.sendItems.Skip(firstItem ?? 0).ToList().Take(itemsNumber ?? 0).ToList();
           return CustomServerItemsProvider.sendItems;
        }

        public static int getTotalItemsCount(List<FilterDescriptor> filterDescriptors)
        {
            CustomServerItemsProvider.sendItems = new List<Item>(100000);
            foreach (var item in CustomServerItemsProvider.items)
            {
                CustomServerItemsProvider.sendItems.Add(item);
            }
            return CustomServerItemsProvider.onFiltering(filterDescriptors, null).Count;
         }

        private static void Sorting(List<SortDescriptor> sortDescriptors)
        {
            if (sortDescriptors != null && sortDescriptors.Count > 0 && sortDescriptors[0].path != null) {
                 CustomServerItemsProvider.sendItems.Sort();
                    //CustomServerItemsProvider.Sort(sortingRecursive(CustomServerItemsProvider.items[0].ToString(), CustomServerItemsProvider.items[1].ToString(), sortDescriptors, 0))
            }
            
        }

        private static int sortingRecursive(Item a, Item b)
        {
            CustomServerItemsProvider.i = 0;
            if (CustomServerItemsProvider.sortDescriptors.Count > 0)
            {
                if (CustomServerItemsProvider.i != CustomServerItemsProvider.sortDescriptors.Count - 1)
                {
                    if (getMemberValue(a, CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i].path).CompareTo(getMemberValue(a, CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i].path)) > 0)
                        return CustomServerItemsProvider.sortingOrder(sortDescriptors[i]);
                    if (getMemberValue(b, CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i].path).CompareTo(getMemberValue(a, CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i].path)) > 0)
                        return CustomServerItemsProvider.sortingOrderDesc(sortDescriptors[i]);
                    CustomServerItemsProvider.i++;
                    return CustomServerItemsProvider.sortingRecursive(a, b);
                }
                else
                {
                    return getMemberValue(a, CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i].path).CompareTo(getMemberValue(b, CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i].path)) > 0
                        ? CustomServerItemsProvider.sortingOrder(CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i])
                        : CustomServerItemsProvider.sortingOrderDesc(CustomServerItemsProvider.sortDescriptors[CustomServerItemsProvider.i]);
                }
                }
            else return 0;
            //if (i != sortDescriptors.Count - 1) {
            //    if (getMemberValue(a, sortDescriptors[i].Path).CompareTo(getMemberValue(b, sortDescriptors[i].Path)) > 0)
            //        return CustomServerItemsProvider.sortingOrder(sortDescriptors[i]);
            //    if (getMemberValue(b, sortDescriptors[i].Path).CompareTo(getMemberValue(a, sortDescriptors[i].Path)) > 0)
            //        return CustomServerItemsProvider.sortingOrderDesc(sortDescriptors[i]);
            //    return CustomServerItemsProvider.sortingRecursive(a, b, sortDescriptors, i + 1);
            //    } else {
            //    return getMemberValue(a, sortDescriptors[i].Path).CompareTo(getMemberValue(b, sortDescriptors[i].Path)) > 0 ? CustomServerItemsProvider.sortingOrder(sortDescriptors[i]) : CustomServerItemsProvider.sortingOrderDesc(sortDescriptors[i]);
            //}
            //return 1;
        }

        private static int sortingOrder(SortDescriptor sortDescriptor)
        {
             
            return sortDescriptor.asc ?? false ? 1 : -1;
        }

        private static int sortingOrderDesc(SortDescriptor sortDescriptor)
        {
            return  sortDescriptor.asc ?? false ? -1 : 1;
        }

        private static List<Item> onFiltering(List<FilterDescriptor> filterDescriptors, List<FilterDescriptor> collapsedFilterDescriptors)
        {
            if ((filterDescriptors == null || filterDescriptors.Count == 0) && (collapsedFilterDescriptors == null || collapsedFilterDescriptors.Count == 0)) {
                return CustomServerItemsProvider.sendItems;
            }

            if (collapsedFilterDescriptors == null) {
                collapsedFilterDescriptors = new List<FilterDescriptor>();
            }

            List<bool> isCollapsedItem = new List<bool>();
            for (int c = 0; c < collapsedFilterDescriptors.Count; c++) {
                isCollapsedItem.Add(false);
            }

            List<Item> filteredItems = new List<Item>();
            for (var j = 0; j < CustomServerItemsProvider.sendItems.Count; j++)
            {
                // filtering common filters
                var isFiltered = 0;
                if (filterDescriptors != null)
                {
                    for (var i = 0; i < filterDescriptors.Count; i++)
                    {
                        if (CustomServerItemsProvider.filter(CustomServerItemsProvider.sendItems[j], filterDescriptors[i]))
                        {
                            isFiltered++;
                        }
                    }
                }

                // filtering collapsed filter
                bool isCollapsedFiltered = false;
                var numberfilter = -1;
                if (collapsedFilterDescriptors != null)
                {
                    for (var i = 0; i < collapsedFilterDescriptors.Count; i++)
                    {
                        if (CustomServerItemsProvider.filter(CustomServerItemsProvider.sendItems[j], collapsedFilterDescriptors[i]))
                        {
                            isCollapsedFiltered = true;
                            numberfilter = i;
                            i = collapsedFilterDescriptors.Count;
                        }
                    }
                }

                //add fake item for creating collapsing group
                if (isFiltered == 0 && !isCollapsedFiltered) {
                    filteredItems.Add(CustomServerItemsProvider.sendItems[j]);
                } else {
                    if (isFiltered == 0) {
                        if (isCollapsedFiltered && !isCollapsedItem[numberfilter]) {
                            Item fakeItem = new Item();
                            CustomServerItemsProvider.setMemberValue(fakeItem, collapsedFilterDescriptors[numberfilter].path, collapsedFilterDescriptors[numberfilter].value);
                            for (var i = 0; i < collapsedFilterDescriptors[numberfilter].children.Count; i++) {
                                CustomServerItemsProvider.setMemberValue(fakeItem, collapsedFilterDescriptors[numberfilter].children[i].path, collapsedFilterDescriptors[numberfilter].children[i].value);
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
            string value = CustomServerItemsProvider.getMemberValue(item, filterDescriptor.path);

            if (!String.IsNullOrEmpty(value))
            {
                if (!CustomServerItemsProvider.isFiltering(value, filterDescriptor.value, (int)filterDescriptor.condition))
                {
                    if (filterDescriptor.children.Count == 0)
                    {
                        return true;
                    }
                    else
                    {
                        int result = 0;
                        for (var i = 0; i < filterDescriptor.children.Count; i++)
                        {
                            string collapsedValue = CustomServerItemsProvider.getMemberValue(item, filterDescriptor.children[i].path);
                            if (!CustomServerItemsProvider.isFiltering(collapsedValue, filterDescriptor.children[i].value, (int)filterDescriptor.children[i].condition))
                            {
                                result++;
                            }
                        }
                        if (result == filterDescriptor.children.Count)
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

        private static string getMemberValue(Item target, string path)
        {
            if (path == null || path.Length == 0) {
                return target.ToString();
            }

            List<string> pathNames = path.Split('.').ToList<string>();
            Item item = target;
            string value = String.Empty;

            while (pathNames.Count > 0) {
                switch (pathNames[0])
                {
                    case "Number":
                        value = item.Number.ToString();
                        break;
                    case "PictureName":
                        value = item.PictureName.ToString();
                        break;
                    case "Brand":
                        value = item.Brand.ToString();
                        break;
                    case "Type":
                        value = item.Type.ToString();
                        break;
                    case "Year":
                        value = item.Year.ToString();
                        break;
                    case "EnginePower":
                        value = item.Year.ToString();
                        break;
                    case "Cabin":
                        value = item.Cabin.ToString();
                        break;
                    default:
                        value = item.Number.ToString();
                        break;
                }
                pathNames.RemoveAt(0);
            }
            return value;
        }

        private static Item setMemberValue(Item target, string path, string value)
        {
            if (path == null || path.Length == 0)
            {
                return target;
            }
            List<string> pathNames = path.Split('.').ToList<string>();
            Item item = target;

            while (pathNames.Count > 0)
            {
                switch (pathNames[0])
                {
                    case "Number":
                        item.Number = int.Parse(value);
                        break;
                    case "PictureName":
                        item.PictureName = value;
                        break;
                    case "Brand":
                        item.Brand = value;
                        break;
                    case "Type":
                        item.Type = value;
                        break;
                    case "Year":
                        item.Year = int.Parse(value);
                        break;
                    case "EnginePower":
                       item.EnginePower = int.Parse(value);
                        break;
                    case "Cabin":
                        item.Cabin = value;
                        break;
                    default:
                        item.Number = int.Parse(value);
                        break;
                }
                pathNames.RemoveAt(0);
            }
            return item;
        }
    }
}