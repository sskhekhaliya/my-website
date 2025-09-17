import React from "react";
import SEO from "../components/SEO";

const FitnessPage = () => (
  <>
    <SEO
      title="Fitness & Brand - S. S. Khekhaliya"
      description="Explore my fitness journey, vlogs, and my protein bars brand."
      name="Saurav SIngh Khekhaliya"
      type="website"
    />
    <div className="space-y-10">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-8 animate-fade-in-up">
        Fitness & Brand
      </h1>
      <div className="space-y-8">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl font-bold mb-2">Fitness Journey</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            My fitness philosophy and vlogs from the GRIND and Our Consistency
            series.
          </p>
          {/* Embedded YouTube videos would go here */}
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-3xl font-bold mb-2">Protein Bars Brand</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The story and vision behind my protein bars brand.
          </p>
        </div>
      </div>
    </div>
  </>
);

export default FitnessPage;
