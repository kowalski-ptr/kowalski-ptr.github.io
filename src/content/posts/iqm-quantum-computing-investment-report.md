---
title: "IQM Quantum Computers: Europe's Challenger in the Global Quantum Race — Full Investment Report"
description: "Deep-dive on IQM's upcoming Nasdaq listing, its 54-qubit sale to Poland's Galaxy Systemy Informatyczne, and a ranked comparison of all major quantum computing players — from technology purity to commercial traction."
category: "tech-invest"
tags: ["quantum-computing", "IQM", "IQMX", "IonQ", "Rigetti", "IBM", "investment", "SPAC", "lang:en"]
date: 2026-06-22
draft: true
---

# IQM Quantum Computers: Europe's Challenger in the Global Quantum Race

Quantum computing is simultaneously the most hyped and most misunderstood technology of the 2020s. Before diving into IQM's story and where it sits among its peers, it's worth building a map: where quantum actually disrupts, where it underperforms, and where the boundaries are genuinely contested.

---

## Part I — The Creative Destruction Map

### Where Quantum Crushes Classical Technology

**1. Pharmaceutical drug discovery & molecular simulation**

This is arguably quantum computing's clearest near-term "killer app." Classical computers simulate molecular behavior using approximations — the underlying quantum mechanics is simply too computationally expensive to solve exactly. A quantum computer operates natively in the same mathematical space as electrons and chemical bonds. The implication: protein folding, enzyme catalysis, and drug-molecule interaction can be modeled with orders-of-magnitude better accuracy. Quantum ML models are being tested in biomarker discovery and clinical trial design. Timeline to commercial impact: 2028–2032.

**2. Materials science**

University of Michigan researchers already used quantum simulation to solve a 40-year-old puzzle about quasicrystal stability. Designing better superconductors, solar cell materials, and battery electrolytes all require solving quantum many-body problems that scale exponentially for classical hardware. Quantum has a structural advantage here — it is not a matter of "when will quantum be fast enough," but "when will the hardware be reliable enough."

**3. Portfolio optimization and financial risk calculation**

Combinatorial optimization — finding the best allocation across thousands of correlated assets subject to constraints — is a problem class where quantum annealing (D-Wave) and variational quantum algorithms already show practical speedups on specific problem sizes. Not yet general advantage, but the first real commercial contracts in finance exist today.

**4. Logistics and supply chain optimization**

Toyota schedules manufacturing across 47 factories using quantum optimization. Routing, scheduling, and constraint satisfaction problems have an NP-hard backbone that quantum algorithms can attack more efficiently than classical solvers at scale.

**5. Cryptography — both attack and defense**

Shor's algorithm will, on fault-tolerant hardware, break RSA and ECC encryption. This is a certainty mathematically; the question is timeline. Governments are already forcing transitions to post-quantum cryptography standards. On the defense side, Quantum Key Distribution (QKD) offers theoretically unbreakable communication channels. This is a geopolitical sector: whoever controls quantum cryptography controls secure communications infrastructure.

---

### Where Quantum Falls Short — No Table-Flipping (Yet)

**1. Time series forecasting and classical machine learning inference**

This is probably the most counterintuitive finding in recent research. Benchmarking studies (arXiv 2412.13878, arXiv 2408.12007) that directly tested quantum models on time series prediction found **no demonstrable edge** over classical methods on current NISQ hardware. The reason is structural: standard time series forecasting relies on pattern recognition over sequential data — transformers, LSTMs, and state space models are well-suited to this. Quantum reservoir computing shows theoretical promise but requires fault-tolerant qubits with long coherence times that don't exist yet at scale. Quantum approaches may help in very specific niches (option pricing, volatility forecasting via quantum kernel methods) but this is niche-within-niche. **Bottom line: if your edge case is time series prediction, quantum is not your near-term catalyst.**

**2. GPU-based deep learning training (matrix multiplication)**

