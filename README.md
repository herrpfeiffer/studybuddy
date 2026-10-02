# Weekly Learning Studio

An interactive ~30-minute weekly learning app for 7th grade students, covering Math, English, STEM, Science, and Band. The app provides practice and enrichment activities with answer validation, hints, and concept mastery tracking.

**🎯 Academic Integrity**: This app is designed for **practice and enrichment only** — never framed as homework to submit to school.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown (typically `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 📚 Features

### For Students
- **Interactive Learning Stations**: Math problems with step-by-step validation, STEM explorations, English character analysis, Science observations, and Band reflections
- **Progress Tracking**: Visual progress indicators for each week and station
- **Instant Feedback**: Get immediate feedback on answers with hints when needed
- **Concept Mastery**: Track understanding across different topics
- **Spiral Review**: Suggestions for reviewing concepts that need more practice
- **Mobile & Desktop**: Responsive design works on all devices

### For Parents & Tutors
- **Progress Report**: View accuracy, completed stations, and concept mastery
- **Review Suggestions**: See which concepts need additional practice
- **Export/Import**: Backup progress data or transfer between devices
- **Academic Integrity Note**: Built-in reminders about proper use

## 📖 How to Use

1. **Start with This Week**: Click on any learning station to begin
2. **Complete Activities**: Answer questions, get feedback, and use hints if needed
3. **Track Progress**: Watch your progress bar grow as you complete stations
4. **Review Past Weeks**: Go back to previous weeks to review concepts
5. **Check Progress Report**: Parents and tutors can see detailed progress and mastery levels

## 🗂 Lesson Data Schema

Lessons are stored as JSON files in `public/lessons/`. Each lesson follows this structure:

### Week Lesson Structure

```json
{
  "weekId": "week-01",
  "title": "Week 1: Properties of Equality & Explorations",
  "dateRange": "Sep 14–20, 2026",
  "estimatedMinutes": 30,
  "stations": [...]
}
```

### Station Structure

Each station can have either **problems** (for interactive Q&A) or **content** (for reflections).

#### Station with Problems

```json
{
  "id": "math",
  "title": "Math: Properties of Equality",
  "subject": "Math",
  "conceptTags": ["properties-of-equality", "equation-solving"],
  "estimatedMinutes": 12,
  "problems": [...]
}
```

#### Problem Structure

```json
{
  "id": "math-1",
  "tier": 1,
  "type": "equality-reasoning",
  "prompt": "Question text here...",
  "parts": [...],
  "enrichment": "Optional challenge prompt"
}
```

#### Problem Part Types

**Numeric Input:**
```json
{
  "partId": "solve",
  "question": "Solve for x:",
  "type": "numeric",
  "correctAnswer": 5,
  "hint": "Optional hint text"
}
```

**Text Input:**
```json
{
  "partId": "reasoning",
  "question": "Explain your reasoning:",
  "type": "text",
  "validation": {
    "keywords": ["equivalent", "both sides"],
    "minLength": 20
  },
  "hint": "Optional hint text"
}
```

**Multiple Choice:**
```json
{
  "partId": "who-correct",
  "question": "Who preserved equivalence?",
  "type": "multiple-choice",
  "options": ["Marcus", "Carly", "Both", "Neither"],
  "correctAnswer": 0,
  "explanation": "Marcus preserved equivalence by subtracting 11 from BOTH sides."
}
```

#### Station with Content (Reflections)

```json
{
  "id": "stem",
  "title": "STEM: Future Cities",
  "subject": "STEM",
  "conceptTags": ["urban-planning", "sustainability"],
  "estimatedMinutes": 5,
  "content": {
    "type": "exploration",
    "introduction": "Introductory text...",
    "mediaReference": "Optional podcast/video reference",
    "prompts": [...],
    "enrichment": "Optional challenge activity"
  }
}
```

#### Content Prompt Structure

```json
{
  "id": "stem-1",
  "question": "What would get better for kids your age?",
  "type": "reflection",
  "validation": {
    "minLength": 30
  },
  "hint": "Optional hint text",
  "optional": false
}
```

## 📁 Project Structure

```
weekly-learning-studio/
├── public/
│   └── lessons/
│       └── week-01.json        # Week 1 lesson data
├── src/
│   ├── components/
│   │   ├── WeekView.tsx        # Week overview with stations
│   │   ├── StationView.tsx     # Station container
│   │   ├── ProblemComponent.tsx # Interactive problem solver
│   │   ├── ContentComponent.tsx # Reflection prompts
│   │   ├── SummaryPanel.tsx    # Progress report for parents/tutors
│   │   └── PastWeeksView.tsx   # Review past weeks
│   ├── types/
│   │   └── lesson.ts           # TypeScript type definitions
│   ├── utils/
│   │   ├── storage.ts          # localStorage persistence
│   │   └── validation.ts       # Answer validation logic
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Styling
│   └── main.tsx                # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design Philosophy

- **Kid-Friendly**: Warm colors, encouraging language, emoji accents
- **Not Babyish**: Sophisticated enough for 7th grade
- **Mobile-First**: Touch-friendly buttons, readable on small screens
- **Progress-Oriented**: Clear visual feedback on completion
- **Academically Honest**: Designed for learning, not cheating

## 💾 Data Persistence

Progress is automatically saved to browser localStorage:
- All answers and attempts
- Concept mastery levels
- Week completion status
- Timestamps for review

Export/import functionality allows:
- Backing up progress data
- Transferring progress between devices
- Reviewing detailed history

## 🔄 Adding New Weeks

1. Create a new JSON file in `public/lessons/` (e.g., `week-02.json`)
2. Follow the schema documented above
3. Include `weekId`, `title`, `dateRange`, and `stations`
4. Each station should have:
   - Unique `id`
   - `conceptTags` for mastery tracking
   - Either `problems` or `content`
5. The app will automatically load new weeks

### Example: Adding Week 2

```json
{
  "weekId": "week-02",
  "title": "Week 2: Title Here",
  "dateRange": "Week of September 21-27",
  "estimatedMinutes": 30,
  "stations": [
    {
      "id": "math",
      "title": "Math: New Topic",
      "subject": "Math",
      "conceptTags": ["new-concept"],
      "estimatedMinutes": 12,
      "problems": [...]
    }
  ]
}
```

Then update `App.tsx` to load the new week file:

```typescript
const loadLessons = async () => {
  const week1 = await fetch('/lessons/week-01.json').then(r => r.json());
  const week2 = await fetch('/lessons/week-02.json').then(r => r.json());
  setLessons([week1, week2]);
};
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Week view displays all stations
- [ ] Clicking a station opens it
- [ ] Math problems validate correctly
- [ ] Hints appear after incorrect attempts
- [ ] Progress bar updates
- [ ] Station completion saves progress
- [ ] Past weeks view shows completed weeks
- [ ] Summary panel shows accurate stats
- [ ] Concept mastery updates correctly
- [ ] Export/import works
- [ ] Mobile responsive design works

### Validation Testing

The app includes validation logic for:
- Numeric answers (exact match)
- Text answers (keyword and length validation)
- Multiple choice (correct index)

See `src/utils/validation.ts` for implementation details.

## 🎯 Week 1 Content

Week 1 includes:

### Math: Properties of Equality
5 interactive problems covering:
1. Equivalent equations reasoning
2. Addition property of equality
3. Balance scale model
4. Error analysis (comparing two approaches)
5. Spot the mistake

### STEM: Future Cities
Explore the 15-minute city concept with reflective prompts

### English: Character Identity
Analyze internal vs external character identity

### Science: Quick Check-In
Nature observation and curiosity prompts

### Band: Reflection
Practice reflection and growth mindset

## 🛠 Tech Stack

- **Vite**: Fast build tool and dev server
- **React 18**: UI framework
- **TypeScript**: Type safety
- **CSS3**: Custom styling (no frameworks)
- **localStorage**: Client-side persistence

## 📝 License

This is a custom educational app for personal use.

## 🙏 Acknowledgments

Content based on:
- Math: Properties of Equality curriculum materials
- STEM: 15-minute city concept (Carlos Moreno)
- English: Character analysis techniques
- Academic integrity principles

---

Built with ❤️ for student learning and growth
