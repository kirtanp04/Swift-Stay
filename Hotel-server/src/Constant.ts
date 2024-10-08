import { SecrtKey } from './env';
import { TSuccessbooking } from './types/Type';

export const QueueName = {
  EmailQueue: '#@EmailQueu#@',
  ChatQueue: '#@ChatQueue#@',
};

export const Param = {
  broker: {
    manager: {
      Auth: 'ManagerAuthBroker',
      Property: 'ManagerPropertyBroker',
      Room: 'ManagerRoomBroker',
      chat: 'ManagerChatBroker',
      review: 'ManagerReviewBroker',
      subscriber: 'ManagerSubscriberBroker',
      booking: 'ManagerBookingBroker',
      analytic: 'ManagerAnalyticBroker',
      Job: 'ManagerJobBroker',
    },

    guest: {
      Auth: 'GuestAuthBroker',
      Property: 'GuestPropertyBroker',
      Room: 'GuestRoomBroker',
      chat: 'GuestChatBroker',
      payment: 'GuestPaymentBroker',
      booking: 'GuestBookingBroker',
      Job: 'GuestJobBroker',
    },
  },

  function: {
    manager: {
      register: 'CreateManagerAccount',
      login: 'ManagerLogin',
      EmailVerification: 'ManagerEmailVerification',
      analytics: {
        GetOverviewMetrics: 'ManagerGetOverviewMetrics',
        PropertybyStates: 'ManagerPropertybyStates',
        GetPropertyProfitByMonth: 'ManagerGetPropertyProfitByMonth',
      },
      Property: {
        AddProperty: 'ManagerAddProperty',
        GetSingleProperty: 'ManagerGetSingleProperty',
        GetAllProperty: 'ManagerGetAllProperty',
        DeleteProperty: 'ManagerDeleteProperty',
        UpdateProperty: 'ManagerUpdateProperty',
      },
      Room: {
        AddRoom: 'ManagerAddRoom',
        UpdateRoom: 'ManagerUpdateRoom',
        DeleteRoom: 'ManagerDeleteRoom',
        GetAllRoom: 'ManagerGetAllRoom',
      },
      review: {
        GetAllReviewsByAdmin: 'ManagerGetAllReviewsByAdmin',
      },
      subscriber: {
        GetAllSubscriber: 'ManagerGetAllSubscriber',
      },

      chat: {
        saveChat: 'ManagerSaveChatService',
        initRedisForChat: 'InitRedisForChat',
        getChatData: 'getChatData'
      },
      booking: {
        GetBookingListByAdmin: 'ManagerGetBookinListByAdmin',
        GetAllChatBookedUser: 'ManagerGetAllChatBookedUser',
        GetUserBookingDetail: 'ManagerGetUserBookingDetail',
      },
      Job: {
        GetAllJobs: 'ManagerGetAllJobs',
        AddnewJob: 'ManagerAddnewJob',
        UpdateJob: 'ManagerUpdateJob',
        DeleteJob: 'ManagerDeleteJob',
      },
    },
    guest: {
      register: 'CreateGuestAccount',
      login: 'GuestLogin',
      property: {
        GetAllPropertyByCountry: 'GuestGetAllPropertyByCountry',
        GetHomePagePropertyData: 'GuestGethomePagePropertyData',
        GetPropertyListByFilterSearch: 'GuestGetPropertyListByFilterSearch',
        GetSinglePropertyDetail: 'GuestGetSinglePropertyDetail',
      },

      chat: {
        saveChat: 'GuestSaveChatService',
        initRedisForChat: 'InitRedisForChat',
        getChatData: 'getChatData'
      },
      room: {
        GetRoomDetail: 'GuestGetRoomDetail',
      },
      payment: {
        CheckOut: 'GuestCheckOut',
        WebHook: 'GuestWebhook',
        UPIPayment: 'GuestUPIMethod',
      },
      booking: {
        SaveBookingInfo: 'GuestSaveBookingInfo',
        UpdateBookingInfo: 'GuestUpdateBookinInfo',
        generateInvoice: 'GuestGenerateInvoice',
        getMyBookingList: 'GuestGetMyBookingList',
      },
      job: {
        GetAllJobByProperty: 'GuestGetAllJobByProperty',
        GetJobDetail: 'GuestGetJobDetail',
      }
    },
  },
};

