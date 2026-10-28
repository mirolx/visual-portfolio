gsap.registerPlugin(ScrollTrigger);

const works = window.WORKS;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const intro = document.getElementById("intro");
const cat = document.getElementById("cat");
const hint = document.getElementById("hint");
const work = document.getElementById("work");

/* ---------- 발도장 ---------- */
// 어두워진 화면에 고양이가 든 앞발 자리로 발도장 모양의 창이 꾹 찍히고,
// 그 창이 큰 젤리를 중심으로 부풀어 화면 전체를 덮으며 Work가 드러난다.
// 발도장 모양은 Kittl 일러스트(paw-print.png)의 알파를 Work의 mask로 써서 만든다.
// stamp: 발도장이 찍히는 정도, open: 부푸는 정도 (모두 0→1)
const print = { stamp: 0, open: 0, x: 0, y: 0 };
const PRINT_SRC = "assets/cat/paw-print.png";
// paw-print.png 안에서 큰 젤리 중심 (이미지 비율 기준). 부풀 때 이 점을 기준으로 커진다.
const MAIN_PAD = { x: 0.5, y: 0.625 };

// 살짝 튀어 오르며 찍히는 느낌 (back.out)
function backOut(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function clearMask() {
  work.style.webkitMaskImage = work.style.maskImage = "";
  work.style.zIndex = "";
  work.style.opacity = "";
}

function renderPrint() {
  const { stamp, open, x, y } = print;
  if (stamp <= 0 || open >= 1) {
    clearMask();
    return;
  }
  const W = window.innerWidth;
  const H = window.innerHeight;
  const S = Math.min(W, H) * 0.3;
  // 찍힐 때는 살짝 튀어 오르고, 부풀 때는 큰 젤리가 화면 대각선의 몇 배가 될 때까지 키워 화면 전체를 덮는다
  const size = S * backOut(stamp) * (1 + open * open * ((Math.hypot(W, H) * 4) / S));
  const cx = x + (MAIN_PAD.x - 0.5) * S;
  const cy = y + (MAIN_PAD.y - 0.5) * S;
  work.style.zIndex = 30;
  work.style.opacity = Math.min(1, stamp * 3);
  work.style.webkitMaskImage = work.style.maskImage = `url(${PRINT_SRC})`;
  work.style.webkitMaskRepeat = work.style.maskRepeat = "no-repeat";
  work.style.webkitMaskSize = work.style.maskSize = `${size}px ${size}px`;
  work.style.webkitMaskPosition = work.style.maskPosition =
    `${cx - size * MAIN_PAD.x}px ${cy - size * MAIN_PAD.y}px`;
}

/* ---------- Intro: 앞발 든 고양이 → 화면이 어두워지고 발도장 사이로 Work가 드러나는 전환 ---------- */
function setupIntro() {
  if (reduceMotion) {
    // 모션을 줄인 환경에서는 전환 없이 인트로를 일반 섹션처럼 쌓는다
    intro.style.position = "relative";
    intro.style.height = "100vh";
    intro.style.boxShadow = "none";
    return;
  }

  const workParts = work.querySelectorAll(".work__head, .work__body");
  const shade = document.getElementById("shade");
  const catSit = document.getElementById("cat-sit");
  const catUp = document.getElementById("cat-up");
  const texts = intro.querySelectorAll(".intro__eyebrow");

  // cat-paw-up.png 안에서 든 앞발 젤리의 중심 위치 (이미지 비율 기준).
  // 이 점을 기준으로 살짝만 다가가서, 고양이 전신이 거의 다 보이는 상태로 전환한다.
  const PAW_IN_CAT = { x: 0.642, y: 0.317 };
  const ZOOM = 1.2;
  gsap.set(cat, { transformOrigin: `${PAW_IN_CAT.x * 100}% ${PAW_IN_CAT.y * 100}%` });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: work,
      start: "top top",
      end: () => "+=" + window.innerHeight * 2.6,
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
    onUpdate: () => {
      placePrint();
      renderPrint();
      intro.style.visibility = print.open >= 1 ? "hidden" : "visible";
    },
  });

  // 발도장은 고양이가 든 앞발 위치에 찍는다 (줌의 기준점이라 확대해도 위치가 변하지 않는다)
  function placePrint() {
    const r = cat.getBoundingClientRect();
    print.x = r.left + r.width * PAW_IN_CAT.x;
    print.y = r.top + r.height * PAW_IN_CAT.y;
  }

  // 1. 고양이가 앞발을 든다 (앉은 자세 → 앞발 든 자세 크로스페이드)
  tl.to(hint, { autoAlpha: 0, duration: 0.06 }, 0)
    .to(catUp, { opacity: 1, duration: 0.12, ease: "power1.inOut" }, 0)
    .to(catSit, { opacity: 0, duration: 0.08, ease: "power1.in" }, 0.04)
    // 2. 든 앞발로 카메라가 다가간다
    .to(texts, { autoAlpha: 0, y: -20, duration: 0.12 }, 0.12)
    // 큰 글자는 CSS의 회전을 유지하도록 투명도만 줄인다
    .to(".intro__display", { autoAlpha: 0, duration: 0.14 }, 0.12)
    .to(cat, { scale: ZOOM, duration: 0.2, ease: "power2.inOut" }, 0.12)
    // 3. 화면이 어두워지며 고양이가 앞발을 화면 쪽으로 내민다
    .to(shade, { opacity: 0.94, duration: 0.1, ease: "power2.in" }, 0.32)
    .to(cat, { scale: ZOOM * 1.08, duration: 0.1, ease: "power2.in" }, 0.32)
    // 4. 꾹: 고양이가 든 앞발 자리에 발도장 모양으로 Work 화면이 찍힌다
    .to(print, { stamp: 1, duration: 0.12 }, 0.44)
    // 5. 큰 젤리를 중심으로 발도장이 부풀어 Work 화면 전체가 드러난다
    .to(print, { open: 1, duration: 0.34, ease: "power2.in" }, 0.62)
    .fromTo(workParts, { scale: 1.06 }, { scale: 1, duration: 0.36, ease: "power2.out" }, 0.64);

  // 마우스를 따라 고양이가 살짝 움직인다 (breathe 애니메이션의 transform과 겹치지 않게 translate 사용)
  if (canHover) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener("pointermove", (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 18;
      ty = (e.clientY / window.innerHeight - 0.5) * 10;
    });
    gsap.ticker.add(() => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      cat.style.translate = `${cx.toFixed(2)}px ${cy.toFixed(2)}px`;
    });
  }
}

