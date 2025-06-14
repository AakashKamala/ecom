const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import your models (assuming they're in the same file structure)
// If you have separate model files, adjust the imports accordingly
const User = require('./server'); // Adjust path if needed
const Product = require('./server'); // Adjust path if needed
const Order = require('./server'); // Adjust path if needed

// If models are in the same file as your server, you can define them here:
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  image: { type: String, required: true },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [{
    name: String,
    qty: Number,
    image: String,
    price: Number,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
  }],
  shippingAddress: {
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: Date,
  isDelivered: { type: Boolean, default: false },
  deliveredAt: Date
}, { timestamps: true });

// Define models if not imported
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);
const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    isAdmin: true,
    address: {
      street: '123 Admin Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    address: {
      street: '456 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
    address: {
      street: '789 Oak Avenue',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60614',
      country: 'USA'
    }
  }
];

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest Apple iPhone with A17 Pro chip, titanium design, and advanced camera system.',
    price: 999.99,
    category: 'Electronics',
    brand: 'Apple',
    stock: 50,
    image: '/uploads/iphone15pro.jpg',
    rating: 4.8,
    numReviews: 125
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Premium Android smartphone with S Pen, advanced AI features, and exceptional camera.',
    price: 1199.99,
    category: 'Electronics',
    brand: 'Samsung',
    stock: 30,
    image: '/uploads/galaxys24ultra.jpg',
    rating: 4.7,
    numReviews: 89
  },
  {
    name: 'MacBook Air M3',
    description: '13-inch laptop with M3 chip, up to 18 hours battery life, and stunning Liquid Retina display.',
    price: 1099.99,
    category: 'Computers',
    brand: 'Apple',
    stock: 25,
    image: '/uploads/macbookairm3.jpg',
    rating: 4.9,
    numReviews: 67
  },
  {
    name: 'Dell XPS 13',
    description: 'Ultra-portable laptop with Intel Core i7, 16GB RAM, and InfinityEdge display.',
    price: 1299.99,
    category: 'Computers',
    brand: 'Dell',
    stock: 20,
    image: '/uploads/dellxps13.jpg',
    rating: 4.6,
    numReviews: 43
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with 30-hour battery life.',
    price: 399.99,
    category: 'Audio',
    brand: 'Sony',
    stock: 40,
    image: '/uploads/sonywh1000xm5.jpg',
    rating: 4.8,
    numReviews: 156
  },
  {
    name: 'AirPods Pro 2nd Gen',
    description: 'Active Noise Cancellation wireless earbuds with personalized spatial audio.',
    price: 249.99,
    category: 'Audio',
    brand: 'Apple',
    stock: 60,
    image: '/uploads/airpodspro2.jpg',
    rating: 4.7,
    numReviews: 234
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with Max Air unit and breathable mesh upper.',
    price: 149.99,
    category: 'Footwear',
    brand: 'Nike',
    stock: 80,
    image: '/uploads/nikeairmax270.jpg',
    rating: 4.5,
    numReviews: 178
  },
  {
    name: 'Adidas Ultraboost 22',
    description: 'Premium running shoes with Boost midsole and Primeknit upper for ultimate comfort.',
    price: 189.99,
    category: 'Footwear',
    brand: 'Adidas',
    stock: 45,
    image: '/uploads/adidasultraboost22.jpg',
    rating: 4.6,
    numReviews: 92
  },
  {
    name: 'Levi\'s 501 Original Jeans',
    description: 'Classic straight-leg jeans with button fly and iconic styling.',
    price: 79.99,
    category: 'Clothing',
    brand: 'Levi\'s',
    stock: 100,
    image: '/uploads/levis501.jpg',
    rating: 4.4,
    numReviews: 87
  },
  {
    name: 'Champion Reverse Weave Hoodie',
    description: 'Premium heavyweight hoodie with iconic C logo and reverse weave construction.',
    price: 69.99,
    category: 'Clothing',
    brand: 'Champion',
    stock: 70,
    image: '/uploads/championhoodie.jpg',
    rating: 4.5,
    numReviews: 64
  },
  {
    name: 'Instant Pot Duo 7-in-1',
    description: 'Multi-functional pressure cooker that replaces 7 kitchen appliances.',
    price: 99.99,
    category: 'Home & Kitchen',
    brand: 'Instant Pot',
    stock: 35,
    image: '/uploads/instantpotduo.jpg',
    rating: 4.7,
    numReviews: 145
  },
  {
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection and powerful suction.',
    price: 749.99,
    category: 'Home & Kitchen',
    brand: 'Dyson',
    stock: 15,
    image: '/uploads/dysonv15.jpg',
    rating: 4.8,
    numReviews: 78
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import data function
const importData = async () => {
  try {
    // Clear existing data
    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();

    console.log('Existing data cleared');

    // Hash passwords for users
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        return {
          ...user,
          password: await bcrypt.hash(user.password, salt)
        };
      })
    );

    // Insert users
    const createdUsers = await UserModel.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users imported`);

    // Add reviews to some products
    const adminUser = createdUsers[0];
    const johnUser = createdUsers[1];
    const janeUser = createdUsers[2];

    // Add sample reviews to products
    products[0].reviews = [
      {
        user: johnUser._id,
        name: 'John Doe',
        rating: 5,
        comment: 'Excellent phone! The camera quality is amazing.'
      },
      {
        user: janeUser._id,
        name: 'Jane Smith',
        rating: 4,
        comment: 'Great performance, but quite expensive.'
      }
    ];

    products[4].reviews = [
      {
        user: janeUser._id,
        name: 'Jane Smith',
        rating: 5,
        comment: 'Best noise cancellation I\'ve ever experienced!'
      }
    ];

    // Insert products
    const createdProducts = await ProductModel.insertMany(products);
    console.log(`${createdProducts.length} products imported`);

    // Create sample orders
    const sampleOrders = [
      {
        user: johnUser._id,
        orderItems: [
          {
            name: createdProducts[0].name,
            qty: 1,
            image: createdProducts[0].image,
            price: createdProducts[0].price,
            product: createdProducts[0]._id
          }
        ],
        shippingAddress: {
          address: '456 Main Street',
          city: 'Los Angeles',
          postalCode: '90210',
          country: 'USA'
        },
        paymentMethod: 'Credit Card',
        totalPrice: 999.99,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: false
      },
      {
        user: janeUser._id,
        orderItems: [
          {
            name: createdProducts[4].name,
            qty: 1,
            image: createdProducts[4].image,
            price: createdProducts[4].price,
            product: createdProducts[4]._id
          },
          {
            name: createdProducts[6].name,
            qty: 1,
            image: createdProducts[6].image,
            price: createdProducts[6].price,
            product: createdProducts[6]._id
          }
        ],
        shippingAddress: {
          address: '789 Oak Avenue',
          city: 'Chicago',
          postalCode: '60614',
          country: 'USA'
        },
        paymentMethod: 'PayPal',
        totalPrice: 549.98,
        isPaid: true,
        paidAt: new Date(),
        isDelivered: true,
        deliveredAt: new Date()
      }
    ];

    const createdOrders = await OrderModel.insertMany(sampleOrders);
    console.log(`${createdOrders.length} orders imported`);

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
    console.log('\nDefault Admin User:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('\nRegular Users:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Destroy data function
const destroyData = async () => {
  try {
    await OrderModel.deleteMany();
    await ProductModel.deleteMany();
    await UserModel.deleteMany();

    console.log('All data destroyed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error destroying data:', error);
    process.exit(1);
  }
};

// Command line arguments handling
if (process.argv[2] === '-d') {
  destroyData();
} else {
  connectDB().then(() => importData());
}