The Tensor Core operations that define modern AI training — massive parallel matrix multiplications — do not map well onto quantum circuits. Standard GEMM (General Matrix Multiply) operations are precisely what GPUs are optimized for and quantum circuits are not. NVIDIA's CUDA-Q framework explores hybrid quantum-classical deployment in data centers for specific subroutines (quantum sampling, combinatorial pre-processing), but the idea of quantum computers "replacing" GPUs for AI training is a category error — they solve fundamentally different computational primitives. **Quantum will not disrupt GPU-based AI training in the 2020s. It may augment it in specific subroutines by the mid-2030s.**

**3. Web-scale data processing (CRUD, streaming, search)**

Quantum computers offer no advantage for reading and writing structured data, running SQL queries, serving web requests, or processing high-volume streams. Classical DRAM, NVMe, and CPU architectures are optimal here. This will not change.

**4. Image and video processing**

Convolutional operations, video encoding, rendering — classical silicon is the right tool. Quantum Fourier Transform exists but requires fault-tolerant hardware at scale to match what a modern GPU does in milliseconds.

**5. Consumer electronics, mobile, and embedded systems**

Quantum computers require dilution refrigerators operating at 15 millikelvin — roughly 100 times colder than outer space. This will not change for superconducting systems in any foreseeable timeline. Any application requiring portable or room-temperature operation is off the table for the dominant hardware architectures.

---

### The Genuinely Contested Zone (2026–2030)

The honest answer is that the boundary between "quantum wins" and "quantum loses" is actively moving. The hybrid model — quantum co-processors embedded in classical HPC clusters and data centers — is the deployment paradigm currently taking shape. IQM's own thesis is built on this: pair superconducting quantum hardware with classical CPUs/GPUs in the data center tier. The bet is that for a growing category of optimization and simulation subroutines, the quantum co-processor cuts both time-to-solution and energy cost.

---

## Part II — IQM Quantum Computers: Full Profile

### Origins and Technology

IQM was founded in 2019 as a spin-out from two Finnish institutions: **Aalto University** and **VTT Technical Research Centre of Finland**. The four founding researchers — CEO Jan Goetz among them — decided that university labs had the science but lacked the infrastructure to scale quantum hardware commercially.

IQM builds **superconducting quantum computers**, the same underlying technology used by IBM and Google. The key differentiator is IQM's **co-design philosophy**: rather than selling a generic quantum chip and letting customers figure out software, IQM designs both the quantum processor and the classical control systems together, optimized for specific application domains. This is the approach taken by the early semiconductor industry — ASIC-style quantum hardware.

**Latest hardware (Radiance platform):**
- 150-qubit system with 99.91% two-qubit gate fidelity — among the highest ever recorded on a superconducting system at that scale
- Roadmap: 300-qubit system planned for 2027, with error correction capabilities
- WASIX-compatible (sandboxed execution of classical control software)

---

### Commercial Position: The On-Premises Hardware Leader

IQM's most striking commercial stat is this: **23 quantum systems sold to date, 15 delivered.** IBM, which has operated in quantum computing far longer, runs its hardware almost entirely as a cloud service. IQM chose the opposite strategy — sell the physical machine, let the customer own the infrastructure.

This mirrors how Intel and AMD sold CPUs to hardware OEMs in the 1980s–90s: physical hardware, installed on-premises, owned by the customer. For research institutions, government labs, and now private enterprises (via the Galaxy deal), on-premises ownership means sovereignty, security, and no cloud latency.

**Key customers include:**
- Germany's Jülich Supercomputing Centre (JSC)
- Multiple European national research labs
- Galaxy Systemy Informatyczne, Poland (first private enterprise globally — see Part III)

---

### The SPAC Merger and Nasdaq Listing

IQM has entered into a business combination agreement with **Real Asset Acquisition Corp. (RAAQ)** — a blank-check SPAC company. The combined entity will trade on:

- **Nasdaq (New York)** under ticker **IQMX**
- **Nasdaq Helsinki** under the same ticker

Shareholder vote is scheduled for **June 25, 2026.** If approved, IQM becomes the **first European quantum computing company listed on a major U.S. exchange.**

**Deal economics:**
- Pre-money equity valuation: **~$1.8 billion**
- PIPE (Private Investment in Public Equity): **$146 million** (upsized from original $134M — strong institutional demand)
- New commitment from Ilmarinen (major Finnish pension fund)
- Additional sources: RAAQ trust, warrant exercises, existing capital
- Total capital raise expected: **>$300 million**

