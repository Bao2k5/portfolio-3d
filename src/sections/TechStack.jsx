import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import TitleHeader from "../components/TitleHeader";
import { techStackImgs } from "../constants";

const TechStack = () => {
  // Animate the tech cards in the skills section
  useGSAP(() => {
    gsap.fromTo(
      ".tech-card",
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.2,
        scrollTrigger: {
          trigger: "#skills",
          start: "top center",
        },
      }
    );
  });

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="How I Can Contribute & My Key Skills"
          sub="🤝 What I Bring to the Table"
        />
        <div className="tech-grid">
          {techStackImgs.map((techStackIcon, index) => (
            <div
              key={index}
              className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg hover:scale-105 transition-transform duration-300"
            >
              <div className="tech-card-animated-bg" />
              <div className="tech-card-content flex items-center justify-start gap-4 p-4">
                <div className="tech-icon-wrapper w-16 h-16 flex items-center justify-center bg-white-50/10 rounded-full p-2 group-hover:rotate-12 transition-transform duration-300">
                  <img src={techStackIcon.imgPath} alt={techStackIcon.name} className="w-10 h-10 object-contain" />
                </div>
                <div className="padding-x w-full">
                  <p className="text-white font-medium text-lg">{techStackIcon.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechStack;
