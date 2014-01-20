using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
    public enum Condition { None, Equals, NotEquals };
    
    public enum FilterOperation { And, Or };
    
    public class FilterDescriptor
    {
        public string Path { get; private set; }
        public string Value { get; private set; }
        public Condition condition { get; private set; }
        public FilterOperation filterOperation { get; private set; }
        public List<FilterDescriptor> Children { get; private set; }

        public FilterDescriptor(string path, string value, Condition condition, List<FilterDescriptor> children, FilterOperation filterOperation = FilterOperation.And)
        {
            this.Path = path;
            this.Value = value;
            this.condition = condition;
            this.filterOperation = filterOperation;
            this.Children =  children != null ? children : new List<FilterDescriptor>();
        }


    }
}