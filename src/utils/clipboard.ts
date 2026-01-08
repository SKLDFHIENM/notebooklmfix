export const copyToClipboard = (text: string): Promise<boolean> => {
    return new Promise((resolve) => {
        // 1. Try Modern API (Navigator)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => resolve(true))
                .catch(() => fallbackCopy(text, resolve));
        } else {
            // 2. Fallback for HTTP / Mobile WebViews
            fallbackCopy(text, resolve);
        }
    });
};

const fallbackCopy = (text: string, resolve: (success: boolean) => void) => {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // Ensure it's not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        resolve(successful);
    } catch (err) {
        console.error('Fallback copy failed', err);
        resolve(false);
    }
};