**Cap table: governments already invested**
- European Commission
- Finnish government
- German government

This is notable: IQM has operated with public-sector backing from day one, giving it a capital structure different from U.S. pure-plays that rely entirely on venture capital and equity markets. The Nasdaq listing is both a capital raise and a strategic move into the U.S. market following Washington's $2 billion federal quantum sector injection.

---

### Financials and Projections

| Metric | 2025 (actual) |
|---|---|
| Revenue | EUR 31M (~$36M USD) |
| Systems sold | 23 |
| Systems delivered | 15 |
| Order visibility | >$100M |
| Employees | 400+ |

**Revenue projections (2026–2028):** IQM has not issued detailed public guidance, but the order book exceeding $100M provides substantial forward visibility. The global quantum computing market is projected to reach **$3 billion by 2028** (QED-C 2026 Report). IQM's positioning as the on-premises hardware leader — especially as the data center market opens (see Galaxy sale) — gives it a credible path to 3–5x revenue growth over 2025–2028. The 300-qubit Radiance system in 2027 will be the key commercial catalyst.

**Key risk:** IQM is not yet profitable. Like all quantum pure-plays, it burns cash while building toward fault-tolerant scale. The $300M+ from the SPAC transaction is designed to fund operations through the commercialization window.

---

## Part III — Galaxy Systemy Informatyczne: IQM's Polish Flagship

In April 2026, **Galaxy Systemy Informatyczne** (Galaxy SI) became the **first private enterprise in the world** to purchase an IQM quantum computer. This is not a research project or a government grant — it is a commercial sale.

**What Galaxy is buying:**
- IQM Radiance system: **54 qubits**
- Delivery timeline: **Q4 2026**
- Location: Galaxy's headquarters in **Zielona Góra, Poland**
- Poland's most advanced quantum computer

**What Galaxy does:**
Galaxy has operated in the Polish IT market for **30 years**. Its focus areas span security, defense, energy, finance, and space technology — precisely the sectors with the highest near-term quantum utility. Galaxy is not a software-only company; it builds integrated IT systems across critical infrastructure.

**Strategic rationale:**
Galaxy's decision is a bet on **technological sovereignty**. Owning the hardware on-premises means independence from cloud providers, full data sovereignty, and capability to offer quantum computing access to Polish industry and academic institutions. Galaxy intends to open the system as a shared resource — essentially operating as a quantum computing hub for Poland.

**Is Galaxy publicly traded?** No. Galaxy Systemy Informatyczne is a **private Polish company**. There is no ticker, no public financial disclosure.

**Why this deal matters for IQM's story:**
It validates IQM's hypothesis that the next buyer tier is private enterprise data centers — not just government labs. It also positions IQM as the vendor of choice for European companies pursuing digital sovereignty, a strategic priority that has accelerated since 2022.

---

## Part IV — Competitive Landscape: All Major Players

### The Cast

| Company | Technology | Exchange | Model |
|---|---|---|---|
| **IBM** | Superconducting | NYSE (IBM) | Cloud-first + hardware |
| **IonQ** | Trapped-ion | NYSE: IONQ | Cloud + hardware |
| **IQM** | Superconducting | IQMX (pending) | On-premises hardware |
| **D-Wave (QBTS)** | Quantum annealing | NYSE: QBTS | Cloud + hardware |
| **Rigetti (RGTI)** | Superconducting | Nasdaq: RGTI | Cloud |
| **Quantum Comp. Inc. (QUBT)** | Photonic | Nasdaq: QUBT | Early-stage |

---

## Ranking #1 — Technology Maturity × Commercial Traction

*Who is actually making money and shipping real hardware right now?*

### 🥇 1. IBM

IBM is not a quantum pure-play — it is a $150B+ enterprise technology company for which quantum is one division. But in quantum specifically, IBM is the undisputed ecosystem leader. The **Qiskit** open-source framework has become the de facto industry standard. IBM has 100+ quantum systems deployed globally, accessible via the cloud. Its roadmap is the most ambitious and best-resourced, with Heron R2 at 156 qubits and 99.5% two-qubit fidelity.

