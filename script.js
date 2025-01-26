const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn'); // New Share button
const qrContainer = document.querySelector('.qr-body');
const historyContainer = document.getElementById('history-container'); // For displaying history

let size = 200; // Default QR code size

// Load history on page load
window.addEventListener('load', loadHistory);

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isEmptyInput();
});

downloadBtn.addEventListener('click', () => {
    let img = document.querySelector('.qr-body img');

    if (img !== null) {
        let imgAttr = img.getAttribute('src');
        downloadBtn.setAttribute("href", imgAttr);
    } else {
        downloadBtn.setAttribute("href", `${document.querySelector('canvas').toDataURL()}`);
    }
});

shareBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const qrCanvas = document.querySelector('.qr-body canvas'); // Locate the QR Code canvas
    if (!qrCanvas) {
        alert('Please generate a QR code before sharing!');
        return;
    }

    // Convert the QR code canvas to a Blob
    qrCanvas.toBlob(async (blob) => {
        const file = new File([blob], 'qr-code.png', { type: 'image/png' });

        // Check if the Web Share API is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My QR Code',
                    text: 'Check out this QR Code I generated!',
                    files: [file],
                });
                alert('QR Code shared successfully!');
            } catch (error) {
                console.error('Error sharing:', error);
                alert('Failed to share the QR code.');
            }
        } else {
            alert('Sharing is not supported on this device.');
        }
    });
});

function isEmptyInput() {
    qrText && qrText.value.length > 0 ? generateQRCode() : alert("Enter the text or URL to generate your QR code");
}

function generateQRCode() {
    let text = qrText ? qrText.value.trim() : '';

    // Check if the input is a valid URL
    if (!text.startsWith('http://') && !text.startsWith('https://')) {
        text = 'https://' + text;
    }

    qrContainer.innerHTML = "";
    const qrCode = new QRCode(qrContainer, {
        text: text,
        height: size,
        width: size,
        colorLight: "#fff",
        colorDark: "#000",
    });

    saveToHistory(text); // Save the generated QR code to history
}

// Save the QR code text to localStorage
function saveToHistory(text) {
    let history = JSON.parse(localStorage.getItem('qrHistory')) || [];
    if (!history.includes(text)) {
        history.push(text);
        // Keep only the last two entries in localStorage
        if (history.length > 2) {
            history = history.slice(-2);
        }
        localStorage.setItem('qrHistory', JSON.stringify(history));
    }
    displayHistory();
}

// Load and display the history from localStorage
function loadHistory() {
    displayHistory();
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('qrHistory')) || [];
    const recentHistory = history.slice(-2); // Show only the last two entries

    historyContainer.innerHTML = recentHistory.length
        ? `<h3>Generated QR Code History</h3><ul>${recentHistory
              .map((item) => `<li><a href="${item}" target="_blank">${item}</a></li>`)
              .join('')}</ul>`
        : '<h3>No history available</h3>';
}

resetBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior

    // Clear the QR text input
    if (qrText) qrText.value = '';

    // Clear the QR container
    qrContainer.innerHTML = '';

    // Reset the history display
    historyContainer.innerHTML = '<h3>No history available</h3>';

    // Clear localStorage
    localStorage.removeItem('qrHistory');

    // Show the reset notification
    const notification = document.getElementById('reset-notification');
    notification.style.display = 'block';

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 2000); // Adjust time as needed
});
