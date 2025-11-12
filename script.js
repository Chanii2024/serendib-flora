// === FEATURED CAROUSEL AUTO ROTATION ===
const grid = document.querySelector(".featured-carousel-grid");
let cards = Array.from(document.querySelectorAll(".featured-card")); // refreshed dynamically
let current = 0;
let autoRotate;


let isAnimating = false;

function stepPx() {
    const first = cards[0];
    const rect = first.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(grid).columnGap || getComputedStyle(grid).gap || 0);
    return rect.width + gap; // one column shift (card width + grid gap)
}


function rotateCards() {
    if (isAnimating) return;
    isAnimating = true;

    // prepare next card to grow while sliding
    cards.forEach(c => c.classList.remove("is-active"));
    cards[1].classList.add("is-active");

    // animate slide left by exactly one column (responsive)
    const dist = stepPx();
    grid.style.transition = "transform 1s cubic-bezier(0.45, 0, 0.55, 1)";
    void grid.offsetWidth; // force reflow
    grid.style.transform = `translateX(-${dist}px)`;

    setTimeout(() => {
        // move first card to end with smooth entry
        const moved = cards.shift();
        moved.style.transition = "none";
        moved.style.opacity = "0";
        moved.style.transform = "translateX(60px)";
        grid.appendChild(moved);
        cards = Array.from(document.querySelectorAll(".featured-card")); // resync card order


        // slight delay then animate in
        setTimeout(() => {
            moved.style.transition = "transform 0.8s ease, opacity 0.8s ease";
            moved.style.opacity = "1";
            moved.style.transform = "translateX(0) scale(0.83)";
        }, 50);


        // reset position instantly
        grid.style.transition = "none";
        grid.style.transform = "translateX(0)";

        // lock active on new first
        cards.forEach(c => c.classList.remove("is-active"));
        cards[0].classList.add("is-active");

        // wait a bit, then clear inline transforms (keep smooth entry)
        setTimeout(() => {
            cards.forEach(c => (c.style.transform = ""));
        }, 900); // clear right after animations finish



        updateFeaturedInfo(); // sync info with first column card
isAnimating = false;

    }, 1000); // match transition
}


// autoplay control
function startRotation() {
    autoRotate = setInterval(rotateCards, 3000);
}

// pause on hover
grid.addEventListener("mouseenter", () => clearInterval(autoRotate));
grid.addEventListener("mouseleave", startRotation);

// start it
startRotation();



const plantLongDesc = {
  "Dracaena": "Dracaena is an elegant indoor plant known for its tall, glossy green leaves and sculptural form. It thrives in low to moderate light and needs only occasional watering, making it ideal for busy homes or offices. This hardy plant naturally purifies indoor air, effectively removing toxins while maintaining vibrant color throughout the year. Its graceful stems and minimal care requirements bring sophistication, balance, and a refreshing tropical feel to modern interiors, creating a calming environment filled with clean, natural energy and beauty.",
  "Money": "The Money Plant is cherished worldwide as a symbol of luck, wealth, and positive energy. With its heart-shaped, shiny green leaves, it grows easily in both water and soil, making it perfect for any space. It purifies the air, reduces stress, and adds a soothing freshness to rooms and work areas. Known for its resilience, strength, and adaptability, it thrives beautifully in indirect sunlight with minimal care. Whether placed on desks, windows, or shelves, it brings elegance, prosperity, and lasting natural harmony everywhere.",
  "Snake": "The Snake Plant is a resilient houseplant recognized for its upright, sword-like leaves that remain strikingly green year-round. It tolerates low light, thrives with infrequent watering, and improves air quality by removing harmful indoor toxins. Its architectural shape suits both modern and traditional interiors beautifully. Known for surviving neglect, it’s perfect for beginners or travelers. The Snake Plant adds natural texture, style, and cleaner air while enhancing the calmness and visual balance of living rooms, bedrooms, or offices.",
  "Rubber": "The Rubber Plant is a bold, eye-catching indoor species that features broad, shiny leaves with deep green or burgundy tones. It thrives in bright, indirect light and needs minimal attention, making it perfect for home or office spaces. This plant helps purify the air, removes toxins, and promotes a healthier atmosphere. Its lush, polished foliage adds a refined, tropical elegance to interiors, instantly brightening dull corners. Easy to maintain, it continues growing steadily, offering timeless charm, structure, and natural freshness indoors.",
  "Ficus": "The Ficus plant, with its dense canopy of glossy leaves, is a classic favorite for both homes and offices. It thrives in bright, indirect sunlight and appreciates consistent watering without overdoing it. Renowned for its air-purifying abilities, it brings freshness and oxygen indoors naturally. Its graceful shape makes it a perfect decorative accent for corners or entryways. As it grows, the Ficus symbolizes balance, stability, and renewal, helping transform any interior into a vibrant, welcoming, and nature-inspired sanctuary of calm."
};

function updateFeaturedInfo() {
  const first = grid.querySelector(".featured-card:first-child") || grid.querySelector(".featured-card.is-active");
  if (!first) return;

  const name = first.querySelector(".featured-name")?.textContent?.trim() || "";
  const nameEl = document.getElementById("featuredName");
  const descEl = document.getElementById("featuredDesc");

  if (nameEl) nameEl.textContent = name + " Plant";
  if (descEl) descEl.textContent = plantLongDesc[name] || "";
}

updateFeaturedInfo(); // initial sync