The catch: IBM's quantum revenue is bundled into its broader cloud and services business. You cannot invest in "IBM quantum" as a pure-play. But for enterprise customers, IBM is the safest choice.

**Commercial score: 9/10 | Technology: 8.5/10**

---

### 🥈 2. IonQ (IONQ)

IonQ is the **pure-play revenue leader** with $130M in 2025 revenue and guidance for **$260–270M in 2026** — a 755% year-on-year growth rate in Q1 2026 alone. This is not incremental; it represents genuine commercial traction.

IonQ's trapped-ion technology offers **all-to-all qubit connectivity** (any qubit can interact with any other, without routing overhead), very long coherence times, and the highest gate fidelities demonstrated at scale. EQC prototypes hit **99.99%** two-qubit fidelity. The trade-off: trapped-ion gates are slower than superconducting gates, and scaling qubit counts is harder.

IonQ is building toward the **Algorithmic Qubit (AQ)** metric rather than raw qubit count — measuring practical performance, not just hardware specs.

**Commercial score: 9/10 | Technology: 9/10**

---

### 🥉 3. IQM (IQMX — pending)

IQM sits at an inflection point. With $36M in 2025 revenue and 23 systems sold, it is the **hardware sales leader** for on-premises quantum systems globally. Its superconducting Radiance architecture achieves **99.91% two-qubit fidelity** — competitive with the best in class. The co-design approach produces hardware tuned for customer use cases rather than general benchmarks.

The Nasdaq listing will give IQM the capital and U.S. presence to compete for American government and data center contracts. The risk profile is higher than IBM or IonQ — smaller revenue base, not yet profitable, pre-listing — but the on-premises hardware thesis gives it a differentiated path.

**Commercial score: 7/10 | Technology: 8.5/10**

---

### 4. D-Wave (QBTS)

D-Wave is the **oldest quantum computing company** (founded 1999) and has the most mature commercial product — but it's a different kind of quantum computer. **Quantum annealing** is not a universal gate-based machine; it excels at a specific class of combinatorial optimization problems (QUBO — Quadratic Unconstrained Binary Optimization). For logistics, financial portfolio balancing, and scheduling, it already delivers value.

Revenue: $24.6M in 2025, growing 179% year-on-year. Gross margin of 83% is the best in the sector. D-Wave is the only pure-play quantum company with a credible path to near-term profitability, because its technology is already useful.

The limitation: annealing computers cannot run Shor's algorithm, quantum chemistry simulations, or most of the "big prize" quantum applications. D-Wave serves a real but bounded market.

**Commercial score: 7.5/10 | Technology: 6/10 (for general QC, 8/10 for its own niche)**

---

### 5. Rigetti Computing (RGTI)

Rigetti was once a serious contender. Today it is struggling. **Revenue fell 34% in 2025 to $7.1M**, with a net loss of $216M. The company has strong technical engineers and a cloud platform (QCS), but it lacks IBM's resources, IonQ's fidelity leadership, and IQM's on-premises hardware differentiation.

Rigetti's superconducting technology is solid but not best-in-class. Its challenge is existential: it needs either a breakthrough product or a strategic acquirer. The stock remains speculative.

**Commercial score: 3.5/10 | Technology: 6/10**

---

### 6. Quantum Computing Inc. (QUBT)

QUBT is currently a **research-stage company** with approximately $0.3M in revenue and unproven technology. It explores photonic approaches (room temperature operation is a genuine advantage if scalable) but is nowhere near commercial deployment. This is a lottery ticket, not an investment thesis.

**Commercial score: 1/10 | Technology: speculative**

---

## Ranking #2 — Pure Technology: Who Could Become the Next Intel or Nvidia?

*This ranking ignores current revenue. It asks: which company's technology has the structural properties to dominate the sector for decades — the way Intel dominated semiconductors in the 1990s with x86, or Nvidia dominates AI compute today with CUDA?*

The key analogy: Intel won in the 90s because it owned both the **architecture** (x86 ISA) and the **process technology** (fab leadership). Nvidia won in AI because it owned the **programming model** (CUDA) and the **hardware** simultaneously — and no one could replicate the ecosystem.

