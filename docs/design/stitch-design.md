<!-- Design System -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Split Bill - No Frills</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-variant": "#e2e2e2",
                      "secondary-fixed": "#ffe170",
                      "on-tertiary-container": "#6d2f55",
                      "inverse-surface": "#2f3131",
                      "primary-container": "#8ab4f8",
                      "on-primary-fixed": "#001b3c",
                      "on-error": "#ffffff",
                      "surface-container-low": "#f3f3f4",
                      "inverse-primary": "#a8c8ff",
                      "tertiary-container": "#ea9bc6",
                      "tertiary": "#8a486f",
                      "on-error-container": "#93000a",
                      "outline": "#737781",
                      "surface-container-lowest": "#ffffff",
                      "pure-black": "#000000",
                      "on-surface": "#1a1c1c",
                      "primary-fixed": "#d5e3ff",
                      "on-primary-fixed-variant": "#114784",
                      "on-secondary-container": "#6f5c00",
                      "error": "#ba1a1a",
                      "on-tertiary-fixed": "#3a0329",
                      "background": "#ffffff",
                      "inverse-on-surface": "#f0f1f1",
                      "error-container": "#ffdad6",
                      "on-tertiary-fixed-variant": "#6f3157",
                      "on-primary-container": "#0d4582",
                      "on-background": "#1a1c1c",
                      "outline-variant": "#c3c6d1",
                      "on-secondary": "#ffffff",
                      "tertiary-fixed": "#ffd8ea",
                      "primary-fixed-dim": "#a8c8ff",
                      "on-surface-variant": "#424750",
                      "primary": "#315f9d",
                      "secondary-fixed-dim": "#e9c400",
                      "surface": "#ffffff",
                      "surface-container-high": "#e8e8e8",
                      "on-secondary-fixed": "#221b00",
                      "surface-tint": "#315f9d",
                      "surface-container": "#eeeeee",
                      "on-tertiary": "#ffffff",
                      "on-primary": "#ffffff",
                      "surface-dim": "#dadada",
                      "tertiary-fixed-dim": "#ffaeda",
                      "on-secondary-fixed-variant": "#544600",
                      "mint-green": "#A7F3D0",
                      "surface-container-highest": "#e2e2e2",
                      "secondary": "#705d00",
                      "surface-bright": "#f9f9f9",
                      "secondary-container": "#fdd400"
              },
              "borderRadius": {
                      "DEFAULT": "0px",
                      "lg": "0px",
                      "xl": "0px",
                      "full": "0px"
              },
              "spacing": {
                      "margin-mobile": "16px",
                      "base": "4px",
                      "margin-desktop": "40px",
                      "border-width": "4px",
                      "gutter": "24px",
                      "shadow-offset": "8px"
              },
              "fontFamily": {
                      "display-xl": [
                              "Archivo Narrow"
                      ],
                      "headline-sm": [
                              "Archivo Narrow"
                      ],
                      "label-bold": [
                              "Inter"
                      ],
                      "label-sm": [
                              "Inter"
                      ],
                      "headline-lg": [
                              "Archivo Narrow"
                      ],
                      "body-md": [
                              "Inter"
                      ],
                      "body-lg": [
                              "Inter"
                      ],
                      "headline-md": [
                              "Archivo Narrow"
                      ]
              },
              "fontSize": {
                      "display-xl": [
                              "80px",
                              {
                                      "lineHeight": "80px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "900"
                              }
                      ],
                      "headline-sm": [
                              "24px",
                              {
                                      "lineHeight": "28px",
                                      "fontWeight": "900"
                              }
                      ],
                      "label-bold": [
                              "14px",
                              {
                                      "lineHeight": "20px",
                                      "fontWeight": "700"
                              }
                      ],
                      "label-sm": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "fontWeight": "600"
                              }
                      ],
                      "headline-lg": [
                              "48px",
                              {
                                      "lineHeight": "52px",
                                      "fontWeight": "900"
                              }
                      ],
                      "body-md": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "400"
                              }
                      ],
                      "body-lg": [
                              "18px",
                              {
                                      "lineHeight": "28px",
                                      "fontWeight": "500"
                              }
                      ],
                      "headline-md": [
                              "32px",
                              {
                                      "lineHeight": "36px",
                                      "fontWeight": "900"
                              }
                      ]
              }
      },
          },
        }
    </script>
<style>
        .neo-shadow {
            box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
        }
        .neo-shadow-hover:hover {
            box-shadow: 10px 10px 0px 0px rgba(0,0,0,1);
            transform: translate(-2px, -2px);
            transition: all 0.2s ease-in-out;
        }
        .neo-shadow-active:active {
            box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
            transform: translate(8px, 8px);
            transition: all 0.1s ease-in-out;
        }
        .neo-border {
            border: 4px solid #000000;
        }
    </style>
</head>
<body class="bg-background text-pure-black min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-secondary-container selection:text-pure-black">
<!-- TopNavBar -->
<header class="w-full top-0 sticky bg-background border-b-4 border-pure-black z-50">
<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto">
<a class="font-headline-md text-headline-md uppercase text-pure-black tracking-tighter hover:scale-105 transition-transform origin-left" href="#">
                SPLIT BILL
            </a>
<nav class="hidden md:flex items-center gap-gutter">
<a class="text-pure-black font-label-bold uppercase hover:underline hover:text-secondary-fixed transition-colors" href="#how-it-works">How It Works</a>
<a class="text-pure-black font-label-bold uppercase hover:underline hover:text-secondary-fixed transition-colors" href="#features">Features</a>

</nav>
<div class="flex items-center gap-4">


</div>
</div>
</header>
<main class="flex-grow flex flex-col items-center w-full">
<!-- Hero Section -->
<section class="w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-20 flex flex-col items-center text-center">
<h1 class="font-display-xl text-[64px] md:text-display-xl uppercase text-pure-black mb-6 max-w-4xl">
                SPLIT BILL
            </h1>
<p class="font-headline-sm text-headline-sm text-pure-black mb-16 max-w-2xl uppercase">
                Photograph the receipt. Tag who had what.
            </p>
<div class="w-full max-w-3xl flex flex-col items-center gap-8">
<!-- Dominant Action -->
<button class="w-full bg-primary-container neo-border neo-shadow neo-shadow-hover neo-shadow-active p-12 flex flex-col items-center justify-center gap-6 group">
<span class="material-symbols-outlined text-[120px] text-pure-black group-hover:scale-110 transition-transform" style="font-variation-settings: 'FILL' 1;">
                        photo_camera
                    </span>
<span class="font-headline-lg text-headline-lg uppercase text-pure-black tracking-tight">
                        PHOTOGRAPH RECEIPT
                    </span>
</button>
<!-- Secondary Action -->
<button class="bg-surface neo-border neo-shadow neo-shadow-hover neo-shadow-active px-8 py-4 flex items-center justify-center gap-3">
<span class="material-symbols-outlined text-[24px] text-pure-black">
                        edit_document
                    </span>
<span class="font-label-bold text-[18px] uppercase text-pure-black">
                        Enter Manually
                    </span>
</button>
<p class="font-label-sm text-label-sm text-on-surface-variant uppercase mt-8 border-t-4 border-pure-black pt-4 w-full text-center">
                    Nothing is stored on our servers. Your data stays on your device.
                </p>
</div>
</section>
<!-- How It Works Section -->
<section class="w-full border-t-4 border-pure-black bg-surface-variant py-20" id="how-it-works">
<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
<h2 class="font-headline-lg text-headline-lg uppercase text-pure-black mb-12 text-center md:text-left">HOW IT WORKS</h2>
<div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<!-- Step 1 -->
<div class="bg-secondary-container neo-border neo-shadow p-8 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
<div class="w-16 h-16 bg-pure-black text-secondary-container flex items-center justify-center font-headline-md text-headline-md mb-6">1</div>
<h3 class="font-headline-sm text-headline-sm uppercase text-pure-black mb-4">Snap a Photo</h3>
<p class="font-body-lg text-body-lg text-pure-black">Just take a clear picture of your receipt. Our AI reads the items, prices, and totals instantly.</p>
</div>
<!-- Step 2 -->
<div class="bg-tertiary-container neo-border neo-shadow p-8 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
<div class="w-16 h-16 bg-pure-black text-tertiary-container flex items-center justify-center font-headline-md text-headline-md mb-6">2</div>
<h3 class="font-headline-sm text-headline-sm uppercase text-pure-black mb-4">Tag Your Friends</h3>
<p class="font-body-lg text-body-lg text-pure-black">Assign items to specific people. Splitting an appetizer? Assign it to multiple people and we do the math.</p>
</div>
<!-- Step 3 -->
<div class="bg-mint-green neo-border neo-shadow p-8 flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
<div class="w-16 h-16 bg-pure-black text-mint-green flex items-center justify-center font-headline-md text-headline-md mb-6">3</div>
<h3 class="font-headline-sm text-headline-sm uppercase text-pure-black mb-4">Split Fairly</h3>
<p class="font-body-lg text-body-lg text-pure-black">Tax and tip are automatically calculated proportionally based on what everyone ordered.</p>
</div>
</div>
</div>
</section>
<!-- Features Section -->
<section class="w-full border-t-4 border-pure-black bg-background py-20" id="features">
<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
<h2 class="font-headline-lg text-headline-lg uppercase text-pure-black mb-12 text-center">FEATURES</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
<div class="bg-surface neo-border p-8 flex items-start gap-4 hover:bg-secondary-fixed transition-colors duration-300">
<span class="material-symbols-outlined text-[40px] text-pure-black" style="font-variation-settings: 'FILL' 1;">document_scanner</span>
<div>
<h4 class="font-headline-sm text-headline-sm uppercase text-pure-black mb-2">AI Receipt Scanning</h4>
<p class="font-body-md text-body-md text-pure-black">Lightning-fast OCR technology extracts items and prices flawlessly from even crumpled receipts.</p>
</div>
</div>
<div class="bg-surface neo-border p-8 flex items-start gap-4 hover:bg-primary-container transition-colors duration-300">
<span class="material-symbols-outlined text-[40px] text-pure-black" style="font-variation-settings: 'FILL' 1;">calculate</span>
<div>
<h4 class="font-headline-sm text-headline-sm uppercase text-pure-black mb-2">Fair Tax/Tip Splitting</h4>
<p class="font-body-md text-body-md text-pure-black">No more flat splitting. Pay exactly your fair share of taxes and tip based on your order subtotal.</p>
</div>
</div>
<div class="bg-surface neo-border p-8 flex items-start gap-4 hover:bg-tertiary-container transition-colors duration-300">
<span class="material-symbols-outlined text-[40px] text-pure-black" style="font-variation-settings: 'FILL' 1;">no_accounts</span>
<div>
<h4 class="font-headline-sm text-headline-sm uppercase text-pure-black mb-2">No Account Required</h4>
<p class="font-body-md text-body-md text-pure-black">Start splitting immediately. We don't want your email, we just want to solve your dinner math.</p>
</div>
</div>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="w-full mt-auto bg-surface border-t-4 border-pure-black">
<div class="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-12 w-full max-w-[1440px] mx-auto gap-8 md:gap-0">
<div class="flex flex-col items-center md:items-start">
<span class="font-headline-sm text-headline-sm uppercase text-pure-black mb-2">SPLIT BILL</span>
<span class="font-label-sm text-label-sm uppercase text-pure-black">© 2024 SPLIT BILL. NO FRILLS.</span>
</div>
<nav class="flex flex-wrap justify-center gap-6">
<a class="font-label-bold text-[14px] uppercase text-pure-black hover:bg-pure-black hover:text-surface px-2 py-1 transition-colors border-2 border-transparent hover:border-pure-black" href="#">Privacy</a>
<a class="font-label-bold text-[14px] uppercase text-pure-black hover:bg-pure-black hover:text-surface px-2 py-1 transition-colors border-2 border-transparent hover:border-pure-black" href="#">Terms</a>
<a class="font-label-bold text-[14px] uppercase text-pure-black hover:bg-pure-black hover:text-surface px-2 py-1 transition-colors border-2 border-transparent hover:border-pure-black" href="#">Github</a>
<a class="font-label-bold text-[14px] uppercase text-pure-black hover:bg-pure-black hover:text-surface px-2 py-1 transition-colors border-2 border-transparent hover:border-pure-black" href="#">Twitter</a>
</nav>
</div>
</footer>


</body></html>

