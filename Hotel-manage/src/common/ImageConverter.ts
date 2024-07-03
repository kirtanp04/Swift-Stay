
export default class ImageConverter {
    static toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onerror = reject;
            reader.onload = (e: any) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });


    }

    static base64ToBuffer(base64: string): ArrayBuffer {
        const binaryString = window.atob(base64.split(',')[1]);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    static bufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    static base64ToFile(base64: string, filename: string, mimeType: string): File {
        const arr = base64.split(',');
        // const mime = arr[0].match(/:(.*?);/)![1];
        const bstr = window.atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mimeType });
    }


    static fileToBuffer(file: File): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = error => reject(error);
        });
    }
}
