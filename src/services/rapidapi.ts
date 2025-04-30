import axios from 'axios';

// Interface cho kết quả xổ số từ API xoso188.net
export interface LotteryApiResponse {
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

export interface LotteryIssue {
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

export interface LotteryResult {
    prize: string;
    number: string;
}

// Function để kiểm tra vé số
export const checkLotteryTicket = async (
    ticketNumber: string,
    provinceCode: string = 'vnmnmg' // Mã vùng mặc định là xổ số VIP miền Nam
): Promise<string> => {
    try {
        // Gọi API mới từ xoso188.net với mã tỉnh đã chọn
        const url = `https://xoso188.net/api/front/open/lottery/history/list/5/${provinceCode}`;

        const response = await axios.get<LotteryApiResponse>(url);

        // Kiểm tra nếu API không thành công
        if (!response.data.success) {
            throw new Error('API trả về lỗi: ' + response.data.msg);
        }

        // Lấy kết quả xổ số mới nhất
        const latestIssue = response.data.t.issueList[0];
        const detailArray = JSON.parse(latestIssue.detail);

        // Phân tích cấu trúc giải thưởng từ detail
        const prizes: LotteryResult[] = [
            { prize: "Giải Đặc biệt", number: detailArray[0] },
            { prize: "Giải Nhất", number: detailArray[1] },
            { prize: "Giải Nhì", number: detailArray[2] },
            { prize: "Giải Ba", number: parseMultipleNumbers(detailArray[3]) },
            { prize: "Giải Tư", number: parseMultipleNumbers(detailArray[4]) },
            { prize: "Giải Năm", number: detailArray[5] },
            { prize: "Giải Sáu", number: parseMultipleNumbers(detailArray[6]) },
            { prize: "Giải Bảy", number: detailArray[7] },
            { prize: "Giải Tám", number: detailArray[8] }
        ];

        // Kiểm tra vé số với tất cả các giải
        const lastSixDigits = ticketNumber.slice(-6);
        const matchedPrizes: string[] = [];

        for (const prize of prizes) {
            // Xử lý từng số trong giải (có thể có nhiều số)
            const numbers = prize.number.split(',');

            for (const num of numbers) {
                const trimmedNum = num.trim();
                if (lastSixDigits.endsWith(trimmedNum)) {
                    matchedPrizes.push(prize.prize);
                    break; // Không cần kiểm tra các số khác trong cùng giải
                }
            }
        }

        // Trả về kết quả
        if (matchedPrizes.length > 0) {
            return `Chúc mừng! Bạn đã trúng ${matchedPrizes.join(', ')}!`;
        } else {
            return "Không trúng giải nào";
        }
    } catch (error) {
        console.error('Error checking lottery ticket:', error);
        return "Có lỗi xảy ra khi kiểm tra vé số";
    }
};

// Helper function để xử lý các số trong một giải có nhiều số (vd: "10515,32175")
function parseMultipleNumbers(numbersString: string): string {
    // Giữ nguyên chuỗi, không cần xử lý thêm vì chúng ta sẽ tách khi kiểm tra
    return numbersString;
}