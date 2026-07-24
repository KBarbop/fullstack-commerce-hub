import { Model, model, Schema } from 'mongoose';
import { ICategory } from '../../../shared';

const categorySchema = new Schema<ICategory>(
    {
        title_en: {
            type: String,
            required: true,
            index: { unique: true },
        },
        title_el: {
            type: String,
            required: true,
            index: { unique: true },
        },
        description_en: {
            type: String,
        },
        description_el: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

categorySchema.index({ title_en: 1, title_el: 1 });

const Category: Model<ICategory> = model('Category', categorySchema);

export { Category, categorySchema };
