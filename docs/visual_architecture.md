# Agent Darwin - Visual Architecture Guide

Comprehensive Mermaid diagrams showing the system architecture from multiple perspectives.

---

## 1. Complete Generation Cycle Flow

**The end-to-end pipeline for one generation:**

```mermaid
graph TD
    START[("🎬 START GENERATION")]
    
    START --> INIT["Initialize Population"]
    INIT --> GEN["<b>STAGE 1: GENERATION</b><br/>🧬 Create N random agents<br/>with diverse trait values"]
    
    GEN --> BUILD["<b>STAGE 2: BUILD PROMPTS</b><br/>🎨 Convert genome traits<br/>into LLM instructions<br/>(creativity → explore,<br/>depth → analyze, etc.)"]
    
    BUILD --> EXEC["<b>STAGE 3: AGENT EXECUTION LAYER</b><br/>🤖 Prompt Construction → LLM Inference<br/>→ Response Collection"]
    
    EXEC --> CHECK_CACHE{"Cache<br/>Hit?"}
    CHECK_CACHE -->|Yes| CACHED["Use cached solution"]
    CHECK_CACHE -->|No| API["Call LLM API<br/>Cache result"]
    CACHED --> JUDGE
    API --> JUDGE
    
    JUDGE["<b>STAGE 4: EVALUATE</b><br/>🏆 Global Judge scores solutions<br/>on 4 criteria:<br/>• Novelty<br/>• Feasibility<br/>• Completeness<br/>• Clarity"]
    
    JUDGE --> RANK["<b>STAGE 5: RANK</b><br/>📊 Normalize scores<br/>Assign ranks 1-N<br/>Compute percentiles"]
    
    RANK --> STORE["<b>STAGE 6: STORE WINNERS</b><br/>💾 Save top solutions to<br/>Winner Memory (JSON)<br/>Persist genome + score"]
    
    STORE --> ANALYZE["<b>STAGE 7: ANALYZE</b><br/>🔍 Trait Analyzer finds patterns:<br/>• Which traits = high scores?<br/>• Optimal ranges?<br/>• Correlations?"]
    
    ANALYZE --> EXTRACT["<b>STAGE 8: EXTRACT RULES</b><br/>📜 Rule Extractor discovers:<br/>• Success patterns<br/>• Frequency analysis<br/>• Confidence scoring"]
    
    EXTRACT --> SYNTHESIZE["<b>STAGE 9: SYNTHESIZE</b><br/>📚 Combine patterns into<br/>actionable evolution guidance"]
    
    SYNTHESIZE --> SELECT["<b>STAGE 10: SELECT</b><br/>👥 Choose top 2 survivors<br/>as breeding parents"]
    
    SELECT --> CROSS["<b>STAGE 11: CROSSOVER</b><br/>🔀 Mix parent traits<br/>Create 3 children<br/>via genetic recombination"]
    
    CROSS --> MUTATE["<b>STAGE 12: ADAPTIVE MUTATION</b><br/>🧬 Mutate children traits<br/>GUIDED by learned patterns<br/>Not random!"]
    
    MUTATE --> COMBINE["<b>STAGE 13: NEW POPULATION</b><br/>📋 Combine: [Parent1, Parent2,<br/>Child1, Child2, Child3]"]
    
    COMBINE --> LOOP{More<br/>Gens?}
    LOOP -->|Yes| GEN
    LOOP -->|No| END[("✅ EVOLUTION COMPLETE")]
    
    style START fill:#c8e6c9
    style GEN fill:#e8f4f8
    style BUILD fill:#fff4e6
    style EXEC fill:#fff4e6
    style CACHED fill:#c8e6c9
    style API fill:#fbe9e7
    style JUDGE fill:#f3e5f5
    style RANK fill:#f3e5f5
    style STORE fill:#e8f5e9
    style ANALYZE fill:#e8f5e9
    style EXTRACT fill:#e8f5e9
    style SYNTHESIZE fill:#fff3e0
    style SELECT fill:#fce4ec
    style CROSS fill:#fce4ec
    style MUTATE fill:#fce4ec
    style COMBINE fill:#c8e6c9
    style END fill:#81c784
```

