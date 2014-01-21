using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
    public class Item
    {
        public int? Number { get; set; }
        public string Brand { get; set; }
        public string Type { get;  set; }
        public int? Year { get; set; }
        public int? EnginePower { get; set; }
        public string Cabin { get; set; }
        public string PictureName { get; set; }
        public Dictionary<string, string> collapsedValue { get; set; }

        public Item(int number, string brand, string type, int year, int enginePower, string cabin, string pictureName)
        {
            this.Number = number;
            this.Brand = brand;
            this.Type = type;
            this.Year = year;
            this.EnginePower = enginePower;
            this.Cabin = cabin;
            this.PictureName = pictureName;
        }

        public Item()
        {
            this.Number = null;
            this.Brand = String.Empty;
            this.Type = String.Empty;
            this.Year = null;
            this.EnginePower = null;
            this.Cabin = String.Empty;
            this.PictureName = String.Empty;
        }
    }
}