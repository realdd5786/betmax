import PDFDocument from "pdfkit";

type PdfPayload = {
  title: string;
  text: string;
};

export async function generatePdf({ title, text }: PdfPayload) {
  const doc = new PDFDocument({ margin: 40 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(20).text(title, { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(text, { align: "left" });

  doc.end();

  await new Promise<void>((resolve) => {
    doc.on("end", () => resolve());
  });

  return Buffer.concat(chunks);
}
