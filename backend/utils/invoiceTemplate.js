import PDFDocument from "pdfkit";

export const generateInvoicePDF = (
  order,
  doc
) => {

  const shipping =
    order.shippingAddress || {};

  // =========================
  // CUSTOMER DETAILS
  // =========================
  const customerName =
    `${shipping.firstName || ""}
     ${shipping.lastName || ""}`.trim()
     || "Customer";

  const customerEmail =
    shipping.email || "N/A";

  const customerStreet =
    shipping.street || "N/A";

  const customerCity =
    shipping.city || "";

  const customerState =
    shipping.state || "";

  const customerZipcode =
    shipping.zipcode || "";

  const customerPhone =
    shipping.phone || "N/A";

  // =========================
  // HEADER
  // =========================
  doc
    .fillColor("#4A5568")
    .fontSize(22)
    .text(
      "SHOPEASE GROCERY",
      50,
      45
    )

    .fontSize(10)
    .fillColor("#718096")
    .text(
      "Fresh Quality Delivered to Your Doorstep",
      50,
      75
    )

    .text(
      "support@shopease.com",
      50,
      90
    );

  // =========================
  // INVOICE DETAILS
  // =========================
  doc
    .fillColor("#2D3748")
    .fontSize(11)

    .text(
      `Invoice ID: ${order._id}`,
      350,
      50
    )

    .text(
      `Date: ${new Date(
        order.createdAt
      ).toLocaleDateString()}`,
      350,
      70
    )

    .text(
      `Payment: ${order.paymentMethod}`,
      350,
      90
    );

  // LINE
  doc
    .moveTo(50, 120)
    .lineTo(550, 120)
    .strokeColor("#D1D5DB")
    .stroke();

  // =========================
  // DELIVERY ADDRESS
  // =========================
  doc
    .fillColor("#111827")
    .fontSize(13)
    .text(
      "Delivery Address",
      50,
      140
    );

  doc
    .fillColor("#4B5563")
    .fontSize(10)

    .text(customerName, 50, 165)

    .text(customerEmail, 50, 180)

    .text(customerStreet, 50, 195)

    .text(
      `${customerCity}, ${customerState} - ${customerZipcode}`,
      50,
      210
    )

    .text(
      `Phone: ${customerPhone}`,
      50,
      225
    );

  // =========================
  // TABLE HEADER
  // =========================
  let tableTop = 270;

  doc
    .fillColor("#111827")
    .fontSize(11)

    .text("Product", 50, tableTop)

    .text(
      "Price",
      280,
      tableTop,
      {
        width: 80,
        align: "right",
      }
    )

    .text(
      "Qty",
      380,
      tableTop,
      {
        width: 50,
        align: "right",
      }
    )

    .text(
      "Total",
      470,
      tableTop,
      {
        width: 80,
        align: "right",
      }
    );

  doc
    .moveTo(50, tableTop + 18)
    .lineTo(550, tableTop + 18)
    .strokeColor("#D1D5DB")
    .stroke();

  // =========================
  // PRODUCTS
  // =========================
  let currentY = tableTop + 35;

  order.items.forEach((item) => {

    doc
      .fillColor("#4B5563")
      .fontSize(10)

      .text(
        item.name,
        50,
        currentY
      )

      .text(
        `₹${item.price}`,
        280,
        currentY,
        {
          width: 80,
          align: "right",
        }
      )

      .text(
        item.quantity.toString(),
        380,
        currentY,
        {
          width: 50,
          align: "right",
        }
      )

      .text(
        `₹${item.price * item.quantity}`,
        470,
        currentY,
        {
          width: 80,
          align: "right",
        }
      );

    currentY += 30;
  });

  // =========================
  // TOTAL
  // =========================
  doc
    .moveTo(50, currentY)
    .lineTo(550, currentY)
    .strokeColor("#D1D5DB")
    .stroke();

  currentY += 25;

  doc
    .fillColor("#111827")
    .fontSize(14)

    .text(
      "Grand Total:",
      350,
      currentY
    )

    .text(
      `₹${order.totalAmount}`,
      470,
      currentY,
      {
        width: 80,
        align: "right",
      }
    );

  // FOOTER
  currentY += 50;

  doc
    .fillColor("#6B7280")
    .fontSize(9)

    .text(
      "Thank you for shopping with ShopEase!",
      50,
      currentY,
      {
        align: "center",
      }
    );

  doc.end();
};