export const CacheKey = {
  user: {
    property: (propertyID: string) => `#@User${propertyID}#@Property#@`,
    room: (roomID: string) => `#@User${roomID}#@Room#@`,
    bookingList: (userID: string) => `#@User#@${userID}#@bookingList#@`,
  },
  manager: {
    property: (emailID: string) => `#@Manager#@${emailID}#@Property#@`,
    room: (emailID: string) => `#@Manager#@${emailID}#@Room#@`,
    review: (emailID: string) => `#@Manager#@${emailID}#@Review#@`,
    subscriber: (emailID: string) => `#@Manager#@${emailID}#@Subscriber#@`,
    bookingList: (adminID: string) => `#@Manager#@${adminID}#@bookingList#@`,
    userbookindetail: (BookingID: string) => `#@Manager#@${BookingID}#@UserBookingDetail#@`,
    chatUserbaseBooking: (adminID: string) => `#@Manager#@${adminID}#@chatUserbaseBooking#@`,
    Analytics: {
      BookingBase: (emailID: string) => `#@Manager#@${emailID}#@BookingBase#@`,
      PropertyProfitByMonth: (emailID: string, year: number) => `#@Manager#@${emailID}#@${year}#@#@PropertyProfitByMonth#@`,
    },
    JobList: (adminID: string) => `#@Manager#@${adminID}#@jobList#@`,
  },

  job: {
    JobsByProperty: (propertyID: string) => `#@Common#@${propertyID}#@jobList#@`,
    JobDetail: (jobID: string) => `#@Common#@${jobID}#@jobDetail#@`,
  },

  chat: (chatKey: string) => `#@ManagerChat#@${chatKey}#@UserChat#@`,
};

