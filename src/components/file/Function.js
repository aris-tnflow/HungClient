import { toastError, toastLoading, toastSuccess } from '~/components/toast';

export const handleDownload = async (name, downloadUrl) => {
    if (!downloadUrl) return;
    try {
        toastLoading("dowload", "Đang chuẩn bị tải file...");
        const image = await fetch(downloadUrl);
        if (!image.ok) {
            toastError("dowload", "Tải xuống bị lỗi", "File không tồn tại hoặc đã bị xóa khỏi hệ thống");
            return;
        }
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        const anchor = document.createElement("a");
        anchor.href = imageURL;
        anchor.download = `aris-${name || "aris.jpeg"}`;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(imageURL);
        toastSuccess("dowload", "File Đã Sẵn Sàng Để Tải Xuống", "File của bạn đã được chuẩn bị và sẵn sàng để tải xuống");
    } catch (error) {
        toastError("dowload", "Tải xuống bị lỗi", "File không tồn tại hoặc đã bị xóa khỏi hệ thống");
    }
};
