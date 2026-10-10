/* ==============================
   HELPERS
============================== */

const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const pad2 = (n) => String(n).padStart(2, "0");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function nav(method, state, url) {
	try { history[method](state, "", url); return true; } catch (e) { return false; }
}

function store(key, value) {
	try {
		if (value === undefined) return JSON.parse(sessionStorage.getItem(key));
		sessionStorage.setItem(key, JSON.stringify(value));
	} catch (e) { return null; }
}

/* ==============================
   COVERS
============================== */

const WORDS = [
	["Ephemeral", "adj.", "Lasting for a very short time.", "The ticker's lead was ephemeral; by noon the gap had closed."],
	["Laconic", "adj.", "Using very few words.", "His commit messages were laconic but precise."],
	["Perspicacious", "adj.", "Having a ready insight into things.", "A perspicacious backtest exposes its own survivorship bias."],
	["Sanguine", "adj.", "Optimistic, especially in a bad situation.", "She stayed sanguine through the 2020 drawdown."],
	["Obdurate", "adj.", "Stubbornly refusing to change one's opinion.", "The model was obdurate until the t-test said otherwise."],
	["Pellucid", "adj.", "Translucently clear; easily understood.", "The README explained the pipeline in pellucid prose."],
	["Quixotic", "adj.", "Exceedingly idealistic; unrealistic.", "Beating the market without costs is a quixotic goal."],
	["Garrulous", "adj.", "Excessively talkative.", "The chatbot grew garrulous without a token limit."]
];

function wallHTML() {
	const w = WORDS[0];
	return `<div class="wall" data-wall>
		<span class="wall-date">${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</span>
		<span class="wall-time" data-wall-time>${pad2(new Date().getHours())}:${pad2(new Date().getMinutes())}</span>
		<span class="wall-word">${w[0]}</span>
		<span class="wall-pos">${w[1]}</span>
		<span class="wall-mean">${w[2]}</span>
		<span class="wall-ex">“${w[3]}”</span>
	</div>`;
}

function coverHTML(p) {
	const c = p.cover || {};
	let inner = "";
	if (c.type === "phone") inner = `<div class="cover-phone"><img src="${c.img}" alt="${esc(c.alt || p.name)}" loading="lazy" decoding="async"></div>`;
	else if (c.type === "window") inner = `<div class="cover-window"><div class="cover-window-bar"><i></i><i></i><i></i></div><img src="${c.img}" alt="${esc(c.alt || p.name)}" loading="lazy" decoding="async"></div>`;
	else if (c.type === "wall") inner = `<div class="cover-phone">${wallHTML()}</div>`;
	else inner = `<div class="cover-type"><span class="cover-type-grid"></span><span class="cover-type-cap">${esc(c.caption || "")}</span><span class="cover-type-glyph">${esc(c.glyph || p.name[0])}</span></div>`;
	return `<div class="cover" style="--cover-bg:${c.bg || "#eee"}">${inner}</div>`;
}

let wallIndex = 0;
function cycleWalls() {
	wallIndex = (wallIndex + 1) % WORDS.length;
	const w = WORDS[wallIndex];
	$$("[data-wall]").forEach((el) => {
		const word = $(".wall-word", el);
		word.style.opacity = 0;
		setTimeout(() => {
			word.textContent = w[0];
			$(".wall-pos", el).textContent = w[1];
			$(".wall-mean", el).textContent = w[2];
			$(".wall-ex", el).textContent = `“${w[3]}”`;
			word.style.opacity = 1;
		}, 400);
	});
	$$("[data-wall-time]").forEach((t) => { const d = new Date(); t.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; });
}

/* ==============================
   RENDER
============================== */

function renderFeatured() {
	const wrap = $('[data-render="featured"]');
	const list = PROJECTS.filter((p) => p.featured);
	wrap.innerHTML = list.map((p, i) => `
		<a href="#/work/${p.id}" class="card fade-in" data-project="${p.id}" data-cursor="View">
			<div class="card-cover"><div class="card-cover-inner">${coverHTML(p)}</div></div>
			<div class="card-meta">
				<span><span class="card-num">${pad2(i + 1)}</span>${esc(p.name)}${p.release ? `<span class="card-dl">${p.release.ext === ".apk" ? "APK" : "EXE"}</span>` : ""}</span>
				<span class="label desktop-el">${esc(p.detail)} · ${p.year}</span>
			</div>
		</a>`).join("");
}

function renderIndex() {
	const wrap = $('[data-render="index"]');
	wrap.innerHTML = PROJECTS.map((p) => `
		<a href="#/work/${p.id}" class="row" data-project="${p.id}" data-tags="${p.tags.join(" ")}" data-preview="${p.id}" data-cursor="Open">
			<span>${esc(p.name)}${p.release ? `<span class="row-badge">${p.release.ext === ".apk" ? "APK" : "EXE"}</span>` : ""}</span>
			<span class="muted">${esc(p.detail)}</span>
			<span class="row-stack">${esc(p.stack.slice(0, 4).join(", "))}</span>
			<span>${p.year}</span>
		</a>`).join("");
}

function renderAbout() {
	$('[data-render="skills"]').innerHTML = SKILLS.map((s) => `
		<div class="skill-col"><span class="label">[ ${esc(s.label)} ]</span><ul>${s.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul></div>`).join("");
	$('[data-render="recognition"]').innerHTML = RECOGNITION.map((r) => `
		<div class="row"><span>${esc(r.name)}</span><span class="muted">${esc(r.detail)}</span><span>${esc(r.year)}</span></div>`).join("");
	$('[data-render="certs"]').innerHTML = CERTS.map((c) => `<li>${esc(c)}</li>`).join("");
}

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function cleanText(html) {
	const doc = new DOMParser().parseFromString(html || "", "text/html");
	return (doc.body.textContent || "").replace(/ /g, " ").replace(/\s+/g, " ").trim();
}

let POSTS = POSTS_FALLBACK;

