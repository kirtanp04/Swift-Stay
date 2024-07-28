
enum enumJobRole {
    Front_office_Department = 'Front Office Department',
    HouseKeeping = 'Housekeeping',
    Food_and_Beverage_Department = 'Food and Beverage Department',
    Sales_and_Marketing_Department = 'Sales and Marketing Department',
    Finance_and_Accounting_Department = 'Finance and Accounting Department',
    Human_Resources_Department = 'Human Resources Department',
    Maintenance_and_Engineering_Department = 'Maintenance and Engineering Department',
    General_Management = 'General Management',
    Security_Department = 'Security Department'
}

// update jobHiring field in property when saving new job.....


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