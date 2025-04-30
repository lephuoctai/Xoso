import { useState } from 'react';
import './FloatingMenu.css';
import LotteryScanner from './MenuFuture/LotteryScanner';

const FloatingMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [future, setFuture] = useState(0);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuItemClick = (itemNumber: number) => {
        // Xử lý khi người dùng nhấp vào một mục menu
        console.log(`Đã nhấp vào mục menu ${itemNumber}`);

        setFuture(itemNumber);
    };

    return (
        <div className="menu-container">
            {isOpen && (
                <div className="nva">
                    <div className="menu-items">
                        <button onClick={() => handleMenuItemClick(1)}>Auto Scanner</button>
                        <button onClick={() => handleMenuItemClick(2)}>Tính năng 2</button>
                        <button onClick={() => handleMenuItemClick(3)}>Tính năng 3</button>
                    </div>
                    <div className="view"> 
                        <LotteryScanner />
                    </div>
                </div>
            )}
            <button
                className={`menu-button ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Menu"
            >
                <span className="menu-icon"></span>
            </button>
        </div>
    );
};

export default FloatingMenu;