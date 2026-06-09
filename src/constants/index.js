const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Awards",
    link: "#scholarships",
  },
  {
    name: "Skills",
    link: "#skills",
  },
];

const words = [
  { text: "Backend", imgPath: "/images/ideas.svg" },
  { text: "Cloud", imgPath: "/images/concepts.svg" },
  { text: "Edge AI", imgPath: "/images/designs.svg" },
  { text: "IoT", imgPath: "/images/code.svg" },
  { text: "Backend", imgPath: "/images/ideas.svg" },
  { text: "Cloud", imgPath: "/images/concepts.svg" },
  { text: "Edge AI", imgPath: "/images/designs.svg" },
  { text: "IoT", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 100, suffix: "ms", label: "Edge AI Inference Latency" },
  { value: 98, suffix: ".2%", label: "Face Verification Accuracy" },
  { value: 3, suffix: "+", label: "Production-Ready Projects" },
  { value: 2, suffix: "x", label: "Academic Scholarship Awarded" },
];

const logoIconsList = [
  { imgPath: "/images/logos/react.png" },
  { imgPath: "/images/logos/node.png" },
  { imgPath: "/images/logos/python.svg" },
  { imgPath: "/images/logos/three.png" },
  { imgPath: "/images/logos/git.svg" },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Full-Stack Web Development",
    desc: "Building end-to-end web platforms with Next.js frontend and Node.js/Express backend deployed on AWS.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Edge AI & Computer Vision",
    desc: "Running YOLOv11 & InsightFace locally at the edge for real-time video inference under 100ms.",
  },
  {
    imgPath: "/images/time.png",
    title: "Cloud & IoT Integration",
    desc: "Architecting AWS cloud systems (EC2, IoT Core, DynamoDB) connected to ESP32 hardware for real-time control.",
  },
];

const techStackImgs = [
  {
    name: "Next.js Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "Python / ML Engineer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Node.js Backend",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Three.js / WebGL",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Git & DevOps",
    imgPath: "/images/logos/git.svg",
  },
];

const techStackIcons = [
  {
    name: "Programming Languages",
    description: "JavaScript, Python, C/C++, SQL, C#",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend & Frameworks",
    description: "Next.js, Node.js, Express.js, React.js, MongoDB, WebSocket, REST APIs",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Cloud & DevOps",
    description: "AWS (EC2, S3, DynamoDB, IAM, IoT Core), Docker, Linux",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
  {
    name: "Tools & Libraries",
    description: "Git, Postman, OpenCV, VS Code, Three.js",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Frontend & UI/UX",
    description: "HTML, CSS, Tailwind CSS, WebGL, GSAP",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
];

const expCards = [
  {
    review:
      "Le Duong Bao demonstrated strong cloud operations skills during his internship. He improved our resource utilization by 15% and proactively resolved VPC networking issues that had been blocking our team.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Cloud Operations Intern",
    date: "January 2025 - June 2025",
    responsibilities: [
      "Monitored and maintained AWS cloud resources (EC2, S3, RDS) using CloudWatch, improving system availability and resource utilization by 15%.",
      "Configured and audited AWS IAM permissions and security policies following the principle of least privilege, reducing potential access risks by 20%.",
      "Troubleshot VPC networking issues (subnets, route tables, security groups) to maintain secure, high-uptime backend communication.",
    ],
  },
  {
    review:
      "The Smart Jewelry Store project is a technically ambitious O2O system that combines AI, IoT, e-commerce, and cloud — all working seamlessly together. Impressive work for a graduation thesis.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo2.png",
    title: "Full-Stack & Edge AI Developer",
    date: "December 2025 - April 2026",
    responsibilities: [
      "Designed and implemented a Hybrid Cloud-Edge O2O system with a Next.js/Node.js web platform deployed on AWS EC2 & MongoDB Atlas.",
      "Deployed YOLOv11 and InsightFace at the edge for real-time intrusion detection and VIP recognition with <100ms inference latency and 98.2% accuracy.",
      "Integrated Stripe & SePay VietQR payment webhooks and built an AI assistant chatbot using Gemini 1.5 Flash and local Ollama.",
    ],
  },
  {
    review:
      "The Credit Card Default Prediction pipeline showed strong understanding of data engineering and model optimization. Achieving 84.6% F1-score with LightGBM is a solid result.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "Machine Learning Engineer",
    date: "October 2025 - March 2026",
    responsibilities: [
      "Developed an end-to-end machine learning pipeline for credit card default risk prediction.",
      "Implemented feature scaling, encoding, and hyperparameter tuning on LightGBM to achieve an F1-score of 84.6%.",
      "Compared multiple algorithms (Random Forest, XGBoost, LightGBM) and documented model performance in Jupyter Notebooks.",
    ],
  },
];

const expLogos = [
  { name: "logo1", imgPath: "/images/logo1.png" },
  { name: "logo2", imgPath: "/images/logo2.png" },
  { name: "logo3", imgPath: "/images/logo3.png" },
];

const testimonials = [
  {
    name: "ThS. Huỳnh Thanh Sơn",
    mentions: "@Vietnam Aviation Academy",
    review:
      "Bảo's graduation thesis on Smart Jewelry Store is one of the most comprehensive final-year projects I have supervised. The combination of Edge AI, IoT, e-commerce, and cloud computing in a single coherent system demonstrates exceptional initiative and engineering depth.",
    imgPath: "/images/client1.png",
  },
  {
    name: "AWS Supervisor",
    mentions: "@Amazon Web Services",
    review:
      "During his internship, Bao showed strong attention to cloud security and infrastructure detail. His CloudWatch dashboards and IAM audit reports were delivered ahead of schedule and were highly accurate.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Project Collaborator",
    mentions: "@Smart Jewelry Store Team",
    review:
      "Working with Bao was a great experience. He led the backend and AI integration with clear communication and consistently delivered working features on time.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Đặng Cao Minh Anh",
    mentions: "@Thesis Team Member",
    review:
      "Bao is a hardworking and technically strong teammate. His ability to connect Edge AI with IoT hardware in real-time was the most impressive engineering challenge we solved together.",
    imgPath: "/images/client5.png",
  },
];

const socialImgs = [
  {
    name: "github",
    imgPath: "/images/github.svg",
    url: "https://github.com/Bao2k5",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
    url: "https://linkedin.com/in/baoleduong",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};
