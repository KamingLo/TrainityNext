export const getVerificationEmailTemplate = (code: string) => {
  const year = new Date().getFullYear();

  // Palette Warna Monochrome
  const colorBlack = "#000000";
  const colorText = "#333333";
  const colorMuted = "#666666";
  const colorBg = "#f5f5f5";       // Abu-abu sangat muda untuk background luar
  const colorCard = "#ffffff";     // Putih bersih untuk kartu
  const colorBorder = "#eaeaea";   // Border halus

  return `
  <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${colorBg}; color: ${colorText};">
    <div style="max-width: 480px; margin: 0 auto; padding: 60px 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="margin: 0; font-size: 36px; font-weight: 800; letter-spacing: -0.5px; color: ${colorBlack}; ">
          Trainity
        </h1>
      </div>

      <div style="
        background-color: ${colorCard}; 
        padding: 40px 40px; 
        border-radius: 12px; 
        border: 1px solid ${colorBorder};
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      ">
        
        <h2 style="margin: 0 0 20px; font-size: 20px; font-weight: 600; color: ${colorBlack}; text-align: center;">
          Verifikasi Keamanan
        </h2>
        
        <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: ${colorMuted}; text-align: center;">
          Kami menerima permintaan untuk mengatur ulang kata sandi Anda. Gunakan kode OTP di bawah ini untuk melanjutkan.
        </p>

        <div style="
          margin: 30px 0; 
          padding: 20px 0; 
          background-color: #fafafa; 
          border: 1px dashed #cccccc; 
          border-radius: 6px; 
          text-align: center;
        "><span style="
            display: block; 
            font-size: 32px; 
            font-weight: 700; 
            letter-spacing: 8px; 
            color: ${colorBlack}; 
            font-family: monospace; 
          ">${code}</span>
        </div>

        <div style="text-align: center;">
          <p style="margin: 0; font-size: 13px; color: ${colorMuted};">
            Berlaku selama <strong>10 menit</strong>.
          </p>
          <p style="margin: 5px 0 0; font-size: 13px; color: #999;">
            Jika bukan Anda, abaikan email ini.
          </p>
        </div>

      </div>

      <div style="margin-top: 30px; text-align: center;">
        <p style="margin: 0; font-size: 12px; color: #999;">
          &copy; ${year} Trainity. All rights reserved.
        </p>
        <div style="margin-top: 10px;">
          <a href="#" style="color: #999; text-decoration: none; font-size: 12px; margin: 0 8px;">Visit Our Website</a>
        </div>
      </div>

    </div>

  </body>
  </html>
  `;
};