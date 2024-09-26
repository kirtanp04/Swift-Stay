"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytic = exports.THomePageData = exports.Invoice = exports.ChatObj = exports.TParam = void 0;
class TParam {
    constructor() {
        this.Broker = '';
        this.function = '';
    }
}
exports.TParam = TParam;
class ChatObj {
    constructor() {
        this.message = "";
        this.date = new Date();
        this.key = "";
        this.senderDetail = new Sender();
    }
}
exports.ChatObj = ChatObj;
class Sender {
    constructor() {
        this._id = "";
        this.email = "";
        this.name = "";
        this.profileImg = "";
        this.role = '';
    }
}
class Invoice {
    constructor() {
        this.InvoiceId = '';
        this.CustomerInfo = new InvoiceCustomer();
        this.BookingDetails = new InvoiceBooking();
        this.PaymentInfo = new InvoicePayment();
        this.PropertyInfo = new InvoiceProperty();
        this.RoomInfo = new InvoiceRoom();
        this.CreatedAt = new Date();
    }
}
exports.Invoice = Invoice;
class InvoiceCustomer {
    constructor() {
        this.Name = '';
        this.Email = '';
        this.Number = 0;
        this.Address = '';
        this.City = '';
        this.State = '';
        this.Country = '';
    }
}
class InvoiceBooking {
    constructor() {
        this.CheckIn = '';
        this.CheckOut = '';
        this.Adults = 0;
        this.Childrens = 0;
        this.TotalStay = '';
        this.TotalPay = '';
        this.currency = '';
    }
}
class InvoicePayment {
    constructor() {
        this.PaymentID = '';
        this.EmailID = '';
        this.HolderName = '';
        this.PaymentStatus = null;
        this.PaymentType = '';
        this.PaymentDate = '';
        this.TotalPay = 0;
        this.Currency = '';
        this.Country = '';
    }
}
class InvoiceProperty {
    constructor() {
        this.PropertyName = '';
        this.PropertyType = null;
        this.PropertyAddress = '';
        this.PropertyCity = '';
        this.PropertyState = '';
        this.PropertyCountry = '';
    }
}
class InvoiceRoom {
    constructor() {
        this.RoomType = null;
        this.RoomPrice = 0;
        this.currency = '';
        this.RoomNo = 0;
    }
}
// ------------------------------- guest hompage data
class THomePageData {
    constructor() {
        this.TrendingDestinations = [];
        this.TotalPropertByCountryState = [];
        this.TotalPropertByPropertyType = [];
    }
}
exports.THomePageData = THomePageData;
// -------------------------------- Analytic
class Analytic {
    constructor() {
        this.TotalBookings = 0;
        this.TotalRevenue = '';
        this.BookingAnalytics = [];
        this.RevenueAnalytics = [];
        this.TopPropertiesByBooking = [];
        this.TotalPropertyandRooms = {
            property: 0,
            room: 0
        };
        this.AllPropertyWithAvgReview = [];
    }
}
exports.Analytic = Analytic;
