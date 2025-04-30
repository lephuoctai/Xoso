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
        }
      });
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={startCamera}>Bật camera</button>
      <button onClick={captureAndRead}>Chụp & Dò số</button>
      <p>{result}</p>
    </div>
  );
}
