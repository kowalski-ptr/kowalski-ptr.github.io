---
title: "Ranking platform GPU-cloud do fine-tuningu małych modeli LLM time series (≤200M parametrów)"
description: "Analiza i ranking platform wynajmu GPU pod kątem ceny, jakości i łatwości konfiguracji do fine-tuningu małych modeli time series LLM. Porównanie czasu treningu z CPU AMD Ryzen 7 7700 Pro."
category: "AI"
tags: ["llm", "fine-tuning", "gpu-cloud", "time-series", "vast-ai", "runpod", "lambda", "training", "lang:pl"]
date: 2026-06-21
draft: false
---

# Fine-tuning małych modeli LLM time series — który GPU cloud wybrać?

Jeśli chcesz wytrenować lub dostroić własny model forecasting/time series w klasie ≤200M parametrów (Chronos Base, TimesFM-200M, Lag-Llama, Moirai Small), stoisz przed decyzją: wynająć GPU w chmurze czy trenować lokalnie na CPU? Ten post odpowiada na oba pytania na bazie aktualnych danych z czerwca 2026.

---

## Kontekst: co to są małe modele time series LLM?

Kluczowe modele w przedziale ≤200M parametrów:

| Model | Parametry | Architektura | VRAM (fp16) |
|---|---|---|---|
| **Chronos Mini** | 20M | T5-based | ~0.2 GB |
| **Chronos Small** | 46M | T5-based | ~0.4 GB |
| **Chronos Base** | 200M | T5-based | ~1 GB |
| **TimesFM-2.5** | ~200M | Decoder-only | ~1 GB |
| **Lag-Llama** | ~100M | LLaMA-based | ~0.6 GB |
| **Moirai Small** | 91M | Encoder-based | ~0.5 GB |

Kluczowa obserwacja: **modele ≤200M parametrów mają zaskakująco małe wymagania VRAM**. Do fine-tuningu wystarczy GPU z 8 GB+ VRAM. To oznacza, że możesz korzystać z tanich kart jak RTX 3090 lub RTX 4090, nie potrzebujesz A100 ani H100.

---

## Ranking platform GPU-cloud (cena / jakość / łatwość)

### Metodologia oceny

Kryteria (waga 1-5):
- **Cena** — koszt godziny GPU odpowiedniego do zadania
- **Łatwość startu** — czy da się uruchomić środowisko bez DevOps w < 15 min?
- **Niezawodność** — uptime, przerwy w dostępie do GPU
- **Ekosystem narzędzi** — gotowe szablony (Unsloth, PyTorch, JupyterLab)

---

### #1 Vast.ai — najlepsza cena, wysoka elastyczność

**Ocena ogólna: 8.5/10 (cena: 10/10, łatwość: 6/10, niezawodność: 7/10)**

Vast.ai to marketplace GPU — hostami są osoby prywatne i małe firmy, nie data center. Stąd najtańsze stawki na rynku.

**Ceny aktualne (czerwiec 2026):**
- RTX 3090 (24 GB): **$0.07/godz** — najtaniej na rynku (74% taniej niż RunPod)
- RTX 4090 (24 GB): **$0.27/godz**
- A100 40 GB: **$0.52/godz**
- A100 80 GB: **$0.67/godz**

**Billing: per-sekunda** — płacisz tylko za faktyczny czas, bez zaokrąglania do godziny.

**Wady:**
- UI wymaga chwili nauki — filtrowanie po VRAM, DL-performance score, lokalizacji
- Hosting community: uptime może spaść, host może odłączyć GPU w trakcie sesji (ryzyko przy długich treningach)
- Brak oficjalnych gotowych szablonów (choć nieoficjalne szablony PyTorch/CUDA istnieją)

**Najlepszy dla:** budżetowych eksperymentów, krótkich sesji fine-tuningu (<6h), sytuacji gdy priorytetem jest cena

**Setup dla fine-tuningu 200M modelu:**
```bash
# Wybierz GPU: RTX 3090 lub 4090 (24 GB VRAM wystarczy)
# Filtruj: DL Score > 5.0, CUDA >= 12.1, min reliability 95%
# Użyj szablonu PyTorch lub uruchom własny obraz
pip install unsloth transformers datasets
```

