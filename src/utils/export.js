import html2canvas from 'html2canvas';
import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';


export const exportDataExcel = (data, name) => {
    const dataWithStt = data.map((row, index) => ({ stt: index + 1, ...row }));
    const worksheet = utils.json_to_sheet(dataWithStt);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Orders");
    const wscols = [];
    const keys = Object.keys(dataWithStt[0]);
    keys.forEach(key => {
        let maxWidth = key.length;
        dataWithStt.forEach(row => {
            maxWidth = Math.max(maxWidth, String(row[key]).length);
        });
        wscols.push({ wch: maxWidth + 1 });
    });
    worksheet['!cols'] = wscols;

    writeFile(workbook, name);
}
// Hàm exportToPDF
export const exportToPDF = (invoiceRef) => {
    if (invoiceRef.current) {
        // Lưu lại background và màu gốc của invoice
        const originalBackground = invoiceRef.current.style.backgroundColor;
        const originalColor = invoiceRef.current.style.color;

        // Thay đổi background và màu của invoice
        invoiceRef.current.style.backgroundColor = '#ffffff';
        invoiceRef.current.style.color = '#000000';

        // Lưu lại màu gốc của tất cả các text có class "text-order"
        const textOrderElements = invoiceRef.current.querySelectorAll('.text-order');
        const originalTextOrderColors = [];
        textOrderElements.forEach(element => {
            originalTextOrderColors.push(element.style.color);
            element.style.color = 'black'; // Thay đổi thành màu bạn muốn, ví dụ: màu đỏ
        });

        // Sử dụng html2canvas để tạo ảnh
        html2canvas(invoiceRef.current, {
            width: invoiceRef.current.offsetWidth,
            height: invoiceRef.current.offsetHeight,
            scale: 2,
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('invoice.pdf');

            // Trả lại style ban đầu của invoice
            invoiceRef.current.style.backgroundColor = originalBackground;
            invoiceRef.current.style.color = originalColor;

            // Trả lại màu gốc cho các phần tử có class "text-order"
            textOrderElements.forEach((element, index) => {
                element.style.color = originalTextOrderColors[index];
            });
        });
    }
};

// Hàm printInvoice
export const printInvoice = (invoiceRef) => {
    const printContent = invoiceRef.current;
    const WinPrint = window.open('', '', 'width=900,height=650');
    WinPrint.document.write(printContent.innerHTML);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
};