<!-- Split Bill - Authentic Neobrutalist Landing -->
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Split Bill - Receipt Capture</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;700;900&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "secondary-container": "#fdd400",
                        "surface-variant": "#e2e2e2",
                        "on-primary-container": "#0d4582",
                        "surface-container-high": "#e8e8e8",
                        "on-tertiary": "#ffffff",
                        "secondary-fixed-dim": "#e9c400",
                        "on-secondary-fixed": "#221b00",
                        "mint-green": "#A7F3D0",
                        "tertiary": "#8a486f",
                        "on-primary-fixed-variant": "#114784",
                        "inverse-primary": "#a8c8ff",
                        "on-secondary-fixed-variant": "#544600",
                        "on-secondary-container": "#6f5c00",
                        "secondary": "#705d00",
                        "background": "#f9f9f9",
                        "on-error-container": "#93000a",
                        "surface-container-low": "#f3f3f4",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "inverse-surface": "#2f3131",
                        "on-primary": "#ffffff",
                        "on-tertiary-fixed": "#3a0329",
                        "on-background": "#1a1c1c",
                        "outline": "#737781",
                        "primary-fixed": "#d5e3ff",
                        "outline-variant": "#c3c6d1",
                        "surface-container-highest": "#e2e2e2",
                        "primary-container": "#8ab4f8",
                        "on-error": "#ffffff",
                        "on-secondary": "#ffffff",
                        "tertiary-fixed-dim": "#ffaeda",
                        "on-surface": "#1a1c1c",
                        "surface-tint": "#315f9d",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "inverse-on-surface": "#f0f1f1",
                        "primary": "#315f9d",
                        "surface-container-lowest": "#ffffff",
                        "surface-dim": "#dadada",
                        "tertiary-fixed": "#ffd8ea",
                        "primary-fixed-dim": "#a8c8ff",
                        "tertiary-container": "#ea9bc6",
                        "error": "#ba1a1a",
                        "surface-bright": "#f9f9f9",
                        "on-primary-fixed": "#001b3c",
                        "secondary-fixed": "#ffe170",
                        "pure-black": "#000000",
                        "surface": "#f9f9f9",
                        "surface-container": "#eeeeee",
                        "on-surface-variant": "#424750"
                    },
                    "borderRadius": {
                        "DEFAULT": "0px",
                        "lg": "0px",
                        "xl": "0px",
                        "full": "0px"
                    },
                    "spacing": {
                        "margin-mobile": "16px",
                        "base": "4px",
                        "shadow-offset": "8px",
                        "margin-desktop": "40px",
                        "gutter": "24px",
                        "border-width": "4px"
                    },
                    "fontFamily": {
                        "headline-sm": ["Archivo Narrow"],
                        "headline-md": ["Archivo Narrow"],
                        "body-md": ["Inter"],
                        "label-bold": ["Inter"],
                        "headline-lg": ["Archivo Narrow"],
                        "body-lg": ["Inter"],
                        "display-xl": ["Archivo Narrow"],
                        "label-sm": ["Inter"]
                    },
                    "fontSize": {
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background min-h-screen flex flex-col font-body-md text-pure-black">
<!-- TopNavBar -->
<header class="flex justify-between items-center w-full px-margin-desktop py-4 bg-background border-b-[4px] border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative z-50">
<div class="font-headline-md text-headline-md uppercase tracking-tighter text-pure-black">SPLIT BILL</div>
<nav class="hidden md:flex gap-gutter items-center">
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase" href="#">How it Works</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase" href="#">Pricing</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase" href="#">History</a>
</nav>
<button class="bg-primary-container text-pure-black font-headline-sm text-headline-sm uppercase px-6 py-2 border-[4px] border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">New Split</button>
</header>
<!-- Main Content -->
<main class="flex-grow flex flex-col items-center py-20 px-4">
<div class="w-full max-w-[900px] flex flex-col gap-8">
<h1 class="font-display-xl text-display-xl uppercase text-pure-black text-center">ADD THE RECEIPT</h1>
<!-- Drop Zone -->
<div class="w-full h-[420px] bg-white border-[4px] border-dashed border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-6 p-8 relative overflow-hidden group cursor-pointer hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-6xl text-pure-black" style="font-variation-settings: 'FILL' 1;">upload_file</span>
<p class="font-headline-md text-headline-md text-pure-black uppercase text-center">Drop a photo of the receipt here</p>
<p class="font-label-bold text-label-bold text-pure-black uppercase">or</p>
<button class="bg-white text-pure-black font-headline-sm text-headline-sm uppercase px-8 py-4 border-[4px] border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all group-hover:bg-primary-container">
                    CHOOSE A FILE
                </button>
<input accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file">
</div>
<!-- Divider -->
<div class="flex items-center gap-4 w-full px-12">
<div class="flex-grow h-[4px] bg-pure-black"></div>
<span class="font-label-bold text-label-bold text-pure-black uppercase">or</span>
<div class="flex-grow h-[4px] bg-pure-black"></div>
</div>
<!-- Alternative Actions -->
<div class="flex flex-col md:flex-row gap-6 justify-center w-full">
<button class="flex-1 bg-white flex items-center justify-center gap-4 py-6 px-4 border-[4px] border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-mint-green active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
<span class="material-symbols-outlined text-3xl text-pure-black" style="font-variation-settings: 'FILL' 1;">photo_camera</span>
<span class="font-headline-sm text-headline-sm uppercase text-pure-black">USE WEBCAM</span>
</button>
<button class="flex-1 bg-white flex items-center justify-center gap-4 py-6 px-4 border-[4px] border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-tertiary-container active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all">
<span class="material-symbols-outlined text-3xl text-pure-black" style="font-variation-settings: 'FILL' 1;">keyboard</span>
<span class="font-headline-sm text-headline-sm uppercase text-pure-black">ENTER MANUALLY INSTEAD</span>
</button>
</div>
<p class="font-label-bold text-label-bold text-pure-black text-center mt-4 uppercase">Your photo is never stored</p>
</div>
</main>
<!-- Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-8 gap-gutter bg-pure-black border-t-[4px] border-pure-black mt-auto">
<div class="font-headline-sm text-headline-sm text-surface-lowest">© 2024 SPLIT BILL. NO MERCY FOR NON-PAYERS.</div>
<nav class="flex gap-gutter items-center">
<a class="text-surface-variant hover:text-white transition-colors hover:text-secondary-container underline decoration-2 font-label-sm text-label-sm uppercase" href="#">Terms</a>
<a class="text-surface-variant hover:text-white transition-colors hover:text-secondary-container underline decoration-2 font-label-sm text-label-sm uppercase" href="#">Privacy</a>
<a class="text-surface-variant hover:text-white transition-colors hover:text-secondary-container underline decoration-2 font-label-sm text-label-sm uppercase" href="#">Contact</a>
<a class="text-surface-variant hover:text-white transition-colors hover:text-secondary-container underline decoration-2 font-label-sm text-label-sm uppercase" href="#">API</a>
</nav>
</footer>


</body></html>

<!-- Capture Receipt - Desktop -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Parsing Progress - SPLIT BILL</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400..700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "tertiary-fixed": "#ffd8ea",
                        "mint-green": "#A7F3D0",
                        "outline-variant": "#c3c6d1",
                        "on-tertiary": "#ffffff",
                        "surface": "#f9f9f9",
                        "on-primary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-primary-fixed-variant": "#114784",
                        "secondary-fixed": "#ffe170",
                        "on-secondary-fixed": "#221b00",
                        "on-surface-variant": "#424750",
                        "tertiary-fixed-dim": "#ffaeda",
                        "surface-variant": "#e2e2e2",
                        "on-tertiary-container": "#6d2f55",
                        "error": "#ba1a1a",
                        "on-surface": "#1a1c1c",
                        "secondary-container": "#fdd400",
                        "primary-container": "#8ab4f8",
                        "surface-container": "#eeeeee",
                        "outline": "#737781",
                        "secondary-fixed-dim": "#e9c400",
                        "pure-black": "#000000",
                        "surface-container-low": "#f3f3f4",
                        "error-container": "#ffdad6",
                        "surface-container-lowest": "#ffffff",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "on-secondary-container": "#6f5c00",
                        "on-background": "#1a1c1c",
                        "surface-dim": "#dadada",
                        "on-secondary-fixed-variant": "#544600",
                        "surface-bright": "#f9f9f9",
                        "on-primary-fixed": "#001b3c",
                        "inverse-primary": "#a8c8ff",
                        "surface-container-high": "#e8e8e8",
                        "surface-tint": "#315f9d",
                        "on-secondary": "#ffffff",
                        "surface-container-highest": "#e2e2e2",
                        "on-tertiary-fixed": "#3a0329",
                        "primary-fixed-dim": "#a8c8ff",
                        "on-error-container": "#93000a",
                        "inverse-on-surface": "#f0f1f1",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "primary": "#315f9d",
                        "secondary": "#705d00",
                        "tertiary-container": "#ea9bc6",
                        "background": "#f9f9f9",
                        "tertiary": "#8a486f",
                        "on-error": "#ffffff"
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    spacing: {
                        "gutter": "24px",
                        "border-width": "4px",
                        "shadow-offset": "8px",
                        "base": "4px",
                        "margin-mobile": "16px",
                        "margin-desktop": "40px"
                    },
                    fontFamily: {
                        "headline-md": ["Archivo Narrow"],
                        "headline-sm": ["Archivo Narrow"],
                        "display-xl": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "label-sm": ["Inter"],
                        "body-lg": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    fontSize: {
                        "headline-md": ["32px", { lineHeight: "36px", fontWeight: "900" }],
                        "headline-sm": ["24px", { lineHeight: "28px", fontWeight: "900" }],
                        "display-xl": ["80px", { lineHeight: "80px", letterSpacing: "-0.02em", fontWeight: "900" }],
                        "headline-lg": ["48px", { lineHeight: "52px", fontWeight: "900" }],
                        "label-bold": ["14px", { lineHeight: "20px", fontWeight: "700" }],
                        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "600" }],
                        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "500" }],
                        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }]
                    }
                }
            }
        }
    </script>
<style>
        .progress-bar-fill {
            transition: width 0.5s ease-in-out;
        }
        
        .task-item {
            opacity: 0.5;
            transition: opacity 0.3s;
        }
        
        .task-item.active {
            opacity: 1;
        }
        
        .task-item.completed .material-symbols-outlined {
            font-variation-settings: 'FILL' 1;
            color: #ba1a1a; /* Using error color as an accent or we can use black */
        }
    </style>
</head>
<body class="bg-background min-h-screen flex flex-col font-body-md text-pure-black selection:bg-secondary-container selection:text-pure-black">
<!-- Top Navigation omitted intentionally as this is a linear/transactional loading screen -->
<main class="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
<!-- Central Progress Card -->
<div class="w-full max-w-2xl bg-surface-container-lowest border-[4px] border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-12 relative overflow-hidden">
<!-- Background Decorative Grid -->
<div class="absolute inset-0 pointer-events-none opacity-5" style="background-image: radial-gradient(circle at 2px 2px, black 1px, transparent 0); background-size: 24px 24px;"></div>
<!-- Header -->
<div class="text-center mb-8 relative z-10">
<div class="inline-flex items-center justify-center w-16 h-16 bg-primary-container border-[4px] border-pure-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 animate-pulse">
<span class="material-symbols-outlined text-4xl" data-weight="fill" style="font-variation-settings: 'FILL' 1;">document_scanner</span>
</div>
<h1 class="font-headline-lg text-headline-lg uppercase text-pure-black mb-2">Reading Your Receipt...</h1>
<p class="font-body-lg text-body-lg text-outline">Our AI is crunching the numbers. Hold tight.</p>
</div>
<!-- Progress Bar -->
<div class="mb-10 relative z-10">
<div class="h-8 w-full bg-surface-variant border-[4px] border-pure-black relative overflow-hidden">
<div class="h-full bg-secondary-container border-r-[4px] border-pure-black progress-bar-fill" id="progress-fill" style="width: 25%;"></div>
</div>
<div class="flex justify-between mt-2 font-label-bold text-label-bold uppercase">
<span>Progress</span>
<span id="progress-text">25%</span>
</div>
</div>
<!-- Task List -->
<div class="space-y-4 mb-10 relative z-10 font-body-lg text-body-lg border-t-[4px] border-pure-black pt-6">
<div class="flex items-center gap-4 task-item completed active">
<div class="w-8 h-8 flex-shrink-0 bg-mint-green border-[4px] border-pure-black flex items-center justify-center">
<span class="material-symbols-outlined text-pure-black text-xl font-bold">check</span>
</div>
<span class="font-bold">Scanning image quality...</span>
</div>
<div class="flex items-center gap-4 task-item active">
<div class="w-8 h-8 flex-shrink-0 bg-surface-container-lowest border-[4px] border-pure-black flex items-center justify-center relative">
<div class="w-3 h-3 bg-primary-container animate-ping absolute"></div>
<div class="w-3 h-3 bg-primary-container"></div>
</div>
<span class="font-bold">Extracting line items &amp; prices...</span>
</div>
<div class="flex items-center gap-4 task-item">
<div class="w-8 h-8 flex-shrink-0 bg-surface-container-lowest border-[4px] border-pure-black flex items-center justify-center">
</div>
<span>Identifying taxes &amp; tips...</span>
</div>
<div class="flex items-center gap-4 task-item">
<div class="w-8 h-8 flex-shrink-0 bg-surface-container-lowest border-[4px] border-pure-black flex items-center justify-center">
</div>
<span>Preparing your split sheet...</span>
</div>
</div>
<!-- Actions -->
<div class="flex justify-center relative z-10 pt-4 border-t-[4px] border-pure-black">
<button class="px-8 py-3 bg-surface-container-lowest border-[4px] border-pure-black font-label-bold text-label-bold uppercase text-pure-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2">
<span class="material-symbols-outlined">close</span>
                    Cancel Processing
                </button>
</div>
</div>
</main>
<!-- Simulated Progress Script -->
<script>
        document.addEventListener('DOMContentLoaded', () => {
            const progressFill = document.getElementById('progress-fill');
            const progressText = document.getElementById('progress-text');
            const tasks = document.querySelectorAll('.task-item');
            
            let currentProgress = 25;
            let currentTaskIndex = 1;

            const interval = setInterval(() => {
                currentProgress += Math.floor(Math.random() * 15) + 5;
                
                if (currentProgress >= 100) {
                    currentProgress = 100;
                    clearInterval(interval);
                    // Usually redirect here
                }

                progressFill.style.width = `${currentProgress}%`;
                progressText.innerText = `${currentProgress}%`;

                // Update task UI based on progress
                if (currentProgress > 50 && currentTaskIndex === 1) {
                    completeTask(1);
                    activateTask(2);
                    currentTaskIndex = 2;
                } else if (currentProgress > 80 && currentTaskIndex === 2) {
                    completeTask(2);
                    activateTask(3);
                    currentTaskIndex = 3;
                } else if (currentProgress === 100) {
                    completeTask(3);
                }

            }, 1200);

            function completeTask(index) {
                const task = tasks[index];
                const iconBox = task.querySelector('div');
                
                task.classList.add('completed');
                iconBox.className = 'w-8 h-8 flex-shrink-0 bg-mint-green border-[4px] border-pure-black flex items-center justify-center';
                iconBox.innerHTML = '<span class="material-symbols-outlined text-pure-black text-xl font-bold">check</span>';
                task.querySelector('span:not(.material-symbols-outlined)').classList.remove('font-bold');
            }

            function activateTask(index) {
                const task = tasks[index];
                const iconBox = task.querySelector('div');
                
                task.classList.add('active');
                iconBox.className = 'w-8 h-8 flex-shrink-0 bg-surface-container-lowest border-[4px] border-pure-black flex items-center justify-center relative';
                iconBox.innerHTML = '<div class="w-3 h-3 bg-primary-container animate-ping absolute"></div><div class="w-3 h-3 bg-primary-container"></div>';
                task.querySelector('span:not(.material-symbols-outlined)').classList.add('font-bold');
            }
        });
    </script>
