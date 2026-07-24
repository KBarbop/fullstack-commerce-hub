import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from './mongo-service/models/category.model';
import { Product } from './mongo-service/models/product.model';
import { Admin } from './mongo-service/models/admin.model';

dotenv.config();

const categories = [
    { title_en: 'Coffee', title_el: 'Καφές', description_en: 'Freshly brewed coffee', description_el: 'Φρεσκοφτιαγμένος καφές', image: '/placeholder-product.svg' },
    { title_en: 'Snacks', title_el: 'Σνακ', description_en: 'Light bites and pastries', description_el: 'Ελαφριά σνακ και γλυκά', image: '/placeholder-product.svg' },
    { title_en: 'Smoothies', title_el: 'Smoothies', description_en: 'Fresh fruit smoothies', description_el: 'Φρέσκα smoothies φρούτων', image: '/placeholder-product.svg' },
];

const products = [
    {
        category: 'Coffee', title_en: 'Espresso', title_el: 'Εσπρέσο',
        description_en: 'Rich and bold espresso', description_el: 'Πλούσιο εσπρέσο',
        price: '2.99', image: '/placeholder-product.svg',
        ingredients_en: [{ title: 'Sugar', options: ['Regular', 'Low', 'None'] }],
        ingredients_el: [{ title: 'Ζάχαρη', options: ['Κανονική', 'Λίγη', 'Χωρίς'] }],
        options_en: [], options_el: [],
    },
    {
        category: 'Coffee', title_en: 'Cappuccino', title_el: 'Καπουτσίνο',
        description_en: 'Creamy cappuccino with frothy milk', description_el: 'Κρεμώδες καπουτσίνο με αφρόγαλα',
        price: '3.49', image: '/placeholder-product.svg',
        ingredients_en: [{ title: 'Milk Type', options: ['Whole', 'Skim', 'Almond', 'Soy'] }],
        ingredients_el: [{ title: 'Γάλα', options: ['Πλήρες', 'Αποβουτυρωμένο', 'Αμυγδάλου', 'Σόγιας'] }],
        options_en: [], options_el: [],
    },
    {
        category: 'Snacks', title_en: 'Muffin', title_el: 'Μάφιν',
        description_en: 'Chocolate chip muffin', description_el: 'Μάφιν με κομμάτια σοκολάτας',
        price: '1.99', image: '/placeholder-product.svg',
        ingredients_en: [{ title: 'Toppings', options: ['Extra Choc Chips', 'Nuts', 'Whipped Cream'] }],
        ingredients_el: [{ title: 'Γαρνιτούρα', options: ['Επιπλέον Σοκολάτα', 'Ξηροί Καρποί', 'Σαντιγί'] }],
        options_en: [], options_el: [],
    },
    {
        category: 'Smoothies', title_en: 'Strawberry Smoothie', title_el: 'Smoothie Φράουλα',
        description_en: 'Fresh strawberry smoothie', description_el: 'Φρέσκο smoothie φράουλα',
        price: '4.29', image: '/placeholder-product.svg',
        ingredients_en: [{ title: 'Size', options: ['Small', 'Medium', 'Large'] }],
        ingredients_el: [{ title: 'Μέγεθος', options: ['Μικρό', 'Μεσαίο', 'Μεγάλο'] }],
        options_en: [], options_el: [],
    },
];

// The frontend matches products to categories via product.category === category._id,
// so products must reference the category's Mongo _id, not its title.

async function seed() {
    const uri = process.env.ATLAS_URI;
    if (!uri) {
        throw new Error('ATLAS_URI not set');
    }
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const categoryIdsByTitle = new Map<string, string>();
    for (const cat of categories) {
        await Category.updateOne({ title_en: cat.title_en }, { $set: cat }, { upsert: true });
        const savedCategory = await Category.findOne({ title_en: cat.title_en });
        if (savedCategory) {
            categoryIdsByTitle.set(cat.title_en, savedCategory._id.toString());
        }
    }
    console.log(`Seeded ${categories.length} categories`);

    for (const prod of products) {
        const categoryId = categoryIdsByTitle.get(prod.category);
        if (!categoryId) {
            console.warn(`Skipping product "${prod.title_en}": category "${prod.category}" not found`);
            continue;
        }
        await Product.updateOne(
            { title_en: prod.title_en },
            { $set: { ...prod, category: categoryId } },
            { upsert: true },
        );
    }
    console.log(`Seeded ${products.length} products`);

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@commerce-hub.local';
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
        const admin = new Admin({
            username: process.env.SEED_ADMIN_USERNAME || 'admin',
            firstName: 'Admin',
            lastName: 'User',
            email: adminEmail,
            password: process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!',
            role: 'owner',
        });
        await admin.save();
        console.log(`Created default admin: ${adminEmail}`);
    } else {
        console.log('Default admin already exists, skipping');
    }

    await mongoose.disconnect();
    console.log('Seeding complete');
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
