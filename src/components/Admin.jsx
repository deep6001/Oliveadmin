import React, { useEffect, useState } from 'react';
import { collection, getDocs ,onSnapshot} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import {
    Users,
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    Package,
    Ruler,
    Hash,
    DollarSign,
    Search,
    Filter,
    Download,
    Eye,
    ChevronRight
} from 'lucide-react';

function BuyerData() {
    const [buyers, setBuyers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuyer, setSelectedBuyer] = useState(null);


   useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, 'BuyerDetails'), async (buyerSnapshot) => {
    const buyersData = await Promise.all(
      buyerSnapshot.docs.map(async (buyerDoc) => {
        const buyerId = buyerDoc.id;
        const buyerInfo = buyerDoc.data().BuyerInfo;

        const productSnapshot = await getDocs(
          collection(db, 'BuyerDetails', buyerId, 'ProductDetails')
        );

        const products = productSnapshot.docs.map((doc) => {
          const productInfo = doc.data().ProductInfo;
          const productCategories = Object.entries(productInfo || {}).map(([categoryName, sizesObj]) => {
            const sizes = Object.entries(sizesObj).map(([sizeLabel, sizeDetails]) => ({
              sizeLabel,
              ...sizeDetails,
            }));
            return {
              categoryName,
              sizes,
            };
          });

          return {
            id: doc.id,
            productCategories,
          };
        });

        return {
          id: buyerId,
          buyerInfo,
          products,
        };
      })
    );

    setBuyers(buyersData);
  });

  // 🔁 Clean up listener on unmount
  return () => unsubscribe();
}, []);


    console.log(buyers)


    const filteredBuyers = buyers.filter((buyer) =>
  buyer.buyerInfo?.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  buyer.buyerInfo?.firmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  buyer.buyerInfo?.emailId.toLowerCase().includes(searchTerm.toLowerCase())
);


    const getTotalAmount = (buyer) => {
  return buyer.products.reduce((total, product) => {
    return total + product.productCategories.reduce((catTotal, category) => {
      return catTotal + category.sizes.reduce((sizeTotal, size) => sizeTotal + (size.total || 0), 0);
    }, 0);
  }, 0);
};


   const getTotalProducts = (buyer) => {
  return buyer.products.reduce((total, product) => {
    return total + product.productCategories.reduce((catTotal, category) => {
      return catTotal + category.sizes.length;
    }, 0);
  }, 0);
};


  const getTotalQuantity = (buyer) => {
  return buyer.products.reduce((total, product) => {
    return total + product.productCategories.reduce((catTotal, category) => {
      return catTotal + category.sizes.reduce((sizeTotal, size) => sizeTotal + (size.quantity || 0), 0);
    }, 0);
  }, 0);
};

    return (
        <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buyer Management</h1>
                <p className="text-sm text-gray-600">Manage buyers and their product orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Buyers</p>
                <p className="text-2xl font-bold text-gray-900">{buyers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {buyers.reduce((total, buyer) => total + getTotalProducts(buyer), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Hash className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quantity</p>
                <p className="text-2xl font-bold text-gray-900">
                  {buyers.reduce((total, buyer) => total + getTotalQuantity(buyer), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{buyers.reduce((total, buyer) => total + getTotalAmount(buyer), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search buyers by name, firm, or email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-5 w-5 text-gray-400" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Buyers */}
        <div className="grid grid-cols-1 gap-6">
          {filteredBuyers.map((buyer, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 border-b border-green-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                      {buyer.buyerInfo?.dealerName?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{buyer.buyerInfo?.dealerName}</h3>
                      <div className="flex items-center space-x-2 text-green-700">
                        <Building2 className="h-4 w-4" />
                        <span className="font-medium">{buyer.buyerInfo?.firmName}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setSelectedBuyer(selectedBuyer?.id === buyer.id ? null : buyer)
                    }
                    className="bg-white text-green-600 border border-green-300 rounded-lg px-3 py-2 hover:bg-green-50 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{buyer.buyerInfo?.emailId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">{buyer.buyerInfo?.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{buyer.buyerInfo?.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">GST Number</p>
                      <p className="font-medium text-gray-900">{buyer.buyerInfo?.gstNo}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{getTotalProducts(buyer)}</p>
                    <p className="text-sm text-gray-600">Products</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{getTotalQuantity(buyer)}</p>
                    <p className="text-sm text-gray-600">Quantity</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">₹{getTotalAmount(buyer).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                </div>

                {selectedBuyer?.id === buyer.id && (
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center space-x-2">
                      <Package className="h-5 w-5 text-green-600" />
                      <span>Product Details</span>
                    </h4>
                    {buyer.products.map((product, i) => (
                      <div key={i} className="space-y-4">
                        {product.productCategories.map((category, j) => (
                          <div key={j} className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-semibold text-gray-900 mb-3">{category.categoryName}</h5>
                            <div className="space-y-2">
                              {category.sizes.map((size, k) => (
                                <div
                                  key={k}
                                  className="flex items-center justify-between bg-white p-3 rounded-lg"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                      <Ruler className="h-4 w-4 text-gray-400" />
                                      <span className="font-medium">Size: {size.size}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Hash className="h-4 w-4 text-gray-400" />
                                      <span>Qty: {size.quantity}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">₹{size.price} each</p>
                                    <p className="text-sm text-green-600 font-bold">
                                      Total: ₹{size.total.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredBuyers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No buyers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
    );


}

export default BuyerData;
