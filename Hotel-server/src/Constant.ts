import { SecrtKey } from './env';

export const Param = {
    broker: {
        manager: {
            Auth: 'ManagerAuthBroker',
            Property: 'ManagerPropertyBroker',
            Room: 'ManagerRoomBroker',
            chat: 'ManagerChatBroker',
            review: 'ManagerReviewBroker',
            Redis: 'ManagerRedisBroker',
        },

        guest: {
            Auth: 'GuestAuthBroker',
            Property: 'GuestPropertyBroker',
            Room: 'GuestRoomBroker',
            Redis: 'GuestRedisBroker',
            chat: 'GuestChatBroker',
            payment: 'GuestPaymentBroker'
        },
    },

    function: {
        manager: {
            register: 'CreateManagerAccount',
            login: 'ManagerLogin',
            EmailVerification: 'ManagerEmailVerification',
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
                GetAllReviewsByAdmin: 'ManagerGetAllReviewsByAdmin'
            },
            subscriber: {
                GetAllSubscriber: 'ManagerGetAllSubscriber'
            },
            redis: {
                initRedis: 'ManagerInitRedisService'
            },
            chat: {
                saveChat: 'ManagerSaveChatService'
            }
        },
        guest: {
            register: 'CreateGuestAccount',
            login: 'GuestLogin',
            property: {
                GetAllPropertyByState: 'GuestGetAllPropertyByState',
                GetAllPropertyByCountry: 'GuestGetAllPropertyByCountry',
                GetTotalPropertByCountry: 'GuestGetTotalPropertByCountry',
                GetTotalPropertyByType: 'GuestGetTotalPropertyByType',
                GetPropertyListByFilterSearch: 'GuestGetPropertyListByFilterSearch',
                GetSinglePropertyDetail: 'GuestGetSinglePropertyDetail'
            },
            redis: {
                initRedis: 'GuestInitRedisService'
            },
            chat: {
                saveChat: 'GuestSaveChatService'
            },
            room: {
                GetRoomDetail: 'GuestGetRoomDetail'
            },
            payment: {
                CheckOut: 'GuestCheckOut',
                WebHook: 'GuestWebhook'
            }
        },
    },
};

export const CacheKey = {
    user: {
        property: (propertyID: string) => `#@User${propertyID}#@Property#@`,
        room: (roomID: string) => `#@User${roomID}#@Room#@`,
    },
    manager: {
        property: (emailID: string) => `#@Manager#@${emailID}#@Property#@`,
        room: (emailID: string) => `#@Manager#@${emailID}#@Room#@`,
        review: (emailID: string) => `#@Manager#@${emailID}#@Review#@`,
        subscriber: (emailID: string) => `#@Manager#@${emailID}#@Subscriber#@`,
    },

    chat: (chatKey: string) => `#@ManagerChat#@${chatKey}#@UserChat#@`
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
            <div style="text-align: center; margin: 20px 0;">
                <a href="https://your-website-url.com" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">Explore Now</a>
            </div>
            <p style="color: #666666; line-height: 1.5;">If you have any questions or need assistance, feel free to reach out to our support team.</p>
            <p style="color: #666666; line-height: 1.5;">Happy browsing,<br>Quick Stay Team</p>
        </div>
        <div style="text-align: center; padding: 10px; font-size: 12px; color: #888888;">
            &copy; 2024 Quick Stay. All rights reserved.
        </div>
    </div>
</body>
`,
};
