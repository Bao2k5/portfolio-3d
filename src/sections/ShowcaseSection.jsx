import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const projectCategories = {
  games: [
    {
      title: "Don't Let Evil Larry Lick Your Toes",
      desc: "A creepy first-person 3D survival-horror game built on Unity with custom 3D assets designed in Blender. Features real-time survival status bars (hunger, thirst, sanity, temperature), begging/trading economies, and branching storylines.",
      tech: ["Unity 3D", "Blender", "C#", "3D Animation"],
      link: "https://github.com/Bao2k5/Don-t-Let-Evil-Larry-Lick-Your-Toes",
      image: "/images/game_larry.png",
      tagline: "Featured Unity Game 🎮"
    },
    {
      title: "Flappy Bird - Desktop Edition",
      desc: "Classic Flappy Bird game recreated using Pygame. Enhanced with an online-realtime leaderboard, custom skins store, account authentication, and auto-login.",
      tech: ["Python", "Pygame", "JSON API", "Auth System"],
      link: "https://github.com/Bao2k5/laptrinhpython",
      image: "/images/game_flappy.png",
      tagline: "Arcade Adaptation 🐦"
    },
    {
      title: "Space AI Dodge (FINAL ANIMATION AI)",
      desc: "Retro space shooter game with an autonomous AI pilot script that monitors screen threats, calculates optimal movement lanes, and targets enemies.",
      tech: ["Python", "Pygame", "AI Pathfinding", "Decision Trees"],
      link: "https://github.com/Bao2k5/pythonbaitap",
      image: "/images/game_space.png",
      tagline: "Autonomous Space AI 🚀"
    },
    {
      title: "Collaborative Game Project (detaigame)",
      desc: "A collaborative 2D game development project focused on core gameplay mechanics, level design, and teamwork integration.",
      tech: ["Game Development", "Team Collaboration"],
      link: "https://github.com/phuccka12/detaigame",
      image: "/images/game_collab.png",
      tagline: "Collaborative Game 🎮"
    },
    {
      title: "AzuraLand",
      desc: "A vibrant magical 3D video game world (AzuraLand) focusing on immersive gameplay and collaborative game level design.",
      tech: ["Unity 3D", "C#", "ShaderLab", "HLSL"],
      link: "https://github.com/HungLEEE2709/AzuraLand",
      image: "/images/azuraland.png",
      tagline: "Unity 3D Game 🎮"
    },
    {
      title: "Đồ Án Chuyên Ngành (Multiplayer Game)",
      desc: "A complex multiplayer Unity game utilizing ParrelSync for local clone testing. Features a robust client-server architecture with dedicated BE and FE network sync.",
      tech: ["Unity 3D", "C#", "Networking", "ParrelSync"],
      link: "https://github.com/HungLEEE2709/DoAnCN",
      image: "/images/doancn.png",
      tagline: "Multiplayer Game ⚔️"
    }
  ],
  aiIot: [
    {
      title: "Smart Jewelry Store Platform (TTTN)",
      desc: "Hybrid Cloud-Edge O2O platform for retail store operations. Integrates real-time Edge AI (YOLO11, InsightFace, MediaPipe) with physical ESP32 security modules, full-stack admin panel, and stripe payments.",
      tech: ["React", "Node.js", "YOLO11", "ESP32", "AWS EC2", "MongoDB"],
      link: "https://github.com/Bao2k5/TTTN",
      image: "/images/project1.png",
      tagline: "Graduation Thesis 🎓"
    },
    {
      title: "Smart Preservation Vault (IoT)",
      desc: "IoT environmental protection vault system powered by ESP32 microcontrollers running FreeRTOS tasks to monitor, lock/unlock, and sync telemetry via AWS IoT Core.",
      tech: ["ESP32", "FreeRTOS", "AWS IoT Core", "Arduino"],
      link: "https://github.com/Bao2k5/IoT",
      image: "/images/project2.png",
      tagline: "IoT Infrastructure 📡"
    },
    {
      title: "Credit Card Default Prediction (Mayhoc)",
      desc: "A machine learning pipeline comparing and optimizing models (LightGBM, XGBoost, Random Forest) to forecast credit defaults with high accuracy and ROC-AUC metrics.",
      tech: ["Python", "Jupyter Notebook", "LightGBM", "XGBoost", "Scikit-Learn"],
      link: "https://github.com/Bao2k5/Mayhoc",
      image: "/images/project3.png",
      tagline: "Predictive Analytics 📊"
    },
    {
      title: "Digital Image Processing & CV Library",
      desc: "Custom implementation of computer vision algorithms, filters (gaussian, median), edge detection kernels, and morphology operations.",
      tech: ["Python", "OpenCV", "NumPy", "Computer Vision"],
      link: "https://github.com/Bao2k5/Xulianhvathigiacmaytinh",
      image: "/images/cv_library.png",
      tagline: "Computer Vision 👁️"
    },
    {
      title: "XLA_TL (Image Processing Essay)",
      desc: "An academic research and implementation project covering advanced image processing algorithms and techniques.",
      tech: ["Python", "Image Processing", "Research"],
      link: "https://github.com/MinhAnh248/XLA_TL",
      image: "/images/xla_tl.png",
      tagline: "Academic Essay 📚"
    },
    {
      title: "AI Team Portfolio",
      desc: "A collaborative showcase platform displaying various AI solutions and models implemented by the NVT AI Solution Team.",
      tech: ["AI Research", "Team Showcase", "Web"],
      link: "https://github.com/NVT-AI-Solution-Teams/AI-Team-Portfolio",
      image: "/images/ai_portfolio.png",
      tagline: "Team Portfolio 🤖"
    }
  ],
  webFullstack: [
    {
      title: "FastFood Fullstack Store",
      desc: "Java Spring Boot fast food ordering platform with React client app. Features admin product listing, order management, secure cart checkout, and relational database logs.",
      tech: ["Java", "Spring Boot", "React", "MySQL", "Hibernate"],
      link: "https://github.com/Bao2k5/fastfood-fullstack",
      image: "/images/fastfood.png",
      tagline: "E-Commerce App 🍔"
    },
    {
      title: "HMJewelry NextJS templates",
      desc: "Storefront and management portal layouts built with Next.js and Tailwind CSS. Features Redux state controls and mobile-responsive product galleries.",
      tech: ["Next.js", "Tailwind CSS", "Redux Toolkit"],
      link: "https://github.com/Bao2k5/hmjewelry",
      image: "/images/hmjewelry.png",
      tagline: "Frontend Client 💎"
    },
    {
      title: "doangit - Express Phone Store",
      desc: "Phone retail web app utilizing Express server, Docker containers, MongoDB Atlas integration, and clean MVC architecture.",
      tech: ["Node.js", "Express.js", "MongoDB", "Docker"],
      link: "https://github.com/Bao2k5/doangit",
      image: "/images/doangit.png",
      tagline: "Collaborative Lab 📱"
    },
    {
      title: "luyentienganh English Learning App",
      desc: "English vocabulary and language flashcard application featuring customized quizzing and spaced repetition learning logic.",
      tech: ["HTML5", "CSS3", "JavaScript"],
      link: "https://github.com/Bao2k5/luyentienganh",
      image: "/images/english_app.png",
      tagline: "Interactive Education 📖"
    },
    {
      title: "LaptrinhPy (Python Programming)",
      desc: "A collection of collaborative Python programming exercises and mini-projects demonstrating problem-solving skills.",
      tech: ["Python", "Algorithms", "Data Structures"],
      link: "https://github.com/HungLEEE2709/LaptrinhPy",
      image: "/images/laptrinhpy.png",
      tagline: "Programming 🐍"
    }
  ]
};

