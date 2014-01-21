using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
    public class SortDescriptor
    {
        public string path {get; set;}
        public bool? asc { get; set; }


        public SortDescriptor()
        {
            this.path = String.Empty;
            this.asc = null;
        }
        public SortDescriptor(string path, bool? acs)
        {
            this.path = path;
            this.asc = acs;
        }
    }
}