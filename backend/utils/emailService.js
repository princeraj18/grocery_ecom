import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";
import { generateInvoicePDF } from "./invoiceTemplate.js";

export const sendInvoiceEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Capture the layout streams directly via an explicit buffer array array promise
    const pdfBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err) => reject(err));

      // Run formatting instructions against this active document container instance
      generateInvoicePDF(order, doc);
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.shippingAddress.email,
      subject: `Your ShopEase Grocery Order Invoice - #${order._id.toString().toUpperCase()}`,
      html: `
        <h2>Order Confirmation</h2>
        <p>Dear ${order.shippingAddress.fullName || "Customer"},</p>
        <p>Thank you for your purchase! Your grocery order transaction has been processed successfully.</p>
        <p><strong>Order Status:</strong> Processing</p>
        <p><strong>Total Amount Deducted:</strong> ₹${order.totalAmount.toFixed(2)}</p>
        <br/>
        <p>Please find your digital transactional summary breakdown attached as a PDF invoice to this email statement.</p>
        <p>Regards,<br/>ShopEase Team</p>
      `,
      attachments: [
        {
          filename: `Invoice_${order._id.toString().toUpperCase()}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(`Invoice emailed successfully to: ${order.shippingAddress.email}`);

    const info =
  await transporter.sendMail(
    mailOptions
  );

console.log(
  "EMAIL SENT:",
  info.messageId
);
  } catch (error) {
    console.error("CRITICAL ENCOUNTER: INVOICE DISPATCH SYSTEM FAILED:", error);
  }
};