---

## 2. Component Interaction Architecture

**How major components communicate:**

```mermaid
graph TB
    subgraph Genetics["🧬 Genetic Layer"]
        GENOME["Agent<br/>Genomes"]
        CROSS["Crossover"]
        MUTATE["Adaptive<br/>Mutation"]
    end
    
    subgraph Execution["⚙️ Agent Execution Layer"]
        CACHE["Cache<br/>Manager"]
        PC["Prompt<br/>Construction"]
        LI["LLM<br/>Inference"]
        RC["Response<br/>Collection"]
    end
    
    subgraph Evaluation["📊 Evaluation Layer"]
        JUDGE["Global<br/>Judge"]
        RANK["Ranking<br/>System"]
    end
    
    subgraph Memory["🧠 Memory & Learning Layer"]
        WINNER["Winner<br/>Memory"]
        TRAIT["Trait<br/>Analyzer"]
        RULE["Rule<br/>Extractor"]
        LESSON["Lesson<br/>Synthesizer"]
    end
    
    subgraph External["🌐 External"]
        LLM["LLM API<br/>Google/OpenAI"]
        STORAGE["File Storage<br/>JSON"]
    end
    
    GENOME -->|"traits"| PC
    PC -->|"prompt"| CACHE
    CACHE -->|"cached or miss"| LI
    LI -->|"query"| LLM
    LLM -->|"response"| RC
    RC -->|"solution"| JUDGE
    JUDGE -->|"ranked results"| RANK
    RANK -->|"normalized scores"| WINNER
    WINNER -->|"winners"| TRAIT
    WINNER -->|"winners"| RULE
    TRAIT -->|"patterns"| LESSON
    RULE -->|"patterns"| LESSON
    LESSON -->|"guidance"| MUTATE
    RANK -->|"top 2"| CROSS
    CROSS -->|"children"| MUTATE
    MUTATE -->|"new genomes"| GENOME
    WINNER -->|"persist"| STORAGE
    CACHE -->|"persist"| STORAGE
    
    style GENOME fill:#e8f4f8,stroke:#01579b,stroke-width:2px
    style CROSS fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style MUTATE fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style CACHE fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style PC fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style LI fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style RC fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style JUDGE fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style RANK fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style WINNER fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style TRAIT fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style RULE fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style LESSON fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style LLM fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style STORAGE fill:#fff9c4,stroke:#f57f17,stroke-width:2px
```

---

## 3. Data Flow Perspective

**Information flowing through the system:**

```mermaid
graph LR
    TASK["📋 Task Definition"]
    
    TASK -->|"task context"| GEN["Generate<br/>Population"]
    
    GEN -->|"agents: AgentGenome[]"| BUILD["Build<br/>Prompts"]
    
    BUILD -->|"prompts: string[]"| EXEC["Agent<br/>Execution<br/>Layer"]
    
    EXEC -->|"solutions: Result[]<br/>{agent, solution}"| JUDGE["Judge<br/>Solutions"]
    
    JUDGE -->|"judged: JudgeResult[]<br/>{score, rank, eval}"| RANK["Ranking<br/>System"]
    
    RANK -->|"normalized: RankedResult[]<br/>{agent, score, rank}"| MEMORY["Update<br/>Memory"]
    
    MEMORY -->|"winners: WinnerEntry[]"| ANALYZE["Analyze<br/>Patterns"]
    
    ANALYZE -->|"patterns: TraitAnalysis<br/>rules: Rule[]"| SYNTHESIZE["Synthesize<br/>Lessons"]
    
    SYNTHESIZE -->|"guidance: LessonGuidance<br/>{traits, rules}"| SELECT["Select<br/>Parents"]
    
    SELECT -->|"parents: AgentGenome[]"| CROSS["Crossover"]
    
    CROSS -->|"children: AgentGenome[]"| MUTATE["Adaptive<br/>Mutation"]
    
    MUTATE -->|"mutated: AgentGenome[]<br/>informed by guidance"| NEXT["➡️ Next<br/>Generation"]
    
    NEXT -.->|"feedback loop"| BUILD
    
    style TASK fill:#fff9c4
    style GEN fill:#e8f4f8
    style BUILD fill:#fff4e6
    style EXEC fill:#fff4e6
    style JUDGE fill:#f3e5f5
    style RANK fill:#f3e5f5
    style MEMORY fill:#e8f5e9
    style ANALYZE fill:#e8f5e9
    style SYNTHESIZE fill:#fff3e0
    style SELECT fill:#fce4ec
    style CROSS fill:#fce4ec
    style MUTATE fill:#fce4ec
    style NEXT fill:#c8e6c9
```

