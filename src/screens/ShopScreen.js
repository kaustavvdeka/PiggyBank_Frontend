import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Alert,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { apiGet, apiPost } from '../api/client';

export default function ShopScreen() {
  const [mode, setMode] = useState('buyer');
  const [products, setProducts] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    quantity: '1'
  });

  // Demo data
  const demoProducts = [
    {
      _id: '1',
      title: 'Organic Chicken Feed',
      description: 'High-quality organic feed for chickens. Promotes healthy growth and egg production.',
      price: 25.99,
      category: 'Feed',
      image: 'https://placekitten.com/200/200',
      seller: 'Farm Supply Co.',
      rating: 4.5,
      reviews: 124,
      quantity: 1,
      inStock: true
    },
    {
      _id: '2',
      title: 'Veterinary First Aid Kit',
      description: 'Complete first aid kit for farm animals. Essential for emergency care.',
      price: 89.99,
      category: 'Medical',
      image: 'https://placekitten.com/201/201',
      seller: 'Animal Care Supplies',
      rating: 4.8,
      reviews: 89,
      quantity: 1,
      inStock: true
    },
    {
      _id: '3',
      title: 'Automatic Watering System',
      description: 'Automatic watering system for poultry. Saves time and ensures fresh water.',
      price: 149.99,
      category: 'Equipment',
      image: 'https://placekitten.com/202/202',
      seller: 'FarmTech Solutions',
      rating: 4.3,
      reviews: 67,
      quantity: 1,
      inStock: true
    },
    {
      _id: '4',
      title: 'Organic Fertilizer',
      description: 'Natural fertilizer for crops. Improves soil health and yield.',
      price: 34.99,
      category: 'Crop Care',
      image: 'https://placekitten.com/203/203',
      seller: 'Green Thumb Organics',
      rating: 4.6,
      reviews: 203,
      quantity: 1,
      inStock: false
    }
  ];

  const demoAnimals = [
    {
      _id: '1',
      type: 'Dairy Cows',
      breed: 'Holstein',
      age: '2-3 years',
      price: 2500,
      image: 'https://placekitten.com/204/204',
      location: 'Springfield Farm',
      quantity: 5,
      healthStatus: 'Vaccinated'
    },
    {
      _id: '2',
      type: 'Chicken Broilers',
      breed: 'Cornish Cross',
      age: '6 weeks',
      price: 15,
      image: 'https://placekitten.com/205/205',
      location: 'Green Valley Poultry',
      quantity: 100,
      healthStatus: 'Healthy'
    }
  ];

  const myDemoProducts = [
    {
      _id: '101',
      title: 'Fresh Organic Eggs',
      description: 'Farm fresh organic eggs from free-range chickens.',
      price: 4.99,
      category: 'Produce',
      image: 'https://placekitten.com/206/206',
      status: 'active',
      sales: 45,
      stock: 12
    }
  ];

  useEffect(() => {
    loadData();
  }, [mode]);

  const loadData = () => {
    setRefreshing(true);
    
    // Simulate API calls
    setTimeout(() => {
      if (mode === 'buyer') {
        apiGet('/api/shop/products')
          .then(data => {
            setProducts(data && data.length > 0 ? data : demoProducts);
            setAnimals(data && data.length > 0 ? [] : demoAnimals);
          })
          .catch(() => {
            setProducts(demoProducts);
            setAnimals(demoAnimals);
          })
          .finally(() => setRefreshing(false));
      } else {
        apiGet('/api/shop/my-products')
          .then(data => {
            setMyProducts(data && data.length > 0 ? data : myDemoProducts);
          })
          .catch(() => {
            setMyProducts(myDemoProducts);
          })
          .finally(() => setRefreshing(false));
      }
    }, 1000);
  };

  const addToCart = (product) => {
    Alert.alert('Added to Cart', `${product.title} has been added to your cart!`);
    // Here you would typically update cart context or state
  };

  const addToWishlist = (product) => {
    Alert.alert('Added to Wishlist', `${product.title} has been added to your wishlist!`);
  };

  const placeOrder = (product) => {
    Alert.alert(
      'Confirm Order',
      `Order ${product.title} for $${product.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Order Placed', 'Your order has been placed successfully!');
          }
        }
      ]
    );
  };

  const addProduct = () => {
    if (!newProduct.title || !newProduct.price) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const product = {
      ...newProduct,
      _id: Date.now().toString(),
      status: 'active',
      sales: 0,
      stock: parseInt(newProduct.quantity) || 1
    };

    setMyProducts(prev => [product, ...prev]);
    setNewProduct({
      title: '',
      description: '',
      price: '',
      category: '',
      image: '',
      quantity: '1'
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Product listed successfully!');
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productTitle}>{item.title}</Text>
          {!item.inStock && <Text style={styles.outOfStock}>Out of Stock</Text>}
        </View>
        <Text style={styles.productSeller}>by {item.seller}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.reviews}>({item.reviews} reviews)</Text>
        </View>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.wishlistButton}
              onPress={() => addToWishlist(item)}
            >
              <Text style={styles.wishlistIcon}>❤️</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.cartButton,
                !item.inStock && styles.cartButtonDisabled
              ]}
              onPress={() => item.inStock ? addToCart(item) : null}
              disabled={!item.inStock}
            >
              <Text style={styles.cartButtonText}>
                {item.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderAnimalItem = ({ item }) => (
    <View style={styles.animalCard}>
      <Image source={{ uri: item.image }} style={styles.animalImage} />
      <View style={styles.animalInfo}>
        <Text style={styles.animalType}>{item.type}</Text>
        <Text style={styles.animalBreed}>{item.breed}</Text>
        <Text style={styles.animalDetails}>Age: {item.age}</Text>
        <Text style={styles.animalDetails}>Health: {item.healthStatus}</Text>
        <Text style={styles.animalDetails}>Location: {item.location}</Text>
        <View style={styles.animalFooter}>
          <Text style={styles.animalPrice}>${item.price}</Text>
          <TouchableOpacity 
            style={styles.inquireButton}
            onPress={() => placeOrder(item)}
          >
            <Text style={styles.inquireButtonText}>Inquire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderMyProductItem = ({ item }) => (
    <View style={styles.myProductCard}>
      <Image source={{ uri: item.image }} style={styles.myProductImage} />
      <View style={styles.myProductInfo}>
        <Text style={styles.myProductTitle}>{item.title}</Text>
        <Text style={styles.myProductDescription}>{item.description}</Text>
        <View style={styles.myProductStats}>
          <Text style={styles.myProductStat}>Price: ${item.price}</Text>
          <Text style={styles.myProductStat}>Stock: {item.stock}</Text>
          <Text style={styles.myProductStat}>Sales: {item.sales}</Text>
        </View>
        <View style={styles.myProductActions}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Mode Switch */}
      <View style={styles.switchRow}>
        <TouchableOpacity
          onPress={() => setMode('buyer')}
          style={[styles.modeBtn, mode === 'buyer' && styles.modeActive]}
        >
          <Text style={[styles.modeText, mode === 'buyer' && styles.modeTextActive]}>
            🛒 Buyer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('seller')}
          style={[styles.modeBtn, mode === 'seller' && styles.modeActive]}
        >
          <Text style={[styles.modeText, mode === 'seller' && styles.modeTextActive]}>
            🏪 Seller
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'buyer' ? (
        <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadData}
              colors={[colors.primary]}
            />
          }
        >
          {/* Products Section */}
          <Text style={styles.sectionTitle}>Products</Text>
          <FlatList
            data={products}
            keyExtractor={(it) => it._id}
            renderItem={renderProductItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />

          {/* Animals Section */}
          <Text style={styles.sectionTitle}>Live Animals</Text>
          <FlatList
            data={animals}
            keyExtractor={(it) => it._id}
            renderItem={renderAnimalItem}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </ScrollView>
      ) : (
        <View style={styles.sellerContainer}>
          <TouchableOpacity 
            style={styles.addProductButton}
            onPress={() => setShowAddModal(true)}
          >
            <Text style={styles.addProductText}>+ Add New Product</Text>
          </TouchableOpacity>

          <FlatList
            data={myProducts}
            keyExtractor={(it) => it._id}
            renderItem={renderMyProductItem}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadData}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📦</Text>
                <Text style={styles.emptyTitle}>No Products Listed</Text>
                <Text style={styles.emptyText}>Start selling by adding your first product!</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Add Product Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Product</Text>
              
              <ScrollView style={styles.modalForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Product Title"
                  value={newProduct.title}
                  onChangeText={(text) => setNewProduct({...newProduct, title: text})}
                />
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Description"
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct({...newProduct, description: text})}
                  multiline
                  numberOfLines={3}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct({...newProduct, price: text})}
                  keyboardType="decimal-pad"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Category"
                  value={newProduct.category}
                  onChangeText={(text) => setNewProduct({...newProduct, category: text})}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChangeText={(text) => setNewProduct({...newProduct, image: text})}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChangeText={(text) => setNewProduct({...newProduct, quantity: text})}
                  keyboardType="numeric"
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAddModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.submitButton}
                  onPress={addProduct}
                >
                  <Text style={styles.submitButtonText}>List Product</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: colors.background,
    paddingTop: 40,
  },
  switchRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 20,
    backgroundColor: colors.surface,
    padding: 4,
    borderRadius: 12,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeActive: {
    backgroundColor: colors.primary,
  },
  modeText: {
    fontWeight: '600',
    color: colors.textMuted,
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  // Product Card Styles
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadow.card,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  outOfStock: {
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    marginLeft: 8,
  },
  productSeller: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  reviews: {
    fontSize: 12,
    color: colors.textMuted,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wishlistButton: {
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
  },
  wishlistIcon: {
    fontSize: 16,
  },
  cartButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cartButtonDisabled: {
    backgroundColor: colors.textMuted,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Animal Card Styles
  animalCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...shadow.card,
  },
  animalImage: {
    width: '100%',
    height: 180,
  },
  animalInfo: {
    padding: 16,
  },
  animalType: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  animalBreed: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  animalDetails: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  animalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  animalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  inquireButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inquireButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Seller Styles
  sellerContainer: {
    flex: 1,
  },
  addProductButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    ...shadow.card,
  },
  addProductText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  myProductCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    flexDirection: 'row',
    ...shadow.card,
  },
  myProductImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  myProductInfo: {
    flex: 1,
  },
  myProductTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  myProductDescription: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 8,
  },
  myProductStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  myProductStat: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  myProductActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 12,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalForm: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});