---

### #2 RunPod — najlepszy balans ceny i wygody

**Ocena ogólna: 8.8/10 (cena: 7.5/10, łatwość: 9/10, niezawodność: 8.5/10)**

RunPod to środkowa droga: droższy niż Vast.ai, ale z gotowymi szablonami, stabilnym uptime i interfejsem zaprojektowanym dla ML developerów.

**Ceny aktualne (czerwiec 2026):**
- RTX 3090 (24 GB): **$0.27/godz** (Community Cloud) / $0.44/godz (Secure Cloud)
- RTX 4090 (24 GB): **$0.34/godz** (Community)
- A100 80 GB: brak w danych — typowo $0.79/godz
- H100 SXM: **$1.99/godz**
- L40S (48 GB): $0.72/godz (dobry sweet-spot dla finetuningu)

**Zalety:**
- Gotowe szablony: PyTorch, Jupyter, Unsloth, TGI, vLLM — uruchamiasz jednym kliknięciem
- Kontenerowy model — środowisko persystuje między sesjami (volumes)
- Secure Cloud (własna infrastruktura RunPod) = stabilniejszy uptime niż Community
- REST API do zarządzania podami (dobre do automatyzacji)

**Setup czas:** ~5 minut od rejestracji do działającego JupyterLab

**Najlepszy dla:** pierwszego fine-tuningu, developerów którzy chcą "click and go", projektów wymagających niezawodności

---

### #3 Lambda Labs — najstabilniejszy, najdroższy

**Ocena ogólna: 7.5/10 (cena: 5/10, łatwość: 9.5/10, niezawodność: 10/10)**

Lambda Labs to managed cloud z własną infrastrukturą. Ceny wyższe, ale środowisko akademickie i produkcyjne — zero niespodzianek.

**Ceny aktualne (czerwiec 2026):**
- RTX 4090: **$0.50/godz**
- A100 40 GB: **$1.29/godz**
- A100 80 GB (8x): dostępny jako klastry
- H100: **$2.49-3.44/godz**

**Zalety:**
- Dedykowane instancje — nie marketplace, nie współdzielony sprzęt
- Doskonałe IDE w przeglądarce (JupyterHub), persistentne filesystemy
- Wsparcie techniczne dla akademickich projektów
- Gwarantowana dostępność GPU (w przeciwieństwie do marketplace)

**Wady:** RTX 4090 o 85% droższy niż na Vast.ai; brak RTX 3090

**Najlepszy dla:** produkcyjnego treningu, środowisk akademickich, gdy masz budżet i zależy ci na czasie

---

### #4 Spheron — najtańszy H100 spot

**Ocena ogólna: 7/10 (cena H100: 10/10, łatwość: 6/10, niezawodność: 7/10)**

Spheron Network to decentralizowany marketplace. Wyróżnia się ekstremalnie tanim H100 w trybie spot.

**Ceny aktualne (czerwiec 2026):**
- RTX 4090: **$0.55/godz** (on-demand) / **$0.35-0.55/godz** (marketplace)
- A100 80 GB: **$1.07/godz** (on-demand) / **$0.60/godz** (spot)
- H100 SXM5: **$2.50/godz** (on-demand) / **$1.03/godz** (spot)
- B200: od **$2.12/godz** (spot)

**Najlepszy dla:** treningu na H100 z budżetem, eksperymentów gdzie spot-interruption jest akceptowalny

---

### #5 Clore.ai — alternatywa dla Vast.ai

**Ocena ogólna: 6.5/10 (cena: 9/10, łatwość: 5/10, niezawodność: 6/10)**

Podobny model do Vast.ai — marketplace z tanimi kartami konsumenckimi. Mniej popularny, mniejszy wybór, ale bywa tańszy na RTX 3090.

---

## Szacowany czas fine-tuningu modelu 200M parametrów

### Założenia

