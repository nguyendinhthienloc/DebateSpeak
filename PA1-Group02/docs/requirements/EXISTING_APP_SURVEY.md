# Part C: Existing App Survey — DebateSpeak AI

| Field | Description |
|---|---|
| Course | CS300 / CSC13002 — Introduction to Software Engineering |
| Document | **Part C: Existing Web & Mobile App Survey** |
| Score Allocation | Part C (10 Points) |

---

## 1. Survey Methodology & App Selection
*Performed by: Nguyễn Hồng Tấn Tài (24125078) | Reviewed by: Nguyễn Bảo Minh Triết (24125047) | Edited by: Nguyễn Đình Thiên Lộc (24125093)*

To evaluate the current state of market solutions and identify architectural and user experience gaps, our team surveyed existing platforms operating at the intersection of AI debate judging, live speech transcription, and English speaking practice.

We selected **two primary directly comparable platforms**:
1. **ArguFight:** A modern web-based debate platform featuring AI judging, voice input, and automated claim verification.
2. **Luyennoi.com (Luyện Nói):** A popular browser-based spoken English & IELTS Speaking training platform featuring automated 4-criteria rubric scoring and per-sentence feedback.

Additionally, we benchmarked against **two industry reference systems**:
1. **ELSA Speak:** A leading mobile-first AI pronunciation coach, analyzing acoustic phoneme feedback and solo drill UX patterns.
2. **Google Meet with Gemini ("Take notes for me" / Meeting Summary):** Google Workspace's flagship enterprise video/audio platform, analyzing real-time multi-speaker transcription, speaker attribution, and asynchronous post-call LLM synthesis.

---

## 2. In-Depth Survey: App 1 — ArguFight
*Performed by: Nguyễn Hồng Tấn Tài (24125078) | Reviewed by: Trần Lê Anh Tuấn (24125107) | Edited by: Nguyễn Đình Thiên Lộc (24125093)*

### 2.1 Overview & Core Focus
**ArguFight** focuses on structured, competitive online debates. It allows participants to debate motions either through text or asynchronous voice inputs and employs multiple AI judges to evaluate which debater presented the stronger case.

### 2.2 Key Features & Workflow Analysis

```mermaid
graph LR
    subgraph ArguFightWorkflow ["ArguFight Workflow"]
        A["Select Debate Motion"] --> B["Enter Timed Speaking Turn"]
        B --> C["Speech Upload / Voice Input"]
        C --> D["AI Multi-Judge Scoring"]
        D --> E["Winner Proclamation & Fact Check"]
    end
```

1. **Structured Turn System:** Users speak or type in fixed, alternating rounds (Constructive Speech, Cross-Examination, Rebuttal).
2. **AI Panel of Judges:** The platform simulates a panel of diverse judges (e.g., "The Logician", "The Empiricist", "The Pragmatist") who deliver a consolidated score.
3. **Automated Fact-Checking:** Flags suspicious factual claims made by participants and checks them against internal knowledge bases.

### 2.3 User Interface & Screenshots

#### Screen 1: Platform Hero & Competitive Debate Directory
![ArguFight Landing Hero](../management/screenshots/argufight_01_landing_hero.png)
*Figure 2.1: ArguFight Motion Directory & Landing Hero — Highlighting real-time AI-judged debate platform, ELO rankings, and active debate challenges.*

#### Screen 2: Live In-Match Fact Checking & Evidence Verification
![ArguFight Live Fact Check](../management/screenshots/argufight_20_live_fact_check_sources.png)
*Figure 2.2: ArguFight Live Fact-Checking Card — Evaluates factual assertions mid-debate against verified external sources with transparent accuracy ratings.*

#### Screen 3: Post-Debate Multi-Judge Scoring Verdict
![ArguFight Post-Debate Verdict](../management/screenshots/argufight_21_post_debate_verdict.png)
*Figure 2.3: ArguFight Post-Match Verdict — Multi-judge deliberation results with head-to-head score comparison, AI judge consensus, and rematch options.*

### 2.4 Strengths & Limitations
- **Strengths:** Excellent multi-judge roleplay exposing varied reasoning perspectives; strong gamification and competitive motivation.
- **Limitations:** Focuses exclusively on *who won the debate*; provides **zero language-learning feedback** (no grammar correction, no CEFR vocabulary recommendations, no pause/fluency analytics). Asynchronous turn-taking feels mechanical and lacks spontaneous conversational flow.

---

## 3. In-Depth Survey: App 2 — Luyennoi.com (Luyện Nói)
*Performed by: Nguyễn Hồng Tấn Tài (24125078) | Reviewed by: Nguyễn Anh Khoa (24125058) | Edited by: Nguyễn Bảo Minh Triết (24125047)*

### 3.1 Overview & Core Focus
**Luyennoi.com** is a Vietnamese browser-based AI platform designed for English learners and IELTS Speaking candidates. It operates directly inside web browsers (Chrome, Safari, Edge) without requiring app installation, providing automated band scoring across the 4 official IELTS Speaking criteria and per-sentence linguistic feedback.

