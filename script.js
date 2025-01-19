const qrText = document.getElementById('qr-text');
const sizes = document.getElementById('sizes');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn'); // New Share button
const qrContainer = document.querySelector('.qr-body');

let size = sizes.value;

generateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    isEmptyInput();
});

sizes.addEventListener('change', (e) => {
    size = e.target.value;
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

// Add event listener for Share button
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
    qrText.value.length > 0 ? generateQRCode() : alert("Enter the text or URL to generate your QR code");
}

function generateQRCode() {
    let text = qrText.value.trim();
    
    // Check if the input is a valid URL
    if (!text.startsWith('http://') && !text.startsWith('https://')) {
        text = 'https://' + text;
    }

    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
        text: text,
        height: size,
        width: size,
        colorLight: "#fff",
        colorDark: "#000",
    });
}