const AppShowcase = () => {
  const [activeTab, setActiveTab] = useState("webFullstack");
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    // Fade in section on scroll
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom-=100",
        }
      }
    );
  }, []);

  // Trigger grid item animations on tab change
  useEffect(() => {
    if (gridRef.current && gridRef.current.children.length > 0) {
      gsap.fromTo(
        gridRef.current.children,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top bottom-=100",
          }
        }
      );
    }
  }, [activeTab]);

  return (
    <section id="work" ref={sectionRef} className="app-showcase flex flex-col items-center w-full section-padding relative">
      <div className="absolute inset-0 bg-grid-pattern mask-radial-faded pointer-events-none opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(255,200,0,0.05),transparent_70%)] pointer-events-none" />
      <div className="w-full max-w-7xl relative z-10">
        {/* Title and Subtitle */}
        <div className="flex flex-col items-center gap-4 mb-12 text-center">
          <div className="hero-badge">
            <p>📂 Portfolio Showcase</p>
          </div>
          <h2 className="font-bold md:text-5xl text-3xl text-white tracking-tight">
            My Works & Repositories
          </h2>
          <p className="text-white-50 text-sm md:text-base max-w-2xl">
            Explore my verified GitHub repositories organized by discipline. Click on any card to view the repository source code.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center gap-2 md:gap-4 mb-12 bg-black-100 p-2 rounded-full border border-white-50/10 w-fit mx-auto shadow-2xl">
          <button
            onClick={() => setActiveTab("webFullstack")}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "webFullstack"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "text-white-50 hover:text-white"
            }`}
          >
            💻 Web Dev ({projectCategories.webFullstack.length})
          </button>
          <button
            onClick={() => setActiveTab("aiIot")}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "aiIot"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "text-white-50 hover:text-white"
            }`}
          >
            🤖 AI & IoT ({projectCategories.aiIot.length})
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer ${
              activeTab === "games"
                ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20"
                : "text-white-50 hover:text-white"
            }`}
          >
            🎮 Game Dev ({projectCategories.games.length})
          </button>
        </div>

        {/* Project Grid */}
        <div
          ref={gridRef}
          className="minor-projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 w-full"
        >
          {projectCategories[activeTab].map((project, idx) => (
            <a
              key={`${activeTab}-${idx}`}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-2xl glass-panel overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(69,222,196,0.15)] cursor-pointer"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black-200">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black-100 via-transparent to-transparent opacity-60" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/80 text-cyan-400 text-xs font-semibold tracking-wide border border-cyan-500/20">
                  {project.tagline}
                </span>
              </div>
              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-white-50 text-xs md:text-sm leading-relaxed line-clamp-3">
                    {project.desc}
                  </p>
                </div>
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 text-[10px] rounded bg-white-50/5 text-cyan-300 font-medium border border-cyan-500/10"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                    View Repository
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 01.75-.75h10.638L10.22 5.03a.75.75 0 111.06-1.06l5.5 5.5a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 11-1.06-1.06l4.168-4.17H3.75A.75.75 0 013 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
