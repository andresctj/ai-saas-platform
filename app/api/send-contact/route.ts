import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    // Recibimos los nuevos campos: whatsapp y email
    const { nombre, whatsapp, email, imagenUrl, industria } = await req.json();

    // CONFIGURACIÓN PARA SERVIDOR PROPIO
    const transporter = nodemailer.createTransport({
      host: "mail.tmzsolutions.com",
      port: 465, 
      secure: true, 
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"TMZ Leads" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, 
      subject: `🚀 NUEVO LEAD: ${industria} - ${nombre}`,
      // Adjuntamos la imagen generada para que se vea en el cuerpo del mail
      attachments: [
        {
          filename: 'propuesta-diseno.jpg',
          path: imagenUrl,
          cid: 'diseno_adjunto' 
        }
      ],
      html: `
        <div style="font-family: sans-serif; background-color: #000; color: #fff; padding: 40px; border-radius: 20px; border: 1px solid #333;">
          <h1 style="color: #6366f1; text-transform: uppercase; font-style: italic; margin-bottom: 0;">Nuevo Cliente</h1>
          <p style="color: #666; font-size: 12px; margin-top: 5px;">Generado por TMZ AI System</p>
          
          <hr style="border: 0; border-top: 1px solid #333; margin: 20px 0;">
          
          <table style="width: 100%; color: #fff; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;"><strong>Nombre:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;">${nombre}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;"><strong>WhatsApp:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #111; color: #22c55e;">${whatsapp}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;"><strong>Email:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;"><strong>Industria:</strong></td>
              <td style="padding: 10px 0; border-bottom: 1px solid #111;">${industria}</td>
            </tr>
          </table>

          <p style="margin-top: 30px; font-weight: bold; color: #6366f1;">Propuesta Visual Generada:</p>
          <div style="background: #111; padding: 10px; border-radius: 15px; border: 1px solid #222;">
            <img src="cid:diseno_adjunto" style="width: 100%; border-radius: 10px;" />
          </div>
          
          <p style="font-size: 10px; color: #444; text-align: center; margin-top: 30px;">
            TMZ Solutions AI System • Ecuador 2026
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("❌ Error SMTP:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}