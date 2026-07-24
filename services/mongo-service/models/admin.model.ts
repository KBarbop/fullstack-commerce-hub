import { Model, Schema } from 'mongoose';
import {IAdmin} from '../../../shared';
import {User} from "./user.model";

const adminSchema = new Schema<IAdmin>({
    role: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Admin: Model<IAdmin> = User.discriminator<IAdmin>(
    'Admin',
    adminSchema,
);

export { Admin, adminSchema };