### 3.2 Key Features & Workflow Analysis

```mermaid
graph LR
    subgraph LuyennoiWorkflow ["Luyennoi.com Workflow"]
        A["Select Topic / Forecast Prompt"] --> B["Browser Microphone Recording"]
        B --> C["Speech-to-Text Transcription"]
        C --> D["4-Criteria Rubric Scoring"]
        D --> E["Per-Sentence Error & Lexical Feedback"]
    end
```

1. **In-Browser Audio Recording:** Direct browser-based Web Audio capture with countdown timers simulating IELTS speaking rounds.
2. **4-Criteria Automated Scoring:** Evaluates user speech against Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, and Pronunciation.
3. **Per-Sentence Remediation:** Displays transcribed sentences with underlined grammatical errors and suggests upgraded CEFR/academic vocabulary.
4. **"Lớp Nói" Classroom Management:** Offers teacher/tutor portals to assign speaking prompts and review student submission histories.

### 3.3 User Interface & Screenshots

#### Screen 1: Platform Hero & 4-Criteria Scoring Overview
![Luyennoi Landing Page](../management/screenshots/luyennoi_01_landing_hero.png)
*Figure 3.1: Luyennoi.com Landing Page — Automated IELTS Speaking grading based on 4 standardized criteria with immediate test-taking options.*

#### Screen 2: In-Browser Speaking Practice & Recording Interface
![Luyennoi Recording Session](../management/screenshots/luyennoi_08_recording_session.png)
*Figure 3.2: Luyennoi.com In-Browser Recording — Timed speaking prompt with visual audio level meter and response submission controls.*

#### Screen 3: Standardized 4-Criteria Scorecard & Sentence-Level Corrections
![Luyennoi Scorecard Feedback](../management/screenshots/luyennoi_09_scorecard_sentence_feedback.png)
*Figure 3.3: Luyennoi.com Diagnostic Scorecard — Granular sub-scores across fluency, vocabulary, grammar, and pronunciation with verbatim error highlights.*

### 3.4 Strengths & Limitations
- **Strengths:** Zero installation friction (web-first); direct alignment with standardized test rubrics (IELTS 4 criteria); actionable per-sentence feedback quoting learner speech; tailored specifically to Vietnamese English learners.
- **Limitations:** Strictly **solo, monologue-based practice** against static prompts; **zero real-time interactive dialogue or peer debate**; cannot train spontaneous rebuttal, conversational turn-taking, or real-time active listening; no logical argumentation structure analysis or empirical fact-checking.

---

## 4. Industry Reference Benchmarks
*Performed by: Nguyễn Anh Khoa (24125058) | Reviewed by: Nguyễn Đình Thiên Lộc (24125093) | Edited by: Nguyễn Hồng Tấn Tài (24125078)*

### 4.1 Benchmark 1: ELSA Speak
- **Focus:** Mobile-first English pronunciation and acoustic phoneme analysis.
- **Key Relevance to DebateSpeak:** Demonstrates optimal UX patterns for phoneme-level speech feedback, syllable stress visualization, and longitudinal proficiency tracking.
- **Limitation:** Purely solo phoneme drills; lacks spontaneous conversational context and argumentative reasoning.

#### Screen 1: Phoneme-Level Pronunciation Feedback & Proficiency Assessment
![ELSA Speak Pronunciation Feedback](../management/screenshots/elsa_speak_pronunciation.png)
*Figure 4.1: ELSA Speak Pronunciation Assessment — Visual phoneme-level scoring highlighting specific pronunciation errors with color-coded phonetic feedback and CEFR level classification.*

### 4.2 Benchmark 2: Google Meet with Gemini ("Take notes for me" / Meeting Summary)
- **Focus:** Enterprise video conferencing powered by Gemini in Google Workspace.
- **Key Capabilities:**
  1. **Deterministic Speaker Attribution & Streaming Captions:** Isolates multi-party audio streams and renders real-time diarized captions with speaker tags.
  2. **Asynchronous Post-Call Synthesis ("Take notes for me"):** Automatically extracts core discussion threads, decisions made, and assigned action items into a structured Google Doc.
  3. **Live "Summary so far":** In-call catch-up synthesis allowing participants to read what transpired before they joined.

#### Screen 2: Pre-Call Entry & Audio Device Configuration
![Google Meet Pre-Call Entry](../management/screenshots/meeting_google_meet_join.png)
*Figure 4.2: Google Meet Pre-Call Portal — Audio device check and microphone readiness with Gemini background intelligence enabled.*

#### Screen 3: In-Call Orchestration & Live Background Audio Capture
![Google Meet In-Call Session](../management/screenshots/meeting_google_meet_call.png)
*Figure 4.3: Google Meet In-Call Session — Unobtrusive live background speech capture and speaker attribution without interrupting conversational flow.*

