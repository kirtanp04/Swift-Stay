import mongoose from 'mongoose'
import { SecrtKey } from '../env'

export class MongoDB {

    static async connect() {
        try {

            await mongoose.connect('mongodb+srv://kirtanp04:OyBd0kVg6JZxkvpy@hotelcluster.exs9nof.mongodb.net/Stay_Swift').then(() => {
                console.log('DB Connection: Success ')
            })

        } catch (error) {
            console.log(error)
        }
    }
}