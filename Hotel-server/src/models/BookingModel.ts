// const BookingSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
//     room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
//     checkInDate: { type: Date, required: true },
//     checkOutDate: { type: Date, required: true },
//     guests: { type: Number, required: true },
//     totalPrice: { type: Number, required: true },
//     status: { type: String, enum: ['booked', 'checked_in', 'checked_out', 'cancelled'], default: 'booked' },
//     createdAt: { type: Date, default: Date.now }
//   });

//   module.exports = mongoose.model('Booking', BookingSchema);


console.log('booking')