- Model bazowy: Chronos Base (200M) lub TimesFM-200M
- Metoda: QLoRA / LoRA (PEFT) — nie trenujesz od zera, tylko dostosujesz
- Dataset: ~50 000 próbek szeregów czasowych
- Biblioteka: Unsloth (2x szybszy training, 60% mniej VRAM)
- Tryb: 2-5 epok (typowe dla fine-tuningu)

> **Uwaga:** pretraining od zera to zupełnie inna skala. Chronos Base był trenowany na 8x A100 przez ~200K kroków (kilkanaście godzin). Fine-tuning na własnym datasecie to 10-50x mniej obliczeń.

### Szacunki czasu treningu

| GPU | VRAM | Czas fine-tuningu* | Koszt (Vast.ai) | Koszt (RunPod) |
|---|---|---|---|---|
| **RTX 3090** | 24 GB | **3–5 h** | $0.21–0.35 | $0.81–1.35 |
| **RTX 4090** | 24 GB | **2–3.5 h** | $0.54–0.95 | $0.68–1.19 |
| **L40S** | 48 GB | **1.5–2.5 h** | ~$0.50–0.90 | $1.08–1.80 |
| **A100 40 GB** | 40 GB | **1.5–2.5 h** | $0.78–1.30 | $0.90–1.50 |
| **A100 80 GB** | 80 GB | **1–2 h** | $0.67–1.34 | ~$0.79–1.58 |
| **H100 SXM** | 80 GB | **0.5–1 h** | brak | $1.00–2.00 |

*przy 50K sampli, 2-5 epokach, QLoRA z Unsloth

**Wniosek kosztowy:** RTX 3090 na Vast.ai to absolutny king — fine-tuning 200M modelu za **mniej niż $0.35**. RTX 4090 to lepszy balans szybkości i ceny przy ~$0.70-1.00 za sesję.

---

## Porównanie z CPU: AMD Ryzen 7 7700 Pro + DDR5 64 GB RAM

### Specyfikacja bazowa

- CPU: AMD Ryzen 7 7700 Pro (8 rdzeni, 16 wątków, Zen 4, 65W)
- RAM: DDR5 64 GB
- Brak dedykowanej GPU — trening na CPU

### Dlaczego CPU jest dramatycznie wolniejszy?

Transformer-based modele time series (Chronos, TimesFM) opierają się na operacjach macierzowych (GEMM), które GPU wykonuje w tysiącach równoległych jednostek CUDA. Ryzen 7 7700 Pro ma 8 rdzeni z AVX-512 (jeśli obsługuje) — to nieproporcjonalnie mała równoległość dla tych workloadów.

**Typowy speedup GPU vs CPU dla transformerów 100-200M:**
- Benchmarki PyTorch: GPU jest **20–50x szybsze** od wielordzeniowego CPU przy batch training
- Dla architektury T5/decoder-only w rozmiarze 200M: szacunkowy speedup ~**30–40x**

### Szacowany czas fine-tuningu na Ryzen 7 7700 Pro

| Scenariusz | GPU (RTX 4090) | CPU (Ryzen 7 7700 Pro) | Mnożnik |
|---|---|---|---|
| 50K sampli, 2 epoki | ~2 godziny | **~70–80 godzin (3+ dni)** | ~35–40x |
| 50K sampli, 5 epok | ~3.5 godziny | **~120–140 godzin (5–6 dni)** | ~35–40x |
| 10K sampli, 2 epoki | ~25 minut | **~14–17 godzin** | ~35–40x |

### Realna użyteczność CPU

CPU-only training dla 200M modelu jest **praktycznie nieużyteczne** poza testami na mini-datasecie (<1000 sampli). Powody:

1. **Czas treningu 3–6 dni** to nieakceptowalna pętla iteracyjna — nie możesz szybko testować hiperparametrów
2. **Blokuje serwer** na wiele dni, uniemożliwiając inne zadania
3. **Koszt alternatywny:** cała sesja RTX 3090 na Vast.ai = $0.21–0.35 — mniej niż kawa

