interface BookingNotificationLineItem {
  name: string;
  price: number;
  quantity: number;
}

interface BookingNotificationData {
  bookingNumber: number;
  eventTitle: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  eventDate: string;
  eventTime: string;
  guestCount?: number | null;
  notes?: string | null;
  total: number;
  lineItems: BookingNotificationLineItem[];
}

function formatVnd(n: number): string {
  return n.toLocaleString("vi-VN") + "đ";
}

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:6px 0;font-size:13px;color:#6b6b70;width:140px;font-family:Georgia,serif;">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:#16161a;font-family:Georgia,serif;">${value}</td>
  </tr>`;

export function bookingNotificationEmailHtml(data: BookingNotificationData): string {
  const lineItemsHtml = data.lineItems
    .map(
      (li) => `
      <tr>
        <td style="padding:8px 0;font-size:14px;color:#16161a;font-family:Georgia,serif;">${li.name} ${li.quantity > 1 ? `x${li.quantity}` : ""}</td>
        <td style="padding:8px 0;font-size:14px;color:#a8863f;font-weight:bold;text-align:right;font-family:Georgia,serif;">${formatVnd(li.price * li.quantity)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="margin:0;padding:0;background:#faf9f6;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#ffffff;overflow:hidden;box-shadow:0 4px 20px rgba(22,22,26,0.1);border-radius:16px;">

        <tr>
          <td style="background:#16161a;padding:32px 40px;text-align:center;border-bottom:3px solid #a8863f;">
            <p style="color:#a8863f;font-size:10px;letter-spacing:4px;margin:0 0 10px;text-transform:uppercase;font-family:Georgia,serif;">
              3ThéGear Band
            </p>
            <h1 style="color:#faf9f6;font-size:24px;margin:0;font-weight:normal;font-family:Georgia,serif;">
              Booking mới #${data.bookingNumber}
            </h1>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${row("Dịch vụ", data.eventTitle)}
              ${row("Khách hàng", data.customerName)}
              ${row("Điện thoại", data.customerPhone)}
              ${data.customerEmail ? row("Email", data.customerEmail) : ""}
              ${row("Ngày", data.eventDate)}
              ${row("Khung giờ", data.eventTime)}
              ${data.guestCount ? row("Số khách", String(data.guestCount)) : ""}
              ${data.notes ? row("Ghi chú", data.notes) : ""}
            </table>

            <div style="border-top:1px solid #eee;margin:24px 0;"></div>

            <table width="100%" cellpadding="0" cellspacing="0">
              ${lineItemsHtml}
              <tr>
                <td style="padding:12px 0 0;font-size:15px;font-weight:bold;color:#16161a;border-top:1px solid #eee;font-family:Georgia,serif;">Tổng cộng</td>
                <td style="padding:12px 0 0;font-size:16px;font-weight:bold;color:#a8863f;text-align:right;border-top:1px solid #eee;font-family:Georgia,serif;">${formatVnd(data.total)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="background:#16161a;padding:20px 40px;text-align:center;">
            <p style="font-size:11px;color:rgba(250,249,246,0.5);margin:0;font-family:Georgia,serif;">
              Vào trang admin để xác nhận booking này.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
