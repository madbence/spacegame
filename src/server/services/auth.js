/**
 * Created by Gabor on 2015.11.17..
 */

import mongoose from 'mongoose';
import _ from 'lodash';

const ObjectId = mongoose.Schema.ObjectId;

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

export const User = mongoose.model('User', userSchema);

export class AuthProvider {

    constructor(service) {
        console.error("This class should not be initialized\nIt is abstract")
    }

    /**
     * Authenticate a user, based on credentials
     * also if this is a registration request
     * it should create a user, based on data, and
     * store it to mongodb and return the _id of that document
     * @param credentials login credentials specific for the authentication service provider
     * @return user id in mongo
     */
    login(credentials : Any) : ObjectId {
        console.error("This method should be overriden");
        return null;
    }

}

class AuthService {

    constructor() {
        this.providers = [];
    }

    registerProvider(provider : AuthProvider) {
        if(!(provider instanceof AuthProvider)) {
            throw "Invalid auth provider";
        }
        this.providers.push(new provider(this));
    }

}


const service = new AuthService();
// service.registerProvider();
export default service;