Quantum's analogue is: who will own the **qubit architecture** AND the **software/ecosystem stack** AND reach **fault-tolerant scale** first?

---

### 🥇 1. IonQ — The Trapped-Ion Thesis for Long-Term Dominance

IonQ's case for becoming "the Nvidia of quantum" rests on the structural advantages of trapped-ion physics:

- **All-to-all connectivity**: eliminates the routing overhead that plagues superconducting grids. As circuit depth grows, this advantage compounds.
- **Coherence times in seconds** (vs. microseconds for superconducting): more time to run longer algorithms before decoherence destroys the computation.
- **Fidelity approaching theoretical limits**: 99.99% demonstrated — the closer you get to perfect gates, the longer quantum error correction can remain optional.
- **Photonic interconnects**: IonQ is developing quantum networking (entanglement across nodes) that could underpin a future quantum internet.

The challenge for IonQ: gate speed is slower (~milliseconds vs. nanoseconds for superconducting), and scaling ion traps physically is harder than adding more superconducting qubits. But IonQ's modular architecture — multiple smaller traps connected photonically — may solve this without requiring a single monolithic chip.

**If** trapped-ion delivers fault-tolerant quantum computing first at practical scales, IonQ's early commercialization lead and U.S. government relationships position it as the dominant vendor.

**Technology ceiling rating: 9.5/10**

---

### 🥈 2. IBM — The Ecosystem Play (Most Like Nvidia)

IBM's path to quantum dominance is not through the best qubit technology — it's through the **Qiskit ecosystem**. Qiskit is already the most widely used quantum programming framework. IBM trains thousands of developers annually. Its cloud platform runs 100+ quantum systems. If Qiskit becomes to quantum what CUDA is to GPU computing — a mandatory ecosystem lock-in — IBM wins regardless of whether its hardware is the most efficient.

IBM's superconducting roadmap (Heron R2 → Flamingo → beyond) is the most publicly detailed in the industry. It has the resources to execute. The risk: IBM's quantum division is competing internally for investment dollars with its AI and hybrid cloud businesses. A quantum breakthrough at a pure-play competitor could see IBM deprioritize the division.

**Technology ceiling rating: 9/10 (with ecosystem premium)**

---

### 🥉 3. IQM — The Co-Design Hardware Model (Most Like Intel)

IQM's vision is closest to the original Intel thesis: **own the hardware stack, sell physical systems, let customers build applications on top**. Intel did not try to run its own applications; it sold chips optimized for what customers needed.

IQM's co-design approach — building quantum chips tuned for specific computational domains (chemistry, optimization, AI subroutines) rather than a generic general-purpose quantum computer — creates a natural specialization moat. If the data center quantum co-processor market develops as IQM's CEO projects, owning the hardware relationship is worth more than owning cloud access.

The risk: superconducting architectures face more noise challenges than trapped-ion at equivalent fidelity. IQM's Radiance is impressive but not at the ceiling of what physics allows. The question is whether its engineering culture can close that gap faster than IonQ scales its approach.

**Technology ceiling rating: 8.5/10**

---

### 4. Quantinuum *(private — Honeywell subsidiary, not listed)*

Honeywell's quantum subsidiary is arguably the current **technology leader** in qubit fidelity: H-Series achieves **99.9%+ two-qubit gates consistently** across all qubit pairs, with full all-to-all connectivity. It combines the best properties of trapped-ion (high fidelity, connectivity) with rapid hardware iteration.

Quantinuum is not publicly traded. Honeywell has been exploring options (spin-off, IPO). If Quantinuum lists independently, it would immediately rank #1 or #2 by technology in any honest ranking.

**Technology ceiling rating: 9.8/10** *(if public)*

---

### 5. D-Wave — Niche Dominance, Not General Leadership

D-Wave's annealing technology is mature, profitable for specific use cases, and will not be displaced in its niche. But it cannot run the algorithms that matter for cryptography, drug discovery, or materials science. It is a specialized co-processor, not a general-purpose quantum computer. Think of it as a quantum FPGA: powerful within its domain, irrelevant outside it.