#### Screen 4: Asynchronous Post-Call Structured Artifacts & Actionable Minutes
![Gemini Automated Meeting Notes](../management/screenshots/meeting_gemini_notes_email_1.png)
*Figure 4.4: Automated Gemini Notes & Synthesis — Asynchronous extraction of discussion threads, key decisions, and actionable follow-ups distributed post-call via email.*

- **Key Relevance to DebateSpeak:**
  - **Non-Intrusive Background Orchestration:** Demonstrates that AI should listen quietly in the background during live human communication without introducing cognitive disruption or audio latency.
  - **Asynchronous LLM Multi-Agent Pipeline:** Mirrors DebateSpeak's design where deep analytical extraction (Language, Argument, Fact-Checking) runs asynchronously after the speaking session ends.
- **Limitation:** Designed for corporate productivity and action item tracking; provides **zero language-learning pedagogy** (no CEFR grammar or vocabulary analysis), no speech fluency profiling (WPM, pause durations, fillers), and no fact-checking of claims made.

---

## 5. Comparative Synthesis & Differentiation
*Performed by: Nguyễn Hồng Tấn Tài (24125078) | Reviewed by: Trần Lê Anh Tuấn (24125107) | Edited by: Nguyễn Đình Thiên Lộc (24125093)*

### 5.1 Comprehensive Feature Matrix

| Evaluation Dimension | ArguFight | Luyennoi.com | ELSA Speak | Google Meet + Gemini | **DebateSpeak AI (Proposed)** |
|---|---|---|---|---|---|
| **Core Primary Purpose** | Competitive debate game | Solo IELTS speaking drills | Solo pronunciation practice | Enterprise meeting productivity | **Spoken English learning & critical-thinking debate** |
| **Interaction Format** | Asynchronous audio/text turns | Solo recording on web | Solo phoneme drills | Multi-party live video meeting | **Synchronous live peer debate (2 debaters in room)** |
| **Audio Routing Architecture** | Uploaded audio files | Browser Web Audio recording | Native mobile audio recording | WebRTC media routing | **LiveKit Cloud SFU (low-latency WebRTC peer audio)** |
| **Language Pedagogy (CEFR)** | None | Yes (IELTS 4 criteria) | Yes (Pronunciation/Acoustic) | None | **Yes (CEFR A2–C1 grammar, vocab breadth & fluency)** |
| **Spoken Fluency Metrics** | None | High-level fluency band | Phoneme/syllable accuracy | None | **WPM, filler rate, pause profile, lexical diversity (MATTR)** |
| **Argument Structure Analysis** | Judge roleplay text | None | None | Topic clustering | **Claim extraction, rebuttal mapping, fallacy detection** |
| **Fact-Checking Mechanism** | Internal knowledge base | None | None | None | **Live search retrieval (Serper/Tavily) + Skeptic consensus** |
| **Post-Session Output** | Win / Loss verdict | Scorecard + sentence tips | Pronunciation scorecard | Meeting notes & action items | **Personalized action plan with verbatim quote corrections** |

### 5.2 Key Differentiators for DebateSpeak AI
1. **Learning-First Debate Vehicle:** Unlike ArguFight (competitive game) and Google Meet (corporate notes), DebateSpeak uses debate purely as an *educational vehicle* to elicit unscripted, spontaneous speech from language learners.
2. **From Solo Cramming to Live Interaction:** Unlike Luyennoi.com and ELSA Speak where learners practice monologues in isolation, DebateSpeak introduces real-time peer dialogue where learners must listen actively, think on their feet, and formulate rebuttals.
3. **Strict Quote-Grounded Remediation:** Adopting Luyennoi.com's strength of citing learner sentences, DebateSpeak's **Grounding Guard** guarantees 100% of feedback items cite verbatim transcript quotes from the debate, eliminating AI hallucinations.
4. **Empirical Fact-Checking with Transparency:** DebateSpeak goes beyond opinionated scoring by verifying check-worthy claims through live search engines, presenting transparent source URLs, and flagging contested claims.

### 5.3 UI/UX Patterns Adopted from Surveyed Systems
- **From Luyennoi.com:** We adopt the **zero-install web-first audio experience** and the **quote-grounded sentence remediation pattern**, showing learners exactly what they said alongside targeted corrections.
- **From Google Meet with Gemini:** We adopt the **non-intrusive background listener architecture**, where live WebRTC audio streams quietly to backend transcription workers while deep multi-agent evaluation runs asynchronously to produce structured summaries.
- **From ArguFight:** We adopt the **multi-perspective evaluation layout**, presenting distinct coach analyses (Language, Argument, Fact-Checking) as organized, tabbed scorecards.
- **From ELSA Speak:** We adopt the **longitudinal progress visualizer**, tracking speaking speed, filler frequency, and vocabulary growth across debate rounds over time.
