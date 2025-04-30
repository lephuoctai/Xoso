import { useState } from 'react';
import './FloatingMenu.css';

const FloatingMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleMenuItemClick = (itemNumber: number) => {
        // Xử lý khi người dùng nhấp vào một mục menu
        console.log(`Đã nhấp vào mục menu ${itemNumber}`);

        // Đóng menu sau khi người dùng chọn một mục
        setIsOpen(false);
    };

    const handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-container')) {
            setIsOpen(false);
        }
    };

    // Thêm sự kiện lắng nghe khi menu mở
    if (isOpen) {
        document.addEventListener('click', handleOutsideClick);
    } else {
        document.removeEventListener('click', handleOutsideClick);
    }

    return (
        <div className="menu-container">


            {isOpen && (
                <div className="menu-items">
                    <button onClick={() => handleMenuItemClick(1)}>Tính năng 1</button>
                    <button onClick={() => handleMenuItemClick(2)}>Tính năng 2</button>
                    <button onClick={() => handleMenuItemClick(3)}>Tính năng 3</button>
                </div>
            )}<button
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