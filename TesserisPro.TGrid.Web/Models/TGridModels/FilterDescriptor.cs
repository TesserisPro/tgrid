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
        public string path { get; set; }
        public string value { get; set; }
        public bool caseSensitive { get; set; }
        public Condition condition { get; set; }
        public FilterOperation operation { get; set; }
        public List<FilterDescriptor> children { get; set; }

        public FilterDescriptor()
        {
            this.path = null;
            this.value = null;
            this.condition = Condition.None;
            this.operation = FilterOperation.And;
            this.children = children != null ? children : new List<FilterDescriptor>();
        }

        public FilterDescriptor(string path, string value, Condition condition, List<FilterDescriptor> children, FilterOperation filterOperation = FilterOperation.And)
        {
            this.path = path;
            this.value = value;
            this.condition = condition;
            this.operation = filterOperation;
            this.children =  children != null ? children : new List<FilterDescriptor>();
        }


    }
}