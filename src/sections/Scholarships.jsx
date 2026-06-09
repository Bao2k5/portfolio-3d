import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TitleHeader from "../components/TitleHeader";

const Scholarships = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".scholarship-card",
      {
        y: 40,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#scholarships",
          start: "top center+=100",
        },
      }
    );
  });

  const scholarshipList = [
    {
      title: "Excellent Academic Scholarship",
      titleVi: "Học bổng Khuyến khích Học tập loại Giỏi",
      semester: "Semester 1 (Academic Year 2025 - 2026)",
      desc: "Awarded by Vietnam Aviation Academy to students with exceptional academic standing, ranking at the top tier of the major with outstanding GPA and training points.",
      badge: "🏆 Excellent Award",
      stars: 5,
      color: "from-amber-500/20 to-yellow-500/5",
      borderColor: "group-hover:border-amber-500/50",
      glowColor: "rgba(245, 158, 11, 0.15)",
    },
    {
      title: "Encouragement Academic Scholarship - Good Category",
      titleVi: "Học bổng Khuyến khích Học tập loại Khá",
      semester: "Semester 2 (Academic Year 2025 - 2026)",
      desc: "Awarded by Vietnam Aviation Academy to students with good academic standing, demonstrating high effort, consistent grades, and active training points.",
      badge: "🏅 Good Award",
      stars: 4,
      color: "from-blue-500/20 to-cyan-500/5",
      borderColor: "group-hover:border-blue-500/50",
      glowColor: "rgba(59, 130, 246, 0.15)",
    },
  ];

  return (
    <section id="scholarships" className="flex-center section-padding relative">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-diagonal-stripes mask-radial-faded pointer-events-none opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full h-full md:px-10 px-5 relative z-10">
        <TitleHeader
          title="Scholarships & Academic Honors"
          sub="✨ Celebrating Academic Excellence"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 max-w-5xl mx-auto">
          {scholarshipList.map((item, index) => (
            <div
              key={index}
              className={`group relative card-border rounded-2xl p-8 flex flex-col gap-5 overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br ${item.color}`}
              style={{
                boxShadow: `0 10px 30px -10px ${item.glowColor}`,
              }}
            >
              {/* Top Row with Badge */}
              <div className="flex justify-between items-start">
                <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white-50/10 text-white tracking-wider border border-white-50/10">
                  {item.badge}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: item.stars }, (_, i) => (
                    <img
                      key={i}
                      src="/images/star.png"
                      alt="star"
                      className="size-4 opacity-80"
                    />
                  ))}
                </div>
              </div>

              {/* Title & Semester */}
              <div>
                <h3 className="text-white text-2xl font-bold tracking-tight mb-1 group-hover:text-cyan-400 transition-colors duration-300">
                  {item.title}
                </h3>
                <h4 className="text-amber-400/95 font-medium text-base mb-3 italic">
                  {item.titleVi}
                </h4>
                <p className="text-white-50 font-medium text-sm">
                  {item.semester}
                </p>
              </div>

              {/* Description */}
              <p className="text-white-50 text-base leading-relaxed mt-2 border-t border-white-50/10 pt-4">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Scholarships;