function renderPosts() {
	const wrap = $('[data-render="posts"]');
	wrap.innerHTML = POSTS.map((p) => `
		<a href="${esc(p.url)}" target="_blank" rel="noopener" class="post" data-post-img="${esc(p.img || "")}" data-post-title="${esc(p.title)}" data-cursor="Read">
			<span class="post-date">${fmtDate(p.date)}</span>
			<span class="post-title">${esc(p.title)}</span>
			<span class="post-excerpt">${esc(p.excerpt)}</span>
			<span class="post-read link-line">Read ↗</span>
		</a>`).join("");
	$('[data-count="writing"]').textContent = POSTS.length;
	observeReveals(wrap);
	bindPreviews(wrap);
	bindCursorTargets(wrap);
}

async function loadPosts() {
	const cached = store("posts");
	if (cached) { POSTS = cached; renderPosts(); return; }
	try {
		const res = await fetch(SITE.blogApi);
		if (!res.ok) throw new Error(res.status);
		const data = await res.json();
		if (!data.posts?.length) return;
		POSTS = data.posts.map((p) => {
			const title = cleanText(p.title);
			let excerpt = cleanText(p.excerpt).replace(/\[…\]|\[\.\.\.\]/g, "").trim();
			if (excerpt.startsWith(title)) excerpt = excerpt.slice(title.length).trim();
			if (excerpt.length > 170) excerpt = excerpt.slice(0, 170).replace(/\s+\S*$/, "") + "…";
			return { date: p.date, title, url: p.URL, img: p.featured_image, excerpt };
		});
		store("posts", POSTS);
		renderPosts();
	} catch (e) {
		/* fallback list is already on screen */
	}
}

/* ==============================
   RELEASES (GitHub)
============================== */

