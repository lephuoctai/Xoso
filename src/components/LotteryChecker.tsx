import { useState, useEffect, JSX } from 'react';
import { checkLotteryTicket } from '../services/rapidapi';
import axios from 'axios';
import './LotteryChecker.css';

// Interface cho kết quả xổ số từ API
interface LotteryApiResponse {
    success: boolean;
    msg: string;
    code: number;
    t: {
        turnNum: string;
        openTime: string;
        serverTime: string;
        name: string;
        code: string;
        sort: number;
        navCate: string;
        issueList: LotteryIssue[];
    };
}

interface LotteryIssue {
    turnNum: string;
    openNum: string;
    openTime: string;
    openTimeStamp: number;
    detail: string;
    status: number;
    replayUrl: string | null;
    n11: string | null;
    jackpot: number;
}

// Danh sách tỉnh/thành phố với mã vùng tương ứng
interface Province {
    id: string;
    name: string;
}

const provinces: Province[] = [
    { id: 'vnmnmg', name: 'Xổ Số VIP Miền Nam' },
    { id: 'kigi', name: 'Kiên Giang' },
    { id: 'dona', name: 'Đồng Nai' },
    { id: 'bali', name: 'Bạc Liêu' },
    { id: 'angi', name: 'An Giang' },
    { id: 'cama', name: 'Cà Mau' },
    { id: 'thth', name: 'Thừa Thiên Huế' }
];

const LotteryChecker = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [selectedProvince, setSelectedProvince] = useState(provinces[0].id);
    const [result, setResult] = useState<string | null>(null);
    const [resultTime, setResultTime] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lotteryData, setLotteryData] = useState<LotteryIssue | null>(null);
    const [showResults, setShowResults] = useState(false);

    // Lấy kết quả xổ số khi component được tải hoặc khi thay đổi tỉnh/thành phố
    useEffect(() => {
        fetchLotteryResults();
    }, [selectedProvince]);

    // Hàm lấy kết quả xổ số từ API
    const fetchLotteryResults = async () => {
        try {
            const url = `https://xoso188.net/api/front/open/lottery/history/list/5/${selectedProvince}`;
            const response = await axios.get<LotteryApiResponse>(url);

            if (response.data.success && response.data.t.issueList.length > 0) {
                setLotteryData(response.data.t.issueList[0]);
            }
        } catch (error) {
            console.error('Lỗi khi lấy kết quả xổ số:', error);
        }
    };

    const handleTicketNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow numbers and limit to 6 digits
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setTicketNumber(value);
    };

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedProvince(e.target.value);
        // Reset result when province changes
        setResult(null);
    };

    const checkTicket = async () => {
        // Validate ticket number
        if (ticketNumber.length !== 6) {
            setError('Vui lòng nhập 6 số trên vé số của bạn');
            return;
        }

        setError(null);
        setIsLoading(true);
        
        try {
            const resultMessage = await checkLotteryTicket(ticketNumber, selectedProvince);
            setResult(resultMessage);
            
            // Lưu thời gian dò vé
            const now = new Date();
            const timeString = now.toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setResultTime(timeString);
        } catch (err) {
            setError('Đã xảy ra lỗi khi kiểm tra vé số. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Hiển thị kết quả xổ số chi tiết
    const renderLotteryResults = () => {
        if (!lotteryData) return null;

        try {
            const detailArray = JSON.parse(lotteryData.detail);
            
            // Tìm tên tỉnh/thành phố được chọn
            const selectedProvinceName = provinces.find(p => p.id === selectedProvince)?.name || '';

            return (
                <div className="lottery-results">
                    <h3>Kết quả xổ số {selectedProvinceName} ngày {formatDate(lotteryData.openTime)}</h3>
                    <p className="turnNum">Kỳ quay thưởng: {lotteryData.turnNum}</p>

                    <div className="prize-table">
                        <div className="prize-row">
                            <div className="prize-name">Giải Đặc biệt</div>
                            <div className="prize-number">{detailArray[0]}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Nhất</div>
                            <div className="prize-number">{detailArray[1]}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Nhì</div>
                            <div className="prize-number">{detailArray[2]}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Ba</div>
                            <div className="prize-number">{formatMultipleNumbers(detailArray[3])}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Tư</div>
                            <div className="prize-number">{formatMultipleNumbers(detailArray[4])}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Năm</div>
                            <div className="prize-number">{detailArray[5]}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Sáu</div>
                            <div className="prize-number">{formatMultipleNumbers(detailArray[6])}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Bảy</div>
                            <div className="prize-number">{detailArray[7]}</div>
                        </div>
                        <div className="prize-row">
                            <div className="prize-name">Giải Tám</div>
                            <div className="prize-number">{detailArray[8]}</div>
                        </div>
                    </div>
                </div>
            );
        } catch (error) {
            console.error('Lỗi khi hiển thị kết quả xổ số:', error);
            return <p>Không thể hiển thị kết quả xổ số</p>;
        }
    };

    // Format multiple numbers for display
    const formatMultipleNumbers = (numbersString: string): JSX.Element => {
        const numbers = numbersString.split(',');

        return (
            <>
                {numbers.map((num, index) => (
                    <span key={index} className="multi-number">
                        {num.trim()}
                        {index < numbers.length - 1 ? ' - ' : ''}
                    </span>
                ))}
            </>
        );
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    return (
        <div className="lottery-checker">
            <div className="form-group">
                <label htmlFor="ticketNumber">Mã số vé (6 số):</label>
                <input
                    type="text"
                    id="ticketNumber"
                    value={ticketNumber}
                    onChange={handleTicketNumberChange}
                    placeholder="Nhập 6 số trên vé của bạn"
                    maxLength={6}
                />
            </div>

            <div className="form-group">
                <label htmlFor="province">Chọn tỉnh/thành phố:</label>
                <select id="province" value={selectedProvince} onChange={handleProvinceChange}>
                    {provinces.map(province => (
                        <option key={province.id} value={province.id}>{province.name}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={checkTicket}
                disabled={isLoading}
                className="check-button"
            >
                {isLoading ? 'Đang kiểm tra...' : 'Dò Vé'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {result && (
                <div className={`result-container ${result.includes('Chúc mừng') ? 'winner' : 'no-winner'}`}>
                    <h3>Kết quả:</h3>
                    <p>{result}</p>
                    {resultTime && (
                        <p className="result-time">Thời gian dò vé: {resultTime}</p>
                    )}
                </div>
            )}

            <div className="toggle-results">
                <button
                    onClick={() => setShowResults(!showResults)}
                    className="toggle-button"
                >
                    {showResults ? 'Ẩn kết quả xổ số' : 'Xem kết quả xổ số'}
                </button>
            </div>

            {showResults && renderLotteryResults()}
        </div>
    );
};

export default LotteryChecker;