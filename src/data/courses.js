/**
 * Centralized course catalog for Talent Institute & Computer Education.
 * Preserves all existing course IDs, titles, and categories for seamless backward compatibility.
 */
export const courses = [
  {
    id: "data-analyst",
    institute: "Talent Institute & Computer Education",
      thumbnail: "/course-images/Data-Analysis.jpg",
    title: "Data Analyst Course",
    shortTitle: "Data Analyst",
    level: "Beginner to Intermediate",
    duration: "6 Months",
    durationHours: "120 Hours",
    fee: "₹3500",
    category: "Data & Analytics",
    badge: "High Demand",
    description: "At Talent Institute & Computer Education, students learn the essential skills required to extract, analyze, and visualize complex data. This comprehensive program walks you through the complete data lifecycle, providing you with practical expertise in top industry tools.",
    highlights: [
      "In-depth training on Advanced Excel and Power BI",
      "Hands-on SQL database management",
      "Practical Python programming with Pandas",
      "Real-world data cleaning and analysis projects",
      "Professional dashboard creation and reporting",
      "Dedicated interview preparation and portfolio building"
    ],
    prerequisites: "Basic computer literacy and foundational math skills. No prior coding experience required.",
    targetAudience: "Students, graduates, and professionals aiming to build a career in data analysis or business intelligence.",
    careerOpportunities: [
      "Data Analyst",
      "Business Intelligence (BI) Analyst",
      "Data Operations Associate",
      "MIS Executive",
      "Reporting Analyst"
    ],
    syllabus: [
      {
        module: "Module 1: Data Analytics Fundamentals and Advanced Excel",
        topics: [
          "Introduction to Data Analytics",
          "Advanced formulas and functions",
          "PivotTables and PivotCharts",
          "Data validation and conditional formatting"
        ]
      },
      {
        module: "Module 2: Data Cleaning and Exploratory Analysis",
        topics: [
          "Identifying and handling missing data",
          "Removing duplicates and standardizing text",
          "Exploratory Data Analysis (EDA) concepts",
          "Statistical summarization"
        ]
      },
      {
        module: "Module 3: SQL and Relational Databases",
        topics: [
          "Database concepts and RDBMS",
          "Writing basic to advanced SQL queries",
          "Joins, group by, and aggregate functions",
          "Subqueries and data manipulation"
        ]
      },
      {
        module: "Module 4: Power BI and Dashboards",
        topics: [
          "Introduction to Power BI Desktop",
          "Connecting to multiple data sources",
          "Data modeling and DAX basics",
          "Building interactive dashboards and reports"
        ]
      },
      {
        module: "Module 5: Python for Data Analysis",
        topics: [
          "Python basics (syntax, data types, loops)",
          "Introduction to Pandas library",
          "Data manipulation with Pandas DataFrames",
          "Basic data visualization with Python"
        ]
      },
      {
        module: "Module 6: Practical Projects and Interview Preparation",
        topics: [
          "End-to-end data analysis project",
          "Creating a professional data portfolio",
          "Resume building for data roles",
          "Mock interviews and common questions"
        ]
      }
    ]
  },
  {
    id: "web-designing",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/web-designing.jpg",
    title: "Web Designing Course",
    shortTitle: "Web Design",
    level: "Beginner to Intermediate",
    duration: "6 Months",
    durationHours: "120 Hours",
    fee: "₹25,000",
    category: "Development",
    badge: "Top Rated",
    description: "At Talent Institute & Computer Education, students learn how to craft beautiful, responsive, and user-friendly websites. This course covers everything from basic HTML to modern, mobile-first design principles, empowering you to build professional web interfaces from scratch.",
    highlights: [
      "Mastery of HTML5 and CSS3 styling",
      "Mobile-first and responsive design techniques",
      "Fundamentals of UI design and wireframing",
      "Interactive elements using modern JavaScript",
      "Hands-on website deployment training",
      "Creation of a complete live project for your portfolio"
    ],
    prerequisites: "Basic familiarity with using a computer and browsing the internet.",
    targetAudience: "Creative individuals, aspiring frontend developers, and freelancers wanting to learn website creation.",
    careerOpportunities: [
      "Web Designer",
      "Frontend Developer (Entry Level)",
      "UI Developer",
      "Freelance Web Creator",
      "Web Content Manager"
    ],
    syllabus: [
      {
        module: "Module 1: Web Fundamentals and HTML5",
        topics: [
          "How the web works and internet basics",
          "Introduction to HTML5 and semantic tags",
          "Forms, inputs, and multimedia elements",
          "Structuring web pages effectively"
        ]
      },
      {
        module: "Module 2: CSS3 and Modern Layouts",
        topics: [
          "CSS syntax, selectors, and styling text",
          "The Box Model (margins, borders, padding)",
          "Flexbox layout system",
          "CSS Grid for complex layouts"
        ]
      },
      {
        module: "Module 3: Responsive and Mobile-First Design",
        topics: [
          "Understanding responsive web design (RWD)",
          "Media queries and breakpoints",
          "Mobile-first workflow approaches",
          "Testing responsiveness across devices"
        ]
      },
      {
        module: "Module 4: UI Design Fundamentals and Website Planning",
        topics: [
          "Color theory and typography basics",
          "Wireframing and prototyping concepts",
          "Best practices in User Interface (UI) design",
          "Planning website architecture"
        ]
      },
      {
        module: "Module 5: JavaScript Basics and Interactivity",
        topics: [
          "Adding JavaScript to web pages",
          "Variables, data types, and functions",
          "DOM manipulation basics",
          "Creating simple interactive elements (sliders, menus)"
        ]
      },
      {
        module: "Module 6: Website Deployment and Final Project",
        topics: [
          "Domain names and web hosting fundamentals",
          "Using FTP and control panels",
          "Deploying a static website online",
          "Final responsive website project presentation"
        ]
      }
    ]
  },
  {
    id: "tally-prime-gst",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/Tally.jpg",
    title: "Tally Prime with GST",
    shortTitle: "Tally Prime",
    level: "Beginner",
    duration: "3 Months",
    durationHours: "60 Hours",
    fee: "₹10,000",
    category: "Accounting",
    badge: "Career Essential",
    description: "At Talent Institute & Computer Education, students learn the computerized accounting skills highly sought after by modern businesses. This course provides comprehensive training on Tally Prime, covering everything from basic vouchers to complete GST compliance and financial reporting.",
    highlights: [
      "Complete company setup and ledger management",
      "Daily accounting and voucher entry",
      "Advanced inventory and stock maintenance",
      "End-to-end GST configuration and billing",
      "Generation of balance sheets and MIS reports",
      "Practical case studies based on real business scenarios"
    ],
    prerequisites: "Basic knowledge of computers. A foundational understanding of accounting principles is helpful but not strictly required.",
    targetAudience: "Commerce students, small business owners, and accounting professionals aiming to upgrade their software skills.",
    careerOpportunities: [
      "Tally Operator",
      "Accountant",
      "Billing Executive",
      "Accounts Assistant",
      "Inventory Manager"
    ],
    syllabus: [
      {
        module: "Module 1: Accounting Fundamentals and Company Setup",
        topics: [
          "Basics of financial accounting",
          "Introduction to Tally Prime interface",
          "Creating and managing a company profile",
          "Understanding features and configurations"
        ]
      },
      {
        module: "Module 2: Ledgers, Groups, and Daily Transactions",
        topics: [
          "Creating accounting groups and ledgers",
          "Understanding different voucher types",
          "Recording payments, receipts, and journal entries",
          "Contra entries and banking transactions"
        ]
      },
      {
        module: "Module 3: Inventory and Stock Management",
        topics: [
          "Creating stock groups, categories, and items",
          "Units of measure configuration",
          "Purchase and sales order processing",
          "Stock summary and inventory valuation"
        ]
      },
      {
        module: "Module 4: GST Configuration and Billing",
        topics: [
          "Basic concepts of GST in India",
          "Enabling GST in Tally Prime",
          "Creating GST-compliant ledgers and items",
          "Generating tax invoices and GST reports"
        ]
      },
      {
        module: "Module 5: Financial Reports and Practical Exercises",
        topics: [
          "Viewing Balance Sheet and Profit & Loss A/c",
          "Analyzing Trial Balance and Day Book",
          "Bank Reconciliation Statement (BRS)",
          "Practical accounting case studies"
        ]
      }
    ]
  },
  {
    id: "python-programming",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/Python.jpg",
    title: "Python Programming Course",
    shortTitle: "Python",
    level: "Beginner",
    duration: "3 Months",
    durationHours: "60 Hours",
    fee: "₹10,000",
    category: "Development",
    badge: "Trending",
    description: "At Talent Institute & Computer Education, students learn one of the world's most versatile and popular programming languages. This course is designed to take you from coding basics to building fully functional applications using Python, laying a strong foundation for a software development career.",
    highlights: [
      "Step-by-step introduction to programming logic",
      "Comprehensive coverage of Python syntax and structures",
      "Hands-on coding with modern IDEs",
      "Deep dive into collections like lists and dictionaries",
      "Practical error handling and debugging techniques",
      "Development of custom mini-projects"
    ],
    prerequisites: "Basic computer navigation skills. No prior programming background is needed.",
    targetAudience: "Beginners, IT aspirants, and professionals looking to automate tasks or pivot to software development.",
    careerOpportunities: [
      "Python Developer (Entry Level)",
      "Backend Programmer",
      "Automation Script Developer",
      "Software Trainee",
      "Technical Support Engineer"
    ],
    syllabus: [
      {
        module: "Module 1: Python Setup, Syntax, and Data Types",
        topics: [
          "Installing Python and setting up an IDE",
          "Writing your first Python program",
          "Understanding variables and naming conventions",
          "Basic data types (integers, floats, strings, booleans)"
        ]
      },
      {
        module: "Module 2: Operators, Conditions, and Logic Building",
        topics: [
          "Arithmetic, logical, and comparison operators",
          "If, elif, and else conditional statements",
          "While loops and for loops",
          "Break, continue, and logic building exercises"
        ]
      },
      {
        module: "Module 3: Data Structures (Strings, Lists, Tuples, Dictionaries, Sets)",
        topics: [
          "String manipulation and formatting",
          "Working with lists (arrays) and list methods",
          "Understanding tuples and immutability",
          "Using dictionaries for key-value data and sets"
        ]
      },
      {
        module: "Module 4: Functions and Modules",
        topics: [
          "Defining and calling functions",
          "Function arguments and return values",
          "Variable scope (local vs global)",
          "Importing standard libraries and custom modules"
        ]
      },
      {
        module: "Module 5: File Handling, Error Handling, and Mini Projects",
        topics: [
          "Reading from and writing to text files",
          "Understanding exceptions and Try-Except blocks",
          "Debugging Python code",
          "Building practical console-based mini-projects"
        ]
      }
    ]
  },
  {
    id: "advanced-excel",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/Advanced-Excel.jpg",
    title: "Advanced Microsoft Excel",
    shortTitle: "Adv. Excel",
    level: "Intermediate",
    duration: "3 Months",
    durationHours: "60 Hours",
    fee: "₹5,000",
    category: "Office Productivity",
    badge: "Must Have",
    description: "At Talent Institute & Computer Education, students learn how to transform raw spreadsheet data into powerful business insights. This advanced course goes beyond the basics to cover complex formulas, data analysis tools, and interactive dashboards required in corporate environments.",
    highlights: [
      "Mastery of complex logical and lookup functions",
      "In-depth XLOOKUP and VLOOKUP training",
      "Advanced data cleaning and validation techniques",
      "Expert-level PivotTables and PivotCharts",
      "Creation of dynamic Management Information System (MIS) reports",
      "Practical data exercises reflecting corporate tasks"
    ],
    prerequisites: "Familiarity with basic MS Excel (entering data, simple formatting, and basic sum/average formulas).",
    targetAudience: "Office administrators, data entry professionals, HR executives, and business analysts.",
    careerOpportunities: [
      "MIS Executive",
      "Excel Data Analyst",
      "Back Office Executive",
      "Operations Assistant",
      "Administrative Coordinator"
    ],
    syllabus: [
      {
        module: "Module 1: Advanced Formulas and Logical Functions",
        topics: [
          "Advanced use of IF, AND, OR, NOT",
          "Nested IF statements and IFS function",
          "SUMIFS, COUNTIFS, and AVERAGEIFS",
          "Text and date/time functions"
        ]
      },
      {
        module: "Module 2: Lookup and Reference Techniques",
        topics: [
          "Mastering VLOOKUP and HLOOKUP",
          "Using the modern XLOOKUP function",
          "INDEX and MATCH combination",
          "Handling lookup errors efficiently"
        ]
      },
      {
        module: "Module 3: Data Cleaning, Validation, and Sorting",
        topics: [
          "Advanced sorting and complex filtering",
          "Data validation rules and dropdown lists",
          "Text to Columns and removing duplicates",
          "Conditional formatting with formulas"
        ]
      },
      {
        module: "Module 4: PivotTables and PivotCharts",
        topics: [
          "Creating and formatting PivotTables",
          "Calculated fields and grouped data",
          "Adding Slicers and Timelines",
          "Building interactive PivotCharts"
        ]
      },
      {
        module: "Module 5: Dashboards, MIS Reports, and Practical Exercises",
        topics: [
          "Principles of dashboard design in Excel",
          "Linking charts to dynamic data sources",
          "Protecting sheets and workbooks",
          "Real-world MIS reporting exercises"
        ]
      }
    ]
  },
  {
    id: "video-editing-filmora",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/Video-editing.jpg",
    title: "Video Editing with Filmora",
    shortTitle: "Filmora Editing",
    level: "Beginner",
    duration: "3 Months",
    durationHours: "60 Hours",
    fee: "₹25,000",
    category: "Video & Multimedia",
    badge: "Creative",
    description: "At Talent Institute & Computer Education, students learn the art of visual storytelling through intuitive video editing. This course covers Wondershare Filmora, teaching you how to cut, edit, and enhance videos with professional transitions, effects, and audio balancing.",
    highlights: [
      "Complete walk-through of the Filmora interface",
      "Techniques for seamless cutting and trimming",
      "Adding dynamic transitions and text effects",
      "Professional audio editing and synchronization",
      "Color correction for cinematic looks",
      "Hands-on project rendering and export optimization"
    ],
    prerequisites: "Basic computer operations. An interest in digital media or content creation.",
    targetAudience: "YouTubers, social media influencers, digital marketers, and aspiring freelance video editors.",
    careerOpportunities: [
      "Junior Video Editor",
      "Social Media Content Creator",
      "Freelance Video Producer",
      "YouTube Editor",
      "Multimedia Executive"
    ],
    syllabus: [
      {
        module: "Module 1: Filmora Interface and Project Setup",
        topics: [
          "Understanding the workspace and panels",
          "Importing media files and organizing assets",
          "Setting up project aspect ratios and resolutions",
          "Navigating the timeline effectively"
        ]
      },
      {
        module: "Module 2: Cutting, Trimming, and Transitions",
        topics: [
          "Basic split, crop, and trim tools",
          "Applying and customizing transitions",
          "Adding text, titles, and lower thirds",
          "Working with visual effects and filters"
        ]
      },
      {
        module: "Module 3: Audio Editing and Sound Effects",
        topics: [
          "Detaching and balancing audio tracks",
          "Removing background noise",
          "Adding background music and sound effects",
          "Audio ducking and fade transitions"
        ]
      },
      {
        module: "Module 4: Color Correction, Pacing, and Storytelling",
        topics: [
          "Basic color tuning and white balance",
          "Applying 3D LUTs for cinematic styles",
          "Speed control (slow motion and time-lapse)",
          "Fundamentals of video pacing and storytelling"
        ]
      },
      {
        module: "Module 5: Export Settings and Practical Projects",
        topics: [
          "Choosing the right export format (MP4, MOV)",
          "Optimizing settings for YouTube and Instagram",
          "Rendering out the final video",
          "Practical compilation and editing assignments"
        ]
      }
    ]
  },
  {
    id: "coreldraw-design",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/corel.jpg",
    title: "CorelDRAW Graphic Design",
    shortTitle: "CorelDRAW",
    level: "Beginner",
    duration: "3 Months",
    durationHours: "60 Hours",
    fee: "₹10,000",
    category: "Graphic Design",
    badge: "Industry Standard",
    description: "At Talent Institute & Computer Education, students learn the principles of vector graphic design for the printing and advertising industry. This CorelDRAW course equips you with the skills to design precise logos, brochures, and promotional materials from scratch.",
    highlights: [
      "Comprehensive vector design fundamentals",
      "Mastery of shapes, curves, and node editing",
      "Advanced typography and color application",
      "Creation of professional branding materials",
      "Print-ready document preparation",
      "Building a diverse design portfolio"
    ],
    prerequisites: "Basic computer usage skills. A creative mindset is highly recommended.",
    targetAudience: "Aspiring graphic designers, print media professionals, and marketing creatives.",
    careerOpportunities: [
      "Graphic Designer",
      "DTP Operator",
      "Logo Designer",
      "Print Production Artist",
      "Visual Identity Designer"
    ],
    syllabus: [
      {
        module: "Module 1: Workspace and Vector Fundamentals",
        topics: [
          "Introduction to CorelDRAW interface",
          "Understanding vector vs raster graphics",
          "Setting up document properties and grids",
          "Basic navigation and viewing tools"
        ]
      },
      {
        module: "Module 2: Shapes, Curves, and Object Editing",
        topics: [
          "Drawing basic geometric shapes",
          "Using the Bezier and Pen tools",
          "Node editing with the Shape tool",
          "Grouping, combining, and aligning objects"
        ]
      },
      {
        module: "Module 3: Colors, Typography, and Composition",
        topics: [
          "Working with CMYK and RGB color palettes",
          "Applying fills (solid, gradient, pattern)",
          "Artistic and paragraph text formatting",
          "Principles of visual composition"
        ]
      },
      {
        module: "Module 4: Designing Promotional Materials",
        topics: [
          "Creating professional logos and icons",
          "Designing business cards and letterheads",
          "Creating flyers, posters, and banners",
          "Using PowerClip and special effects"
        ]
      },
      {
        module: "Module 5: Print Preparation and Exporting",
        topics: [
          "Preparing files for commercial printing",
          "Adding bleed and crop marks",
          "Exporting to PDF, EPS, and JPEG formats",
          "Final portfolio project compilation"
        ]
      }
    ]
  },
  {
    id: "adobe-photoshop",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/Photoshop.jpg",
    title: "Adobe Photoshop",
    shortTitle: "Photoshop",
    level: "Beginner",
    duration: "2 Months",
    durationHours: "40 Hours",
    fee: "₹5,000",
    category: "Graphic Design",
    badge: "Popular",
    description: "At Talent Institute & Computer Education, students learn the world's leading image editing software. This course provides hands-on experience with Adobe Photoshop, teaching you how to manipulate photos, create stunning graphics, and produce engaging digital art.",
    highlights: [
      "Thorough understanding of the Photoshop interface",
      "Expertise in layer management and blending",
      "Advanced selection and masking techniques",
      "Professional image retouching and correction",
      "Designing creative social media graphics",
      "Optimizing images for web and digital platforms"
    ],
    prerequisites: "Basic computer familiarity. Interest in photography or digital design.",
    targetAudience: "Photographers, social media managers, digital artists, and marketing professionals.",
    careerOpportunities: [
      "Photo Editor",
      "Graphic Designer",
      "Social Media Graphic Artist",
      "Creative Retoucher",
      "Freelance Designer"
    ],
    syllabus: [
      {
        module: "Module 1: Interface, Tools, and Document Settings",
        topics: [
          "Understanding the Photoshop workspace",
          "Creating and managing new documents",
          "Resolution and color modes (RGB vs CMYK)",
          "Basic navigation and tool overview"
        ]
      },
      {
        module: "Module 2: Layers, Selections, and Masks",
        topics: [
          "Layer concepts, grouping, and opacity",
          "Using Marquee, Lasso, and Magic Wand tools",
          "Refining edges and selections",
          "Non-destructive editing with Layer Masks"
        ]
      },
      {
        module: "Module 3: Background Removal and Image Correction",
        topics: [
          "Removing and replacing backgrounds cleanly",
          "Using the Clone Stamp and Healing Brush tools",
          "Color correction and adjustment layers",
          "Basic portrait retouching techniques"
        ]
      },
      {
        module: "Module 4: Typography and Creative Compositions",
        topics: [
          "Adding and formatting text layers",
          "Using Layer Styles (drop shadows, glows)",
          "Combining multiple images into composites",
          "Applying creative filters and effects"
        ]
      },
      {
        module: "Module 5: Social Media Graphics and Exports",
        topics: [
          "Designing promotional banners and posts",
          "Understanding canvas sizes for different platforms",
          "Exporting for web (Save for Web, PNG, JPG)",
          "Final creative project presentation"
        ]
      }
    ]
  },
  {
    id: "ai-tools-productivity",
    institute: "Talent Institute & Computer Education",
    thumbnail: "/course-images/Ai.jpg",
    title: "AI Tools & Productivity Course",
    shortTitle: "AI Tools",
    level: "Beginner to Intermediate",
    duration: "To Be Decided",
    durationHours: "To Be Decided",
    fee: "₹5,000",
    category: "AI & Digital Productivity",
    badge: "New",
    description: "At Talent Institute & Computer Education, students learn to harness the power of modern Artificial Intelligence to supercharge their daily workflows. This forward-looking course teaches practical applications of generative AI across writing, data tasks, presentations, and creative processes.",
    highlights: [
      "Mastery of prompt engineering fundamentals",
      "Accelerated writing and research using AI",
      "Creating presentations and docs with AI assistants",
      "Exploring cutting-edge AI image generation tools",
      "Automating spreadsheet tasks efficiently",
      "Understanding AI ethics, privacy, and copyright"
    ],
    prerequisites: "General comfort with using web browsers and internet applications.",
    targetAudience: "Professionals, students, entrepreneurs, and anyone looking to boost productivity using AI.",
    careerOpportunities: [
      "AI Prompt Engineer",
      "Digital Productivity Consultant",
      "Content Strategist",
      "Operations Optimizer",
      "Tech-savvy Administrator"
    ],
    syllabus: [
      {
        module: "Module 1: Generative AI Fundamentals and Prompt Engineering",
        topics: [
          "What is Generative AI and how it works",
          "Introduction to major AI models (ChatGPT, Gemini, etc.)",
          "The anatomy of a perfect prompt",
          "Iterative prompting and context management"
        ]
      },
      {
        module: "Module 2: AI-Assisted Writing, Summarization, and Research",
        topics: [
          "Drafting emails, reports, and proposals",
          "Summarizing long articles and documents",
          "Using AI for brainstorming and ideation",
          "Accelerating internet research and fact-gathering"
        ]
      },
      {
        module: "Module 3: AI Tools for Presentations and Documents",
        topics: [
          "Generating presentation outlines quickly",
          "Using AI-integrated presentation software",
          "Formatting and structuring long-form documents",
          "Enhancing visual appeal with automated design features"
        ]
      },
      {
        module: "Module 4: AI Image Generation and Creative Workflows",
        topics: [
          "Introduction to AI image generators",
          "Writing effective prompts for visuals",
          "Use cases for marketing and social media",
          "Understanding the limitations of AI art"
        ]
      },
      {
        module: "Module 5: AI-Assisted Spreadsheet and Data Tasks",
        topics: [
          "Using AI to write complex Excel/Sheets formulas",
          "Generating macros and scripts with AI help",
          "Data cleaning and formatting tips using AI",
          "Extracting insights from raw data faster"
        ]
      },
      {
        module: "Module 6: Responsible AI Usage and Final Project",
        topics: [
          "Data privacy and corporate security policies",
          "Fact-checking AI hallucinations",
          "Copyright awareness and ethical usage",
          "Practical assignment: End-to-end workflow automation"
        ]
      }
    ]
  }
];

export function getCourseById(id) {
  return courses.find((c) => c.id === id);
}

export const courseCategories = [
  ...new Set(courses.map((c) => c.category)),
];
