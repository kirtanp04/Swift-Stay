// const StaffSchema = new mongoose.Schema({
//     hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
//     name: { type: String, required: true },
//     role: { type: String, required: true }, // e.g., manager, receptionist, cleaner
//     phone: { type: String, required: true },
//     email: { type: String, required: true },
//     hireDate: { type: Date, default: Date.now }
//   });

//   module.exports = mongoose.model('Staff', StaffSchema);


console.log('staff')



// Booking.find({ user: userId })
//   .populate('user')
//   .populate('hotel')
//   .populate('room')
//   .exec((err, bookings) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log('Bookings for the user:', bookings);
//   });