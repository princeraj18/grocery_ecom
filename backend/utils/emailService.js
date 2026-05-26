import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { generateInvoicePDF } from "./invoiceTemplate.js";

export const sendInvoiceEmail = async (order) => {
  try {

    if (!order?.shippingAddress?.email) {
      console.log("Customer email missing");
      return;
    }

    // TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // VERIFY SMTP
    await transporter.verify();

    console.log("SMTP CONNECTED");

    // PDF BUFFER
    const pdfBuffer = await new Promise(
      (resolve, reject) => {

        const chunks = [];

        const doc = new PDFDocument({
          size: "A4",
          margin: 50,
        });

        doc.on("data", (chunk) => {
          chunks.push(chunk);
        });

        doc.on("end", () => {
          resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);

        generateInvoicePDF(order, doc);
      }
    );

    // CUSTOMER NAME
    const customerName =
      `${order.shippingAddress.firstName || ""}
       ${order.shippingAddress.lastName || ""}`
        .trim() || "Customer";

    // SEND EMAIL
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: order.shippingAddress.email,

      subject: `Invoice - ${order._id}`,

      html: `
        <h2>Order Confirmed</h2>

        <p>Dear ${customerName},</p>

        <p>
          Thank you for shopping with ShopEase.
        </p>

        <p>
          Your order has been placed successfully.
        </p>

        <p>
          Total Amount:
          <strong>
            ₹${order.totalAmount}
          </strong>
        </p>

        <p>
          Please find the invoice attached.
        </p>

        <br/>

        <p>
          Regards,
          <br/>
          ShopEase Team
        </p>
      `,

      attachments: [
        {
          filename: `Invoice-${order._id}.pdf`,

          content: pdfBuffer,

          contentType: "application/pdf",
        },
      ],
    });

    console.log(
      "EMAIL SENT:",
      info.messageId
    );

  } catch (error) {

    console.error(
      "EMAIL ERROR:",
      error
    );
  }
};