**Jedyna sytuacja gdzie CPU ma sens:** prototypowanie kodu i testowanie setupu na małym kawałku danych (100–1000 sampli, 1 batch). Na CPU sprawdzasz czy kod w ogóle działa, zanim uruchomisz na GPU.

---

## Rekomendacja — ścieżka minimalna

### Cel: fine-tuning Chronos Base (200M) na własnym datasecie time series

**Krok 1: Przygotuj kod lokalnie (CPU)**
```python
# Test na 100 próbkach — weryfikacja że pipeline działa
# Ryzen 7 7700 Pro: ~5–10 minut na 100 sampli, 1 epoka
from unsloth import FastLanguageModel
model, tokenizer = FastLanguageModel.from_pretrained(
    "amazon/chronos-t5-base",
    max_seq_length=512,
    load_in_4bit=True,
)
```

**Krok 2: Odpal właściwy trening na Vast.ai (RTX 3090)**
```bash
# Koszt: ~$0.21–0.35 za pełną sesję fine-tuningu
# Czas: 3–5 godzin
# Filtruj: RTX 3090 24GB, DL Score > 6, reliability > 95%
```

**Krok 3: Jeśli potrzebujesz powtarzalności — użyj RunPod**
```bash
# Template: PyTorch 2.4 + JupyterLab
# RTX 4090 Community: $0.34/godz
# Persistentny volume — możesz wracać do checkpointów
```

---

## Podsumowanie — ranking syntetyczny

| Platforma | Cena | Łatwość | Niezawodność | **Ogólna** |
|---|---|---|---|---|
| **Vast.ai** | ★★★★★ | ★★★☆☆ | ★★★☆☆ | **★★★★☆ (cena)** |
| **RunPod** | ★★★★☆ | ★★★★★ | ★★★★☆ | **★★★★★ (balans)** |
| **Lambda Labs** | ★★★☆☆ | ★★★★★ | ★★★★★ | **★★★★☆ (stabilność)** |
| **Spheron** | ★★★★☆ | ★★★☆☆ | ★★★☆☆ | **★★★☆☆ (H100 spot)** |
| **CPU Ryzen 7 7700 Pro** | ★★★★★ | ★★★★★ | ★★★★★ | **✗ (nieużyteczne >10K sampli)** |

**Rekomendacja główna:** RunPod dla pierwszych projektów, Vast.ai gdy znasz środowisko i liczy się budżet. RTX 3090 lub RTX 4090 — wystarczający do pełnego fine-tuningu 200M modelu za mniej niż $1.

---

*Ceny zweryfikowane: czerwiec 2026. Czas treningu: szacunki dla QLoRA z Unsloth, dataset ~50K sampli, 2–5 epok.*

---

**Źródła:**
- [Vast.ai vs RunPod pricing 2026 (Medium)](https://medium.com/@velinxs/vast-ai-vs-runpod-pricing-in-2026-which-gpu-cloud-is-cheaper-bd4104aa591b)
- [GPU Cloud Pricing 2026 (Spheron Blog)](https://www.spheron.network/blog/gpu-cloud-pricing-comparison-2026/)
- [Deploy Time Series Foundation Models on GPU Cloud (Spheron)](https://www.spheron.network/blog/deploy-time-series-foundation-models-gpu-cloud/)
- [Cloud GPU Rental Comparison 2026 (PromptQuorum)](https://www.promptquorum.com/local-llms/cloud-gpu-rental-comparison-2026)
- [Chronos: Learning the Language of Time Series (arXiv)](https://arxiv.org/pdf/2403.07815)
- [How to Fine-Tune LLMs in 2026 (Spheron Blog)](https://www.spheron.network/blog/how-to-fine-tune-llm-2026/)
- [Unsloth Studio on Vast.ai](https://vast.ai/article/how-to-use-unsloth-studio-for-fast-affordable-ai-fine-tuning)
- [GPU vs CPU for AI: Performance Comparison (io.net)](https://io.net/blog/gpu-vs-cpu-for-ai)
- [LLM Fine-Tuning Hardware Guide 2026 (Lyceum Tech)](https://lyceum.technology/magazine/hardware-recommendation-llm-fine-tuning/)