**Technology ceiling rating: 6/10 (for general purpose)**

---

### 6. Rigetti — Capable But Outpaced

Rigetti's superconducting technology is real and functional. The problem is that IBM, IQM, and even Google (Willow chipset) are all executing faster with more resources. Rigetti has the right technology class but not the scale or differentiation to win. A turnaround or acquisition is more likely than organic dominance.

**Technology ceiling rating: 6.5/10**

---

### 7. QUBT — Long Shot

Photonic quantum computing (room temperature, potentially easier to scale) is genuinely interesting theoretically. But QUBT is so early-stage that its "technology ceiling" is speculative. This could be the dark horse in 2030–2035 if its photonic approach proves scalable. Today it is a research bet, not an investment thesis.

**Technology ceiling rating: speculative / 5–9/10** *(enormous uncertainty)*

---

## Part V — Creotech: Poland's Two-Headed Quantum Play

Poland has its own quantum computing story — and it's more nuanced than a single company. The Creotech group has deliberately split itself into two separate listed entities, each attacking a different layer of the technology stack.

> **Ticker confusion note:** CRI and CRQ are related but different. CRI is the satellite/space parent; CRQ is the quantum spinoff. Both are listed on GPW (Warsaw Stock Exchange).

---

### Creotech Instruments SA — Ticker: CRI (GPW)

Creotech Instruments is **not a quantum computing company**. It is Poland's leading microsatellite manufacturer and one of Europe's fastest-growing space technology firms.

**What it does:**
- Proprietary **HyperSat** microsatellite platform (functions like a standardized PC chassis — customers plug in their own radar, camera, or comms payload; Creotech handles power, navigation, thermal, and launch)
- Satellite production capacity: currently 10 microsatellites/year at the Piaseczno facility near Warsaw; planning to scale to 40/year by 2029
- Customers span defence, Earth observation, and telecommunications

**Financials (2025):**
- Revenue: **PLN 146M (~$40M USD)** from space sector — record year
- **First full-year profit** in company history (2025)
- Order backlog: PLN 600M (~$165M)
- Pipeline visibility: PLN 6.6B
- Contracts include a **€59M ESA contract** and growing NATO-adjacent defence demand

**Capital plans:**
- **$118 million capital raise** to build a new satellite production factory in Poland (target: 2029)
- The company is positioning HyperSat as a standard platform for the "Three Seas" countries (12 Central/Eastern European nations) — a potentially dominant supplier position in a region with limited domestic satellite capability

**Why it matters for this report:**
CRI is the parent that spun off the quantum business. It retains a stake in CRQ and benefits indirectly from the quantum halo effect, but its core value proposition is satellites, not qubits. For investors: CRI is a **profitable space hardware company with a massive government backlog** — a different risk profile than pure-play quantum stocks.

**Exchange:** GPW main market. Not listed on U.S. exchanges.

---

### Creotech Quantum SA — Ticker: CRQ (GPW)

Creotech Quantum is the quantum computing spin-off, separated from Creotech Instruments and listed independently on the GPW main market on **April 17, 2026**, at a debut valuation of approximately **PLN 350M (~$95M)**.

**Critical distinction: Creotech Quantum does NOT build quantum processors.** It builds the **classical control infrastructure** that runs quantum experiments and quantum computers — the electronics, firmware, and systems without which quantum processors are useless. Think of it as the company that builds CUDA-capable motherboards, not the GPU itself.

**Core product lines:**
- **Sinara/ARTIQ ecosystem** — a control and measurement platform for quantum processors. This is the de facto open-source standard for controlling trapped-ion and neutral-atom quantum computers globally. Creotech Quantum manufacturers the physical hardware for this ecosystem.
- **MTCA systems** — modular electronics for control, synchronization, and data processing in quantum physics labs
- **White Rabbit** — precision time synchronization for long-distance quantum networks (used in CERN and major European research infrastructure)
- **Quantum Key Distribution (QKD) systems** — hardware for information-theoretically secure communication channels

**Revenue (2025):** approximately PLN 14–16M (~$4M), with growth >100% year-on-year from quantum segment.

