import {Model, model, Schema} from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IUser } from '../../../shared';

const userSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            index: { unique: true },
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: { unique: true },
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

userSchema.index({ username: 1, email: 1 });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password || '', salt);
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
    return await bcryptjs.compare(enteredPassword, this.password);
};

const User: Model<IUser> = model('User', userSchema);

export { User, userSchema };
