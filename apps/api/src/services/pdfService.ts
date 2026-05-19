import puppeteer from 'puppeteer';

export const generatePDF = async (htmlContent: string) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
 await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
  
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
  });

  await browser.close();
  return pdfBuffer;
};