async function getRelease(rel) {
	const key = `rel:${rel.repo}`;
	const cached = store(key);
	if (cached !== null && cached !== undefined) return cached || null;
	try {
		const res = await fetch(`https://api.github.com/repos/${SITE.githubUser}/${rel.repo}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
		if (res.status === 404) { store(key, false); return null; }
		if (!res.ok) return null;
		const data = await res.json();
		const asset = (data.assets || []).find((a) => a.name.toLowerCase().endsWith(rel.ext));
		const out = asset ? { url: asset.browser_download_url, size: asset.size, tag: data.tag_name, name: asset.name } : false;
		store(key, out);
		return out || null;
	} catch (e) { return null; }
}

const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/* ==============================
   RÉSUMÉ DOWNLOAD
   On a normal host the <a download> link does the work. Inside the
   claude.ai Artifact viewer links can't download, so we hand the PDF
   to the viewer's `downloads` capability instead.
============================== */

let downloadsApi = null;
try { window.claude?.use?.("downloads").then((d) => { downloadsApi = d; }).catch(() => {}); } catch (e) {}

async function saveResume() {
	if (!downloadsApi) return false;
	try {
		const blob = await (await fetch(SITE.resume)).blob();
		await downloadsApi.save({ filename: "Manan_Sheth_Resume.pdf", data: blob });
	} catch (e) { /* declined or unavailable */ }
	return true;
}

document.addEventListener("click", (e) => {
	if (!downloadsApi || !e.target.closest(".js-resume")) return;
	e.preventDefault();
	saveResume();
});

/* ==============================
   LOADER
============================== */

function loader() {
	const el = $(".loader");
	const num = $(".loader-num");
	document.body.classList.add("is-loading");

	const imgs = $$("img").filter((i) => i.loading !== "lazy");
	let target = 0, shown = 0, done = false;
	const total = imgs.length + 1;
	let loaded = 0;
	const bump = () => { loaded++; target = (loaded / total) * 100; };

	imgs.forEach((img) => (img.complete ? bump() : (img.addEventListener("load", bump, { once: true }), img.addEventListener("error", bump, { once: true }))));
	(document.fonts?.ready || Promise.resolve()).then(bump);

	const start = performance.now();
	let last = start;
	return new Promise((resolve) => {
		const tick = (t) => {
			const minT = clamp((t - start) / 1400, 0, 1);
			const goal = Math.min(target, minT * 100);
			shown = lerp(shown, goal, 1 - Math.exp(-(t - last) / 90));
			last = t;
			if (goal >= 99.5 && shown > 99) shown = 100;
			num.textContent = Math.round(shown);
			if (shown >= 100 && !done) {
				done = true;
				setTimeout(() => {
					el.classList.add("is-loaded");
					document.body.classList.remove("is-loading");
					resolve();
					setTimeout(() => el.remove(), 1200);
				}, 180);
				return;
			}
			requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
		setTimeout(() => { target = 100; }, 2500);
	});
}

/* ==============================
   SMOOTH SCROLL
============================== */

let lenis = null;

function smoothScroll() {
	if (REDUCED || typeof Lenis === "undefined") return;
	lenis = new Lenis({ duration: 1.15, smoothWheel: true });
	const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
	requestAnimationFrame(raf);
}

function scrollToTarget(target) {
	if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
	else (typeof target === "number" ? window.scrollTo({ top: target, behavior: REDUCED ? "auto" : "smooth" }) : target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }));
}

function anchors() {
	document.addEventListener("click", (e) => {
		const a = e.target.closest('a[href^="#"]');
		if (!a) return;
		const href = a.getAttribute("href");
		if (href.startsWith("#/")) return;
		e.preventDefault();
		closeMenu();
		if (href === "#top" || href === "#") return scrollToTarget(0);
		const el = $(href);
		if (el) scrollToTarget(el);
	});
}

/* ==============================
   SCROLL REVEALS
============================== */

let revealObserver;

function observeReveals(scope = document) {
	if (!revealObserver) {
		revealObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const t = entry.target;
				if (t.classList.contains("scroll-in-group")) {
					$$(".scroll-in", t).forEach((el, i) => { el.style.setProperty("--stagger-delay", `${i * .08}s`); el.classList.add("is-visible"); });
				} else {
					t.classList.add("is-visible");
				}
				revealObserver.unobserve(t);
			});
		}, { threshold: 0, rootMargin: "0px 0px -6% 0px" });
	}

	$$(".scroll-in-group, .border, .fade-in", scope).forEach((el) => revealObserver.observe(el));

	// rows & posts stagger by position within their list
	$$(".table-body, .posts", scope.matches?.(".table-body, .posts") ? scope.parentElement : scope).forEach((list) => {
		$$(".row, .post", list).forEach((el, i) => { el.style.setProperty("--stagger-delay", `${Math.min(i, 10) * .06}s`); revealObserver.observe(el); });
	});
	$$(".cards", scope).forEach((list) => $$(".fade-in", list).forEach((el, i) => el.style.setProperty("--stagger-delay", `${(i % 2) * .12}s`)));
}

function revealWords() {
	const blocks = $$(".reveal-words");
	blocks.forEach((b) => {
		const words = b.textContent.trim().split(/\s+/);
		b.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
	});
	const update = () => {
		blocks.forEach((b) => {
			const r = b.getBoundingClientRect();
			const p = clamp((innerHeight * .9 - r.top) / (r.height + innerHeight * .35), 0, 1);
			const ws = b.children;
			const lit = Math.floor(p * ws.length * 1.15);
			for (let i = 0; i < ws.length; i++) ws[i].classList.toggle("on", i < lit);
		});
	};
	window.addEventListener("scroll", update, { passive: true });
	update();
}

function counters() {
	const io = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			const el = entry.target;
			io.unobserve(el);
			const to = parseFloat(el.dataset.to);
			const dec = parseInt(el.dataset.dec || "0", 10);
			const suf = el.dataset.suffix || "";
			const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
			if (REDUCED) { el.textContent = fmt(to); return; }
			const t0 = performance.now();
			const dur = 2000;
			const step = (t) => {
				const k = clamp((t - t0) / dur, 0, 1);
				const e = 1 - Math.pow(2, -10 * k);
				el.textContent = fmt(k === 1 ? to : to * e);
				if (k < 1) requestAnimationFrame(step);
			};
			requestAnimationFrame(step);
		});
	}, { threshold: .4 });
	$$(".number-val").forEach((el) => io.observe(el));
}

/* ==============================
   CURSOR, MAGNETIC, PREVIEW
============================== */

const pointer = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, speed: 0 };
const cursorEl = $(".cursor");
const cursorLabel = $(".cursor-label");
const previewEl = $(".preview");
const previewInner = $(".preview-inner");
const cur = { x: pointer.x, y: pointer.y };
const prev = { x: pointer.x, y: pointer.y };

function cursor() {
	if (!FINE_POINTER) return;
	let lastX = pointer.x, lastY = pointer.y;
	window.addEventListener("pointermove", (e) => {
		pointer.x = e.clientX; pointer.y = e.clientY;
		pointer.speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
		lastX = e.clientX; lastY = e.clientY;
		cursorEl.classList.add("is-on");
	}, { passive: true });
	document.addEventListener("pointerleave", () => cursorEl.classList.remove("is-on"));

	const loop = () => {
		cur.x = lerp(cur.x, pointer.x, .28); cur.y = lerp(cur.y, pointer.y, .28);
		prev.x = lerp(prev.x, pointer.x, .12); prev.y = lerp(prev.y, pointer.y, .12);
		cursorEl.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
		previewEl.style.transform = `translate3d(${prev.x}px, ${prev.y}px, 0) rotate(${clamp((pointer.x - prev.x) * .04, -8, 8)}deg)`;
		pointer.speed *= .9;
		requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
	bindCursorTargets(document);
}

function bindCursorTargets(scope) {
	if (!FINE_POINTER) return;
	$$("a, button, [data-cursor]", scope).forEach((el) => {
		if (el.dataset.cursorBound) return;
		el.dataset.cursorBound = "1";
		el.addEventListener("mouseenter", () => {
			const label = el.dataset.cursor;
			if (label) { cursorLabel.textContent = label; cursorEl.classList.add("is-label"); }
			else cursorEl.classList.add("is-hover");
		});
		el.addEventListener("mouseleave", () => cursorEl.classList.remove("is-hover", "is-label"));
	});
}

function magnetic() {
	if (!FINE_POINTER || REDUCED) return;
	$$(".magnetic").forEach((el) => {
		el.addEventListener("mousemove", (e) => {
			const r = el.getBoundingClientRect();
			const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
			const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
			const k = el.classList.contains("contact-big") ? 40 : 10;
			const target = el.querySelector(".contact-big-inner") || el;
			target.style.transform = `translate(${dx * k}px, ${dy * k}px)`;
		});
		el.addEventListener("mouseleave", () => { (el.querySelector(".contact-big-inner") || el).style.transform = ""; });
	});
}

const previewCache = {};
function bindPreviews(scope) {
	if (!FINE_POINTER) return;
	$$("[data-preview], [data-post-img]", scope).forEach((el) => {
		if (el.dataset.previewBound) return;
		el.dataset.previewBound = "1";
		el.addEventListener("mouseenter", () => {
			let html = "";
			if (el.dataset.preview) {
				const p = PROJECTS.find((x) => x.id === el.dataset.preview);
				html = previewCache[p.id] ||= coverHTML(p);
			} else if (el.dataset.postImg) {
				html = `<div class="cover" style="--cover-bg:var(--card)"><img src="${el.dataset.postImg}" alt="" style="width:100%;height:100%;object-fit:cover"></div>`;
			} else {
				const t = el.dataset.postTitle || "";
				html = `<div class="cover" style="--cover-bg:#ECE8E1"><div class="cover-type"><span class="cover-type-grid"></span><span class="cover-type-cap">Blog · WordPress</span><span class="cover-type-glyph">“</span></div></div>`;
				void t;
			}
			previewInner.innerHTML = html;
			previewEl.classList.add("is-on");
		});
		el.addEventListener("mouseleave", () => previewEl.classList.remove("is-on"));
	});
}

/* ==============================
   TEXT SCRAMBLE
============================== */

function scramble() {
	if (REDUCED) return;
	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ₹$%#01";
	$$(".scramble").forEach((el) => {
		let raf;
		el.addEventListener("mouseenter", () => {
			const text = el.dataset.text || el.textContent;
			const t0 = performance.now();
			cancelAnimationFrame(raf);
			const step = (t) => {
				const p = clamp((t - t0) / 420, 0, 1);
				const n = Math.floor(p * text.length);
				el.textContent = text.slice(0, n) + [...text.slice(n)].map((c) => (c === " " ? " " : chars[(Math.random() * chars.length) | 0])).join("");
				if (p < 1) raf = requestAnimationFrame(step); else el.textContent = text;
			};
			raf = requestAnimationFrame(step);
		});
	});
}

/* ==============================
   FILTERS
============================== */

function filters() {
	$$(".filter").forEach((btn) => btn.addEventListener("click", () => {
		$$(".filter").forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
		const f = btn.dataset.filter;
		$$('[data-render="index"] .row').forEach((row, i) => {
			const show = f === "all" || row.dataset.tags.split(" ").includes(f);
			row.classList.toggle("is-hidden", !show);
			if (show) { row.classList.remove("is-visible"); row.style.setProperty("--stagger-delay", `${i * .03}s`); requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add("is-visible"))); }
		});
	}));
}

/* ==============================
   PROJECT OVERLAY
============================== */

const projectEl = $(".project");
const projectContent = $(".project-content");
const transitionEl = $(".transition");
let currentProject = null;
let pushedState = false;

function transition(fn) {
	if (REDUCED) { fn(); return Promise.resolve(); }
	return new Promise((resolve) => {
		transitionEl.classList.remove("is-out");
		transitionEl.classList.add("is-in");
		setTimeout(() => {
			fn();
			transitionEl.classList.remove("is-in");
			transitionEl.classList.add("is-out");
			setTimeout(() => { transitionEl.classList.remove("is-out"); resolve(); }, 750);
		}, 720);
	});
}

/* Each project page gets its own colours and display font (see `theme` in data.js) */

let fontsLinked = false;
function linkProjectFonts() {
	if (fontsLinked) return;
	fontsLinked = true;
	const families = [...new Set(PROJECTS.map((p) => p.theme?.gf).filter(Boolean))];
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join("&")}&display=swap`;
	document.head.appendChild(link);
}

function loadProjectFont(p) {
	linkProjectFonts();
	const t = p.theme;
	if (!t || !document.fonts?.load) return Promise.resolve();
	const spec = `${t.style === "italic" ? "italic " : ""}64px "${t.font}"`;
	return Promise.race([document.fonts.load(spec, p.name).catch(() => {}), new Promise((r) => setTimeout(r, 1500))]);
}

function applyTheme(p) {
	const t = p.theme || {};
	const vars = {
		"--bg": t.bg, "--fg": t.fg, "--p-title": t.title,
		"--p-font": t.font ? `"${t.font}"` : null, "--p-style": t.style,
		"--p-track": t.track, "--p-case": t.upper ? "uppercase" : null
	};
	projectEl.removeAttribute("style");
	Object.entries(vars).forEach(([k, v]) => v && projectEl.style.setProperty(k, v));
	$('meta[name="theme-color"]').content = t.bg || "#ffffff";
}

function fitTitle() {
	const el = $(".p-title", projectContent);
	if (!el) return;
	const avail = el.parentElement.clientWidth;
	el.style.fontSize = "100px";
	const size = (100 * avail) / el.scrollWidth;
	el.style.fontSize = `${Math.min(size, innerHeight * .42, innerWidth * .26)}px`;
}

function projectHTML(p) {
	const i = PROJECTS.indexOf(p);
	const links = [];
	if (p.release) links.push(`<a class="btn btn-solid is-checking" data-release="${p.release.repo}" href="https://github.com/${SITE.githubUser}/${p.release.repo}/releases" target="_blank" rel="noopener">↓ ${esc(p.release.label)} <small>checking…</small></a>`);
	if (p.links.live) links.push(`<a class="btn" href="${p.links.live}" target="_blank" rel="noopener">Live demo ↗</a>`);
	if (p.links.github) links.push(`<a class="btn" href="${p.links.github}" target="_blank" rel="noopener">Source on GitHub ↗</a>`);
	if (p.links.blog) links.push(`<a class="btn" href="${p.links.blog}" target="_blank" rel="noopener">Read the write-up ↗</a>`);
	if (!p.links.github) links.push(`<span class="btn is-disabled">Private repository</span>`);

	const gallery = (p.gallery || []).length > 1 ? `<div class="p-gallery">${p.gallery.map((g) => `<figure class="fade-in"><img src="${g}" alt="${esc(p.name)} screenshot" loading="lazy"></figure>`).join("")}</div>` : "";
	const metrics = p.metrics ? `<div class="p-metrics">${p.metrics.map(([v, c]) => `<div class="fade-in"><span class="p-metric-val">${esc(v)}</span><span class="p-metric-cap">${esc(c)}</span></div>`).join("")}</div>` : "";

	return `
		<div class="p-title-wrap"><h2 class="p-title" id="project-title" aria-label="${esc(p.name)}"><span aria-hidden="true">${[...p.name].map((c, k) => `<span class="p-ch" style="--i:${k}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("")}</span></h2></div>
		<p class="p-tagline scroll-in-group"><span class="text-box"><span class="scroll-in" style="white-space:normal">${esc(p.tagline)}</span></span></p>
		<div class="p-meta">
			<span class="border"></span>
			<div><span class="label">[ Year ]</span><span>${p.year}</span></div>
			<div><span class="label">[ Role ]</span><span>${esc(p.role)}</span></div>
			<div><span class="label">[ Stack ]</span><span>${esc(p.stack.join(", "))}</span></div>
			<div><span class="label">[ Index ]</span><span>${pad2(i + 1)} / ${pad2(PROJECTS.length)}</span></div>
		</div>
		<div class="p-cover fade-in">${coverHTML(p)}</div>
		<div class="p-body">
			<span class="label">[ Overview ]</span>
			<div>
				<p class="p-summary">${esc(p.summary)}</p>
				<ol class="p-highlights">${p.highlights.map((h, k) => `<li class="fade-in"><span>${pad2(k + 1)}</span><span>${esc(h)}</span></li>`).join("")}</ol>
				<div class="p-actions">${links.join("")}</div>
				${p.note ? `<p class="p-note">${esc(p.note)}</p>` : ""}
			</div>
		</div>
		${metrics}
		${gallery}`;
}

async function hydrateRelease(p) {
	const btn = $(`[data-release="${p.release?.repo}"]`, projectContent);
	if (!btn) return;
	const rel = await getRelease(p.release);
	if (currentProject !== p) return;
	btn.classList.remove("is-checking");
	if (rel) {
		btn.href = rel.url;
		btn.removeAttribute("target");
		btn.setAttribute("download", "");
		btn.innerHTML = `↓ ${esc(p.release.label)} <small>${esc(rel.tag)} · ${fmtSize(rel.size)}</small>`;
		btn.addEventListener("click", () => market.boost(4, `${p.name} ${p.release.ext === ".apk" ? "APK" : "installer"} downloaded — adoption beats estimates`), { once: true });
	} else {
		btn.classList.remove("btn-solid");
		btn.classList.add("is-disabled");
		btn.innerHTML = `${esc(p.release.label)} <small>release coming soon</small>`;
	}
}

function openProject(id, { push = true } = {}) {
	const p = PROJECTS.find((x) => x.id === id);
	if (!p) return;
	const fontReady = loadProjectFont(p);
	$(".transition-block").style.background = p.theme?.bg || "";
	const swap = () => {
		currentProject = p;
		applyTheme(p);
		projectContent.innerHTML = projectHTML(p);
		fitTitle();
		fontReady.then(() => currentProject === p && fitTitle());
		$(".project-count").textContent = `${pad2(PROJECTS.indexOf(p) + 1)} — ${p.name}`;
		projectEl.classList.add("is-open");
		projectEl.setAttribute("aria-hidden", "false");
		$(".project-scroll").scrollTop = 0;
		lenis?.stop();
		document.documentElement.style.overflow = "hidden";
		document.title = `${p.name} • Manan Sheth`;
		requestAnimationFrame(() => { observeReveals(projectContent); bindCursorTargets(projectEl); });
		hydrateRelease(p);
	};
	if (push) pushedState = nav("pushState", { project: id }, `#/work/${id}`);
	transition(swap).then(() => $(".project-scroll").focus({ preventScroll: true }));
	market.boost(1.2, `Deep dive into ${p.name} — volume spikes`, true);
}

function closeProject({ fromPop = false } = {}) {
	if (!projectEl.classList.contains("is-open")) return;
	if (!fromPop && pushedState) { pushedState = false; history.back(); return; }
	transition(() => {
		projectEl.classList.remove("is-open");
		projectEl.setAttribute("aria-hidden", "true");
		currentProject = null;
		document.documentElement.style.overflow = "";
		document.title = "Manan Sheth";
		$('meta[name="theme-color"]').content = document.documentElement.dataset.theme === "dark" ? "#0c0c0c" : "#ffffff";
		lenis?.start();
	});
	if (!fromPop) nav("replaceState", null, location.pathname + location.search);
}

function projects() {
	document.addEventListener("click", (e) => {
		const a = e.target.closest("[data-project]");
		if (!a || a.classList.contains("is-hidden")) return;
		e.preventDefault();
		openProject(a.dataset.project);
	});
	$(".project-close").addEventListener("click", () => closeProject());
	$(".project-next").addEventListener("click", () => {
		const i = PROJECTS.indexOf(currentProject);
		const next = PROJECTS[(i + 1) % PROJECTS.length];
		nav("replaceState", { project: next.id }, `#/work/${next.id}`);
		openProject(next.id, { push: false });
	});
	window.addEventListener("popstate", () => {
		const m = location.hash.match(/^#\/work\/(.+)$/);
		if (m) openProject(m[1], { push: false });
		else closeProject({ fromPop: true });
	});
	$(".project-scroll").setAttribute("data-lenis-prevent", "");
	window.addEventListener("resize", () => currentProject && fitTitle());
}

function deepLink() {
	const m = location.hash.match(/^#\/work\/(.+)$/);
	if (m) { pushedState = false; openProject(m[1], { push: false }); }
}

/* ==============================
   $MANAN — a tiny market that reacts to you
============================== */

const market = {
	open: 1000,
	price: 1000,
	drift: 0,
	candles: [],
	cur: null,
	ticks: 0,
	news: [],
	lastToast: 0,
	seen: new Set(),

	init() {
		// seed history with a gentle random walk so the chart is never empty
		let p = this.open * .965;
		for (let i = 0; i < 48; i++) {
			const o = p;
			let h = o, l = o;
			for (let k = 0; k < 6; k++) { p *= 1 + (Math.random() - .47) * .006; h = Math.max(h, p); l = Math.min(l, p); }
			this.candles.push({ o, h, l, c: p });
		}
		this.price = p;
		this.open = this.candles[0].o;
		this.newCandle();
		setInterval(() => this.tick(), 220);
		this.updateTicker();
	},

	newCandle() {
		this.cur = { o: this.price, h: this.price, l: this.price, c: this.price };
		this.candles.push(this.cur);
		if (this.candles.length > 120) this.candles.shift();
	},

	tick() {
		const vol = .0011 + Math.min(pointer.speed, 120) * .00003;
		const shock = (Math.random() - .5) * 2 * vol;
		const d = this.drift * .18;
		this.drift -= d;
		this.price *= 1 + shock + d + .00004;
		this.cur.c = this.price;
		this.cur.h = Math.max(this.cur.h, this.price);
		this.cur.l = Math.min(this.cur.l, this.price);
		if (++this.ticks % 7 === 0) this.newCandle();
		this.updateTicker();
	},

	boost(pct, headline, quiet = false) {
		this.drift += pct / 100;
		if (headline && !quiet) this.toast(headline, pct);
	},

	catalyst(key, pct, headline) {
		if (this.seen.has(key)) return;
		this.seen.add(key);
		this.boost(pct, headline);
	},

	toast(text, pct) {
		const now = Date.now();
		if (now - this.lastToast < 3500) { this.news.push([text, pct]); return; }
		this.lastToast = now;
		const wrap = $(".toasts");
		const t = document.createElement("div");
		t.className = "toast";
		t.innerHTML = `<b>$MANAN</b> <span class="t-up">▲ ${pct.toFixed(1)}%</span><br>${esc(text)}`;
		wrap.appendChild(t);
		requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add("is-in")));
		setTimeout(() => { t.classList.remove("is-in"); setTimeout(() => t.remove(), 800); }, 4200);
		setTimeout(() => { const n = this.news.shift(); if (n) this.toast(...n); }, 3600);
	},

	change() { return (this.price / this.open - 1) * 100; },

	updateTicker() {
		const ch = this.change();
		const el = $(".ticker");
		$(".ticker-price", el).textContent = this.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		const c = $(".ticker-chg", el);
		c.textContent = `${ch >= 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(2)}%`;
	}
};

function heroChart() {
	const canvas = $(".hero-canvas");
	const box = $(".hero-box");
	const ctx = canvas.getContext("2d");
	let w = 0, h = 0, dpr = 1, colors = {};
	const floaters = [];

	const readColors = () => {
		const cs = getComputedStyle(document.documentElement);
		colors = { fg: cs.getPropertyValue("--fg").trim(), muted: cs.getPropertyValue("--muted").trim(), border: cs.getPropertyValue("--border").trim() };
	};
	const resize = () => {
		const r = box.getBoundingClientRect();
		dpr = Math.min(devicePixelRatio || 1, 2);
		w = r.width; h = r.height;
		canvas.width = Math.max(1, w * dpr); canvas.height = Math.max(1, h * dpr);
	};
	readColors();
	new ResizeObserver(resize).observe(box);
	window.addEventListener("themechange", readColors);

	box.addEventListener("click", (e) => {
		const r = box.getBoundingClientRect();
		floaters.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: 0 });
		market.boost(.8, null);
	});

	const draw = () => {
		requestAnimationFrame(draw);
		if (!w) return;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, w, h);

		const cw = Math.max(4, w / 30);
		const n = Math.min(market.candles.length, Math.ceil(w / cw) - 2);
		const list = market.candles.slice(-n);
		let hi = -Infinity, lo = Infinity;
		list.forEach((c) => { hi = Math.max(hi, c.h); lo = Math.min(lo, c.l); });
		const padY = h * .2;
		const y = (v) => padY + (1 - (v - lo) / (hi - lo || 1)) * (h - padY * 1.6);

		// grid
		ctx.strokeStyle = colors.border; ctx.lineWidth = 1;
		for (let i = 1; i < 4; i++) { const gy = Math.round((h / 4) * i) + .5; ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke(); }

		// candles
		list.forEach((c, i) => {
			const x = i * cw + cw * .5 + 2;
			const up = c.c >= c.o;
			ctx.strokeStyle = up ? colors.fg : colors.muted;
			ctx.fillStyle = colors.fg;
			ctx.beginPath(); ctx.moveTo(Math.round(x) + .5, y(c.h)); ctx.lineTo(Math.round(x) + .5, y(c.l)); ctx.stroke();
			const top = y(Math.max(c.o, c.c)), bot = y(Math.min(c.o, c.c));
			const bw = cw * .56;
			if (up) ctx.fillRect(x - bw / 2, top, bw, Math.max(1, bot - top));
			else { ctx.fillStyle = getComputedStyle(document.body).backgroundColor; ctx.fillRect(x - bw / 2, top, bw, Math.max(1, bot - top)); ctx.strokeRect(x - bw / 2 + .5, top + .5, bw - 1, Math.max(1, bot - top - 1)); }
		});

		// last price line
		const ly = y(market.price);
		ctx.setLineDash([3, 3]); ctx.strokeStyle = colors.fg; ctx.globalAlpha = .5;
		ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(w, ly); ctx.stroke();
		ctx.setLineDash([]); ctx.globalAlpha = 1;
		ctx.font = `${Math.max(9, w * .045)}px "Geist Mono", monospace`;
		const label = market.price.toFixed(2);
		const tw = ctx.measureText(label).width + 8;
		ctx.fillStyle = colors.fg; ctx.fillRect(w - tw, ly - 8, tw, 16);
		ctx.fillStyle = getComputedStyle(document.body).backgroundColor; ctx.textBaseline = "middle"; ctx.fillText(label, w - tw + 4, ly + .5);

		// click floaters
		for (let i = floaters.length - 1; i >= 0; i--) {
			const f = floaters[i]; f.t += 1 / 60;
			ctx.globalAlpha = 1 - f.t; ctx.fillStyle = colors.fg;
			ctx.fillText("+BUY", f.x, f.y - f.t * 30);
			ctx.globalAlpha = 1;
			if (f.t >= 1) floaters.splice(i, 1);
		}
	};
	requestAnimationFrame(draw);
}

