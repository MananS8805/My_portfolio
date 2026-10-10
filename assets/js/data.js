/* ==============================
   SITE DATA — edit this file to update content
============================== */

const SITE = {
	name: "Manan Sheth",
	email: "manansheth8805@gmail.com",
	github: "https://github.com/MananS8805",
	githubUser: "MananS8805",
	linkedin: "https://www.linkedin.com/in/manan-sheth-6702621b2/",
	blog: "https://mananshethblogs.wordpress.com",
	blogApi: "https://public-api.wordpress.com/rest/v1.1/sites/mananshethblogs.wordpress.com/posts/?number=12&fields=title,date,URL,excerpt,featured_image",
	resume: "assets/files/Manan_Sheth_Resume.pdf"
};

/*
	cover.type:
	- "phone"  : screenshot inside a phone frame
	- "window" : screenshot inside a desktop window frame
	- "wall"   : WallLearn lock-screen mock (rendered in HTML)
	- "type"   : typographic cover (cover.glyph, cover.caption)

	theme: { bg, fg, title?, font, gf, style?, track?, upper? }
	Colours and Google Font for the project page. `gf` is the Google Fonts
	family query (e.g. "Bungee" or "DM+Serif+Display:ital@1").

	release: { repo, ext, label }
	Download buttons look up github.com/<user>/<repo>/releases/latest and link
	the first asset ending in `ext`. Publish a GitHub Release with that file
	attached and the button switches on by itself.
*/