**Who buys from Creotech Quantum?**
The customer base is primarily research institutions, national quantum labs, and companies building or operating quantum computers. Notably: the Sinara/ARTIQ ecosystem is used by IonQ, by European quantum research programs, and by academic labs worldwide. This means **Creotech Quantum is a supplier to the quantum computing sector, not just a participant in it** — its revenue grows as the number of quantum systems globally increases, regardless of which quantum processor vendor wins.

**The "picks and shovels" thesis:**
In the 1850s California Gold Rush, the people who consistently made money were not gold miners but those who sold shovels, denim, and provisions. Creotech Quantum is positioned analogously: as every major quantum hardware player (IBM, IonQ, IQM, Quantinuum) deploys more systems, demand for quantum control electronics — the picks and shovels of the quantum era — grows predictably. This makes CRQ's revenue less dependent on picking the right qubit architecture winner.

**Risks:**
- Revenue base is still small (~$4M) — highly speculative at current valuation
- Customer concentration risk (heavy research lab exposure)
- QKD is a competitive and somewhat fragmented market
- As quantum hardware matures, large players (IBM, IonQ) may build more of their own control systems in-house

**Exchange:** GPW main market (Warsaw). Not listed on U.S. exchanges. For non-Polish investors: low liquidity, PLN-denominated, limited analyst coverage.

---

## Ranking Summary Tables

### Ranking #1: Technology × Business Today

| # | Company | Revenue (2025) | Tech Maturity | Commercial Traction | Overall |
|---|---|---|---|---|---|
| 1 | **IBM** | bundled | ★★★★☆ | ★★★★★ | ★★★★★ |
| 2 | **IonQ (IONQ)** | $130M | ★★★★★ | ★★★★★ | ★★★★★ |
| 3 | **IQM (IQMX)** | $36M | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| 4 | **D-Wave (QBTS)** | $24.6M | ★★★☆☆ | ★★★★☆ | ★★★★☆ |
| 5 | **Creotech Instr. (CRI)** | $40M (space) | ★★★★☆ | ★★★★☆ | ★★★★☆ |
| 6 | **Rigetti (RGTI)** | $7.1M | ★★★☆☆ | ★★☆☆☆ | ★★★☆☆ |
| 7 | **Creotech Quantum (CRQ)** | ~$4M | ★★★☆☆ | ★★★☆☆ | ★★★☆☆ |
| 8 | **QUBT** | $0.3M | ★★☆☆☆ | ★☆☆☆☆ | ★★☆☆☆ |

*Note: CRI ranked by satellite business; CRQ ranked as quantum infrastructure supplier, not processor maker.*

### Ranking #2: Pure Technology — The "Next Intel/Nvidia" Race

| # | Company | Technology | Scalability Path | Ecosystem | Potential Ceiling |
|---|---|---|---|---|---|
| 1 | **IonQ** | Trapped-ion, 99.99% fidelity | Photonic interconnects | Growing fast | ★★★★★ |
| 2 | **IBM** | Superconducting + Qiskit | Massive roadmap, cloud | Dominant (Qiskit) | ★★★★★ |
| 3 | **IQM** | Superconducting co-design | Data center hardware | Emerging | ★★★★☆ |
| 4 | **Creotech Quantum (CRQ)** | Quantum infrastructure | Grows with whole sector | Open-source (ARTIQ) | ★★★★☆ |
| 5 | **Rigetti** | Superconducting | Limited resources | Small | ★★★☆☆ |
| 6 | **D-Wave** | Annealing (niche) | Bounded | Optimization only | ★★☆☆☆ |
| 7 | **QUBT** | Photonic (early) | Unknown | None yet | ★★☆☆☆ (speculative upside) |

