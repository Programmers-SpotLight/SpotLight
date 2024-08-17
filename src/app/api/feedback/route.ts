import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request, res: Response) {
  const { type, title, contents, pictures } = await req.json();

  const transporter = nodemailer.createTransport({
    service: process.env.NEXT_PUBLIC_EMAIL_SERVICE,
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: parseInt(process.env.NEXT_PUBLIC_EMAIL_PORT!, 10),
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_AUTH_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_AUTH_PASS
    }
  });

  const mailOptions = {
    from: process.env.NEXT_PUBLIC_EMAIL_SENDER,
    to: process.env.NEXT_PUBLIC_EMAIL_RECEIVER,
    subject: `Feedback: ${type} - ${title}`,
    text: contents,
    attachments: pictures.map((pic: any) => {
      const extension = pic.imgType.split("/")[1];
      return {
        filename: `${pic.reviewImgId}.${extension}`,
        path: pic.reviewImgSrc
      };
    })
  };

  try {
    // 이메일 보내기
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "성공적으로 전송되었습니다." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "이메일 전송 실패" }, { status: 500 });
  }
}
