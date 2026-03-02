import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

/**
 * Seed script: populates the database with 25 diverse mentor profiles.
 * Run with: npm run seed
 */

const prisma = new PrismaClient().$extends(withAccelerate());

const mentors = [
  {
    name: "Dr. Sarah Chen",
    email: "sarah.chen@example.com",
    bio: "Former Google Staff Engineer with 15+ years in distributed systems and cloud architecture. PhD in Computer Science from MIT. Passionate about mentoring the next generation of tech leaders.",
    skills: ["System Design", "Cloud Architecture", "Go", "Kubernetes", "gRPC"],
    expertise: ["Distributed Systems", "Technical Leadership", "Career Growth in Big Tech"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    name: "Marcus Johnson",
    email: "marcus.johnson@example.com",
    bio: "Serial entrepreneur and Y Combinator alum. Built and scaled 3 startups, with one successful exit. Expert in product-market fit, fundraising, and building high-performance engineering teams.",
    skills: ["Product Strategy", "Fundraising", "Team Building", "Node.js", "React"],
    expertise: ["Startup Growth", "Entrepreneurship", "Product-Market Fit"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
  },
  {
    name: "Priya Patel",
    email: "priya.patel@example.com",
    bio: "Senior ML Engineer at DeepMind with expertise in NLP and computer vision. Published researcher with 20+ papers in top-tier conferences. Advocates for diversity in AI.",
    skills: ["Machine Learning", "Python", "PyTorch", "NLP", "Computer Vision"],
    expertise: ["AI/ML Engineering", "Research-to-Production", "Academic to Industry Transition"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
  },
  {
    name: "James O'Brien",
    email: "james.obrien@example.com",
    bio: "VP of Engineering at a Fortune 500 fintech company. 20 years of experience scaling engineering organizations from 10 to 500+ engineers. Expert in organizational design and engineering culture.",
    skills: ["Engineering Management", "Agile", "Strategic Planning", "Java", "Microservices"],
    expertise: ["Engineering Leadership", "Organizational Scaling", "Fintech"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
  },
  {
    name: "Aisha Mohammed",
    email: "aisha.mohammed@example.com",
    bio: "Full-stack developer and open-source contributor with a passion for developer experience. Core maintainer of several popular npm packages. Conference speaker and tech educator.",
    skills: ["TypeScript", "React", "Next.js", "Node.js", "GraphQL"],
    expertise: ["Frontend Architecture", "Open Source", "Developer Experience"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=aisha",
  },
  {
    name: "Carlos Rivera",
    email: "carlos.rivera@example.com",
    bio: "Staff Security Engineer at Meta. Specializes in application security, penetration testing, and building security-first cultures. CISSP and OSCP certified.",
    skills: ["Cybersecurity", "Penetration Testing", "Python", "Security Architecture", "DevSecOps"],
    expertise: ["Application Security", "Security Engineering", "Compliance & Governance"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
  },
  {
    name: "Dr. Emily Watson",
    email: "emily.watson@example.com",
    bio: "Data Science lead at Netflix with 12 years of experience in analytics and experimentation. PhD in Statistics. Pioneer in A/B testing methodologies and data-driven decision making.",
    skills: ["Data Science", "Statistics", "Python", "SQL", "A/B Testing"],
    expertise: ["Data Strategy", "Experimentation", "Analytics Leadership"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
  },
  {
    name: "Takeshi Yamamoto",
    email: "takeshi.yamamoto@example.com",
    bio: "Mobile engineering lead at Apple. 10+ years building iOS and cross-platform apps. Expert in mobile architecture patterns and performance optimization.",
    skills: ["Swift", "iOS Development", "React Native", "Kotlin", "Mobile Architecture"],
    expertise: ["Mobile Development", "Cross-Platform Strategy", "Performance Optimization"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=takeshi",
  },
  {
    name: "Lisa Andersen",
    email: "lisa.andersen@example.com",
    bio: "Platform Engineering Director at Spotify. Built and led teams that design internal developer platforms. Advocate for platform engineering best practices and DevOps culture.",
    skills: ["Platform Engineering", "Terraform", "AWS", "Docker", "CI/CD"],
    expertise: ["DevOps & Platform Engineering", "Infrastructure as Code", "Developer Productivity"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    bio: "Blockchain engineer and Web3 advisor. Previously at Coinbase and Ethereum Foundation. Expert in smart contract development, DeFi protocols, and tokenomics.",
    skills: ["Solidity", "Ethereum", "Rust", "Smart Contracts", "DeFi"],
    expertise: ["Blockchain Development", "Web3 Strategy", "Tokenomics"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
  },
  // ── New Mentors ──────────────────────────────────────────────────
  {
    name: "Sofia Gonzalez",
    email: "sofia.gonzalez@example.com",
    bio: "Principal UX Designer at Airbnb with 12 years crafting user experiences for products used by millions. Former design lead at Figma. Speaker at Config and design systems advocate.",
    skills: ["UX Design", "UI Design", "Figma", "Design Systems", "User Research"],
    expertise: ["Product Design", "Design Leadership", "Design Systems Architecture"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
  },
  {
    name: "Ryan Cooper",
    email: "ryan.cooper@example.com",
    bio: "Lead Game Developer at Riot Games with 8 years in AAA game development. Previously at Epic Games working on Unreal Engine. Specializes in game physics, networking, and real-time rendering.",
    skills: ["C++", "Unreal Engine", "Unity", "Game Physics", "Multiplayer Networking"],
    expertise: ["Game Development", "Real-Time Systems", "Game Engine Architecture"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ryan",
  },
  {
    name: "Dr. Fatima Al-Rashid",
    email: "fatima.alrashid@example.com",
    bio: "Principal Database Architect at Amazon with 18 years of experience in large-scale data systems. PhD in Information Systems. Leading expert in database internals, query optimization, and NewSQL.",
    skills: ["PostgreSQL", "DynamoDB", "Database Design", "Query Optimization", "Data Modeling"],
    expertise: ["Database Architecture", "Distributed Databases", "Data Infrastructure at Scale"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=fatima",
  },
  {
    name: "Olga Petrov",
    email: "olga.petrov@example.com",
    bio: "QA Engineering Director at Microsoft. Built test automation frameworks used across Azure services. Champion of shift-left testing and quality culture. 14 years transforming QA organizations.",
    skills: ["Test Automation", "Selenium", "Playwright", "Performance Testing", "CI/CD"],
    expertise: ["QA Strategy", "Test Architecture", "Quality Engineering Culture"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=olga",
  },
  {
    name: "Raj Krishnamurthy",
    email: "raj.krishnamurthy@example.com",
    bio: "AR/VR Engineering Lead at Meta Reality Labs. Previously at Magic Leap. Building the future of spatial computing with 10+ years in immersive technologies and 3D graphics.",
    skills: ["Unity", "C#", "OpenXR", "3D Graphics", "Spatial Computing"],
    expertise: ["AR/VR Development", "Spatial UI Design", "Immersive Technology Strategy"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=raj",
  },
  {
    name: "Hannah Liu",
    email: "hannah.liu@example.com",
    bio: "Accessibility Engineering Lead at GitHub. W3C WCAG Working Group member. Passionate about making the web usable for everyone. 11 years building inclusive digital products.",
    skills: ["Web Accessibility", "ARIA", "Screen Reader Testing", "HTML/CSS", "JavaScript"],
    expertise: ["Digital Accessibility", "Inclusive Design", "WCAG Compliance"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=hannah",
  },
  {
    name: "Nate Williams",
    email: "nate.williams@example.com",
    bio: "Head of Technical Writing at Stripe. Former documentation lead at Twilio and MongoDB. Built doc platforms that serve millions of developers. Expert in docs-as-code and API documentation.",
    skills: ["Technical Writing", "API Documentation", "Markdown", "OpenAPI", "Developer Portals"],
    expertise: ["Documentation Strategy", "API Design Communication", "Developer Education"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=nate",
  },
  {
    name: "Maya Torres",
    email: "maya.torres@example.com",
    bio: "VP of Developer Relations at Vercel. Previously DevRel at AWS and Hashicorp. Built developer communities of 100K+ members. Expert in developer marketing, advocacy, and community building.",
    skills: ["Developer Advocacy", "Public Speaking", "Content Creation", "Community Building", "TypeScript"],
    expertise: ["Developer Relations", "Technical Community Building", "Developer Marketing"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=maya",
  },
  {
    name: "Dr. Alexei Volkov",
    email: "alexei.volkov@example.com",
    bio: "Robotics Research Scientist at Boston Dynamics. PhD in Robotics from Carnegie Mellon. 15 years working on autonomous navigation, manipulation, and human-robot interaction.",
    skills: ["ROS", "C++", "Python", "SLAM", "Control Systems"],
    expertise: ["Robotics Engineering", "Autonomous Systems", "Computer Vision for Robotics"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alexei",
  },
  {
    name: "Dr. Nina Chandra",
    email: "nina.chandra@example.com",
    bio: "Quantum Computing Researcher at IBM Quantum. PhD in Physics from Caltech. Working on quantum error correction and building practical quantum algorithms. Published 30+ papers.",
    skills: ["Qiskit", "Python", "Quantum Algorithms", "Linear Algebra", "Physics"],
    expertise: ["Quantum Computing", "Quantum Machine Learning", "Research Career Development"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=nina",
  },
  {
    name: "Kwame Asante",
    email: "kwame.asante@example.com",
    bio: "IoT & Edge Computing architect at Siemens. 13 years building industrial IoT platforms. Expert in embedded systems, edge AI, and connecting physical and digital worlds at scale.",
    skills: ["Embedded C", "MQTT", "Edge Computing", "Raspberry Pi", "TensorFlow Lite"],
    expertise: ["IoT Architecture", "Edge AI", "Industrial Automation"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=kwame",
  },
  {
    name: "Elena Kowalski",
    email: "elena.kowalski@example.com",
    bio: "Staff Data Engineer at Databricks. Previously at Uber building large-scale data pipelines. Expert in real-time streaming, data lakehouse architecture, and data quality at scale.",
    skills: ["Apache Spark", "Kafka", "dbt", "Airflow", "Python"],
    expertise: ["Data Engineering", "Real-Time Data Pipelines", "Data Lakehouse Architecture"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
  },
  {
    name: "Chris Okafor",
    email: "chris.okafor@example.com",
    bio: "Principal SRE at Google. 16 years keeping mission-critical systems running at planet scale. Co-author of internal SRE playbooks. Expert in incident management and observability.",
    skills: ["SRE", "Prometheus", "Grafana", "Go", "Chaos Engineering"],
    expertise: ["Site Reliability Engineering", "Observability", "Incident Management"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=chris",
  },
  {
    name: "Jessica Huang",
    email: "jessica.huang@example.com",
    bio: "Group Product Manager at Slack. 10 years in product management across B2B SaaS companies. Expert in product strategy, user growth, and cross-functional team leadership.",
    skills: ["Product Management", "User Analytics", "Roadmap Planning", "A/B Testing", "SQL"],
    expertise: ["B2B Product Strategy", "Product-Led Growth", "Cross-Functional Leadership"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=jessica",
  },
  {
    name: "Tom Nguyen",
    email: "tom.nguyen@example.com",
    bio: "Head of Automation & Low-Code at Zapier. 9 years helping businesses automate workflows. Expert in no-code/low-code platforms, workflow automation, and making technology accessible to non-engineers.",
    skills: ["Low-Code Platforms", "Workflow Automation", "API Integration", "JavaScript", "Process Design"],
    expertise: ["No-Code/Low-Code Strategy", "Business Process Automation", "Citizen Development"],
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom",
  },
];

async function seed(): Promise<void> {
  console.log("🌱 Seeding mentors...\n");

  for (const mentor of mentors) {
    const existing = await (prisma as unknown as PrismaClient).mentor.findUnique({
      where: { email: mentor.email },
    });

    if (existing) {
      console.log(`  ⏭  Skipping "${mentor.name}" (already exists)`);
      continue;
    }

    await (prisma as unknown as PrismaClient).mentor.create({ data: mentor });
    console.log(`  ✅ Created "${mentor.name}"`);
  }

  console.log("\n🎉 Seeding complete!");
}

seed()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await (prisma as unknown as PrismaClient).$disconnect();
  });
