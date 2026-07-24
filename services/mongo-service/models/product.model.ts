import { Model, model, Schema } from 'mongoose';
import { IProduct } from '../../../shared';

const productSchema = new Schema<IProduct>(
    {
        category: {
            type: String,
            required: true,
        },
        title_en: {
            type: String,
            required: true,
        },
        title_el: {
            type: String,
            required: true,
        },
        description_en: {
            type: String,
        },
        description_el: {
            type: String,
        },
        ingredients_en: [{
            title: { type: String },
            options: [{ type: String }]
        }],
        ingredients_el: [{
            title: { type: String },
            options: [{ type: String }]
        }],
        options_en: [{
            title: { type: String },
            options: [{ type: String }]
        }],
        options_el: [{
            title: { type: String },
            options: [{ type: String }]
        }],
        price: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

productSchema.index({ category: 1, price: 1 });

const Product: Model<IProduct> = model('Product', productSchema);

export { Product, productSchema };
