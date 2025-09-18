import React from "react";
import SEO from "../components/SEO";

const ProjectsPage = () => (
  <>
    <SEO
      title="Projects - SSKhekhaliya"
      description="A showcase of my work, including fitness vlogs, novels, and entrepreneurial ventures."
      name="Saurav SIngh Khekhaliya"
      type="website"
    />
    <div className="space-y-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-8 animate-fade-in-up">
        Projects
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "GRIND Series",
            description:
              "A fitness vlog series documenting my workout journey.",
            imgSrc: "https://placehold.co/600x400/232222/FFF?text=GRIND",
          },
          {
            title: "Eklavya Novel",
            description: "A mythological fiction novel series.",
            imgSrc: "https://placehold.co/600x400/232222/FFF?text=Eklavya",
          },
          {
            title: "Protein Bars Brand",
            description:
              "An entrepreneurial venture into the fitness food market.",
            imgSrc: "https://placehold.co/600x400/232222/FFF?text=Brand",
          },
        ].map((project, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg animate-fade-in-up overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={project.imgSrc}
              alt={project.title}
              loading="lazy"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {project.description}
              </p>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:underline"
              >
                View More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default ProjectsPage;
