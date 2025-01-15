const TextBox = document.getElementById("TextBox");

let words = "Tillman's Sandbox";

const ANIMATION_DURATION = 4000; // ms

function updateSpiral() {
    words = TextBox.value;
    document.getElementById("spiral").innerHTML = "";
    document.getElementById("spiral2").innerHTML = "";

    const characters = words.split("").forEach((char, i) => {
        function createElement(offset) {
            const div = document.createElement("div");
            div.innerText = char;
            div.classList.add("character");
            div.style.animationDelay = `-${i * (ANIMATION_DURATION / 16) - offset}ms`;
            return div;
        }
    
        document.getElementById("spiral").append(createElement(0));
        document.getElementById("spiral2").append(createElement(-1 * (ANIMATION_DURATION / 2)));
    });
}

TextBox.addEventListener("input", updateSpiral);

TextBox.value = words;
window.addEventListener('load', function() {
    updateSpiral();
});