function catalysts() {
	const map = [
		["#work", 2.1, "Analysts initiate coverage after reviewing 13 projects"],
		[".numbers", 1.6, "Beats GARCH by 16% on RMSE — shares rally"],
		["#writing", 1.4, "Thought leadership lifts retail interest"],
		["#about", 1.8, "Fundamentals check out: GPA 8.9, district gold in the pool"],
		["#contact", 2.4, "Merger talk: visitor eyeing “Get in touch”"]
	];
	const io = new IntersectionObserver((entries) => entries.forEach((e) => {
		if (!e.isIntersecting) return;
		const m = map.find(([s]) => e.target.matches(s));
		if (m) market.catalyst(m[0], m[1], m[2]);
		io.unobserve(e.target);
	}), { threshold: .25 });
	map.forEach(([s]) => { const el = $(s); if (el) io.observe(el); });

	$$(".js-resume").forEach((a) => a.addEventListener("click", () => market.catalyst("resume", 5, "Résumé downloaded — rating upgraded to STRONG HIRE")));
	$$('a[href^="mailto:"]').forEach((a) => a.addEventListener("click", () => market.catalyst("mail", 6, "Deal announced: inbox merger pending")));
}

/* ==============================
   TERMINAL
============================== */

const term = {
	el: $(".terminal"),
	out: $(".terminal-out"),
	input: $(".terminal-input"),
	history: [],
	hi: 0,

	print(html, cls = "") { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; this.out.appendChild(d); this.out.scrollTop = this.out.scrollHeight; },

	open() {
		this.el.classList.add("is-open");
		this.el.setAttribute("aria-hidden", "false");
		lenis?.stop();
		if (!this.out.childElementCount) {
			this.print(`<span class="t-acc">MananOS 26.10</span> — last login: ${new Date().toDateString()}`);
			this.print(`Type <span class="t-acc">help</span> to see what you can do. <span class="t-dim">Esc to close.</span>\n`);
		}
		setTimeout(() => this.input.focus(), 50);
	},

	close() {
		this.el.classList.remove("is-open");
		this.el.setAttribute("aria-hidden", "true");
		if (!projectEl.classList.contains("is-open")) lenis?.start();
	},

	run(raw) {
		const line = raw.trim();
		this.print(`<span class="t-up">manan@portfolio ~ %</span> ${esc(line)}`);
		if (!line) return;
		this.history.push(line); this.hi = this.history.length;
		const [cmd, ...args] = line.split(/\s+/);
		const arg = args.join(" ").toLowerCase();
		const c = this.cmds[cmd.toLowerCase()] || (line.toLowerCase().startsWith("sudo") ? this.cmds.sudo : null);
		if (c) c.call(this, arg, line);
		else this.print(`zsh: command not found: ${esc(cmd)} <span class="t-dim">— try help</span>`);
	},

	cmds: {
		help() {
			this.print([
				"<span class='t-acc'>whoami</span>        who is this guy",
				"<span class='t-acc'>ls</span>            list projects",
				"<span class='t-acc'>open</span> &lt;name|#&gt;   open a project   e.g. open niveshrl",
				"<span class='t-acc'>blog</span>          latest writing",
				"<span class='t-acc'>skills</span>        the toolbox",
				"<span class='t-acc'>resume</span>        download the résumé",
				"<span class='t-acc'>contact</span>       ways to reach me",
				"<span class='t-acc'>quote</span>         live $MANAN quote",
				"<span class='t-acc'>buy</span> [qty]     invest in $MANAN",
				"<span class='t-acc'>theme</span>         toggle lights",
				"<span class='t-acc'>clear</span>, <span class='t-acc'>exit</span>"
			].join("\n") + "\n<span class='t-dim'>…and maybe a sudo command or two.</span>");
		},
		whoami() {
			this.print("Manan Sheth — AI/ML engineer, B.Tech CSE (FinTech & AI), GPA 8.9.\nBuilds deep-learning + GenAI systems for finance. Ahmedabad, India.\nIEEE paper under review · ET Gen AI Hackathon national finalist · World Bank Youth Summit 2026 delegate.\n<span class='t-dim'>Currently seeking: AI/ML engineering internship.</span>");
		},
		about(a) { this.cmds.whoami.call(this, a); },
		ls() {
			this.print(PROJECTS.map((p, i) => `<span class="t-dim">${pad2(i + 1)}</span>  ${p.name.padEnd(18)} <span class="t-dim">${p.detail}${p.release ? " · " + (p.release.ext === ".apk" ? "apk" : "exe") : ""}</span>`).join("\n"));
		},
		projects(a) { this.cmds.ls.call(this, a); },
		open(arg) {
			if (!arg) return this.print("usage: open &lt;name|number&gt;");
			const n = parseInt(arg, 10);
			const p = !isNaN(n) ? PROJECTS[n - 1] : PROJECTS.find((x) => x.id === arg || x.name.toLowerCase().startsWith(arg));
			if (!p) return this.print(`open: no such project: ${esc(arg)}`);
			this.print(`opening ${p.name}…`);
			setTimeout(() => { this.close(); openProject(p.id); }, 350);
		},
		cd(arg) { arg ? this.cmds.open.call(this, arg) : this.print("~"); },
		blog() {
			this.print(POSTS.map((p) => `<span class="t-dim">${fmtDate(p.date)}</span>  <a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.title)}</a>`).join("\n"));
		},
		skills() { this.print(SKILLS.map((s) => `<span class="t-acc">${s.label}</span>: ${s.items.join(", ")}`).join("\n")); },
		resume() {
			this.print("downloading Manan_Sheth_Resume.pdf… <span class='t-up'>done</span>");
			if (!downloadsApi) { const a = document.createElement("a"); a.href = SITE.resume; a.download = ""; document.body.appendChild(a); a.click(); a.remove(); }
			else saveResume();
			market.catalyst("resume", 5, "Résumé downloaded — rating upgraded to STRONG HIRE");
		},
		contact() { this.print(`email     <a href="mailto:${SITE.email}">${SITE.email}</a>\nlinkedin  <a href="${SITE.linkedin}" target="_blank" rel="noopener">manan-sheth</a>\ngithub    <a href="${SITE.github}" target="_blank" rel="noopener">MananS8805</a>\nblog      <a href="${SITE.blog}" target="_blank" rel="noopener">mananshethblogs.wordpress.com</a>`); },
		quote() {
			const ch = market.change();
			this.print(`$MANAN  ${market.price.toFixed(2)}  <span class="${ch >= 0 ? "t-up" : "t-down"}">${ch >= 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(2)}%</span>\n<span class="t-dim">Rating: STRONG BUY · Sector: AI × Finance · Float: 1 human</span>`);
		},
		ticker(a) { this.cmds.quote.call(this, a); },
		buy(arg) {
			const q = clamp(parseInt(arg, 10) || 1, 1, 1000000);
			market.boost(Math.min(8, .5 + Math.log10(q) * 1.5), null);
			this.print(`order filled: BUY ${q.toLocaleString()} $MANAN @ ${market.price.toFixed(2)} <span class="t-up">✓</span>\n<span class="t-dim">Settlement: please email ${SITE.email} :)</span>`);
		},
		sell() { this.print("<span class='t-down'>order rejected</span>: $MANAN is a long-term hold."); },
		short(a) { this.cmds.sell.call(this, a); },
		theme() { toggleTheme(); this.print(`lights ${document.documentElement.dataset.theme === "dark" ? "off" : "on"}.`); },
		sudo(arg, line) {
			if (/hire/.test(line)) {
				this.print("[sudo] password for recruiter: ********\n<span class='t-up'>Access granted.</span> Drafting an email to Manan…");
				market.catalyst("sudo", 10, "Insider buying detected: recruiter runs sudo hire");
				setTimeout(() => { location.href = `mailto:${SITE.email}?subject=${encodeURIComponent("Let's talk — AI/ML internship")}`; }, 900);
			} else if (/rm\s+-rf/.test(line)) {
				this.print("<span class='t-down'>nice try.</span> the backtests are immutable.");
			} else this.print("usage: sudo hire-manan");
		},
		hire() { this.print("permission denied. try: <span class='t-acc'>sudo hire-manan</span>"); },
		date() { this.print(new Date().toString()); },
		echo(arg, line) { this.print(esc(line.slice(5))); },
		history() { this.print(this.history.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`).join("\n")); },
		clear() { this.out.innerHTML = ""; },
		exit() { this.close(); },
		vim() { this.print("you are now stuck in vim forever. (just kidding — type exit)"); },
		swim() { this.print("🏊 district gold · represented Kachchh at state level"); },
		harmonium() { this.print("♪ sa re ga ma pa dha ni sa ♪"); }
	},

	init() {
		$(".terminal-form").addEventListener("submit", (e) => { e.preventDefault(); this.run(this.input.value); this.input.value = ""; });
		this.input.addEventListener("keydown", (e) => {
			if (e.key === "ArrowUp") { e.preventDefault(); this.hi = Math.max(0, this.hi - 1); this.input.value = this.history[this.hi] || ""; }
			if (e.key === "ArrowDown") { e.preventDefault(); this.hi = Math.min(this.history.length, this.hi + 1); this.input.value = this.history[this.hi] || ""; }
			if (e.key === "Tab") {
				e.preventDefault();
				const v = this.input.value;
				const [c, a] = v.split(/\s+/);
				if (a !== undefined && (c === "open" || c === "cd")) { const m = PROJECTS.find((p) => p.id.startsWith(a.toLowerCase())); if (m) this.input.value = `${c} ${m.id}`; }
				else { const m = Object.keys(this.cmds).find((k) => k.startsWith(v)); if (m) this.input.value = m + " "; }
			}
		});
		$(".terminal-close").addEventListener("click", () => this.close());
		this.el.addEventListener("click", (e) => { if (e.target === this.el) this.close(); });
		$$(".js-terminal").forEach((b) => b.addEventListener("click", () => this.open()));
		$(".ticker").addEventListener("click", () => { this.open(); this.run("quote"); });
		this.out.setAttribute("data-lenis-prevent", "");

		document.addEventListener("keydown", (e) => {
			const typing = /input|textarea/i.test(document.activeElement?.tagName);
			if ((e.key === "/" || e.key === "`" || e.key === "~") && !typing) { e.preventDefault(); this.el.classList.contains("is-open") ? this.close() : this.open(); }
			if (e.key === "Escape") {
				if (this.el.classList.contains("is-open")) this.close();
				else if (projectEl.classList.contains("is-open")) closeProject();
				else closeMenu();
			}
		});
	}
};