</body></html>

<!-- Parsing Progress - Desktop -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Split Bill - Split Sheet</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;family=Archivo+Narrow:wght@900&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "pure-black": "#000000",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-tertiary-fixed": "#3a0329",
                        "surface": "#f9f9f9",
                        "on-error-container": "#93000a",
                        "surface-bright": "#f9f9f9",
                        "secondary-fixed-dim": "#e9c400",
                        "surface-container-lowest": "#ffffff",
                        "secondary": "#705d00",
                        "on-secondary": "#ffffff",
                        "secondary-container": "#fdd400",
                        "surface-tint": "#315f9d",
                        "on-surface": "#1a1c1c",
                        "on-tertiary": "#ffffff",
                        "primary": "#315f9d",
                        "on-background": "#1a1c1c",
                        "tertiary-fixed": "#ffd8ea",
                        "surface-variant": "#e2e2e2",
                        "surface-container-low": "#f3f3f4",
                        "inverse-primary": "#a8c8ff",
                        "on-error": "#ffffff",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "on-primary-fixed": "#001b3c",
                        "on-secondary-fixed": "#221b00",
                        "surface-container-high": "#e8e8e8",
                        "background": "#f9f9f9",
                        "surface-container": "#eeeeee",
                        "on-tertiary-container": "#6d2f55",
                        "secondary-fixed": "#ffe170",
                        "error": "#ba1a1a",
                        "on-surface-variant": "#424750",
                        "on-secondary-fixed-variant": "#544600",
                        "surface-container-highest": "#e2e2e2",
                        "on-primary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-primary-fixed-variant": "#114784",
                        "outline": "#737781",
                        "inverse-on-surface": "#f0f1f1",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#6f5c00",
                        "tertiary-fixed-dim": "#ffaeda",
                        "primary-fixed-dim": "#a8c8ff",
                        "outline-variant": "#c3c6d1",
                        "tertiary": "#8a486f",
                        "mint-green": "#A7F3D0",
                        "tertiary-container": "#ea9bc6",
                        "primary-container": "#8ab4f8",
                        "surface-dim": "#dadada"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "base": "4px",
                        "margin-desktop": "40px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-mobile": "16px",
                        "shadow-offset": "8px"
                    },
                    "fontFamily": {
                        "label-sm": ["Inter"],
                        "headline-sm": ["Archivo Narrow"],
                        "body-lg": ["Inter"],
                        "headline-md": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "headline-lg": ["Archivo Narrow"],
                        "display-xl": ["Archivo Narrow"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
<style>
        .neo-border { border: 4px solid var(--tw-colors-pure-black, #000); }
        .neo-shadow { box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); }
        .neo-shadow-hover:hover { box-shadow: 10px 10px 0px 0px rgba(0,0,0,1); transform: translate(-2px, -2px); transition: all 0.2s ease; }
        .neo-shadow-active:active { box-shadow: 0px 0px 0px 0px rgba(0,0,0,1); transform: translate(8px, 8px); transition: all 0.1s ease; }
        
        /* Custom scrollbar for neobrutalist look */
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: var(--tw-colors-surface-container-lowest, #ffffff); border-left: 4px solid var(--tw-colors-pure-black, #000); }
        ::-webkit-scrollbar-thumb { background: var(--tw-colors-secondary-container, #fdd400); border: 4px solid var(--tw-colors-pure-black, #000); border-right: none; }
        ::-webkit-scrollbar-thumb:hover { background: var(--tw-colors-primary-container, #8ab4f8); }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
<!-- TopNavBar -->
<nav class="flex justify-between items-center w-full px-margin-desktop py-4 bg-background border-b-[4px] border-pure-black z-50 sticky top-0 bg-background dark:bg-background text-primary dark:text-primary-container shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
<div class="font-headline-md text-headline-md uppercase tracking-tighter text-pure-black dark:text-pure-black">
            SPLIT BILL
        </div>
<div class="hidden md:flex items-center gap-6">
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-3 py-2 border-4 border-transparent hover:border-pure-black" href="#">How it Works</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-3 py-2 border-4 border-transparent hover:border-pure-black" href="#">Pricing</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-3 py-2 border-4 border-transparent hover:border-pure-black" href="#">History</a>
</div>
<button class="bg-primary-container text-pure-black neo-border neo-shadow neo-shadow-hover neo-shadow-active font-label-bold text-label-bold uppercase px-6 py-3 transition-all flex items-center gap-2">
            New Split
            <span class="material-symbols-outlined" data-icon="add" data-weight="fill" style="font-variation-settings: 'FILL' 1;">add</span>
</button>
</nav>
<!-- Main Content Canvas -->
<main class="flex-grow p-gutter md:p-margin-desktop flex flex-col gap-gutter max-w-7xl mx-auto w-full">
<header class="mb-4">
<h1 class="font-headline-lg text-headline-lg uppercase text-pure-black mb-2">Dinner at Mario's</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Tap an item to assign it to a person.</p>
</header>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
<!-- Left Column: Receipt Items -->
<section class="lg:col-span-7 flex flex-col gap-4 h-[600px] overflow-y-auto pr-4 pb-4">
<h2 class="font-headline-sm text-headline-sm uppercase border-b-4 border-pure-black pb-2 mb-2 sticky top-0 bg-background z-10">Receipt Items</h2>
<!-- Item Card 1 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4 flex justify-between items-center group cursor-pointer hover:bg-mint-green transition-colors">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Artisanal Pizza</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $18.50
                    </div>
<div class="w-10 h-10 neo-border bg-surface-variant flex items-center justify-center rounded-full group-hover:bg-pure-black group-hover:text-white transition-colors">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
</div>
<!-- Item Card 2 -->
<div class="bg-secondary-container neo-border neo-shadow p-4 flex justify-between items-center cursor-pointer">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Craft Beer</h3>
<p class="font-body-md text-body-md text-on-surface-variant">2x @ $4.00</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $8.00
                    </div>
<div class="flex -space-x-2">
<div class="w-10 h-10 neo-border bg-tertiary-container flex items-center justify-center rounded-full z-20 font-label-bold text-label-bold" title="Alice">A</div>
<div class="w-10 h-10 neo-border bg-primary-container flex items-center justify-center rounded-full z-10 font-label-bold text-label-bold" title="Bob">B</div>
</div>
</div>
<!-- Item Card 3 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4 flex justify-between items-center group cursor-pointer hover:bg-mint-green transition-colors">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Garden Salad</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $12.00
                    </div>
<div class="w-10 h-10 neo-border bg-surface-variant flex items-center justify-center rounded-full group-hover:bg-pure-black group-hover:text-white transition-colors">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
</div>
<!-- Item Card 4 -->
<div class="bg-tertiary-container neo-border neo-shadow p-4 flex justify-between items-center cursor-pointer">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Garlic Bread</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $6.50
                    </div>
<div class="flex -space-x-2">
<div class="w-10 h-10 neo-border bg-tertiary-container flex items-center justify-center rounded-full z-20 font-label-bold text-label-bold" title="Alice">A</div>
</div>
</div>
<!-- Item Card 5 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4 flex justify-between items-center group cursor-pointer hover:bg-mint-green transition-colors">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Tiramisu</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $9.00
                    </div>
<div class="w-10 h-10 neo-border bg-surface-variant flex items-center justify-center rounded-full group-hover:bg-pure-black group-hover:text-white transition-colors">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
</div>
</section>
<!-- Right Column: The Party -->
<section class="lg:col-span-5 flex flex-col gap-4">
<div class="flex justify-between items-end border-b-4 border-pure-black pb-2 mb-2">
<h2 class="font-headline-sm text-headline-sm uppercase">The Party</h2>
<button class="bg-secondary-container neo-border px-3 py-1 font-label-bold text-label-bold uppercase flex items-center gap-1 hover:bg-pure-black hover:text-white transition-colors">
<span class="material-symbols-outlined text-sm" data-icon="add">add</span> Person
                    </button>
</div>
<!-- Person Card 1 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4">
<div class="flex justify-between items-center mb-3">
<div class="flex items-center gap-3">
<div class="w-12 h-12 neo-border bg-tertiary-container flex items-center justify-center rounded-full font-headline-sm text-headline-sm">A</div>
<h3 class="font-headline-sm text-headline-sm uppercase">Alice</h3>
</div>
<div class="font-headline-sm text-headline-sm">$10.50</div>
</div>
<div class="border-t-4 border-pure-black pt-2 flex flex-wrap gap-2">
<span class="bg-surface-variant neo-border px-2 py-1 font-label-sm text-label-sm">Craft Beer (1/2)</span>
<span class="bg-surface-variant neo-border px-2 py-1 font-label-sm text-label-sm">Garlic Bread</span>
</div>
</div>
<!-- Person Card 2 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4">
<div class="flex justify-between items-center mb-3">
<div class="flex items-center gap-3">
<div class="w-12 h-12 neo-border bg-primary-container flex items-center justify-center rounded-full font-headline-sm text-headline-sm">B</div>
<h3 class="font-headline-sm text-headline-sm uppercase">Bob</h3>
</div>
<div class="font-headline-sm text-headline-sm">$4.00</div>
</div>
<div class="border-t-4 border-pure-black pt-2 flex flex-wrap gap-2">
<span class="bg-surface-variant neo-border px-2 py-1 font-label-sm text-label-sm">Craft Beer (1/2)</span>
</div>
</div>
<!-- Unassigned Summary Block -->
<div class="bg-error-container neo-border p-4 mt-auto">
<div class="flex justify-between items-center">
<h3 class="font-label-bold text-label-bold uppercase text-on-error-container">Unassigned Items</h3>
<div class="font-headline-sm text-headline-sm text-on-error-container">$39.50</div>
</div>
</div>
</section>
</div>
<!-- Sticky Bottom Summary / Actions -->
<section class="mt-8 bg-surface-container-lowest border-4 border-pure-black p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sticky bottom-4 z-40">
<div class="flex gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
<div class="flex flex-col">
<span class="font-label-bold text-label-bold uppercase text-on-surface-variant">Subtotal</span>
<span class="font-headline-sm text-headline-sm">$54.00</span>
</div>
<div class="flex flex-col">
<span class="font-label-bold text-label-bold uppercase text-on-surface-variant">Tax (8%)</span>
<span class="font-headline-sm text-headline-sm">$4.32</span>
</div>
<div class="flex flex-col">
<span class="font-label-bold text-label-bold uppercase text-on-surface-variant">Tip (20%)</span>
<span class="font-headline-sm text-headline-sm">$10.80</span>
</div>
</div>
<div class="flex items-center gap-6 w-full md:w-auto border-t-4 border-pure-black pt-4 md:border-t-0 md:pt-0 md:border-l-4 md:pl-6">
<div class="flex flex-col mr-4">
<span class="font-label-bold text-label-bold uppercase text-pure-black">Total</span>
<span class="font-headline-md text-headline-md">$69.12</span>
</div>
<button class="bg-mint-green text-pure-black neo-border neo-shadow neo-shadow-hover neo-shadow-active font-headline-sm text-headline-sm uppercase px-8 py-4 transition-all w-full md:w-auto flex-shrink-0">
                    Settle Up
                </button>
</div>
</section>
</main>
<!-- Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-8 gap-gutter bg-pure-black dark:bg-pure-black text-surface-lowest dark:text-surface-lowest border-t-[4px] border-pure-black mt-auto">
<div class="font-headline-sm text-headline-sm text-surface-lowest">
            © 2024 SPLIT BILL. NO MERCY FOR NON-PAYERS.
        </div>
<div class="flex gap-4">
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">Terms</a>
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">Privacy</a>
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">Contact</a>
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">API</a>
</div>
</footer>
</body></html>

<!-- Split Sheet - Desktop -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Split Bill - Split Sheet</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;500;600;700;900&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "pure-black": "#000000",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-tertiary-fixed": "#3a0329",
                        "surface": "#f9f9f9",
                        "on-error-container": "#93000a",
                        "surface-bright": "#f9f9f9",
                        "secondary-fixed-dim": "#e9c400",
                        "surface-container-lowest": "#ffffff",
                        "secondary": "#705d00",
                        "on-secondary": "#ffffff",
                        "secondary-container": "#fdd400",
                        "surface-tint": "#315f9d",
                        "on-surface": "#1a1c1c",
                        "on-tertiary": "#ffffff",
                        "primary": "#315f9d",
                        "on-background": "#1a1c1c",
                        "tertiary-fixed": "#ffd8ea",
                        "surface-variant": "#e2e2e2",
                        "surface-container-low": "#f3f3f4",
                        "inverse-primary": "#a8c8ff",
                        "on-error": "#ffffff",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "on-primary-fixed": "#001b3c",
                        "on-secondary-fixed": "#221b00",
                        "surface-container-high": "#e8e8e8",
                        "background": "#f9f9f9",
                        "surface-container": "#eeeeee",
                        "on-tertiary-container": "#6d2f55",
                        "secondary-fixed": "#ffe170",
                        "error": "#ba1a1a",
                        "on-surface-variant": "#424750",
                        "on-secondary-fixed-variant": "#544600",
                        "surface-container-highest": "#e2e2e2",
                        "on-primary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-primary-fixed-variant": "#114784",
                        "outline": "#737781",
                        "inverse-on-surface": "#f0f1f1",
                        "error-container": "#ffdad6",
                        "on-secondary-container": "#6f5c00",
                        "tertiary-fixed-dim": "#ffaeda",
                        "primary-fixed-dim": "#a8c8ff",
                        "outline-variant": "#c3c6d1",
                        "tertiary": "#8a486f",
                        "mint-green": "#A7F3D0",
                        "tertiary-container": "#ea9bc6",
                        "primary-container": "#8ab4f8",
                        "surface-dim": "#dadada"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "base": "4px",
                        "margin-desktop": "40px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-mobile": "16px",
                        "shadow-offset": "8px"
                    },
                    "fontFamily": {
                        "label-sm": ["Archivo Narrow"],
                        "headline-sm": ["Archivo Narrow"],
                        "body-lg": ["Archivo Narrow"],
                        "headline-md": ["Archivo Narrow"],
                        "label-bold": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"],
                        "display-xl": ["Archivo Narrow"],
                        "body-md": ["Archivo Narrow"]
                    },
                    "fontSize": {
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
<style>
        .neo-border { border: 4px solid var(--tw-colors-pure-black, #000); }
        .neo-shadow { box-shadow: 8px 8px 0px 0px rgba(0,0,0,1); }
        .neo-shadow-hover:hover { box-shadow: 10px 10px 0px 0px rgba(0,0,0,1); transform: translate(-2px, -2px); transition: all 0.2s ease; }
        .neo-shadow-active:active { box-shadow: 0px 0px 0px 0px rgba(0,0,0,1); transform: translate(8px, 8px); transition: all 0.1s ease; }
        
        /* Custom scrollbar for neobrutalist look */
        ::-webkit-scrollbar { width: 12px; }
        ::-webkit-scrollbar-track { background: var(--tw-colors-surface-container-lowest, #ffffff); border-left: 4px solid var(--tw-colors-pure-black, #000); }
        ::-webkit-scrollbar-thumb { background: var(--tw-colors-secondary-container, #fdd400); border: 4px solid var(--tw-colors-pure-black, #000); border-right: none; }
        ::-webkit-scrollbar-thumb:hover { background: var(--tw-colors-primary-container, #8ab4f8); }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
<!-- TopNavBar -->
<nav class="flex justify-between items-center w-full px-margin-desktop py-4 bg-background border-b-[4px] border-pure-black z-50 sticky top-0 bg-background dark:bg-background text-primary dark:text-primary-container shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
<div class="font-headline-md text-headline-md uppercase tracking-tighter text-pure-black dark:text-pure-black">
            SPLIT BILL
        </div>
<div class="hidden md:flex items-center gap-6">
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-3 py-2 border-4 border-transparent hover:border-pure-black" href="#">How it Works</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-3 py-2 border-4 border-transparent hover:border-pure-black" href="#">Pricing</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-3 py-2 border-4 border-transparent hover:border-pure-black" href="#">History</a>
</div>
<button class="bg-primary-container text-pure-black neo-border neo-shadow neo-shadow-hover neo-shadow-active font-label-bold text-label-bold uppercase px-6 py-3 transition-all flex items-center gap-2">
            New Split
            <span class="material-symbols-outlined" data-icon="add" data-weight="fill" style="font-variation-settings: 'FILL' 1;">add</span>
</button>
</nav>
<!-- Main Content Canvas -->
<main class="flex-grow p-gutter md:p-margin-desktop flex flex-col gap-gutter max-w-7xl mx-auto w-full">
<header class="mb-4">
<h1 class="font-headline-lg text-headline-lg uppercase text-pure-black mb-2">Dinner at Mario's</h1>
<p class="font-body-lg text-body-lg text-on-surface-variant">Tap an item to assign it to a person.</p>
</header>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-grow">
<!-- Left Column: Receipt Items -->
<section class="lg:col-span-7 flex flex-col gap-4 h-[600px] overflow-y-auto pr-4 pb-4">
<h2 class="font-headline-sm text-headline-sm uppercase border-b-4 border-pure-black pb-2 mb-2 sticky top-0 bg-background z-10">Receipt Items</h2>
<!-- Item Card 1 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4 flex justify-between items-center group cursor-pointer hover:bg-mint-green transition-colors">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Artisanal Pizza</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $18.50
                    </div>
<div class="w-10 h-10 neo-border bg-surface-variant flex items-center justify-center rounded-full group-hover:bg-pure-black group-hover:text-white transition-colors">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
</div>
<!-- Item Card 2 -->
<div class="bg-secondary-container neo-border neo-shadow p-4 flex justify-between items-center cursor-pointer">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Craft Beer</h3>
<p class="font-body-md text-body-md text-on-surface-variant">2x @ $4.00</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $8.00
                    </div>
<div class="flex -space-x-2">
<div class="w-10 h-10 neo-border bg-tertiary-container flex items-center justify-center rounded-full z-20 font-label-bold text-label-bold" title="Alice">A</div>
<div class="w-10 h-10 neo-border bg-primary-container flex items-center justify-center rounded-full z-10 font-label-bold text-label-bold" title="Bob">B</div>
</div>
</div>
<!-- Item Card 3 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4 flex justify-between items-center group cursor-pointer hover:bg-mint-green transition-colors">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Garden Salad</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $12.00
                    </div>
<div class="w-10 h-10 neo-border bg-surface-variant flex items-center justify-center rounded-full group-hover:bg-pure-black group-hover:text-white transition-colors">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
</div>
<!-- Item Card 4 -->
<div class="bg-tertiary-container neo-border neo-shadow p-4 flex justify-between items-center cursor-pointer">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Garlic Bread</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $6.50
                    </div>
<div class="flex -space-x-2">
<div class="w-10 h-10 neo-border bg-tertiary-container flex items-center justify-center rounded-full z-20 font-label-bold text-label-bold" title="Alice">A</div>
</div>
</div>
<!-- Item Card 5 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4 flex justify-between items-center group cursor-pointer hover:bg-mint-green transition-colors">
<div class="flex-grow">
<h3 class="font-label-bold text-label-bold uppercase text-pure-black">Tiramisu</h3>
<p class="font-body-md text-body-md text-on-surface-variant">1x</p>
</div>
<div class="font-headline-sm text-headline-sm mr-4">
                        $9.00
                    </div>
<div class="w-10 h-10 neo-border bg-surface-variant flex items-center justify-center rounded-full group-hover:bg-pure-black group-hover:text-white transition-colors">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
</div>
</div>
</section>
<!-- Right Column: The Party -->
<section class="lg:col-span-5 flex flex-col gap-4">
<div class="flex justify-between items-end border-b-4 border-pure-black pb-2 mb-2">
<h2 class="font-headline-sm text-headline-sm uppercase">The Party</h2>
<button class="bg-secondary-container neo-border px-3 py-1 font-label-bold text-label-bold uppercase flex items-center gap-1 hover:bg-pure-black hover:text-white transition-colors">
<span class="material-symbols-outlined text-sm" data-icon="add">add</span> Person
                    </button>
</div>
<!-- Person Card 1 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4">
<div class="flex justify-between items-center mb-3">
<div class="flex items-center gap-3">
<div class="w-12 h-12 neo-border bg-tertiary-container rounded-full overflow-hidden flex items-center justify-center"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv38dtPaNaVrA7_oxa-60UULHCeZs2QfEVZxekdAm-TnNUH3K8HkjWkt_vQouTaw9PKDbVL0kt16RrehRS6yI-7bDPdqgAx8FumI6rGtMmc1WVCMdBVOIteHXDG8VXyvru6psjOrsFmcxNrADvPyOG_q4-oiP8R9IK7mjJNvWVJVGAAq6tGQRVdOZdT3-hza3Qdt34WFcgYh3u9srVPPARoXGxMK2y9X7RxzQjlYCcGKm-CZyByjPsCg" alt="Apple" class="w-[300%] h-[300%] max-w-none object-none" style="object-position: 10% 10%;"></div>
<h3 class="font-headline-sm text-headline-sm uppercase">Alice</h3>
</div>
<div class="font-headline-sm text-headline-sm">$10.50</div>
</div>
<div class="border-t-4 border-pure-black pt-2 flex flex-wrap gap-2">
<span class="bg-surface-variant neo-border px-2 py-1 font-label-sm text-label-sm">Craft Beer (1/2)</span>
<span class="bg-surface-variant neo-border px-2 py-1 font-label-sm text-label-sm">Garlic Bread</span>
</div>
</div>
<!-- Person Card 2 -->
<div class="bg-surface-container-lowest neo-border neo-shadow p-4">
<div class="flex justify-between items-center mb-3">
<div class="flex items-center gap-3">
<div class="w-12 h-12 neo-border bg-primary-container rounded-full overflow-hidden flex items-center justify-center"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv38dtPaNaVrA7_oxa-60UULHCeZs2QfEVZxekdAm-TnNUH3K8HkjWkt_vQouTaw9PKDbVL0kt16RrehRS6yI-7bDPdqgAx8FumI6rGtMmc1WVCMdBVOIteHXDG8VXyvru6psjOrsFmcxNrADvPyOG_q4-oiP8R9IK7mjJNvWVJVGAAq6tGQRVdOZdT3-hza3Qdt34WFcgYh3u9srVPPARoXGxMK2y9X7RxzQjlYCcGKm-CZyByjPsCg" alt="Banana" class="w-[300%] h-[300%] max-w-none object-none" style="object-position: 50% 10%;"></div>
<h3 class="font-headline-sm text-headline-sm uppercase">Bob</h3>
</div>
<div class="font-headline-sm text-headline-sm">$4.00</div>
</div>
<div class="border-t-4 border-pure-black pt-2 flex flex-wrap gap-2">
<span class="bg-surface-variant neo-border px-2 py-1 font-label-sm text-label-sm">Craft Beer (1/2)</span>
</div>
</div>
<!-- Unassigned Summary Block -->
<div class="bg-error-container neo-border p-4 mt-auto">
<div class="flex justify-between items-center">
<h3 class="font-label-bold text-label-bold uppercase text-on-error-container">Unassigned Items</h3>
<div class="font-headline-sm text-headline-sm text-on-error-container">$39.50</div>
</div>
</div>
</section>
</div>
<!-- Sticky Bottom Summary / Actions -->
<section class="mt-8 bg-surface-container-lowest border-4 border-pure-black p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] sticky bottom-4 z-40">
<div class="flex gap-8 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
<div class="flex flex-col">
<span class="font-label-bold text-label-bold uppercase text-on-surface-variant">Subtotal</span>
<span class="font-headline-sm text-headline-sm">$54.00</span>
</div>
<div class="flex flex-col">
<span class="font-label-bold text-label-bold uppercase text-on-surface-variant">Tax (8%)</span>
<span class="font-headline-sm text-headline-sm">$4.32</span>
</div>
<div class="flex flex-col">
<span class="font-label-bold text-label-bold uppercase text-on-surface-variant">Tip (20%)</span>
<span class="font-headline-sm text-headline-sm">$10.80</span>
</div>
</div>
<div class="flex items-center gap-6 w-full md:w-auto border-t-4 border-pure-black pt-4 md:border-t-0 md:pt-0 md:border-l-4 md:pl-6">
<div class="flex flex-col mr-4">
<span class="font-label-bold text-label-bold uppercase text-pure-black">Total</span>
<span class="font-headline-md text-headline-md">$69.12</span>
</div>
<button class="bg-mint-green text-pure-black neo-border neo-shadow neo-shadow-hover neo-shadow-active font-headline-sm text-headline-sm uppercase px-8 py-4 transition-all w-full md:w-auto flex-shrink-0">
                    Settle Up
                </button>
</div>
</section>
</main>
<!-- Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-8 gap-gutter bg-pure-black dark:bg-pure-black text-surface-lowest dark:text-surface-lowest border-t-[4px] border-pure-black mt-auto">
<div class="font-headline-sm text-headline-sm text-surface-lowest">
            © 2024 SPLIT BILL. NO MERCY FOR NON-PAYERS.
        </div>
<div class="flex gap-4">
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">Terms</a>
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">Privacy</a>
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">Contact</a>
<a class="text-surface-variant hover:text-secondary-container hover:underline decoration-2 transition-all duration-200 font-label-sm text-label-sm" href="#">API</a>
</div>
</footer>


</body></html>

<!-- Split Sheet - Standardized Typography -->
<!DOCTYPE html><html class="light" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Settle Up - SPLIT BILL</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400..700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-background": "#1a1c1c",
                        "on-primary": "#ffffff",
                        "tertiary-container": "#ea9bc6",
                        "primary": "#315f9d",
                        "primary-container": "#8ab4f8",
                        "on-surface-variant": "#424750",
                        "tertiary": "#8a486f",
                        "mint-green": "#A7F3D0",
                        "secondary-fixed": "#ffe170",
                        "error": "#ba1a1a",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-container": "#0d4582",
                        "surface-dim": "#dadada",
                        "on-secondary-fixed": "#221b00",
                        "secondary": "#705d00",
                        "on-tertiary-fixed": "#3a0329",
                        "primary-fixed": "#d5e3ff",
                        "inverse-on-surface": "#f0f1f1",
                        "primary-fixed-dim": "#a8c8ff",
                        "on-secondary-fixed-variant": "#544600",
                        "surface-container-highest": "#e2e2e2",
                        "surface-container-high": "#e8e8e8",
                        "on-tertiary": "#ffffff",
                        "on-primary-fixed-variant": "#114784",
                        "on-secondary-container": "#6f5c00",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "on-error": "#ffffff",
                        "inverse-surface": "#2f3131",
                        "surface-container-low": "#f3f3f4",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9",
                        "tertiary-fixed": "#ffd8ea",
                        "tertiary-fixed-dim": "#ffaeda",
                        "secondary-fixed-dim": "#e9c400",
                        "on-primary-fixed": "#001b3c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-variant": "#e2e2e2",
                        "outline": "#737781",
                        "on-surface": "#1a1c1c",
                        "surface-container": "#eeeeee",
                        "outline-variant": "#c3c6d1",
                        "pure-black": "#000000",
                        "on-error-container": "#93000a",
                        "secondary-container": "#fdd400",
                        "on-secondary": "#ffffff",
                        "background": "#f9f9f9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "border-width": "4px",
                        "margin-desktop": "40px",
                        "gutter": "24px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "shadow-offset": "8px"
                    },
                    "fontFamily": {
                        "headline-sm": ["Archivo Narrow"],
                        "display-xl": ["Archivo Narrow"],
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "headline-lg": ["Archivo Narrow"],
                        "body-lg": ["Inter"],
                        "label-bold": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-image: radial-gradient(#dadada 2px, transparent 2px);
            background-size: 24px 24px;
        }
        .neobrutalist-shadow {
            box-shadow: var(--spacing-shadow-offset) var(--spacing-shadow-offset) 0px 0px rgba(0, 0, 0, 1);
        }
        .neobrutalist-shadow:hover {
            box-shadow: calc(var(--spacing-shadow-offset) + 2px) calc(var(--spacing-shadow-offset) + 2px) 0px 0px rgba(0, 0, 0, 1);
            transform: translate(-2px, -2px);
        }
        .neobrutalist-shadow:active {
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
            transform: translate(var(--spacing-shadow-offset), var(--spacing-shadow-offset));
        }
        .transition-neo {
            transition: all 0.15s ease-out;
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md">
<!-- TopNavBar -->
<header class="flex justify-between items-center w-full px-margin-desktop py-4 bg-background border-b-[4px] border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50">
<div class="font-headline-md text-headline-md uppercase tracking-tighter text-pure-black">
            SPLIT BILL
        </div>
<nav class="hidden md:flex gap-gutter items-center">
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black" href="#">How it Works</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black" href="#">Pricing</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black" href="#">History</a>
<button class="bg-primary-container text-pure-black font-label-bold text-label-bold border-[4px] border-pure-black px-6 py-2 uppercase neobrutalist-shadow transition-neo">
                New Split
            </button>
</nav>
<button class="md:hidden flex items-center justify-center p-2 border-[4px] border-pure-black bg-secondary-container neobrutalist-shadow">
<span class="material-symbols-outlined" data-weight="fill" style="font-variation-settings: 'FILL' 1;">menu</span>
</button>
</header>
<!-- Main Content -->
<main class="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop gap-12 max-w-5xl mx-auto w-full my-12">
<!-- Header -->
<div class="text-center w-full flex flex-col items-center gap-4">
<div class="inline-block bg-mint-green border-[4px] border-pure-black px-4 py-2 mb-2 neobrutalist-shadow rotate-[-2deg]">
<span class="font-headline-sm text-headline-sm uppercase text-pure-black tracking-widest">SUCCESS</span>
</div>
<h1 class="font-display-xl text-display-xl text-pure-black uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                BILL SETTLED
            </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl bg-surface-container-lowest p-4 border-[4px] border-pure-black neobrutalist-shadow">
                The dinner at <span class="font-label-bold text-label-bold text-pure-black">Luigi's Trattoria</span> has been successfully split. Here is the final summary.
            </p>
</div>
<!-- Summary Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full mt-8">
<!-- Alice's Card -->
<div class="bg-tertiary-container border-[4px] border-pure-black p-8 flex flex-col gap-6 neobrutalist-shadow transition-neo relative overflow-hidden group hover:rotate-1">
<div class="absolute -right-12 -top-12 w-48 h-48 bg-pure-black opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
<div class="flex justify-between items-start relative z-10">
<div class="flex items-center gap-4">
<img class="w-16 h-16 border-[4px] border-pure-black object-cover bg-surface-container-lowest shadow-[4px_4px_0_0_#000]" data-alt="Neobrutalist Apple avatar for Alice" src="https://lh3.googleusercontent.com/aida/AP1WRLsgPl4Tf3KC_BSTh-zIR0SVDcwytFwFtZiB_Qalhy520xKYm69nmk3B3_oXrqDNS5d93TYLAKnxj0aZD3GHuiNFDFJiPNW3MZaPiB-EuqPqq-TDjHj8ErPapYVueF64QiAwZ5YCxiX5_SiWJGEgFpXq57KU36JBmOy1bkJopGtKDrDiuHvvOnAk3rKe5q7buxTxZ8Ww3Qp3IhqJKIHq_24jnjojTthp-7gSPtTVtrfRj-rK7Z2UMHjLE9_Z">
<h2 class="font-headline-lg text-headline-lg text-pure-black uppercase">ALICE</h2>
</div>
<span class="material-symbols-outlined text-4xl text-pure-black">account_balance_wallet</span>
</div>
<div class="bg-surface-container-lowest border-[4px] border-pure-black p-6 shadow-[4px_4px_0_0_#000] relative z-10">
<div class="text-sm font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Total Owed</div>
<div class="font-display-xl text-display-xl text-pure-black">$34.56</div>
<div class="w-full h-[4px] bg-pure-black my-4"></div>
<div class="flex justify-between items-center font-label-bold text-label-bold text-pure-black">
<span class="">Status</span>
<span class="bg-secondary-container px-3 py-1 border-[4px] border-pure-black uppercase">Pending</span>
</div>
</div>
</div>
<!-- Bob's Card -->
<div class="bg-primary-container border-[4px] border-pure-black p-8 flex flex-col gap-6 neobrutalist-shadow transition-neo relative overflow-hidden group hover:-rotate-1">
<div class="absolute -right-12 -bottom-12 w-48 h-48 bg-pure-black opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
<div class="flex justify-between items-start relative z-10">
<div class="flex items-center gap-4">
<img class="w-16 h-16 border-[4px] border-pure-black object-cover bg-surface-container-lowest shadow-[4px_4px_0_0_#000]" data-alt="Neobrutalist Banana avatar for Bob" src="https://lh3.googleusercontent.com/aida/AP1WRLsgPl4Tf3KC_BSTh-zIR0SVDcwytFwFtZiB_Qalhy520xKYm69nmk3B3_oXrqDNS5d93TYLAKnxj0aZD3GHuiNFDFJiPNW3MZaPiB-EuqPqq-TDjHj8ErPapYVueF64QiAwZ5YCxiX5_SiWJGEgFpXq57KU36JBmOy1bkJopGtKDrDiuHvvOnAk3rKe5q7buxTxZ8Ww3Qp3IhqJKIHq_24jnjojTthp-7gSPtTVtrfRj-rK7Z2UMHjLE9_Z">
<h2 class="font-headline-lg text-headline-lg text-pure-black uppercase">BOB</h2>
</div>
<span class="material-symbols-outlined text-4xl text-pure-black">payments</span>
</div>
<div class="bg-surface-container-lowest border-[4px] border-pure-black p-6 shadow-[4px_4px_0_0_#000] relative z-10">
<div class="text-sm font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Total Owed</div>
<div class="font-display-xl text-display-xl text-pure-black">$34.56</div>
<div class="w-full h-[4px] bg-pure-black my-4"></div>
<div class="flex justify-between items-center font-label-bold text-label-bold text-pure-black">
<span class="">Status</span>
<span class="bg-secondary-container px-3 py-1 border-[4px] border-pure-black uppercase">Pending</span>
</div>
</div>
</div>
</div>
<!-- Action Section -->
<div class="mt-12 flex flex-col md:flex-row gap-6 w-full justify-center items-center max-w-2xl">
<button class="w-full md:w-auto bg-surface-container-lowest text-pure-black border-[4px] border-pure-black py-4 px-8 font-headline-md text-headline-md uppercase neobrutalist-shadow transition-neo flex items-center justify-center gap-4 hover:bg-surface-variant">
<span class="material-symbols-outlined">share</span>
                SHARE
            </button>
<button class="w-full md:w-auto flex-grow bg-secondary-fixed text-pure-black border-[4px] border-pure-black py-4 px-8 font-headline-md text-headline-md uppercase neobrutalist-shadow transition-neo flex items-center justify-center gap-4">
                START NEW SPLIT
                <span class="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</main>
<!-- Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-8 gap-gutter bg-pure-black border-t-[4px] border-pure-black mt-auto">
<div class="font-headline-sm text-headline-sm text-surface-lowest">
            © 2024 SPLIT BILL. NO MERCY FOR NON-PAYERS.
        </div>
<nav class="flex gap-gutter items-center flex-wrap justify-center">
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">Terms</a>
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">Privacy</a>
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">Contact</a>
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">API</a>
</nav>
</footer>


</body></html>

<!-- Settle Up - Desktop -->
<!DOCTYPE html><html class="light" lang="en" style=""><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Settle Up - SPLIT BILL</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400..700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-background": "#1a1c1c",
                        "on-primary": "#ffffff",
                        "tertiary-container": "#ea9bc6",
                        "primary": "#315f9d",
                        "primary-container": "#8ab4f8",
                        "on-surface-variant": "#424750",
                        "tertiary": "#8a486f",
                        "mint-green": "#A7F3D0",
                        "secondary-fixed": "#ffe170",
                        "error": "#ba1a1a",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-container": "#0d4582",
                        "surface-dim": "#dadada",
                        "on-secondary-fixed": "#221b00",
                        "secondary": "#705d00",
                        "on-tertiary-fixed": "#3a0329",
                        "primary-fixed": "#d5e3ff",
                        "inverse-on-surface": "#f0f1f1",
                        "primary-fixed-dim": "#a8c8ff",
                        "on-secondary-fixed-variant": "#544600",
                        "surface-container-highest": "#e2e2e2",
                        "surface-container-high": "#e8e8e8",
                        "on-tertiary": "#ffffff",
                        "on-primary-fixed-variant": "#114784",
                        "on-secondary-container": "#6f5c00",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "on-error": "#ffffff",
                        "inverse-surface": "#2f3131",
                        "surface-container-low": "#f3f3f4",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9",
                        "tertiary-fixed": "#ffd8ea",
                        "tertiary-fixed-dim": "#ffaeda",
                        "secondary-fixed-dim": "#e9c400",
                        "on-primary-fixed": "#001b3c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-variant": "#e2e2e2",
                        "outline": "#737781",
                        "on-surface": "#1a1c1c",
                        "surface-container": "#eeeeee",
                        "outline-variant": "#c3c6d1",
                        "pure-black": "#000000",
                        "on-error-container": "#93000a",
                        "secondary-container": "#fdd400",
                        "on-secondary": "#ffffff",
                        "background": "#f9f9f9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "border-width": "4px",
                        "margin-desktop": "40px",
                        "gutter": "24px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "shadow-offset": "8px"
                    },
                    "fontFamily": {
                        "headline-sm": ["Archivo Narrow"],
                        "display-xl": ["Archivo Narrow"],
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "headline-lg": ["Archivo Narrow"],
                        "body-lg": ["Inter"],
                        "label-bold": ["Inter"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-image: radial-gradient(#dadada 2px, transparent 2px);
            background-size: 24px 24px;
        }
        .neobrutalist-shadow {
            box-shadow: var(--spacing-shadow-offset) var(--spacing-shadow-offset) 0px 0px rgba(0, 0, 0, 1);
        }
        .neobrutalist-shadow:hover {
            box-shadow: calc(var(--spacing-shadow-offset) + 2px) calc(var(--spacing-shadow-offset) + 2px) 0px 0px rgba(0, 0, 0, 1);
            transform: translate(-2px, -2px);
        }
        .neobrutalist-shadow:active {
            box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 1);
            transform: translate(var(--spacing-shadow-offset), var(--spacing-shadow-offset));
        }
        .transition-neo {
            transition: all 0.15s ease-out;
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col font-body-md text-body-md">
<!-- TopNavBar -->
<header class="flex justify-between items-center w-full px-margin-desktop py-4 bg-background border-b-[4px] border-pure-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50">
<div class="font-headline-md text-headline-md uppercase tracking-tighter text-pure-black">
            SPLIT BILL
        </div>
<nav class="hidden md:flex gap-gutter items-center">
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black" href="#">How it Works</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black" href="#">Pricing</a>
<a class="text-pure-black hover:bg-surface-variant transition-colors font-label-bold text-label-bold px-4 py-2 border-[4px] border-transparent hover:border-pure-black" href="#">History</a>
<button class="bg-primary-container text-pure-black font-label-bold text-label-bold border-[4px] border-pure-black px-6 py-2 uppercase neobrutalist-shadow transition-neo">
                New Split
            </button>
</nav>
<button class="md:hidden flex items-center justify-center p-2 border-[4px] border-pure-black bg-secondary-container neobrutalist-shadow">
<span class="material-symbols-outlined" data-weight="fill" style="font-variation-settings: 'FILL' 1;">menu</span>
</button>
</header>
<!-- Main Content -->
<main class="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop gap-12 max-w-5xl mx-auto w-full my-12">
<!-- Header -->
<div class="text-center w-full flex flex-col items-center gap-4">
<div class="inline-block bg-mint-green border-[4px] border-pure-black px-4 py-2 mb-2 neobrutalist-shadow rotate-[-2deg]">
<span class="font-headline-sm text-headline-sm uppercase text-pure-black tracking-widest">SUCCESS</span>
</div>
<h1 class="font-display-xl text-display-xl text-pure-black uppercase drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
                BILL SETTLED
            </h1>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl bg-surface-container-lowest p-4 border-[4px] border-pure-black neobrutalist-shadow">
                The dinner at <span class="font-label-bold text-label-bold text-pure-black">Luigi's Trattoria</span> has been successfully split. Here is the final summary.
            </p>
</div>
<!-- Summary Cards Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter w-full mt-8">
<!-- Alice's Card -->
<div class="bg-tertiary-container border-[4px] border-pure-black p-8 flex flex-col gap-6 neobrutalist-shadow transition-neo relative overflow-hidden group hover:rotate-1">
<div class="absolute -right-12 -top-12 w-48 h-48 bg-pure-black opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
<div class="flex justify-between items-start relative z-10">
<div class="flex items-center gap-4">
<div class="w-16 h-16 border-[4px] border-pure-black bg-surface-container-lowest shadow-[4px_4px_0_0_#000] flex items-center justify-center text-4xl">🍎</div>
<h2 class="font-headline-lg text-headline-lg text-pure-black uppercase">ALICE</h2>
</div>
<span class="material-symbols-outlined text-4xl text-pure-black">account_balance_wallet</span>
</div>
<div class="bg-surface-container-lowest border-[4px] border-pure-black p-6 shadow-[4px_4px_0_0_#000] relative z-10">
<div class="text-sm font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Total Owed</div>
<div class="font-display-xl text-display-xl text-pure-black">$34.56</div>
<div class="w-full h-[4px] bg-pure-black my-4"></div>
<div class="flex justify-between items-center font-label-bold text-label-bold text-pure-black">
<span class="">Status</span>
<span class="bg-secondary-container px-3 py-1 border-[4px] border-pure-black uppercase">Pending</span>
</div>
</div>
</div>
<!-- Bob's Card -->
<div class="bg-primary-container border-[4px] border-pure-black p-8 flex flex-col gap-6 neobrutalist-shadow transition-neo relative overflow-hidden group hover:-rotate-1">
<div class="absolute -right-12 -bottom-12 w-48 h-48 bg-pure-black opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
<div class="flex justify-between items-start relative z-10">
<div class="flex items-center gap-4">
<div class="w-16 h-16 border-[4px] border-pure-black bg-surface-container-lowest shadow-[4px_4px_0_0_#000] flex items-center justify-center text-4xl">🍌</div>
<h2 class="font-headline-lg text-headline-lg text-pure-black uppercase">BOB</h2>
</div>
<span class="material-symbols-outlined text-4xl text-pure-black">payments</span>
</div>
<div class="bg-surface-container-lowest border-[4px] border-pure-black p-6 shadow-[4px_4px_0_0_#000] relative z-10">
<div class="text-sm font-label-bold text-label-bold text-on-surface-variant uppercase mb-2">Total Owed</div>
<div class="font-display-xl text-display-xl text-pure-black">$34.56</div>
<div class="w-full h-[4px] bg-pure-black my-4"></div>
<div class="flex justify-between items-center font-label-bold text-label-bold text-pure-black">
<span class="">Status</span>
<span class="bg-secondary-container px-3 py-1 border-[4px] border-pure-black uppercase">Pending</span>
</div>
</div>
</div>
</div>
<!-- Action Section -->
<div class="mt-12 flex flex-col md:flex-row gap-6 w-full justify-center items-center max-w-2xl">
<button class="w-full md:w-auto bg-surface-container-lowest text-pure-black border-[4px] border-pure-black py-4 px-8 font-headline-md text-headline-md uppercase neobrutalist-shadow transition-neo flex items-center justify-center gap-4 hover:bg-surface-variant">
<span class="material-symbols-outlined">share</span>
                SHARE
            </button>
<button class="w-full md:w-auto flex-grow bg-secondary-fixed text-pure-black border-[4px] border-pure-black py-4 px-8 font-headline-md text-headline-md uppercase neobrutalist-shadow transition-neo flex items-center justify-center gap-4">
                START NEW SPLIT
                <span class="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</main>
<!-- Footer -->
<footer class="flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-8 gap-gutter bg-pure-black border-t-[4px] border-pure-black mt-auto">
<div class="font-headline-sm text-headline-sm text-surface-lowest">
            © 2024 SPLIT BILL. NO MERCY FOR NON-PAYERS.
        </div>
<nav class="flex gap-gutter items-center flex-wrap justify-center">
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">Terms</a>
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">Privacy</a>
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">Contact</a>
<a class="text-surface-variant hover:text-white transition-colors duration-200 font-label-sm text-label-sm hover:text-secondary-container underline decoration-2" href="#">API</a>
</nav>
</footer>
</body></html>

<!-- Settle Up - Emoji Avatars -->
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Splitwise Neo - Landing Screen</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed": "#001b3c",
                        "secondary-fixed-dim": "#e9c400",
                        "secondary-container": "#fdd400",
                        "tertiary-container": "#ea9bc6",
                        "tertiary-fixed-dim": "#ffaeda",
                        "inverse-on-surface": "#f0f1f1",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-container": "#eeeeee",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-secondary-fixed-variant": "#544600",
                        "primary-container": "#8ab4f8",
                        "on-surface": "#1a1c1c",
                        "surface-variant": "#e2e2e2",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f3f3f4",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "surface-container-highest": "#e2e2e2",
                        "on-background": "#1a1c1c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "secondary": "#705d00",
                        "tertiary-fixed": "#ffd8ea",
                        "primary": "#315f9d",
                        "on-tertiary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-error-container": "#93000a",
                        "outline": "#737781",
                        "on-primary-fixed-variant": "#114784",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#c3c6d1",
                        "surface-container-high": "#e8e8e8",
                        "mint-green": "#A7F3D0",
                        "on-surface-variant": "#424750",
                        "pure-black": "#000000",
                        "error": "#ba1a1a",
                        "background": "#f9f9f9",
                        "on-tertiary-fixed": "#3a0329",
                        "on-secondary-container": "#6f5c00",
                        "on-secondary": "#ffffff",
                        "on-primary": "#ffffff",
                        "primary-fixed-dim": "#a8c8ff",
                        "surface-dim": "#dadada",
                        "tertiary": "#8a486f",
                        "on-secondary-fixed": "#221b00",
                        "secondary-fixed": "#ffe170",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "shadow-offset": "8px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-desktop": "40px"
                    },
                    "fontFamily": {
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display-xl": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "headline-sm": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"]
                    },
                    "fontSize": {
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
<!-- TopAppBar -->
<header class="w-full top-0 sticky flex justify-between items-center px-margin-mobile py-4 bg-background z-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-b-4 border-pure-black">
<button class="flex items-center justify-center p-2 border-2 border-pure-black bg-surface-container-lowest hover:bg-mint-green hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-2 active:translate-y-2 transition-all">
<span class="material-symbols-outlined text-primary dark:text-primary-fixed" data-icon="menu">menu</span>
</button>
<h1 class="font-headline-sm text-headline-sm text-pure-black dark:text-inverse-on-surface uppercase tracking-tighter">SPLIT BILL</h1>
<button class="flex items-center justify-center p-1 border-2 border-pure-black bg-secondary-container hover:bg-surface-container-high hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-2 active:translate-y-2 transition-all rounded-full overflow-hidden w-10 h-10">
<span class="material-symbols-outlined text-pure-black" data-icon="user_profile_sticker">person</span>
</button>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow flex flex-col px-margin-mobile py-8 gap-8 overflow-y-auto">
<!-- Hero Actions -->
<section class="flex flex-col gap-6 mt-4">
<button class="w-full bg-primary-container border-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all p-6 flex flex-col items-center justify-center gap-4 group">
<span class="material-symbols-outlined text-6xl text-pure-black group-hover:scale-110 transition-transform" data-icon="photo_camera" style="font-variation-settings: 'FILL' 1;">photo_camera</span>
<span class="font-headline-md text-headline-md text-pure-black uppercase text-center leading-tight">PHOTOGRAPH<br>RECEIPT</span>
</button>
<button class="w-full bg-surface-container-lowest border-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:bg-mint-green active:translate-x-2 active:translate-y-2 active:shadow-none transition-all p-4 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-pure-black" data-icon="edit_document">edit_document</span>
<span class="font-headline-sm text-headline-sm text-pure-black uppercase">ENTER MANUALLY</span>
</button>
</section>
<!-- How it Works Section -->
<section class="mt-8 flex flex-col gap-4">
<h2 class="font-headline-md text-headline-md text-pure-black uppercase border-b-4 border-pure-black pb-2 inline-block self-start">How It Works</h2>
<div class="flex flex-col gap-4">
<!-- Step 1 -->
<div class="bg-surface-container-lowest border-4 border-pure-black p-4 flex items-center gap-4 relative overflow-hidden group hover:bg-tertiary-fixed transition-colors">
<div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-9xl text-pure-black" data-icon="photo_camera">photo_camera</span>
</div>
<div class="w-12 h-12 bg-mint-green border-4 border-pure-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
<span class="font-headline-sm text-headline-sm text-pure-black">1</span>
</div>
<div class="z-10">
<h3 class="font-headline-sm text-headline-sm text-pure-black uppercase">Snap a Photo</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Take a clear picture of your receipt.</p>
</div>
</div>
<!-- Step 2 -->
<div class="bg-surface-container-lowest border-4 border-pure-black p-4 flex items-center gap-4 relative overflow-hidden group hover:bg-secondary-container transition-colors">
<div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-9xl text-pure-black" data-icon="group_add">group_add</span>
</div>
<div class="w-12 h-12 bg-tertiary-container border-4 border-pure-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
<span class="font-headline-sm text-headline-sm text-pure-black">2</span>
</div>
<div class="z-10">
<h3 class="font-headline-sm text-headline-sm text-pure-black uppercase">Tag Friends</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Assign items to whoever ordered them.</p>
</div>
</div>
<!-- Step 3 -->
<div class="bg-surface-container-lowest border-4 border-pure-black p-4 flex items-center gap-4 relative overflow-hidden group hover:bg-primary-container transition-colors">
<div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="material-symbols-outlined text-9xl text-pure-black" data-icon="payments">payments</span>
</div>
<div class="w-12 h-12 bg-secondary-fixed-dim border-4 border-pure-black flex items-center justify-center shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
<span class="font-headline-sm text-headline-sm text-pure-black">3</span>
</div>
<div class="z-10">
<h3 class="font-headline-sm text-headline-sm text-pure-black uppercase">Split Fairly</h3>
<p class="font-body-md text-body-md text-on-surface-variant">Math is done instantly. Settle up.</p>
</div>
</div>
</div>
</section>
<!-- Decorative spacer for bottom nav -->
<div class="h-24 w-full md:hidden"></div>
</main>
<!-- BottomNavBar (Mobile Only) -->
<nav class="flex justify-around items-center w-full px-2 py-3 bg-background fixed bottom-0 z-50 md:hidden border-t-4 border-pure-black">
<!-- SCAN (Active) -->
<button class="flex flex-col items-center justify-center bg-secondary-container text-pure-black font-label-bold p-2 border-2 border-pure-black w-20 h-16 hover:bg-surface-container-high transition-colors active:scale-95">
<span class="material-symbols-outlined mb-1" data-icon="photo_camera" style="font-variation-settings: 'FILL' 1;">photo_camera</span>
<span class="font-label-sm text-label-sm uppercase">SCAN</span>
</button>
<!-- HISTORY (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-20 h-16 hover:bg-surface-container-high transition-colors active:scale-95 border-2 border-transparent">
<span class="material-symbols-outlined mb-1" data-icon="receipt_long">receipt_long</span>
<span class="font-label-sm text-label-sm uppercase">HISTORY</span>
</button>
<!-- GROUPS (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-20 h-16 hover:bg-surface-container-high transition-colors active:scale-95 border-2 border-transparent">
<span class="material-symbols-outlined mb-1" data-icon="groups">groups</span>
<span class="font-label-sm text-label-sm uppercase">GROUPS</span>
</button>
<!-- SETTLE (Inactive) -->
<button class="flex flex-col items-center justify-center text-on-surface-variant p-2 w-20 h-16 hover:bg-surface-container-high transition-colors active:scale-95 border-2 border-transparent">
<span class="material-symbols-outlined mb-1" data-icon="payments">payments</span>
<span class="font-label-sm text-label-sm uppercase">SETTLE</span>
</button>
</nav>


</body></html>

<!-- Start Screen - Mobile -->
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Splitwise Neo - Capture Receipt</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed": "#001b3c",
                        "secondary-fixed-dim": "#e9c400",
                        "secondary-container": "#fdd400",
                        "tertiary-container": "#ea9bc6",
                        "tertiary-fixed-dim": "#ffaeda",
                        "inverse-on-surface": "#f0f1f1",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-container": "#eeeeee",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-secondary-fixed-variant": "#544600",
                        "primary-container": "#8ab4f8",
                        "on-surface": "#1a1c1c",
                        "surface-variant": "#e2e2e2",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f3f3f4",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "surface-container-highest": "#e2e2e2",
                        "on-background": "#1a1c1c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "secondary": "#705d00",
                        "tertiary-fixed": "#ffd8ea",
                        "primary": "#315f9d",
                        "on-tertiary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-error-container": "#93000a",
                        "outline": "#737781",
                        "on-primary-fixed-variant": "#114784",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#c3c6d1",
                        "surface-container-high": "#e8e8e8",
                        "mint-green": "#A7F3D0",
                        "on-surface-variant": "#424750",
                        "pure-black": "#000000",
                        "error": "#ba1a1a",
                        "background": "#f9f9f9",
                        "on-tertiary-fixed": "#3a0329",
                        "on-secondary-container": "#6f5c00",
                        "on-secondary": "#ffffff",
                        "on-primary": "#ffffff",
                        "primary-fixed-dim": "#a8c8ff",
                        "surface-dim": "#dadada",
                        "tertiary": "#8a486f",
                        "on-secondary-fixed": "#221b00",
                        "secondary-fixed": "#ffe170",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "shadow-offset": "8px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-desktop": "40px"
                    },
                    "fontFamily": {
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display-xl": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "headline-sm": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"]
                    },
                    "fontSize": {
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }]
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-background min-h-screen flex flex-col font-body-md text-pure-black relative overflow-x-hidden selection:bg-secondary-container selection:text-pure-black">
<!-- Top App Bar -->
<header class="w-full top-0 sticky border-b-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-background dark:bg-background flex justify-between items-center px-margin-mobile py-4 z-50">
<button aria-label="Menu" class="text-primary dark:text-primary-fixed hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:translate-x-2 active:translate-y-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">menu</span>
</button>
<h1 class="font-headline-sm text-headline-sm text-pure-black dark:text-inverse-on-surface uppercase tracking-tighter">SPLIT BILL</h1>
<div class="w-10 h-10 rounded-full border-4 border-pure-black overflow-hidden bg-mint-green hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:translate-x-2 active:translate-y-2">
<img alt="user_profile_sticker" class="object-cover w-full h-full" data-alt="A stylized neobrutalist 2D sticker avatar of a young user with cool sunglasses and a vibrant green background. High contrast, clean vector art style, flat colors, no shading. Thick black outlines." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDejNCz-w3sIaFG4i7WuGCB6hsZlh7hw8Qm1sW0jLzJQJjeEyj0qmOc_S1Tcxdo_1E7pPYdbVw3g5AedR7RHO4knLc17Kdmq1ti4nkC1yVNqU0iqMyOpQs5LF8gnuaQwSAgflR7uTWf1k3sHaMvY2Mzh9C1veuvFHuUclvQnrymN5TM0O9AyVUP3UAeBn1eBJFEqH5en9nYyPF5sYJun-avCH9lTBMhTYlMTVa1WY0urssvwzhWKtLQLw">
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow flex flex-col p-margin-mobile gap-6 md:hidden">
<section class="flex flex-col gap-4 w-full max-w-md mx-auto pt-4">
<h2 class="font-headline-md text-headline-md uppercase text-center">Capture Receipt</h2>
<!-- Upload Area -->
<label class="relative group cursor-pointer w-full aspect-[3/4] bg-surface-container-lowest border-4 border-pure-black border-dashed flex flex-col items-center justify-center p-8 gap-4 hover:bg-surface-variant transition-colors active:translate-x-1 active:translate-y-1" for="receipt-upload">
<span class="material-symbols-outlined text-6xl text-on-surface-variant" style="font-variation-settings: 'FILL' 0;">upload_file</span>
<div class="text-center">
<p class="font-headline-sm text-headline-sm uppercase text-pure-black">Tap to Upload</p>
<p class="font-body-md text-body-md text-on-surface-variant mt-2">or drag and drop</p>
</div>
<input accept="image/*" capture="environment" class="hidden" id="receipt-upload" type="file">
</label>
<div class="flex items-center gap-4 py-2">
<div class="flex-grow h-1 bg-pure-black"></div>
<span class="font-label-bold text-label-bold uppercase px-2">OR</span>
<div class="flex-grow h-1 bg-pure-black"></div>
</div>
<!-- Action Buttons -->
<button class="w-full bg-primary-container border-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-4 flex justify-center items-center gap-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all" type="button">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">photo_camera</span>
<span class="font-headline-sm text-headline-sm uppercase">Use Webcam</span>
</button>
<button class="w-full bg-surface-container-lowest border-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] px-6 py-4 flex justify-center items-center gap-2 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all mt-2" type="button">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">edit_square</span>
<span class="font-headline-sm text-headline-sm uppercase">Enter Manually</span>
</button>
<p class="font-label-sm text-label-sm uppercase text-on-surface-variant text-center mt-6 tracking-widest border-2 border-pure-black p-2 bg-secondary-container">Your photo is never stored.</p>
</section>
</main>
<!-- Bottom Nav Bar -->
<nav class="fixed bottom-0 w-full z-50 border-t-4 border-pure-black bg-background dark:bg-background flex justify-around items-center px-2 py-3 md:hidden">
<a class="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary text-pure-black font-label-bold p-2 border-2 border-pure-black active:scale-95 transition-transform w-1/4" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">photo_camera</span>
<span class="font-label-sm text-label-sm uppercase">SCAN</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant p-2 hover:bg-surface-container-high transition-colors active:scale-95 transition-transform w-1/4" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">receipt_long</span>
<span class="font-label-sm text-label-sm uppercase">HISTORY</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant p-2 hover:bg-surface-container-high transition-colors active:scale-95 transition-transform w-1/4" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">groups</span>
<span class="font-label-sm text-label-sm uppercase">GROUPS</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant p-2 hover:bg-surface-container-high transition-colors active:scale-95 transition-transform w-1/4" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 0;">payments</span>
<span class="font-label-sm text-label-sm uppercase">SETTLE</span>
</a>
</nav>
<!-- Padding for bottom nav -->
<div class="h-24 md:hidden"></div>


</body></html>

<!-- Capture Receipt - Mobile -->
<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title class="">Parsing Progress - SPLIT BILL</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@100..900&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed": "#001b3c",
                        "secondary-fixed-dim": "#e9c400",
                        "secondary-container": "#fdd400",
                        "tertiary-container": "#ea9bc6",
                        "tertiary-fixed-dim": "#ffaeda",
                        "inverse-on-surface": "#f0f1f1",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-container": "#eeeeee",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-secondary-fixed-variant": "#544600",
                        "primary-container": "#8ab4f8",
                        "on-surface": "#1a1c1c",
                        "surface-variant": "#e2e2e2",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f3f3f4",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "surface-container-highest": "#e2e2e2",
                        "on-background": "#1a1c1c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "secondary": "#705d00",
                        "tertiary-fixed": "#ffd8ea",
                        "primary": "#315f9d",
                        "on-tertiary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-error-container": "#93000a",
                        "outline": "#737781",
                        "on-primary-fixed-variant": "#114784",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#c3c6d1",
                        "surface-container-high": "#e8e8e8",
                        "mint-green": "#A7F3D0",
                        "on-surface-variant": "#424750",
                        "pure-black": "#000000",
                        "error": "#ba1a1a",
                        "background": "#f9f9f9",
                        "on-tertiary-fixed": "#3a0329",
                        "on-secondary-container": "#6f5c00",
                        "on-secondary": "#ffffff",
                        "on-primary": "#ffffff",
                        "primary-fixed-dim": "#a8c8ff",
                        "surface-dim": "#dadada",
                        "tertiary": "#8a486f",
                        "on-secondary-fixed": "#221b00",
                        "secondary-fixed": "#ffe170",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "shadow-offset": "8px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-desktop": "40px"
                    },
                    "fontFamily": {
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display-xl": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "headline-sm": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"]
                    },
                    "fontSize": {
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24;
        }
        @keyframes custom-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-custom-spin {
            animation: custom-spin 2s linear infinite;
        }
        @keyframes pulse-bg {
            0%, 100% { background-color: #fdd400; }
            50% { background-color: #ffe170; }
        }
        .animate-pulse-bg {
            animation: pulse-bg 1.5s ease-in-out infinite;
        }
    </style>
</head>
<body class="bg-surface-variant min-h-screen flex justify-center items-start text-pure-black font-body-md selection:bg-secondary-container selection:text-pure-black">
<!-- Mobile Device Simulator Container -->
<main class="w-full max-w-[400px] min-h-screen bg-background flex flex-col relative overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] border-r-4 border-l-4 border-pure-black sm:my-8 sm:border-y-4 sm:min-h-[800px]">
<!-- Main Content Area (Nav suppressed due to transactional nature) -->
<div class="flex-1 flex flex-col px-margin-mobile pt-12 pb-6 gap-8 z-10 relative">
<!-- Header Section -->
<div class="flex flex-col items-center text-center gap-4 mt-8">
<div class="w-20 h-20 bg-primary-container border-4 border-pure-black rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse-bg">
<span class="material-symbols-outlined text-[40px] text-pure-black animate-custom-spin" data-icon="document_scanner">document_scanner</span>
</div>
<h1 class="font-headline-md text-headline-md uppercase tracking-tight mt-4">
                    Reading Your<br>Receipt...
                </h1>
</div>
<!-- Progress Bar -->
<div class="flex flex-col gap-2 w-full mt-4">
<div class="flex justify-between items-end">
<span class="font-label-bold text-label-bold uppercase">Processing</span>
<span class="font-label-bold text-label-bold text-outline">58%</span>
</div>
<div class="w-full h-8 border-4 border-pure-black bg-surface-container-lowest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
<div class="absolute top-0 left-0 h-full bg-secondary-container border-r-4 border-pure-black w-[58%]">
<!-- Striped pattern for brutalist feel -->
<div class="w-full h-full opacity-20" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px);"></div>
</div>
</div>
</div>
<!-- Checklist Card -->
<div class="bg-surface-container-lowest border-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mt-4 flex flex-col gap-5">
<!-- Item 1: Done -->
<div class="flex items-center gap-4">
<div class="w-8 h-8 border-4 border-pure-black bg-mint-green flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[20px]" data-icon="check">check</span>
</div>
<span class="font-body-md text-body-md line-through text-outline">Scanning image quality</span>
</div>
<div class="w-full h-1 bg-pure-black opacity-10"></div>
<!-- Item 2: Done -->
<div class="flex items-center gap-4">
<div class="w-8 h-8 border-4 border-pure-black bg-mint-green flex items-center justify-center shrink-0">
<span class="material-symbols-outlined text-[20px]" data-icon="check">check</span>
</div>
<span class="font-body-md text-body-md line-through text-outline">Extracting line items</span>
</div>
<div class="w-full h-1 bg-pure-black opacity-10"></div>
<!-- Item 3: In Progress -->
<div class="flex items-center gap-4 bg-secondary-container -mx-2 px-2 py-1 border-2 border-pure-black">
<div class="w-8 h-8 border-4 border-pure-black bg-surface-container-lowest flex items-center justify-center shrink-0 animate-custom-spin">
<span class="material-symbols-outlined text-[20px]" data-icon="sync">sync</span>
</div>
<span class="font-body-lg text-body-lg font-bold">Identifying taxes &amp; tips</span>
</div>
<div class="w-full h-1 bg-pure-black opacity-10"></div>
<!-- Item 4: Pending -->
<div class="flex items-center gap-4 opacity-50">
<div class="w-8 h-8 border-4 border-pure-black bg-surface-container-lowest shrink-0"></div>
<span class="font-body-md text-body-md">Preparing your split sheet</span>
</div>
</div>
<!-- Footer / Action -->
<div class="mt-auto pt-8">
<button class="w-full bg-surface-container-lowest border-4 border-pure-black text-pure-black font-label-bold text-label-bold uppercase py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 active:translate-x-2 active:translate-y-2 active:shadow-none transition-all">
                    Cancel Processing
                </button>
</div>
</div>
<!-- Atmospheric Background Element -->
<div class="absolute -bottom-20 -right-20 w-64 h-64 bg-tertiary-container rounded-full blur-3xl opacity-30 z-0 pointer-events-none"></div>
</main>


</body></html>

<!-- Parsing Progress - Mobile -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Split Sheet</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:wght@400;700;900&amp;family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed": "#001b3c",
                        "secondary-fixed-dim": "#e9c400",
                        "secondary-container": "#fdd400",
                        "tertiary-container": "#ea9bc6",
                        "tertiary-fixed-dim": "#ffaeda",
                        "inverse-on-surface": "#f0f1f1",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-container": "#eeeeee",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-secondary-fixed-variant": "#544600",
                        "primary-container": "#8ab4f8",
                        "on-surface": "#1a1c1c",
                        "surface-variant": "#e2e2e2",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f3f3f4",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "surface-container-highest": "#e2e2e2",
                        "on-background": "#1a1c1c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "secondary": "#705d00",
                        "tertiary-fixed": "#ffd8ea",
                        "primary": "#315f9d",
                        "on-tertiary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-error-container": "#93000a",
                        "outline": "#737781",
                        "on-primary-fixed-variant": "#114784",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#c3c6d1",
                        "surface-container-high": "#e8e8e8",
                        "mint-green": "#A7F3D0",
                        "on-surface-variant": "#424750",
                        "pure-black": "#000000",
                        "error": "#ba1a1a",
                        "background": "#f9f9f9",
                        "on-tertiary-fixed": "#3a0329",
                        "on-secondary-container": "#6f5c00",
                        "on-secondary": "#ffffff",
                        "on-primary": "#ffffff",
                        "primary-fixed-dim": "#a8c8ff",
                        "surface-dim": "#dadada",
                        "tertiary": "#8a486f",
                        "on-secondary-fixed": "#221b00",
                        "secondary-fixed": "#ffe170",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9",
                        "flamingo-pink": "#FFB3C6",
                        "cyber-yellow": "#FFD600"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "shadow-offset": "8px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-desktop": "40px"
                    },
                    "fontFamily": {
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display-xl": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "headline-sm": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"]
                    },
                    "fontSize": {
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 24;
        }
        .neo-shadow {
            box-shadow: 8px 8px 0px 0px rgba(0,0,0,1);
        }
        .neo-shadow-sm {
            box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
        }
        .neo-border {
            border: 4px solid #000;
        }
        .neo-interactive:hover {
            box-shadow: 10px 10px 0px 0px rgba(0,0,0,1);
            transform: translate(-2px, -2px);
        }
        .neo-interactive:active {
            box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
            transform: translate(8px, 8px);
        }
        .bg-cyber-yellow { background-color: #FFD600; }
        .bg-flamingo-pink { background-color: #FFB3C6; }
    </style>
</head>
<body class="bg-background text-pure-black font-body-md h-screen flex flex-col selection:bg-cyber-yellow selection:text-pure-black relative overflow-hidden">
<!-- TopAppBar -->
<header class="w-full top-0 sticky bg-background border-b-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center px-margin-mobile py-4 z-50">
<button class="w-12 h-12 neo-border bg-surface-container-lowest flex items-center justify-center neo-interactive transition-all">
<span class="material-symbols-outlined text-2xl text-pure-black" data-icon="arrow_back">arrow_back</span>
</button>
<h1 class="font-headline-sm text-headline-sm text-pure-black uppercase tracking-tighter">SPLIT BILL</h1>
<div class="w-12 h-12 rounded-full neo-border overflow-hidden bg-mint-green neo-shadow-sm">
<img alt="User Profile" class="w-full h-full object-cover" data-alt="A stylized 3D avatar of a futuristic cyberpunk character wearing neon yellow sunglasses and a bold red jacket, set against a solid mint green background in a flat-shaded graphic style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmmyguVeaI6XsTdkr7u-EMlTG5X5aMzT69ryPGCdiJ3IN_n7LkAZW5_tV9TqtzzqJqlwqEEqNwczJDCZaQ3N5JovpkkEJ3cxV7EXPvbvKYRn_13qvfvINsY7edNIc5iUUY-XoRIqVatA1EU9VDFcuxtJmrFQ6-4PmR7f0P9h6q4oJFvdaPy-e6MgX1YVWLbCcHXOR70U8u3qGsKvGk7k5SqWoAxdVTM7XulytR9sx0_cVYRNpUXelPMA">
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 overflow-y-auto pb-32 px-margin-mobile pt-8 space-y-6">
<!-- Header Info -->
<div class="bg-surface-container-lowest p-6 neo-border neo-shadow">
<div class="flex justify-between items-start mb-4">
<h2 class="font-headline-md text-headline-md uppercase">Joe's Pizza</h2>
<div class="bg-mint-green px-3 py-1 neo-border font-label-bold text-label-bold">AUG 24</div>
</div>
<p class="font-body-lg text-body-lg mb-4">Total: $84.50</p>
<div class="flex flex-wrap gap-2">
<div class="w-10 h-10 rounded-full neo-border bg-cyber-yellow flex items-center justify-center font-headline-sm text-headline-sm">A</div>
<div class="w-10 h-10 rounded-full neo-border bg-flamingo-pink flex items-center justify-center font-headline-sm text-headline-sm">B</div>
<div class="w-10 h-10 rounded-full neo-border bg-primary-container flex items-center justify-center font-headline-sm text-headline-sm">C</div>
<button class="w-10 h-10 rounded-full neo-border bg-surface-container-lowest flex items-center justify-center border-dashed neo-interactive">
<span class="material-symbols-outlined" data-icon="add">add</span>
</button>
</div>
</div>
<h3 class="font-headline-sm text-headline-sm uppercase border-b-4 border-pure-black pb-2">Receipt Items</h3>
<!-- Items List -->
<div class="space-y-4">
<!-- Item 1 -->
<div class="bg-surface-container-lowest p-4 neo-border neo-shadow flex items-center justify-between">
<div class="flex-1">
<div class="flex items-center gap-2 mb-1">
<span class="bg-mint-green px-2 py-0.5 neo-border text-xs font-label-bold uppercase">Food</span>
<h4 class="font-headline-sm text-headline-sm uppercase leading-none">Artisanal Pizza</h4>
</div>
<p class="font-body-lg text-body-lg font-bold">$24.00</p>
</div>
<div class="flex items-center gap-2">
<button class="w-12 h-12 rounded-full neo-border bg-surface-container-lowest flex items-center justify-center neo-interactive">
<span class="material-symbols-outlined text-2xl" data-icon="person_add">person_add</span>
</button>
</div>
</div>
<!-- Item 2 -->
<div class="bg-primary-container p-4 neo-border neo-shadow flex items-center justify-between">
<div class="flex-1">
<div class="flex items-center gap-2 mb-1">
<span class="bg-cyber-yellow px-2 py-0.5 neo-border text-xs font-label-bold uppercase">Drinks</span>
<h4 class="font-headline-sm text-headline-sm uppercase leading-none">Craft Beer</h4>
</div>
<p class="font-body-lg text-body-lg font-bold">$12.50</p>
</div>
<div class="flex items-center gap-2">
<div class="flex -space-x-4">
<div class="w-12 h-12 rounded-full neo-border bg-flamingo-pink flex items-center justify-center font-headline-sm text-headline-sm z-10">A</div>
<div class="w-12 h-12 rounded-full neo-border bg-cyber-yellow flex items-center justify-center font-headline-sm text-headline-sm z-20">B</div>
</div>
</div>
</div>
<!-- Item 3 -->
<div class="bg-surface-container-lowest p-4 neo-border neo-shadow flex items-center justify-between">
<div class="flex-1">
<div class="flex items-center gap-2 mb-1">
<span class="bg-mint-green px-2 py-0.5 neo-border text-xs font-label-bold uppercase">Food</span>
<h4 class="font-headline-sm text-headline-sm uppercase leading-none">Garlic Knots</h4>
</div>
<p class="font-body-lg text-body-lg font-bold">$8.00</p>
</div>
<div class="flex items-center gap-2">
<div class="w-12 h-12 rounded-full neo-border bg-primary-container flex items-center justify-center font-headline-sm text-headline-sm">C</div>
</div>
</div>
<!-- Item 4 -->
<div class="bg-surface-container-lowest p-4 neo-border neo-shadow flex items-center justify-between">
<div class="flex-1">
<div class="flex items-center gap-2 mb-1">
<span class="bg-flamingo-pink px-2 py-0.5 neo-border text-xs font-label-bold uppercase">Fee</span>
<h4 class="font-headline-sm text-headline-sm uppercase leading-none">Tax &amp; Tip</h4>
</div>
<p class="font-body-lg text-body-lg font-bold">$40.00</p>
</div>
<div class="flex items-center gap-2">
<button class="bg-cyber-yellow px-4 py-2 neo-border font-label-bold text-label-bold uppercase neo-interactive">Split All</button>
</div>
</div>
</div>
</main>
<!-- Sticky Summary Bar -->
<div class="fixed bottom-0 w-full z-50 bg-background border-t-4 border-pure-black p-margin-mobile flex items-center justify-between shadow-[0px_-8px_0px_0px_rgba(0,0,0,1)] md:hidden">
<div>
<p class="font-label-bold text-label-bold uppercase text-on-surface-variant">Your Share</p>
<p class="font-headline-md text-headline-md">$28.33</p>
</div>
<button class="bg-primary-container px-8 py-4 neo-border font-headline-sm text-headline-sm uppercase text-pure-black neo-interactive">
            SETTLE UP
        </button>
</div>


</body></html>

<!-- Split Sheet - Mobile -->
<!DOCTYPE html><html class="light" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Splitwise Neo - Settle Up</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&amp;family=Inter:wght@400..700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed": "#001b3c",
                        "secondary-fixed-dim": "#e9c400",
                        "secondary-container": "#fdd400",
                        "tertiary-container": "#ea9bc6",
                        "tertiary-fixed-dim": "#ffaeda",
                        "inverse-on-surface": "#f0f1f1",
                        "on-tertiary-container": "#6d2f55",
                        "error-container": "#ffdad6",
                        "surface-container": "#eeeeee",
                        "inverse-surface": "#2f3131",
                        "on-primary-container": "#0d4582",
                        "on-secondary-fixed-variant": "#544600",
                        "primary-container": "#8ab4f8",
                        "on-surface": "#1a1c1c",
                        "surface-variant": "#e2e2e2",
                        "on-error": "#ffffff",
                        "surface-container-low": "#f3f3f4",
                        "on-tertiary-fixed-variant": "#6f3157",
                        "surface-container-highest": "#e2e2e2",
                        "on-background": "#1a1c1c",
                        "surface-bright": "#f9f9f9",
                        "surface-tint": "#315f9d",
                        "secondary": "#705d00",
                        "tertiary-fixed": "#ffd8ea",
                        "primary": "#315f9d",
                        "on-tertiary": "#ffffff",
                        "primary-fixed": "#d5e3ff",
                        "on-error-container": "#93000a",
                        "outline": "#737781",
                        "on-primary-fixed-variant": "#114784",
                        "surface-container-lowest": "#ffffff",
                        "outline-variant": "#c3c6d1",
                        "surface-container-high": "#e8e8e8",
                        "mint-green": "#A7F3D0",
                        "on-surface-variant": "#424750",
                        "pure-black": "#000000",
                        "error": "#ba1a1a",
                        "background": "#f9f9f9",
                        "on-tertiary-fixed": "#3a0329",
                        "on-secondary-container": "#6f5c00",
                        "on-secondary": "#ffffff",
                        "on-primary": "#ffffff",
                        "primary-fixed-dim": "#a8c8ff",
                        "surface-dim": "#dadada",
                        "tertiary": "#8a486f",
                        "on-secondary-fixed": "#221b00",
                        "secondary-fixed": "#ffe170",
                        "inverse-primary": "#a8c8ff",
                        "surface": "#f9f9f9"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "shadow-offset": "8px",
                        "margin-mobile": "16px",
                        "base": "4px",
                        "border-width": "4px",
                        "gutter": "24px",
                        "margin-desktop": "40px"
                    },
                    "fontFamily": {
                        "headline-md": ["Archivo Narrow"],
                        "label-sm": ["Inter"],
                        "body-md": ["Inter"],
                        "body-lg": ["Inter"],
                        "display-xl": ["Archivo Narrow"],
                        "label-bold": ["Inter"],
                        "headline-sm": ["Archivo Narrow"],
                        "headline-lg": ["Archivo Narrow"]
                    },
                    "fontSize": {
                        "headline-md": ["32px", { "lineHeight": "36px", "fontWeight": "900" }],
                        "label-sm": ["12px", { "lineHeight": "16px", "fontWeight": "600" }],
                        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "500" }],
                        "display-xl": ["80px", { "lineHeight": "80px", "letterSpacing": "-0.02em", "fontWeight": "900" }],
                        "label-bold": ["14px", { "lineHeight": "20px", "fontWeight": "700" }],
                        "headline-sm": ["24px", { "lineHeight": "28px", "fontWeight": "900" }],
                        "headline-lg": ["48px", { "lineHeight": "52px", "fontWeight": "900" }]
                    }
                },
            },
        }
    </script>
<style>
        /* Neo-brutalist interaction classes */
        .neo-button {
            transition: all 0.1s ease-in-out;
        }
        .neo-button:hover {
            box-shadow: 10px 10px 0px 0px rgba(0,0,0,1);
        }
        .neo-button:active {
            transform: translate(8px, 8px);
            box-shadow: 0px 0px 0px 0px rgba(0,0,0,1);
        }
        .neo-card {
            transition: all 0.2s ease-in-out;
        }
        .neo-card:hover {
            box-shadow: 10px 10px 0px 0px rgba(0,0,0,1);
        }
    </style>
</head>
<body class="bg-background text-on-background min-h-screen flex flex-col overflow-x-hidden md:hidden">
<!-- TopAppBar -->
<header class="flex justify-between items-center px-margin-mobile py-4 bg-background w-full z-50 w-full top-0 sticky border-b-4 border-pure-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
<button class="flex items-center justify-center p-2 text-primary hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:translate-x-2 active:translate-y-2">
<span class="material-symbols-outlined font-headline-sm text-headline-sm" data-icon="menu">menu</span>
</button>
<h1 class="font-headline-sm text-headline-sm text-pure-black uppercase tracking-tighter text-center">SPLIT BILL</h1>
<div class="flex items-center justify-center p-2 rounded-full border-2 border-pure-black bg-surface-container-highest overflow-hidden w-10 h-10 hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:translate-x-2 active:translate-y-2">
<span class="material-symbols-outlined text-on-surface" data-icon="person">person</span>
</div>
</header>
<!-- Main Content Canvas -->
<main class="flex-grow p-margin-mobile flex flex-col gap-8 pb-32">
<!-- Hero Section / Success Celebration -->
<section class="flex flex-col items-center justify-center pt-8 text-center gap-4">
<div class="bg-mint-green border-border-width border-pure-black px-4 py-1 inline-block uppercase font-label-bold text-label-bold">
                SUCCESS
            </div>
<h2 class="font-headline-lg text-headline-lg text-pure-black uppercase">
                BILL SETTLED
            </h2>
<p class="font-body-lg text-body-lg text-on-surface-variant max-w-xs">
                All outstanding balances for this split have been resolved.
            </p>
</section>
<!-- Participant Summary Cards -->
<section class="flex flex-col gap-6">
<h3 class="font-headline-sm text-headline-sm uppercase text-pure-black border-b-4 border-pure-black pb-2 inline-block self-start">
                Summary
            </h3>
<!-- Card: Alice -->
<div class="neo-card bg-surface-container-lowest border-border-width border-pure-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-16 h-16 bg-primary-container border-border-width border-pure-black flex items-center justify-center font-display-xl text-3xl">
                        🍎
                    </div>
<div class="flex flex-col">
<span class="font-headline-sm text-headline-sm uppercase text-pure-black">Alice</span>
<span class="font-body-md text-body-md text-on-surface-variant">Paid Full Amount</span>
</div>
</div>
<div class="font-headline-sm text-headline-sm text-pure-black">
                    $45.00
                </div>
</div>
<!-- Card: Bob -->
<div class="neo-card bg-surface-container-lowest border-border-width border-pure-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-16 h-16 bg-tertiary-container border-border-width border-pure-black flex items-center justify-center font-display-xl text-3xl">
                        🍌
                    </div>
<div class="flex flex-col">
<span class="font-headline-sm text-headline-sm uppercase text-pure-black">Bob</span>
<span class="font-body-md text-body-md text-on-surface-variant">Paid Full Amount</span>
</div>
</div>
<div class="font-headline-sm text-headline-sm text-pure-black">
                    $22.50
                </div>
</div>
</section>
<!-- Action Buttons -->
<section class="mt-auto flex flex-col gap-4 pt-8">
<button class="neo-button bg-primary-container border-border-width border-pure-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-headline-sm text-headline-sm uppercase text-pure-black flex items-center justify-center gap-2 w-full">
<span class="material-symbols-outlined" data-icon="share">share</span>
                SHARE
            </button>
<button class="neo-button bg-surface-container-lowest border-border-width border-pure-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-headline-sm text-headline-sm uppercase text-pure-black flex items-center justify-center gap-2 w-full">
<span class="material-symbols-outlined" data-icon="add">add</span>
                START NEW SPLIT
            </button>
</section>
</main>
<!-- BottomNavBar -->
<nav class="flex justify-around items-center w-full px-2 py-3 bg-background fixed bottom-0 w-full z-50 border-t-4 border-pure-black">
<a class="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-container-high transition-colors active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined font-headline-md text-headline-md" data-icon="photo_camera">photo_camera</span>
<span class="font-label-sm text-label-sm uppercase">SCAN</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-container-high transition-colors active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined font-headline-md text-headline-md" data-icon="receipt_long">receipt_long</span>
<span class="font-label-sm text-label-sm uppercase">HISTORY</span>
</a>
<a class="flex flex-col items-center justify-center text-on-surface-variant p-2 hover:bg-surface-container-high transition-colors active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined font-headline-md text-headline-md" data-icon="groups">groups</span>
<span class="font-label-sm text-label-sm uppercase">GROUPS</span>
</a>
<a class="flex flex-col items-center justify-center bg-secondary-container text-pure-black font-label-bold p-2 border-2 border-pure-black hover:bg-surface-container-high transition-colors active:scale-95 transition-transform" href="#">
<span class="material-symbols-outlined font-headline-md text-headline-md" data-icon="payments">payments</span>
<span class="font-label-sm text-label-sm uppercase">SETTLE</span>
</a>
</nav>


</body></html>