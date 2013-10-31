using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TesserisPro.TGrid.Server
{
    public static class MemberByPathExtensions
    {
        public static T GetMemberValue<T>(this object target, string path)
        {
            if(string.IsNullOrEmpty(path))
            {
                return (T)target;
            }

            if(ValidateMemberPath(path))
            {
                var pathNames = path.Split('.').ToList();
               
                object value = target;
                while(pathNames.Any())
                {
                    value = GetMemberValue(value, pathNames.First());
                    pathNames.Remove(pathNames.First());
                }

                return (T)value;
            }
            else
            {
                throw new ArgumentException("Path is not correct");
            }
        }

        private static bool ValidateMemberPath(string path)
        {
            var validationRegex = new Regex("^@?([a-z]|[A-Z]|_)([a-z]|[A-Z]|[0-9]|_)*(\\.@?(|[a-z]|[A-Z]|[0-9]|_)+)*$");
            return validationRegex.IsMatch(path);
        }

        private static object GetMemberValue(object target, string memberName)
        {
            if(target == null)
            {
                throw new NullReferenceException("Target should not be null");
            }

            var type = target.GetType();
            var property = type.GetProperties(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance)
                               .LastOrDefault(x => x.Name == memberName);

            if(property != null)
            {
                return property.GetValue(target);
            }
            else
            {
                var filed = type.GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance)
                                .LastOrDefault(x => x.Name == memberName);
                if(filed != null)
                {
                    return filed.GetValue(target);
                }
            }

            throw new MissingMemberException(target.GetType().Name, memberName);
        }
    }
}