const PROJECTS = [
	{
		id: "niveshrl",
		theme: { bg: "#0B1F15", fg: "#8CFFB0", font: "VT323", gf: "VT323", track: "0em" },
		name: "NiveshRL",
		tagline: "Deep-learning research terminal for Indian equities",
		detail: "Research terminal",
		tags: ["ai", "fintech"],
		year: "2026",
		role: "Solo — research, modelling, desktop app",
		stack: ["Python", "PyTorch", "LightGBM", "PySide6", "C++", "Streamlit", "FinBERT"],
		featured: true,
		cover: { type: "window", img: "assets/img/nivesh-equity.png", bg: "#E7E4F6", alt: "NiveshRL growth-of-₹1 equity curves after costs" },
		gallery: ["assets/img/nivesh-equity.png", "assets/img/nivesh-frontier.png"],
		summary: "A Windows desktop research terminal that asks a simple, uncomfortable question: does deep learning add anything over classic methods for Indian equities, once real trading costs are paid? Every prediction is walk-forward and out-of-sample, on point-in-time NIFTY 200 members.",
		highlights: [
			"Trains and monitors 24 models on NSE data — packaged as a native app with PySide6, a C++ backtest core, PyInstaller and Inno Setup.",
			"Dilated causal TCN (28k params, multi-task BCE + Huber heads, isotonic calibration) doubled LightGBM's information coefficient — 0.032 vs 0.013.",
			"LSTM volatility forecaster beat GARCH(1,1) by 16% on RMSE across 28,461 out-of-sample forecasts; it drives stop-loss and position sizing.",
			"FFNN, LSTM and Transformer stock rankers with rank-IC t-stat 3.78 — and a momentum benchmark that exposed survivorship bias inflating returns from 19.3% to 39.8%.",
			"Decision layer: neural-linear Thompson-sampling bandit, conformal abstention and implicit Q-learning exits — each enabled only after passing a paired t-test."
		],
		metrics: [["24", "models"], ["171", "tests passing"], ["+16%", "vs GARCH RMSE"]],
		links: { github: "https://github.com/MananS8805/NiveshRL" },
		release: { repo: "NiveshRL", ext: ".exe", label: "Windows installer" },
		note: "Educational research project — not investment advice. Paper trading only."
	},
	{
		id: "finmentor",
		theme: { bg: "#FBE2D0", fg: "#3E0F0F", font: "Abril Fatface", gf: "Abril+Fatface", track: "-.01em" },
		name: "ET FinMentor",
		tagline: "An AI personal-finance mentor — ET Gen AI Hackathon national finalist",
		detail: "Mobile app",
		tags: ["ai", "fintech", "apps"],
		year: "2026",
		role: "Hackathon build — mobile & AI",
		stack: ["React Native", "Expo", "TypeScript", "Gemini", "Groq", "Supabase"],
		featured: true,
		cover: { type: "phone", img: "assets/img/finmentor-dashboard.jpg", bg: "#EDE7DC", alt: "ET FinMentor dashboard on a phone" },
		gallery: ["assets/img/finmentor-dashboard.jpg", "assets/img/finmentor-xray.jpg", "assets/img/finmentor-fire.jpg", "assets/img/finmentor-modules.jpg"],
		summary: "Built for the problem statement “95% of Indians don't have a financial plan — make planning as easy as checking WhatsApp.” One app covers FIRE planning, money health, life events, taxes, couples' planning and portfolio analysis.",
		highlights: [
			"FIRE planner with month-by-month SIP roadmap, corpus projection and an AI 12-month action plan.",
			"Six-dimension Money Health Score — emergency, insurance, investment, debt, tax, retirement — computed fully offline.",
			"Tax Wizard reads Form 16 with Gemini Vision and compares old vs new regime with ranked 80C / NPS / HRA moves.",
			"Portfolio X-Ray turns a CAMS/KFintech statement into true XIRR, overlap and expense drag in under 10 seconds.",
			"Automatic Gemini → Groq (Llama 3.1) failover on rate limits, invisible to the user."
		],
		metrics: [["R2", "national finalist"], ["6", "planning modules"], ["<10s", "portfolio X-ray"]],
		links: { github: "https://github.com/MananS8805/ET_Fin_Mentor" },
		release: { repo: "ET_Fin_Mentor", ext: ".apk", label: "Android APK" }
	},
	{
		id: "walllearn",
		theme: { bg: "#FFE24D", fg: "#141414", font: "DM Serif Display", gf: "DM+Serif+Display:ital@1", style: "italic", track: "-.02em" },
		name: "WallLearn",
		tagline: "Your lock screen, quietly turned into a vocabulary trainer",
		detail: "Android app",
		tags: ["apps"],
		year: "2026",
		role: "Solo — Android",
		stack: ["Kotlin", "Android", "Foreground Service", "WallpaperManager"],
		featured: true,
		cover: { type: "wall", bg: "#E2E9E4" },
		summary: "WallLearn swaps a new word onto your lock screen every time you wake your phone — word, part of speech, meaning and an example sentence, rendered straight onto the wallpaper. No app to open, no reminders to dismiss: you learn a word by checking the time.",
		highlights: [
			"1,000+ GRE words out of the box in a persisted, no-repeat shuffled rotation.",
			"Lock screen only (FLAG_LOCK) — your home-screen wallpaper is never touched.",
			"A lightweight foreground service listens for ACTION_SCREEN_ON; a boot receiver restarts it after reboot.",
			"Add your own words in-app — merged into the same rotation and kept across restarts."
		],
		metrics: [["1,000+", "words"], ["0", "taps to learn"], ["1", "word per unlock"]],
		links: { github: "https://github.com/MananS8805/VocabLearn" },
		release: { repo: "VocabLearn", ext: ".apk", label: "Android APK" }
	},
	{
		id: "nexdoc",
		theme: { bg: "#16469E", fg: "#EAF1FF", font: "Special Elite", gf: "Special+Elite", track: "-.01em" },
		name: "NexDoc",
		tagline: "A semantic preprocessing pipeline for enterprise documents",
		detail: "AI pipeline",
		tags: ["ai"],
		year: "2026",
		role: "Solo — pipeline & evaluation",
		stack: ["Python", "EasyOCR", "OpenCV", "PyTorch", "Groq"],
		featured: true,
		cover: { type: "window", img: "assets/img/nexdoc-flow.png", bg: "#E3EAF2", alt: "Flowchart fixture reconstructed by NexDoc's diagram adapter" },
		summary: "Enterprise knowledge lives in spreadsheets, scanned forms and diagrams whose structure carries meaning. Generic pipelines flatten it to text and lose it. NexDoc reads each artifact on its own terms and converges every adapter onto one schema — so downstream systems integrate once.",
		highlights: [
			"Three working adapters — spreadsheet (deterministic, formula-aware), document (text layer + OCR) and diagram (OpenCV detection + reconstruction).",
			"Router picks the adapter from a file's magic bytes, not its extension.",
			"Measured: deterministic fact lookup 0% → 100%, and real LLM task accuracy 17% → 100% on spreadsheets.",
			"Switched OCR to EasyOCR — offline, English + Hindi, real per-detection confidence, and honest about when OCR isn't available."
		],
		metrics: [["17→100%", "LLM task accuracy"], ["3", "adapters"], ["1", "shared schema"]],
		links: { github: "https://github.com/MananS8805/NexDoc" }
	},
	{
		id: "fingenie",
		theme: { bg: "#341766", fg: "#F5C94A", font: "Cinzel Decorative", gf: "Cinzel+Decorative:wght@700", track: "0em" },
		name: "FinGenie",
		tagline: "AI financial-literacy coach and private expense tracker",
		detail: "Mobile app",
		tags: ["ai", "fintech", "apps"],
		year: "2026",
		role: "Solo — full-stack",
		stack: ["React Native", "FastAPI", "LangChain", "Gemini", "Zustand", "SQLite", "NumPy"],
		cover: { type: "type", glyph: "₹", caption: "FIRE · 30 yrs", bg: "#F1E7E3" },
		summary: "A cross-platform app that teaches money by doing: an event-driven AI coach with memory, a RAG-powered financial news feed you can listen to, and serious planning maths underneath.",
		highlights: [
			"FastAPI backend with Zustand state; Gemini + LangChain power a RAG news feed with text-to-speech.",
			"Memory-persistent, event-driven AI financial coach.",
			"NumPy engine for 30-year FIRE projections and a Portfolio X-Ray (XIRR, expense ratio via external APIs).",
			"Privacy-first offline SQLite expense tracker."
		],
		links: { github: "https://github.com/MananS8805/FinGenie" }
	},
	{
		id: "f1",
		theme: { bg: "#D50A0A", fg: "#FFFFFF", font: "Racing Sans One", gf: "Racing+Sans+One", track: "0em", upper: true },
		name: "F1 Predictor",
		tagline: "Race-winner predictions with XGBoost and Monte Carlo",
		detail: "ML + Flutter",
		tags: ["ai", "apps"],
		year: "2026",
		role: "Solo — ML & app",
		stack: ["FastAPI", "FastF1", "XGBoost", "scikit-learn", "Flutter"],
		cover: { type: "type", glyph: "P1", caption: "Monte Carlo race sims", bg: "#EDEDED" },
		summary: "A full-stack Formula 1 prediction service: ingestion and feature engineering on FastF1 and Ergast data, XGBoost inference, Monte Carlo race simulation and a Flutter front end with team-coloured, F1-style UI.",
		highlights: [
			"Predicts the next race winner, the projected podium and a Top-10 probability board.",
			"Custom what-if race simulations and session telemetry summaries.",
			"Offline training + cache warming so the API behaves like a production inference service."
		],
		links: { github: "https://github.com/MananS8805/ML-based-formulae-1-predictions-model" },
		release: { repo: "ML-based-formulae-1-predictions-model", ext: ".apk", label: "Android APK" }
	},
	{
		id: "msme",
		theme: { bg: "#0D6E50", fg: "#EFFFF6", font: "Bungee", gf: "Bungee", track: "0em" },
		name: "MSME Health Score",
		tagline: "Financial-health scoring and lending copilot for MSMEs",
		detail: "Web dashboard",
		tags: ["ai", "fintech"],
		year: "2026",
		role: "Full-stack & scoring engine",
		stack: ["Next.js", "TypeScript", "Python", "shadcn/ui"],
		cover: { type: "type", glyph: "742", caption: "Health score", bg: "#E4EDE8" },
		summary: "A lender-facing dashboard that scores the financial health of small businesses, explains the score and surfaces risks, anomalies and lending opportunities.",
		highlights: [
			"Python scoring engine with a score-breakdown radar and explainability panel.",
			"Portfolio view, risk distribution, anomaly alerts and loan recommendations.",
			"An AI copilot chat card for asking questions about any MSME."
		],
		links: { github: "https://github.com/MananS8805/Financial_healh_score_msme", live: "https://financial-healh-score-msme.vercel.app" }
	},
	{
		id: "fixmyjournal",
		theme: { bg: "#F1E5CC", fg: "#2A1A0D", font: "UnifrakturMaguntia", gf: "UnifrakturMaguntia", track: "0em" },
		name: "Fix My Journal",
		tagline: "An AI agent that formats manuscripts to journal guidelines",
		detail: "AI agent",
		tags: ["ai"],
		year: "2026",
		role: "Backend & AI",
		stack: ["FastAPI", "Docling", "Gemini", "React"],
		cover: { type: "type", glyph: "¶", caption: "IEEE · Nature · ACM", bg: "#ECE8F1" },
		summary: "Upload a PDF or DOCX manuscript and get it back reformatted for the journal you're submitting to — with citations checked and every change explained.",
		highlights: [
			"20+ journal profiles (Nature, IEEE, ACM, PLOS, Elsevier, Springer…) plus AI extraction of rules from any guideline URL.",
			"Citation validation against the reference list and a 0–100% compliance score.",
			"Exports to LaTeX, DOCX or PDF with a human-readable changelog."
		],
		links: { github: "https://github.com/MananS8805/Fix_my_journal", live: "https://fixmyjournal.vercel.app" }
	},
	{
		id: "mfreco",
		theme: { bg: "#FF9A2E", fg: "#1C1205", font: "Bungee Shade", gf: "Bungee+Shade", track: "0em" },
		name: "Fund Recommender",
		tagline: "A vector-based mutual-fund recommendation engine",
		detail: "Recommender",
		tags: ["ai", "fintech"],
		year: "2026",
		role: "Solo — data & modelling",
		stack: ["Python", "pandas", "scikit-learn", "Embeddings"],
		cover: { type: "type", glyph: "₹80T", caption: "Paradox of choice", bg: "#E9EEF0" },
		summary: "Indian investors face 15,000+ schemes and no menu. This engine builds a full mutual-fund dataset, estimates expense ratios from SEBI rules where data is missing, and matches funds to an investor profile with vector similarity.",
		highlights: [
			"End-to-end dataset build: fetch, merge, AUM enrichment and feature engineering.",
			"Rule-based TER estimator grounded in SEBI caps and AUM economies of scale.",
			"Written up in the blog post “From Analysis Paralysis to Alpha”."
		],
		links: { github: "https://github.com/MananS8805/Mutual-Fund-Investment-Recommendation", blog: "https://mananshethblogs.wordpress.com/2026/02/03/from-analysis-paralysis-to-alpha-building-a-vector-based-financial-recommendation-engine/" }
	},
	{
		id: "taxrag",
		theme: { bg: "#5A1824", fg: "#F6E8D5", font: "IM Fell English", gf: "IM+Fell+English", track: "-.01em" },
		name: "Tax Consultant",
		tagline: "A fully local RAG over Indian tax legislation",
		detail: "Local RAG",
		tags: ["ai", "fintech"],
		year: "2025",
		role: "Solo",
		stack: ["Ollama", "LangChain", "FAISS"],
		cover: { type: "type", glyph: "§", caption: "Clause-level answers", bg: "#F0EBE4" },
		summary: "Tax law is long, dense and private to ask about. This pipeline parses complex legislation and answers questions with source-verified, clause-level citations — running entirely on your own machine.",
		highlights: [
			"Local LLM via Ollama, FAISS vector search and LangChain orchestration.",
			"Every answer points back to the exact clause it came from.",
			"100% data privacy — nothing leaves the device."
		],
		links: {}
	},
	{
		id: "assistant",
		theme: { bg: "#00D2E0", fg: "#03161C", font: "Audiowide", gf: "Audiowide", track: "0em" },
		name: "RAG Agent",
		tagline: "A tool-using AI assistant with a Flutter client",
		detail: "AI agent",
		tags: ["ai", "apps"],
		year: "2026",
		role: "Solo",
		stack: ["FastAPI", "LangChain", "Groq", "Tavily", "Flutter"],
		cover: { type: "type", glyph: "{ }", caption: "Tools + memory", bg: "#E6E6EC" },
		summary: "A simple way to build your own idea-driven assistant: a FastAPI agent on Groq with web search and personal tools, talking to a Flutter app.",
		highlights: [
			"LangChain agent with Tavily search and custom tools (like a schedule lookup).",
			"Flutter client for Android and web."
		],
		links: { github: "https://github.com/MananS8805/RAG-AGENT" }
	},
	{
		id: "resumeanalyzer",
		theme: { bg: "#DCE8FF", fg: "#14234D", title: "#C8102E", font: "Permanent Marker", gf: "Permanent+Marker", track: "0em" },
		name: "Resume Analyzer",
		tagline: "AI résumé scoring with ATS feedback",
		detail: "Web app",
		tags: ["ai"],
		year: "2025",
		role: "Front end",
		stack: ["React Router", "TypeScript", "Puter.js", "Docker"],
		cover: { type: "window", img: "assets/img/resume-analyzer.png", bg: "#EEEAF3", alt: "Resume Analyzer score screen" },
		summary: "Upload a résumé, get an ATS score, a breakdown by category and concrete suggestions — in a clean, animated interface.",
		highlights: [
			"PDF-to-image pipeline in the browser and AI feedback via Puter.js.",
			"Score gauges, ATS panel and per-section accordions."
		],
		links: { github: "https://github.com/MananS8805/resume-analyzer" }
	},
	{
		id: "coreinventory",
		theme: { bg: "#C69D6B", fg: "#1A1307", font: "Stardos Stencil", gf: "Stardos+Stencil:wght@700", track: "0em", upper: true },
		name: "CoreInventory",
		tagline: "Full-stack inventory management",
		detail: "Web app",
		tags: ["apps"],
		year: "2026",
		role: "Full-stack",
		stack: ["React", "Vite", "Tailwind", "Express", "JWT"],
		cover: { type: "type", glyph: "SKU", caption: "Stock in / out", bg: "#EAEAE6" },
		summary: "An inventory management prototype built to learn and collaborate on modern full-stack practice.",
		highlights: ["React + Vite + Tailwind front end, Express REST API with JWT auth."],
		links: { github: "https://github.com/MananS8805/CoreInventory" }
	}
];