/* ---------- Work 리스트와 hover 미리보기 ---------- */
const list = document.getElementById("list");
const preview = document.getElementById("preview");
document.getElementById("count").textContent = `(${String(works.length).padStart(2, "0")})`;

function posterHTML(w) {
  const bg = `linear-gradient(160deg, hsl(${w.hue} 42% 58%), hsl(${w.hue + 30} 38% 28%))`;
  return `<div class="poster" style="background:${bg}">
    <p class="poster__cat">${w.category}</p>
    <p class="poster__title">${w.title}</p>
    <div class="poster__tags">${w.tags.map((t) => `<span>${t}</span>`).join("")}</div>
  </div>`;
}

const cards = works.map((w) => {
  const card = document.createElement("div");
  card.className = "preview__card";
  card.innerHTML = w.image ? `<img src="${w.image}" alt="" style="background:hsl(${w.hue} 30% 88%);object-fit:contain">` : posterHTML(w);
  preview.appendChild(card);
  return card;
});

let activeIndex = -1;
let z = 1;

function activate(i) {
  if (i === activeIndex) return;
  list.children[activeIndex]?.classList.remove("is-active");
  activeIndex = i;
  list.children[i].classList.add("is-active");
  if (!canHover) return;
  preview.classList.add("is-on");
  const card = cards[i];
  gsap.killTweensOf(card);
  gsap.set(card, { zIndex: ++z });
  gsap.fromTo(card, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.out" });
  gsap.fromTo(card.firstElementChild, { scale: 1.15 }, { scale: 1, duration: 0.8, ease: "power3.out" });
}

function deactivate() {
  list.children[activeIndex]?.classList.remove("is-active");
  activeIndex = -1;
  preview.classList.remove("is-on");
}

works.forEach((w, i) => {
  const li = document.createElement("li");
  li.className = "work__item";
  li.innerHTML = `<button class="work__row" type="button">
    <span class="num">${String(i + 1).padStart(2, "0")}</span>
    <span class="title">${w.title}</span>
    <span class="meta">${w.category}</span>
  </button>`;
  const row = li.firstElementChild;
  row.addEventListener("mouseenter", () => activate(i));
  row.addEventListener("focus", () => activate(i));
  row.addEventListener("click", () => openDetail(i));
  list.appendChild(li);
});
list.addEventListener("mouseleave", deactivate);

/* ---------- 상세 화면: 설명 + 짧은 구현 영상 ---------- */
const detail = document.getElementById("detail");
const panel = detail.querySelector(".detail__panel");
const backdrop = detail.querySelector(".detail__backdrop");
const media = document.getElementById("detail-media");
let lastFocus = null;

function placeholder(w) {
  const path = w.video || `assets/videos/${w.id}.mp4`;
  return `<div class="detail__placeholder"><p>구현 영상 클립 준비 중<br><code>${path}</code> 에 파일을 넣으면 자동 재생됩니다</p></div>`;
}

function renderMedia(w) {
  media.innerHTML = "";
  if (w.video) {
    const video = document.createElement("video");
    Object.assign(video, { src: w.video, autoplay: true, muted: true, loop: true, playsInline: true });
    video.addEventListener("error", () => { media.innerHTML = placeholder(w); });
    media.appendChild(video);
  } else if (w.image) {
    media.innerHTML = `<img src="${w.image}" alt="" style="object-fit:contain;background:hsl(${w.hue} 30% 88%)">`;
  } else {
    media.innerHTML = placeholder(w);
  }
}

function openDetail(i) {
  const w = works[i];
  lastFocus = document.activeElement;
  deactivate();
  document.getElementById("detail-cat").textContent = `${w.category} · ${w.status}`;
  document.getElementById("detail-title").textContent = w.title;
  document.getElementById("detail-tags").innerHTML = w.tags.map((t) => `<li>${t}</li>`).join("");
  document.getElementById("detail-summary").textContent = w.summary;
  document.getElementById("detail-points").innerHTML = w.points.map((p) => `<li>${p}</li>`).join("");
  // learnedLabel이 ""이면 머리말 없이 내용만 보여준다 (예: 배운 점이 아니라 고객 리뷰 인용인 경우)
  const label = w.learnedLabel ?? "배운 점";
  document.getElementById("detail-learned").textContent = w.learned ? (label ? `${label} · ${w.learned}` : w.learned) : "";
  const link = document.getElementById("detail-link");
  link.href = w.link || "#";
  link.textContent = w.link ? `${w.link.replace(/^https?:\/\//, "")} ↗` : "";
  renderMedia(w);

  detail.hidden = false;
  document.body.style.overflow = "hidden";
  gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  gsap.fromTo(panel, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
  detail.querySelector(".detail__close").focus();
}

function closeDetail() {
  if (detail.hidden) return;
  gsap.to(backdrop, { opacity: 0, duration: 0.25 });
  gsap.to(panel, {
    y: 24, opacity: 0, duration: 0.25, ease: "power2.in",
    onComplete: () => {
      detail.hidden = true;
      media.innerHTML = "";
      document.body.style.overflow = "";
      lastFocus?.focus();
    },
  });
}

detail.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closeDetail(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDetail(); });

setupIntro();
