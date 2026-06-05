function showMessage(text, success = false) {
    const el = document.getElementById("login-message");

    el.innerText = text;

    el.className =
        "fixed top-5 right-5 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg z-50 " +
        "transform translate-x-32 opacity-0 transition-all duration-500 backdrop-blur-md border";

    if (success) {
        el.classList.add("bg-green-400/30", "text-green-700", "border-green-300/40");
    } else {
        el.classList.add("bg-red-400/30", "text-red-700", "border-red-300/40");
    }

    setTimeout(() => {
        el.classList.remove("translate-x-32", "opacity-0");
        el.classList.add("translate-x-0", "opacity-100");
    }, 50);

    setTimeout(() => {
        el.classList.add("translate-x-32", "opacity-0");
    }, 3000);
}