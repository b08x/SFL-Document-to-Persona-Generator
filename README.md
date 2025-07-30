# SFL Document-to-Persona Generator

An innovative application that analyzes source documents using Systemic Functional Linguistics (SFL) principles to automatically generate detailed persona characteristics for dialogue generation. This tool bridges linguistic analysis with AI-powered conversation creation, enabling researchers, writers, and content creators to generate authentic dialogue based on the linguistic patterns found in source texts.

## Features

### Core Functionality
- **Document Analysis**: Upload text documents (.txt, .md) for comprehensive SFL analysis
- **Persona Generation**: Automatically extract linguistic personas from document analysis
- **Dialogue Creation**: Generate conversations between personas with distinct linguistic characteristics
- **Interactive Editing**: Refine individual dialogue turns and add new conversation lines
- **Multiple AI Models**: Support for Google Gemini models with configurable thinking budgets

### SFL Analysis Components
- **Ideational Analysis**: Process type distribution (Material, Mental, Relational, Verbal)
- **Interpersonal Features**: Modality patterns and appraisal system analysis
- **Textual Organization**: Cohesion patterns and thematic progression
- **Technicality Measurement**: Lexical density scoring on a 1-10 scale

### Persona Configuration
- **Ideational Settings**: Process distributions and technicality levels
- **Interpersonal Settings**: Speech functions, modality, and appraisal patterns
- **Textual Settings**: Lexical density, grammatical intricacy, and cohesion features

## Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn package manager
- Google Gemini API key

### Environment Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd SFL-Document-to-Persona-Generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## Usage

### Quick Start

1. **Upload Document**: Drag and drop or select a text file (.txt or .md)
2. **Configure Model**: Choose your Gemini model and optional thinking budget
3. **Analyze**: Click "Analyze" to perform SFL analysis and generate persona
4. **Create Dialogue**: Set topic, context, and length preferences
5. **Generate Conversation**: Create dialogue between personas
6. **Refine & Edit**: Modify individual lines or add new dialogue turns

### Document Requirements
- Supported formats: `.txt`, `.md`
- Recommended length: 500-5000 words for optimal analysis
- Content should contain varied linguistic patterns for rich persona generation

### Model Configuration
- **Gemini 2.5 Flash**: Supports thinking budgets for enhanced reasoning
- **Temperature Settings**: Automatically optimized for different tasks
- **Response Formats**: JSON for analysis, text for dialogue generation

## Project Structure

```
src/
├── App.tsx                 # Main application component
├── components/             # React components
│   ├── AnalysisDetails.tsx    # SFL analysis display
│   ├── DialogueGenerator.tsx  # Dialogue creation interface
│   ├── DocumentInput.tsx      # File upload and parsing
│   ├── HelpMenu.tsx          # User guidance and documentation
│   ├── ModelSettings.tsx      # AI model configuration
│   ├── PersonaBuilder.tsx     # Persona editing interface
│   ├── PersonaOutput.tsx      # Persona display component
│   ├── ResultsDisplay.tsx     # Main results container
│   ├── editors/              # Specialized persona editors
│   │   ├── IdeationalSettingsEditor.tsx
│   │   ├── InterpersonalSettingsEditor.tsx
│   │   └── TextualSettingsEditor.tsx
│   ├── icons/               # Custom SVG icons
│   └── shared/              # Reusable UI components
│       ├── SelectInput.tsx
│       ├── SliderInput.tsx
│       └── TextInput.tsx
├── services/
│   ├── fileParser.ts        # Document parsing utilities
│   └── geminiService.ts     # AI service integration
├── types.ts                 # TypeScript type definitions
└── vite.config.ts          # Vite build configuration
```

## Technical Architecture

### SFL Analysis Pipeline
1. **Document Processing**: Text extraction and preprocessing
2. **Feature Extraction**: Linguistic pattern identification
3. **Quantitative Analysis**: Statistical measurement of SFL features
4. **Persona Mapping**: Translation of linguistic features to persona characteristics
5. **Configuration Generation**: Structured persona parameters for dialogue generation

### Dialogue Generation Process
1. **Persona Configuration**: Apply SFL-derived settings to AI prompts
2. **Context Integration**: Incorporate user-specified topics and constraints
3. **Turn Generation**: Create speaker-specific dialogue lines
4. **Refinement Pipeline**: Interactive editing and enhancement tools

### Data Flow
```
Document Upload → SFL Analysis → Persona Generation → Dialogue Creation → Interactive Refinement
```

## API Integration

### Google Gemini API
The application integrates with Google's Gemini API for:
- Document analysis and SFL feature extraction
- Persona-based dialogue generation
- Individual turn refinement
- Contextual conversation continuation

### Configuration Options
- Model selection (gemini-2.5-flash, etc.)
- Thinking budget allocation for enhanced reasoning
- Temperature control for creative vs. analytical tasks
- Response format specification (JSON/text)

## Development

### Local Development
```bash
# Start development server with hot reload
npm run dev

# Type checking
npx tsc --noEmit

# Build for production
npm run build
```

### Component Architecture
- **React 19**: Latest React features with concurrent rendering
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast build tool with optimized development experience
- **Tailwind CSS**: Utility-first styling (configured in components)

### Adding New Features
1. Define types in `types.ts`
2. Create components in appropriate directories
3. Integrate with `geminiService.ts` for AI functionality
4. Update main `App.tsx` with new features

## Contributing

### Development Guidelines
- Follow existing TypeScript patterns and interfaces
- Maintain SFL theoretical accuracy in analysis algorithms
- Ensure responsive design compatibility
- Include comprehensive error handling
- Document complex linguistic transformations

### Testing
- Test with various document types and lengths
- Verify SFL analysis accuracy against linguistic theory
- Validate persona generation consistency
- Ensure dialogue quality and coherence

## Troubleshooting

### Common Issues

**API Key Problems**
- Ensure `GEMINI_API_KEY` is correctly set in environment
- Verify API key has necessary permissions
- Check for API rate limits or quota exhaustion

**Document Upload Issues**
- Confirm file format is `.txt` or `.md`
- Check file size limits (recommended under 1MB)
- Ensure proper text encoding (UTF-8)

**Analysis Errors**
- Verify document contains sufficient linguistic content
- Check for special characters or formatting issues
- Ensure stable internet connection for API calls

**Dialogue Generation Problems**
- Confirm both personas are successfully generated
- Check topic and context specifications
- Verify model availability and configuration

### Performance Optimization
- Use thinking budgets judiciously to balance quality and speed
- Consider document length for analysis complexity
- Monitor API usage and costs
- Cache persona configurations for repeated use

## License

This project is part of the SFL-Toolbox suite. Please refer to the main repository for licensing information.

## Acknowledgments

- Built on Systemic Functional Linguistics theory by M.A.K. Halliday
- Powered by Google's Gemini AI models
- Uses modern React and TypeScript ecosystem
- Inspired by computational linguistics research