export const EmailTemplate = {
  EmailVerification: (
    UserName: string,
    token: string
  ) => `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 10px 0;">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="50"
        height="50"
        viewBox="0 0 172 172"
        fill="hsl(82 84.5% 67.1%)"
        
      >
        <g
          fill="none"
          fillRule="nonzero"
          stroke="none"
          strokeWidth="1"
          strokeLinecap="butt"
          strokeLinejoin="miter"
          strokeMiterlimit="10"
          strokeDasharray=""
          strokeDashoffset="0"
          fontFamily="none"
          fontWeight="none"
          fontSize="none"
          textAnchor="none"
          style={{ mixBlendMode: "normal" }}
        >
          <path d="M0,172v-172h172v172z" fill="none"></path>
          <g fill="hsl(82 84.5% 67.1%)">
            <path d="M21.5,21.5v129h64.5v-32.25v-64.5v-32.25zM86,53.75c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25c-17.7805,0 -32.25,14.4695 -32.25,32.25zM118.25,86c-17.7805,0 -32.25,14.4695 -32.25,32.25c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25z"></path>
          </g>
        </g>
      </svg>
        </div>
        <div style="text-align: center; padding: 20px;">
            <h1 style="color: #333333;">Welcome to Quick Stay!</h1>
            <p style="color: #666666; line-height: 1.5;">Hi ${UserName},</p>
            <p style="color: #666666; line-height: 1.5;">Thank you for creating an account with Quick Stay. To complete your registration, please verify your email address by clicking the button below.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${SecrtKey.FRONTEND_URL}/${UserName}/email/verification/${token}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Verify Email</a>
            </div>
            <p style="color: #666666; line-height: 1.5;">If you did not create an account, please ignore this email.</p>
            <p style="color: #666666; line-height: 1.5;">Thank you,<br>Quick Stay Team</p>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #888888;">
            &copy; 2024 Quick Stay. All rights reserved.
        </div>
    </div>
</body>`,

  LogedIn: (UserName: string) => `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 10px 0;">
            <img src="https://your-logo-url.com/logo.png" alt="Quick Stay Logo" style="width: 100px;">
        </div>
        <div style="text-align: center; padding: 20px;">
            <h1 style="color: #333333;">Welcome Back to Quick Stay!</h1>
            <p style="color: #666666; line-height: 1.5;">Hi ${UserName},</p>
            <p style="color: #666666; line-height: 1.5;">We're excited to see you again! Thank you for logging in. We hope you have a great experience with Quick Stay.</p>
           
            <p style="color: #666666; line-height: 1.5;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p style="color: #666666; line-height: 1.5;">Happy browsing,<br>Quick Stay Team</p>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #888888;">
            &copy; 2024 Quick Stay. All rights reserved.
        </div>
    </div>
</body>
`,

  Successbooking: ({ objBooking, objRoom }: TSuccessbooking) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header svg {
          width: 50px;
          height: 50px;
        }
        .header h1 {
          margin: 0;
          color: #333;
        }
        .details {
          margin-bottom: 20px;
        }
        .details h2 {
          color: #333;
          font-size: 20px;
        }
        .details p {
          margin: 0;
        }
        .images {
          margin: 20px 0;
          display:grid;
          grid-template-columns: repeat(3,1fr);
        }
        .images img {
          width: 100%;
          height: auto;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
        }
        .footer p {
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 172 172"
            fill="#333"
          >
            <g
              fill="none"
              fill-rule="nonzero"
              stroke="none"
              stroke-width="1"
              stroke-linecap="butt"
              stroke-linejoin="miter"
              stroke-miterlimit="10"
              stroke-dasharray=""
              stroke-dashoffset="0"
              font-family="none"
              font-weight="none"
              font-size="none"
              text-anchor="none"
              style="mix-blend-mode: normal"
            >
              <path d="M0,172v-172h172v172z" fill="none"></path>
              <g fill="#333">
                <path d="M21.5,21.5v129h64.5v-32.25v-64.5v-32.25zM86,53.75c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25c-17.7805,0 -32.25,14.4695 -32.25,32.25zM118.25,86c-17.7805,0 -32.25,14.4695 -32.25,32.25c0,17.7805 14.4695,32.25 32.25,32.25c17.7805,0 32.25,-14.4695 32.25,-32.25c0,-17.7805 -14.4695,-32.25 -32.25,-32.25z"></path>
              </g>
            </g>
          </svg>
          <h1>Swift Stay</h1>
        </div>
  
        <div class="details">
          <h2>Booking Confirmation</h2>
          <p><strong>Hotel:</strong> ${objRoom.property.name} (${objRoom.property.propertyType})</p>
          <p>${objRoom.property.description}</p>
          <div class="images">
            ${objRoom.property.images.map((img: any) => `<img src="${img}" alt="${objRoom.property.name} Image" />`).join('')}
          </div>
          <p><strong>Check-in:</strong> ${objBooking.stayInfo.checkIn}</p>
          <p><strong>Check-out:</strong> ${objBooking.stayInfo.checkOut}</p>
          <p><strong>Total Nights:</strong> ${objBooking.stayInfo.totalStay} </p>
          <p><strong>Total Payment:</strong> ${objBooking.totalPay}</p>
        </div>
  
        <div class="details">
          <h2>Room Details</h2>
          <p>${objRoom.description}</p>
          <p><strong>Room Type:</strong> ${objRoom.type}</p>
          <p><strong>Room Price:</strong> ${objRoom.price} per night</p>
          <p><strong>Room Rating:</strong> ${objRoom.rating} </p>
          <div class="images">
            ${objRoom.images.map((img: any) => `<img src="${img}" alt="${objRoom.type} Image" />`).join('')}
          </div>
        </div>
  
        <div class="footer">
          <p>Thank you for booking with Swift Stay! We look forward to your stay.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  },

  FailedBooking: ({ propertyName, failReason }: { propertyName: string; failReason: string }) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Failed</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .header svg {
            width: 50px;
            height: 50px;
          }
          .header h1 {
            margin: 0;
            color: #333;
          }
          .details {
            margin-bottom: 20px;
          }
          .details h2 {
            color: #333;
            font-size: 20px;
          }
          .details p {
            margin: 0;
          }
          .images {
            margin: 20px 0;
            display:grid;
            grid-template-columns: repeat(3,1fr);
          }
          .images img {
            width: 100%;
            height: auto;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
          }
          .footer p {
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="50"
              height="50"
              viewBox="0 0 172 172"
              fill="#e74c3c"
            >
              <g
                fill="none"
                fill-rule="nonzero"
                stroke="none"
                stroke-width="1"
                stroke-linecap="butt"
                stroke-linejoin="miter"
                stroke-miterlimit="10"
                stroke-dasharray=""
                stroke-dashoffset="0"
                font-family="none"
                font-weight="none"
                font-size="none"
                text-anchor="none"
                style="mix-blend-mode: normal"
              >
                <path d="M0,172v-172h172v172z" fill="none"></path>
                <g fill="#e74c3c">
                  <path d="M86,0c-47.46094,0 -86,38.53906 -86,86c0,47.46094 38.53906,86 86,86c47.46094,0 86,-38.53906 86,-86c0,-47.46094 -38.53906,-86 -86,-86zM129.66406,115.15625c1.46094,1.46094 1.46094,3.80469 0,5.26562c-1.46094,1.46094 -3.80469,1.46094 -5.26562,0l-38.39844,-38.39844l-38.39844,38.39844c-1.46094,1.46094 -3.80469,1.46094 -5.26562,0c-1.46094,-1.46094 -1.46094,-3.80469 0,-5.26562l38.39844,-38.39844l-38.39844,-38.39844c-1.46094,-1.46094 -1.46094,-3.80469 0,-5.26562c1.46094,-1.46094 3.80469,-1.46094 5.26562,0l38.39844,38.39844l38.39844,-38.39844c1.46094,-1.46094 3.80469,-1.46094 5.26562,0c1.46094,1.46094 1.46094,3.80469 0,5.26562l-38.39844,38.39844z"></path>
                </g>
              </g>
            </svg>
            <h1>Swift Stay</h1>
          </div>
    
          <div class="details">
            <h2>Booking Failed</h2>
            <p>Unfortunately, your booking for <strong>${propertyName}</strong> could not be completed.</p>
            <p><strong>Reason:</strong> ${failReason || 'Unknown error'}</p>
            <p>We apologize for the inconvenience caused. Please try again later or contact our support team for assistance.</p>
          </div>
    
          <div class="footer">
            <p>If you need further assistance, please reach out to our customer service team.</p>
            <p>Thank you for choosing Swift Stay!</p>
          </div>
        </div>
      </body>
      </html>
      `;
  },
};