---

## 4. Parallel Execution Model

**How generations can be parallelized:**

```mermaid
graph TB
    GEN["🧬 Generation N<br/>Population: [A1, A2, A3, A4, A5]"]
    
    GEN --> SPLIT["Split into batches"]
    
    SPLIT --> BATCH1["<b>Batch 1</b><br/>A1, A2"]
    SPLIT --> BATCH2["<b>Batch 2</b><br/>A3, A4"]
    SPLIT --> BATCH3["<b>Batch 3</b><br/>A5"]
    
    BATCH1 -->|"parallel<br/>LLM calls"| RES1["Solutions<br/>S1, S2"]
    BATCH2 -->|"parallel<br/>LLM calls"| RES2["Solutions<br/>S3, S4"]
    BATCH3 -->|"parallel<br/>LLM calls"| RES3["Solutions<br/>S5"]
    
    RES1 --> COMBINE["Combine Results"]
    RES2 --> COMBINE
    RES3 --> COMBINE
    
    COMBINE --> JUDGE["Judge All<br/>(batch processing)"]
    
    JUDGE --> RANK["Rank Results"]
    
    RANK --> MEMORY["Update Memory"]
    
    MEMORY --> ANALYZE["Analyze<br/>(single-threaded)"]
    
    ANALYZE --> EVOLVE["Evolve Next Gen<br/>(single-threaded)"]
    
    EVOLVE --> NEXT["➡️ Generation N+1"]
    
    style GEN fill:#e8f4f8,stroke:#01579b,stroke-width:2px
    style SPLIT fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style BATCH1 fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style BATCH2 fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style BATCH3 fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style RES1 fill:#f3e5f5
    style RES2 fill:#f3e5f5
    style RES3 fill:#f3e5f5
    style COMBINE fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style JUDGE fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style RANK fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style MEMORY fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style ANALYZE fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style EVOLVE fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style NEXT fill:#c8e6c9,stroke:#33691e,stroke-width:2px
    
    classDef parallel fill:#fff4e6,stroke-dasharray: 5 5
```

---

## 5. Adaptive Mutation Deep Dive

**How learned patterns guide evolution:**

