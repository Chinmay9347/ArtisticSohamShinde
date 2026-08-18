export const PAYMENT_DETAILS = {
  upi: {
    id: "artisticsoham@upi",
    name: "Artistic Soham",
  },

  bank: {
    accountName: "Artistic Soham",
    accountNumber: "XXXXXXXXXXXX",
    ifsc: "XXXXXXXXXXX",
    bankName: "XXXXXXXX Bank",
    branch: "XXXXXXXX",
  },

  qrImage: "/payment/upi-qr.png",
} as const;