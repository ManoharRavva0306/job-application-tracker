const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Intelligent Domain Knowledge Base for Deeply Customized Plans
const getDomainCurriculum = (role, company) => {
  const r = role.toLowerCase();
  const c = company || 'Tech Company';

  if (r.includes('frontend') || r.includes('react') || r.includes('ui') || r.includes('web')) {
    return {
      skills: [
        'React 19 Hooks, Fiber Reconciler & Virtual DOM Mechanics',
        'State Architecture (Zustand, Redux Toolkit, Context API)',
        'CSS Layout Engines (Grid, Flexbox, Tailwind CSS, Responsive Design)',
        'Web Performance (Core Web Vitals, Code Splitting, Bundle Optimization)',
        'TypeScript Interfaces, Generics & Component Typing',
      ],
      days: [
        {
          focus: `${c} Architecture & Component Design`,
          tasks: [
            `Audit ${c}'s user-facing web apps and design system`,
            `Build an interactive component using memoization and custom hooks`,
            `Prepare your pitch on architectural decisions you made in past frontend projects`,
          ],
        },
        {
          focus: 'State Management & Asynchronous Data',
          tasks: [
            `Compare client-side caching vs server state (React Query / SWR / Axios interceptors)`,
            `Handle optimistic UI updates, debouncing, and pagination edge cases`,
            `Solve 2 coding challenges: Virtual list rendering & Autocomplete search`,
          ],
        },
        {
          focus: 'Web Performance & Core Web Vitals',
          tasks: [
            `Deep dive into Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and INP`,
            `Practice diagnosing re-render bottlenecks using React DevTools Profiler`,
            `Review lazy loading, dynamic imports, and asset compression techniques`,
          ],
        },
        {
          focus: 'Behavioral & Cross-Functional Collaboration',
          tasks: [
            `Formulate STAR stories: Working with UI/UX designers and Product Managers`,
            `Practice answering: "Tell me about a time you had to push back on a feature deadline"`,
            `Prepare your technical explanation of modern accessibility (WCAG AA, ARIA roles)`,
          ],
        },
        {
          focus: `System Design & Final Rehearsal for ${c}`,
          tasks: [
            `Design a real-world web application: (e.g. Netflix Video Browser / Twitter Feed / Google Docs)`,
            `Review your GitHub repositories and resume technical talking points`,
            `Prepare 5 high-impact questions to ask your interviewers at ${c}`,
          ],
        },
      ],
      questions: [
        `How does the React Fiber reconciler prioritize updates and manage interruptions?`,
        `Walk me through how you would optimize a slow-rendering dashboard with 10,000 live data rows.`,
        `How do you handle client-side authentication tokens, XSS vulnerabilities, and CSRF protection?`,
        `Describe a production bug you introduced or solved, how you diagnosed it, and how you prevented it.`,
        `Why do you want to join ${c}'s engineering team specifically?`,
      ],
    };
  }

  if (r.includes('embedded') || r.includes('firmware') || r.includes('iot') || r.includes('stm32') || r.includes('c++')) {
    return {
      skills: [
        'C/C++ Memory Management, Pointers & Volatile Keyword',
        'Microcontroller Peripherals (GPIO, UART, SPI, I2C, DMA, Timers)',
        'Interrupt Service Routines (ISRs) & Real-Time Operating Systems (FreeRTOS)',
        'Low-Power Modes, Hardware Clocks & Power Optimization',
        'Hardware Debugging (Oscilloscopes, Logic Analyzers, JTAG/SWD)',
      ],
      days: [
        {
          focus: `${c} Hardware Domain & C Fundamentals`,
          tasks: [
            `Analyze ${c}'s hardware platforms, microcontrollers, and system architecture`,
            `Practice pointer arithmetic, function pointers, and bitwise register manipulation`,
            `Explain the difference between stack, heap, BSS, and flash memory segments`,
          ],
        },
        {
          focus: 'Peripherals, Protocols & Bus Communication',
          tasks: [
            `Contrast SPI vs I2C vs UART (Clock lines, pull-up resistors, speed limitations)`,
            `Write driver code for reading sensor data using interrupts and DMA buffers`,
            `Solve circular buffer implementation for asynchronous serial communication`,
          ],
        },
        {
          focus: 'RTOS Concepts & Concurrency',
          tasks: [
            `Understand FreeRTOS task scheduling, priority inversion, and mutexes vs semaphores`,
            `Prevent deadlocks, race conditions, and memory leaks in real-time systems`,
            `Calculate worst-case interrupt latency and task execution deadlines`,
          ],
        },
        {
          focus: 'Firmware Architecture & Safety Critical Design',
          tasks: [
            `Prepare STAR stories: Debugging intermittent hardware faults or race conditions`,
            `Review watchdog timers, brown-out detection, and fail-safe recovery patterns`,
            `Explain how you test and automate firmware regression with simulation or hardware-in-the-loop`,
          ],
        },
        {
          focus: `System Design & Final Rehearsal for ${c}`,
          tasks: [
            `Architect an embedded device (e.g. Smart Battery Monitor / IoT Telemetry Unit)`,
            `Review all C code and hardware projects listed on your resume`,
            `Formulate 5 technical questions to ask the engineering team at ${c}`,
          ],
        },
      ],
      questions: [
        `What happens when an interrupt fires during an atomic operation, and how do you protect shared memory?`,
        `Explain the exact role of the 'volatile' keyword in embedded C with a real hardware example.`,
        `How do you diagnose and fix a memory leak or stack overflow in a memory-constrained MCU?`,
        `How does DMA transfer data without CPU intervention, and what are its cache coherency caveats?`,
        `Why do you want to engineer embedded hardware solutions at ${c}?`,
      ],
    };
  }

  // Default / Backend & Full Stack
  return {
    skills: [
      'Microservice & Monolith Architecture, Clean Code & SOLID Principles',
      'RESTful & GraphQL API Design with JWT & OAuth2 Security',
      'Database Optimization (MongoDB Aggregation, SQL Indexing, B-Trees)',
      'Distributed Caching (Redis), Message Queues (Kafka/RabbitMQ)',
      'Docker Containerization, CI/CD Pipelines & Cloud Architecture',
    ],
    days: [
      {
        focus: `${c} Business Domain & API Foundations`,
        tasks: [
          `Research ${c}'s product ecosystem, scalability challenges, and engineering blogs`,
          `Review REST status codes (200, 201, 204, 400, 401, 403, 404, 409, 500, 502)`,
          `Prepare your 2-minute project pitch focusing on backend throughput and reliability`,
        ],
      },
      {
        focus: 'Database Modeling & Query Performance',
        tasks: [
          `Deep dive into indexing strategies (Compound, Sparse, TTL, Text) in MongoDB/PostgreSQL`,
          `Write complex aggregation pipelines ($lookup, $unwind, $group, $facet)`,
          `Prevent N+1 query problems and design schema for high read/write ratios`,
        ],
      },
      {
        focus: 'System Design & Scalability Patterns',
        tasks: [
          `Practice designing a distributed system (e.g. URL Shortener / Rate Limiter / E-Commerce Backend)`,
          `Incorporate caching layers with Redis (Cache-Aside, Write-Through, Eviction policies)`,
          `Understand database sharding, horizontal vs vertical scaling, and CAP theorem trade-offs`,
        ],
      },
      {
        focus: 'Behavioral & Leadership Scenarios',
        tasks: [
          `Prepare 3 stories using Situation, Task, Action, Result on handling production outages`,
          `Practice answering: "Tell me about a time you disagreed with an architectural decision"`,
          `Discuss strategies for code review, mentoring, and technical debt management`,
        ],
      },
      {
        focus: `Mock Interview & Rehearsal for ${c}`,
        tasks: [
          `Simulate a live 45-minute coding round on data structures (HashMaps, Graphs, Trees)`,
          `Review your system design diagrams and resume bullet points`,
          `Prepare 5 insightful questions about ${c}'s infrastructure and engineering culture`,
        ],
      },
    ],
    questions: [
      `How do you design an API rate limiter to protect ${c}'s endpoints from abuse?`,
      `Explain the differences between optimistic and pessimistic locking in concurrent systems.`,
      `How do you ensure data consistency across multiple microservices without distributed transactions?`,
      `Walk through how you diagnosed and resolved a production bottleneck or slow database query.`,
      `Why is ${c} the right place for your next career step as a ${role}?`,
    ],
  };
};