```mermaid
graph TD
    WINNER["💾 Winner Memory<br/>(Top solutions)"]
    
    WINNER --> TA["🔍 Trait Analyzer<br/>Statistical Analysis"]
    
    TA -->|"correlations"| TCOR["Find trait correlations<br/>• creativity: r=0.89<br/>• depth: r=0.87<br/>• skepticism: r=-0.72"]
    
    TCOR -->|"optimal ranges"| TRANGE["Compute optimal ranges<br/>• creativity: [80-95]<br/>• depth: [82-92]<br/>• risk: [35-50]"]
    
    WINNER --> RE["📜 Rule Extractor<br/>Pattern Discovery"]
    
    RE -->|"frequent patterns"| RULES["Extract success rules<br/>• 'Include timeline' (92%)<br/>• 'Market analysis' (88%)<br/>• 'Tech differentiation' (85%)"]
    
    RULES -->|"rule guidance"| RGUIDE["Map rules to traits<br/>• timeline → depth<br/>• analysis → skepticism<br/>• innovation → creativity"]
    
    TRANGE --> LESSON["📚 Lesson Synthesizer"]
    RGUIDE --> LESSON
    
    LESSON -->|"synthesize"| GUIDANCE["Create Evolution Guidance<br/>{<br/> 'creativity': {<br/>   'optimal': [80,95],<br/>   'importance': 0.89<br/> },<br/> ...<br/>}"]
    
    GUIDANCE --> MUTATE["🧬 Adaptive Mutation<br/>(Breeding Stage)"]
    
    MUTATE -->|"Parent1 + Parent2"| CROSS["Crossover<br/>Mix traits"]
    
    CROSS -->|"children"| MUT["For each trait:<br/>IF in guidance:<br/>  bias_toward(optimal_range)<br/>ELSE:<br/>  random_mutation()"]
    
    MUT -->|"mutated child"| CHILD["Child Genome<br/>with evolved traits<br/>biased toward success"]
    
    CHILD -->|"new generation"| NEXT["Next Generation<br/>(informed by memory)"]
    
    style WINNER fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style TA fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style RE fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style TCOR fill:#c8e6c9
    style TRANGE fill:#c8e6c9
    style RULES fill:#c8e6c9
    style RGUIDE fill:#c8e6c9
    style LESSON fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style GUIDANCE fill:#fff3e0
    style MUTATE fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style CROSS fill:#fce4ec
    style MUT fill:#fce4ec
    style CHILD fill:#fce4ec
    style NEXT fill:#c8e6c9,stroke:#33691e,stroke-width:2px
```

---

## 6. Module Dependency Graph

**System module dependencies and imports:**

```mermaid
graph TB
    CONFIG["📄 config.py<br/>(Configuration)"]
    
    CONFIG --> LLM["🛠️ utils/llm.py<br/>(LLM API)"]
    
    CONFIG --> GENOME["🧬 agents/agent_genome.py<br/>(AgentGenome)"]
    
    GENOME --> PROMPT["🎨 agents/prompt_builder.py<br/>(Prompt Builder)"]
    
    PROMPT --> EXEC["⚙️ agents/executor.py<br/>(Executor)"]
    
    LLM --> EXEC
    
    EXEC --> JUDGE["🏆 judge/global_judge.py<br/>(Global Judge)"]
    
    JUDGE --> RANK["📊 judge/ranking_utils.py<br/>(Ranking)"]
    
    EXEC --> CACHE["💾 cache/cache_manager.py<br/>(Cache)"]
    
    CACHE --> EXEC
    
    RANK --> WINNER["🧠 memory/winner_memory.py<br/>(Winner Memory)"]
    
    WINNER --> TRAIT["🔍 memory/trait_analyzer.py<br/>(Trait Analysis)"]
    
    WINNER --> RULE["📜 memory/rule_extractor.py<br/>(Rule Extraction)"]
    
    TRAIT --> LESSON["📚 memory/lesson_synthesizer.py<br/>(Lesson Synthesis)"]
    
    RULE --> LESSON
    
    RANK --> SELECT["👥 evolution/selector.py<br/>(Selector)"]
    
    SELECT --> CROSS["🔀 evolution/crossover.py<br/>(Crossover)"]
    
    CROSS --> MUTATE["🧬 evolution/mutation.py<br/>(Mutation)"]
    
    LESSON --> MUTATE
    
    SELECT --> RUNNER["🎬 evolution/generation_runner.py<br/>(Generation Runner)"]
    
    CROSS --> RUNNER
    
    MUTATE --> RUNNER
    
    GENOME --> RUNNER
    
    EXEC --> RUNNER
    
    JUDGE --> RUNNER
    
    RANK --> RUNNER
    
    WINNER --> RUNNER
    
    RUNNER -.->|"orchestrates"| CONFIG
    
    style CONFIG fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style LLM fill:#fff9c4,stroke:#f57f17,stroke-width:2px
    style GENOME fill:#e8f4f8,stroke:#01579b,stroke-width:2px
    style PROMPT fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style EXEC fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style CACHE fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style JUDGE fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style RANK fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style WINNER fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style TRAIT fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style RULE fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style LESSON fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style SELECT fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style CROSS fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style MUTATE fill:#fce4ec,stroke:#880e4f,stroke-width:2px
    style RUNNER fill:#c8e6c9,stroke:#33691e,stroke-width:2px
```

