using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using TesserisPro.TGrid.Server;

namespace TesserisPro.TGrid.Server.Tests
{
    class ClassA
    {
        public ClassB test = new ClassB();
    }

    public class ClassB
    {
        public string value = "test";
        public string Value
        {
            get
            {
                return "Test";
            }
        }
    }

    [TestClass]
    public class MemberByPathExtensionsTest
    {
        [TestMethod]
        public void TestPropertyAccess()
        {
            var testObject = new ClassA();
            Assert.AreEqual("Test", testObject.GetMemberValue<string>("test.Value"));
        }

        [TestMethod]
        public void TestFiledAccess()
        {
            var testObject = new ClassA();
            Assert.AreEqual("test", testObject.GetMemberValue<string>("test.value"));
        }

        [TestMethod]
        public void TestDirectFieldAccess()
        {
            var testObject = new ClassA();
            Assert.AreEqual(testObject.test, testObject.GetMemberValue<ClassB>("test"));
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidCastException))]
        public void TestCastException()
        {
            var testObject = new ClassA();
            testObject.GetMemberValue<string>("test");
        }

        [TestMethod]
        [ExpectedException(typeof(MissingMemberException))]
        public void TestMissingmemberException()
        {
            var testObject = new ClassA();
            testObject.GetMemberValue<string>("missing.missing2.missing3");
        }

        [TestMethod]
        public void TestEmptyPath()
        {
            var testObject = new ClassA();
            Assert.AreEqual(testObject, testObject.GetMemberValue<object>(""));
        }

        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void TestWrongPathFormat()
        {
            var testObject = new ClassA();
            testObject.GetMemberValue<object>("fsfj%203k,x");
        }

    }
}