const POSTS_FALLBACK = [
	{
		date: "2026-02-03",
		title: "From Analysis Paralysis to Alpha: Building a Vector-Based Financial Recommendation Engine",
		url: "https://mananshethblogs.wordpress.com/2026/02/03/from-analysis-paralysis-to-alpha-building-a-vector-based-financial-recommendation-engine/",
		img: "",
		excerpt: "Investing in India today is less like a disciplined science and more like walking into a buffet with 15,000 dishes but no menu."
	},
	{
		date: "2026-01-26",
		title: "Understanding Blockchain: A Journey Through Trust and Decentralization",
		url: "https://mananshethblogs.wordpress.com/2026/01/26/understanding-blockchain-a-journey-through-trust-and-decentralization/",
		img: "assets/img/blog-blockchain.png",
		excerpt: "What is blockchain and how does it help us? Notes from a seminar by Sunil Kapadia on trust without intermediaries."
	},
	{
		date: "2026-01-04",
		title: "From Pavement to Pixels: How Tech is Giving the Traditional Hustle a Jetpack",
		url: "https://mananshethblogs.wordpress.com/2026/01/04/from-pavement-to-pixels-how-tech-is-giving-the-traditional-hustle-a-jetpack/",
		img: "assets/img/blog-pavement.jpg",
		excerpt: "A weathered notebook full of hand-drawn maps and crossed-out numbers — and what happens when the old hustle meets new tools."
	}
];