---

## 7. Quick Reference: Color Coding

Used consistently across all diagrams:

| Color | Layer | Components |
|-------|-------|-----------|
| 🔵 Blue (`#e8f4f8`) | **Genetic** | Genomes, Generation |
| 🟠 Orange (`#fff4e6`) | **Execution** | Prompts, Executor, Cache |
| 🟣 Purple (`#f3e5f5`) | **Evaluation** | Judge, Ranking |
| 🟢 Green (`#e8f5e9`) | **Memory/Learning** | Winner Memory, Analysis, Rules |
| 🟡 Yellow (`#fff3e0`) | **Synthesis** | Lesson Synthesis |
| 🔴 Red (`#fce4ec`) | **Evolution** | Selection, Crossover, Mutation |
| ✅ Light Green (`#c8e6c9`) | **Output/Complete** | Next generation, Results |

---

## 8. Scaling Architecture

**How the system scales with population and generations:**

```mermaid
graph LR
    SCALE_INPUT["Population: N agents<br/>Generations: G<br/>Task complexity: T"]
    
    SCALE_INPUT --> COMPUTE["🖥️ Compute Requirements<br/>(LLM API calls)"]
    
    COMPUTE -->|"per generation"| CALLS["N × T calls<br/>@ ~0.8s each<br/>= N × T × 0.8s"]
    
    CALLS -->|"total for G gens"| TOTAL["G × N × T × 0.8s total time<br/>Example: 3 gens × 5 agents × 1 task<br/>= 12 seconds"]
    
    SCALE_INPUT --> MEMORY_REQ["💾 Memory Requirements<br/>(Persistent storage)"]
    
    MEMORY_REQ -->|"winner memory"| WMEM["G × topK entries<br/>~1KB per entry<br/>Example: 3 × 10 = 30KB"]
    
    SCALE_INPUT --> CACHE_OPT["⚡ Cache Optimization<br/>(API call reduction)"]
    
    CACHE_OPT -->|"crossover reuse"| CREUSE["Crossover produces<br/>similar genomes<br/>Cache hit rate: ~20-40%<br/>Savings: 1-2s per gen"]
    
    TOTAL --> WALLTIME["⏱️ Wall Time"]
    WMEM --> WALLTIME
    CREUSE --> WALLTIME
    
    WALLTIME -->|"Practical timing"| ESTIMATE["Gen 1: ~4s (no cache)<br/>Gen 2-3: ~2-3s (with cache)<br/>Total: ~8-10s for 3 gens"]
    
    style SCALE_INPUT fill:#fff9c4
    style COMPUTE fill:#fff4e6,stroke:#e65100,stroke-width:2px
    style CALLS fill:#fff4e6
    style MEMORY_REQ fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px
    style WMEM fill:#e8f5e9
    style CACHE_OPT fill:#c8e6c9,stroke:#33691e,stroke-width:2px
    style CREUSE fill:#c8e6c9
    style WALLTIME fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    style ESTIMATE fill:#f3e5f5
```

---

*All diagrams are GitHub-compatible Mermaid syntax. Copy any diagram into a `.md` file for instant rendering in GitHub.*

**Last Updated**: June 3, 2026  
**Mermaid Version**: 10.0+
