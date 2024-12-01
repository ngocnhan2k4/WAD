function showNotification(message, type = 'info') {
    const overlay = document.createElement('div');
    overlay.id = 'notification-overlay';

    const notification = document.createElement('div');
    notification.id = 'notification';
    notification.className = `notification-${type}`; // Thêm class cho loại thông báo
    notification.innerHTML = `
        <p class="notification-message">${message}</p>
        <button id="notification-ok" class="notification-button">OK</button>
    `;

    document.body.appendChild(overlay);
    overlay.appendChild(notification);

    const closeNotification = () => {
        notification.classList.add('fade-out');
        setTimeout(() => overlay.remove(), 300);
    };

    document.getElementById('notification-ok').addEventListener('click', closeNotification);

    setTimeout(() => {
        if (document.body.contains(overlay)) closeNotification();
    }, 5000);
}

// Xuất hàm
export { showNotification };