/* ==============================
   THEME & MENU
============================== */

function toggleTheme(e) {
	const root = document.documentElement;
	const isDark = root.dataset.theme === "dark";
	const next = isDark ? "light" : "dark";
	const apply = () => {
		root.dataset.theme = next;
		try { localStorage.setItem("theme", next); } catch (err) {}
		$$(".js-theme").forEach((b) => (b.textContent = next === "dark" ? "Lights on" : "Lights off"));
		$('meta[name="theme-color"]').content = next === "dark" ? "#0c0c0c" : "#ffffff";
		window.dispatchEvent(new Event("themechange"));
	};
	if (document.startViewTransition && !REDUCED) {
		const x = e?.clientX ?? innerWidth / 2, y = e?.clientY ?? innerHeight / 2;
		const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
		const vt = document.startViewTransition(apply);
		vt.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 900, easing: "cubic-bezier(.77,0,.18,1)", pseudoElement: "::view-transition-new(root)" })).catch(() => {});
	} else apply();
}

function theme() {
	const isDark = document.documentElement.dataset.theme === "dark";
	$$(".js-theme").forEach((b) => { b.textContent = isDark ? "Lights on" : "Lights off"; b.addEventListener("click", toggleTheme); });
}

const menuEl = $(".menu");
const menuBtn = $(".menu-btn");
function closeMenu() { menuEl.classList.remove("is-open"); menuEl.setAttribute("aria-hidden", "true"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.textContent = "Menu"; lenis?.start(); }
function menu() {
	menuBtn.addEventListener("click", () => {
		const open = !menuEl.classList.contains("is-open");
		if (!open) return closeMenu();
		menuEl.classList.add("is-open"); menuEl.setAttribute("aria-hidden", "false"); menuBtn.setAttribute("aria-expanded", "true"); menuBtn.textContent = "Close"; lenis?.stop();
	});
}

/* ==============================
   HERO
============================== */

function hero() {
	const h = $(".hero");
	$$(".hero-char", h).forEach((c, i) => c.style.setProperty("--i", i < 3 ? i : i + 1));
	requestAnimationFrame(() => h.classList.add("is-in"));
	setTimeout(() => h.classList.add("is-open"), REDUCED ? 0 : 900);
}

/* ==============================
   INIT
============================== */

function init() {
	renderFeatured();
	renderIndex();
	renderAbout();
	renderPosts();
	$('[data-count="work"]').textContent = PROJECTS.length;

	market.init();
	heroChart();
	cursor();
	scramble();
	filters();
	projects();
	menu();
	theme();
	term.init();
	anchors();
	smoothScroll();
	setInterval(cycleWalls, 3800);

	if (location.hash.startsWith("#/work/")) {
		$(".loader")?.remove();
		document.body.classList.remove("is-loading");
		start();
		deepLink();
	} else {
		loader().then(start);
	}
	loadPosts();
}

function start() {
	hero();
	observeReveals(document);
	revealWords();
	counters();
	magnetic();
	bindPreviews(document);
	catalysts();
	(window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(linkProjectFonts);
	console.log("%c$MANAN%c  Press / anywhere to open the terminal. Try `sudo hire-manan`.", "background:#000;color:#fff;padding:2px 6px;font-family:monospace", "font-family:monospace");
}

init();