const SKILLS = [
	{ label: "AI / ML", items: ["PyTorch", "LightGBM", "Scikit-learn", "TensorFlow", "TCN · LSTM · Transformers", "Reinforcement learning", "Time-series forecasting", "LLMs · RAG · LangChain", "Ollama · FAISS · Embeddings", "Computer vision"] },
	{ label: "Languages", items: ["Python", "SQL", "TypeScript", "Java", "C++", "C", "Dart", "Kotlin"] },
	{ label: "Backend & apps", items: ["FastAPI", "Flask", "Django", "Node.js", "React", "React Native (Expo)", "Flutter", "PySide6", "Streamlit"] },
	{ label: "Cloud & tools", items: ["AWS", "Google Cloud", "Docker", "Git", "PostgreSQL", "MongoDB", "SQLite", "Firebase", "Power BI"] }
];

const RECOGNITION = [
	{ name: "IEEE paper", detail: "Impact of Generative AI on Indian financial markets — under review", year: "2026" },
	{ name: "ET Gen AI Hackathon", detail: "National finalist (Round 2) with FinMentor", year: "2026" },
	{ name: "World Bank Youth Summit", detail: "Delegate — “Future Works: Designing Jobs for the Digital Age”", year: "2026" },
	{ name: "Swimming", detail: "District-level gold medallist, represented Kachchh at state level", year: "—" },
	{ name: "Parasdham Youth NGO", detail: "Volunteer coordinator — logistics for weekly outreach drives", year: "—" }
];

const CERTS = ["AWS Certified Cloud Practitioner", "Supervised Machine Learning — DeepLearning.AI", "Machine Learning for Trading — Google", "Google AI Essentials", "Google UX Design", "Power BI Data Analytics"];