*(Quantinuum excluded — private. Would rank #1 on pure technology if public.)*
*(CRI excluded from Ranking #2 — satellite company, different sector.)*

---

## Investment Considerations

**IQM (IQMX)** is the most interesting European entry point to quantum hardware. The $1.8B pre-money valuation is rational — compare to IonQ's current market cap in the $5–10B range at lower revenue growth rates. If the Galaxy deal marks the beginning of private enterprise data center sales, IQM's on-premises revenue model could scale non-linearly.

**IonQ (IONQ)** is the current pure-play market leader by every financial metric. It is also the most expensive relative to current revenue. The trapped-ion technology thesis is the strongest long-term bet in this sector.

**D-Wave (QBTS)** is the overlooked profitability play. If you want quantum exposure with the best near-term path to positive gross economics, annealing optimization is already commercially useful.

**Rigetti (RGTI)** and **QUBT** are speculative positions.

**IBM** remains the safest quantum exposure — but you're buying the whole company, and quantum is a small fraction of the thesis.

**Creotech Instruments (CRI, GPW)** is the most interesting Polish play — and it's not primarily a quantum stock. A profitable satellite company with a €59M ESA contract and PLN 6.6B pipeline, trading on the Warsaw Stock Exchange. The quantum optionality (via its CRQ stake) is essentially free. Illiquid for international investors.

**Creotech Quantum (CRQ, GPW)** is the "picks and shovels" thesis within quantum: control electronics and QKD that power labs worldwide. Revenue grows with the entire sector rather than with a single hardware winner. Very early stage (~$4M revenue), high risk, but a structurally differentiated position in the quantum value chain. Listed exclusively on GPW — limited accessibility for non-Polish investors.

---

*Sources:*
- *[IQM + Real Asset SPAC Merger — SEC Filing](https://www.sec.gov/Archives/edgar/data/0002052161/000121390026056652/ea029090901ex99-1.htm)*
- *[IQM $146M PIPE announcement (BusinessWire)](https://www.businesswire.com/news/home/20260602993879/en/IQM-a-Global-Leader-in-Quantum-Computing-and-Real-Asset-Acquisition-Corp.-Announce-Upsized-USD-146-million-PIPE-with-New-Commitment-from-Ilmarinen)*
- *[Galaxy Systemy Informatyczne 54-qubit purchase (BusinessWire)](https://www.businesswire.com/news/home/20260407351934/en/Polands-Galaxy-Systemy-Informatyczne-Becomes-First-Private-Enterprise-to-Buy-Quantum-Computer-from-IQM)*
- *[Galaxy SI purchase — HPCwire](https://www.hpcwire.com/off-the-wire/iqm-installs-54-qubit-quantum-computer-at-polands-galaxy-in-1st-enterprise-deployment/)*
- *[IQM Finnish Unicorn valuation $1.8B (TrendingTopics)](https://www.trendingtopics.eu/iqm-finnish-unicorn-goes-public-valuation-at-1-8-billion/)*
- *[IonQ Q1 2026 Revenue $64.7M (SEC 8-K)](https://www.sec.gov/Archives/edgar/data/0001824920/000119312526208923/ionq-ex99_1.htm)*
- *[Quantum Computing Stocks 2026 Guide (TECHi)](https://www.techi.com/quantum-computing-stocks/)*
- *[Benchmarking Quantum Models for Time-Series Forecasting (arXiv 2412.13878)](https://arxiv.org/pdf/2412.13878)*
- *[Quantum Hardware Comparison 2026 (QuantumAIReport)](https://quantumaireport.info/articles/quantum-hardware-comparison-2026)*
- *[Global Quantum Market to $3B by 2028 — QED-C Report (TheQuantumInsider)](https://thequantuminsider.com/2026/04/14/global-quantum-computing-market-to-double-by-2028-reaching-3-billion-in-revenue-qed-c-state-of-the-global-quantum-industry-2026-report-finds/)*
- *[Creotech Quantum CRQ debiut GPW 350 mln zł (Comparic)](https://comparic.pl/creotech-quantum-debiutuje-na-gpw-z-wycena-350-mln-zl-spin-off-z-polskiej-firmy-kosmicznej/)*
- *[Creotech plans $118M capital raise for satellite factory (SpaceNews)](https://spacenews.com/creotech-plans-118-million-capital-raise-investment-in-new-satellite-factory/)*
- *[Creotech Instruments Q1 record results (creotech.pl)](https://creotech.pl/news/creotech-instruments-reports-record-breaking-q1-with-nearly-fourfold-year-over-year-revenue-growth/)*
