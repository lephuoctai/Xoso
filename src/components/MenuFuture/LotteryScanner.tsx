
import { useRef, useState } from 'react';
import Tesseract from 'tesseract.js';

export default function LotteryScanner() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [result, setResult] = useState<string>('Chưa có kết quả');

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    };

    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const stream = video.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            video.srcObject = null;
        }
    };

    const captureAndRead = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            const ctx = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            Tesseract.recognize(canvas, 'eng').then(({ data: { text } }) => {
                const matches = text.match(/\b\d{6}\b/g); // Lọc chuỗi 6 số
                if (matches) {
                    setResult(`Số dò được: ${matches.join(', ')}`);
                } else {
                    setResult('Không tìm thấy số 6 chữ số nào.');
                    setTimeout(() => {
                        setResult('Vui lòng chụp lại ảnh rõ hơn!');
                    }, 500);
                }
            });
        }
    };

    return (
        <>
            <video ref={videoRef} autoPlay playsInline style={{ height: '80%' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className="btn-contain">
                <button onClick={startCamera}>Bật camera</button>
                <button onClick={stopCamera}>Tắt camera</button>
                <button onClick={captureAndRead}>Chụp & Dò số</button>
            </div>
            <p>{result}</p>
        </>
    );
}