// Live Google Gemini API Caller
const callGeminiAPI = async (role, company, days, apiKey) => {
  const prompt = `You are an elite Tech Career Coach and Senior Technical Interviewer.
Create a rich, completely unique, and highly specific ${days}-day interview preparation roadmap for a candidate interviewing for the role of "${role}" at "${company || 'a top tech company'}".
Avoid generic advice. Tailor every task and question specifically to the role of ${role} and the engineering culture of ${company}.

Respond STRICTLY with valid JSON conforming to this schema:
{
  "role": "${role}",
  "company": "${company || 'Tech Company'}",
  "durationDays": ${days},
  "technicalFocus": ["4-5 specific high-demand technical skills to master"],
  "dailyPlan": [
    {
      "day": 1,
      "focus": "Specific focus title",
      "tasks": ["Specific technical task 1", "Specific technical task 2", "Specific task 3"]
    }
  ],
  "sampleQuestions": [
    "4-5 challenging technical and behavioral interview questions tailored to ${role} at ${company}"
  ]
}`;

  const models = ['gemini-3.5-flash', 'gemma-4-31b-it', 'gemini-3.8-flash'];
  let lastError = null;

  for (const model of models) {
    try {
      console.log(`🤖 Attempting Gemini model: ${model}...`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              response_mime_type: 'application/json',
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Model ${model} returned ${response.status}: ${errText}`);
      }

      const data = await response.json();
      let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

      const parsed = JSON.parse(rawText);
      parsed.source = `Google Gemini (${model}) [Live AI]`;
      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] ${model} unavailable, trying next...`);
    }
  }

  throw lastError || new Error('All Gemini models failed');
};

// @route POST /api/ai/plan
router.post('/plan', async (req, res) => {
  try {
    const { role, company, days } = req.body;
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && geminiKey.trim() !== '') {
      try {
        const livePlan = await callGeminiAPI(role, company, days || 5, geminiKey);
        console.log(`✅ Live Gemini AI plan generated successfully!`);
        return res.json(livePlan);
      } catch (geminiError) {
        console.warn(`⚠️ Live Gemini call throttled/unavailable, activating specialized curriculum engine: ${geminiError.message}`);
      }
    }

    // Dynamic, deeply customized domain engine
    const domain = getDomainCurriculum(role, company);
    const daysCount = parseInt(days) || 5;

    // Slice or repeat days to match requested duration
    const dailyPlan = [];
    for (let i = 0; i < daysCount; i++) {
      const templateDay = domain.days[i % domain.days.length];
      dailyPlan.push({
        day: i + 1,
        focus: templateDay.focus,
        tasks: templateDay.tasks,
      });
    }

    const plan = {
      source: 'Specialized Curriculum Engine',
      role,
      company: company || 'Tech Company',
      durationDays: daysCount,
      technicalFocus: domain.skills,
      dailyPlan,
      sampleQuestions: domain.questions,
    };

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;