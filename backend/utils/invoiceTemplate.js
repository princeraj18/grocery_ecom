import PDFDocument from "pdfkit";

export const generateInvoicePDF = (order, doc) => {
  // ===================================
  // INVOICE HEADER
  // ===================================
  doc
    .fillColor("#4A5568")
    .fontSize(20)
    .text("SHOPEASE GROCERY", 50, 50, { bold: true })
    .fontSize(10)
    .text("Fresh Quality Delivered to Your Doorstep", 50, 75)
    .fillColor("#718096")
    .text("Support Email: support@shopease.com", 50, 90)
    .moveDown();

  // INVOICE DETAILS 
  doc
    .fillColor("#2D3748")
    .fontSize(12)
    .text(`INVOICE ID: ${order._id.toString().toUpperCase()}`, 380, 50, { align: "right" })
    .fontSize(10)
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 380, 70, { align: "right" })
    .text(`Payment: ${order.paymentMethod}`, 380, 85, { align: "right" })
    .moveDown();

  // Structural Rule Line Divider
  doc.moveTo(50, 115).lineTo(550, 115).strokeColor("#E2E8F0").stroke();

  // ===================================
  // CUSTOMER & SHIPPING REGISTRATION (FIXED PROPERTY NAME)
  // ===================================
  doc
    .fillColor("#2D3748")
    .fontSize(12)
    .text("Delivery Address:", 50, 135, { underline: true })
    .fontSize(10)
    .fillColor("#4A5568")
    .text(`${order.shippingAddress.fullName}`, 50, 155) // <-- FIXED FROM firstName/lastName
    .text(`${order.shippingAddress.address || order.shippingAddress.street}`, 50, 170) // Accommodates either variant fallback securely
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode || order.shippingAddress.zipcode}`, 50, 185)
    .text(`Phone: ${order.shippingAddress.phone}`, 50, 200);

  // ===================================
  // INVOICE ITEMS TABLE HEADER
  // ===================================
  let tableTopY = 240;

  doc
    .fillColor("#1A202C")
    .fontSize(10)
    .text("Item Name", 50, tableTopY, { bold: true })
    .text("Unit Price", 280, tableTopY, { width: 70, align: "right", bold: true })
    .text("Qty", 380, tableTopY, { width: 40, align: "right", bold: true })
    .text("Total", 480, tableTopY, { width: 70, align: "right", bold: true });

  doc.moveTo(50, tableTopY + 15).lineTo(550, tableTopY + 15).strokeColor("#A0AEC0").stroke();

  let currentY = tableTopY + 25;

  // Map Cart Items
  order.items.forEach((item) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 50;
    }

    doc
      .fillColor("#4A5568")
      .text(item.name, 50, currentY, { width: 220 })
      .text(`Rs. ${item.price.toFixed(2)}`, 280, currentY, { width: 70, align: "right" })
      .text(item.quantity.toString(), 380, currentY, { width: 40, align: "right" })
      .text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 480, currentY, { width: 70, align: "right" });

    currentY += 25;
  });

  doc.moveTo(50, currentY).lineTo(550, currentY).strokeColor("#E2E8F0").stroke();

  // ===================================
  // TOTAL SUMMARY FOOTER
  // ===================================
  currentY += 15;
  doc
    .fillColor("#1A202C")
    .fontSize(12)
    .text("Grand Total:", 350, currentY, { bold: true })
    .text(`Rs. ${order.totalAmount.toFixed(2)}`, 480, currentY, { width: 70, align: "right", bold: true });

  currentY += 30;
  doc
    .fillColor("#718096")
    .fontSize(9)
    .text("Thank you for shopping with ShopEase! If you have any inquiries regarding this document statement layout, please reach out to our helpdesk.", 50, currentY, { align: "center" });

  doc.end();
};