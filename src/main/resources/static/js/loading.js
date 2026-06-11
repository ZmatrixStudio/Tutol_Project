function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'otp-loading';
    loading.className = `
        fixed inset-0 bg-black/50 flex items-center justify-center z-[99999]
    `;

    loading.innerHTML = `
        <div class="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    `;

    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('otp-loading');
    if (loading) loading.remove();
}