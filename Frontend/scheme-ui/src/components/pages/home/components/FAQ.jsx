"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-800 group-hover:text-[#74B83E] transition-colors">
          {question}
        </span>
        <span className="ml-4 text-gray-500 group-hover:text-[#74B83E] transition-transform">
          {isOpen ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </span>
      </button>

      {/* Animated Answer */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 mt-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How can I apply for a scheme?",
      answer:
        "You can apply for a scheme by visiting our 'Explore Schemes' section, selecting the relevant scheme, and following the application process outlined there. Make sure you meet the eligibility criteria before applying.",
    },
    {
      question: "What documents are required for application?",
      answer:
        "The required documents vary depending on the scheme. Generally, you'll need proof of identity (such as Aadhaar card), address proof, income certificate, and sometimes category certificates (SC/ST/OBC). Specific requirements are listed on each scheme's page.",
    },
    {
      question: "Who is eligible for the central schemes?",
      answer:
        "Eligibility for central schemes varies. Typically, factors like age, income, occupation, and sometimes location are considered. Some schemes are targeted at specific groups like women, farmers, or students. Check the specific scheme's eligibility criteria for accurate information.",
    },
    {
      question: "How long does the application process take?",
      answer:
        "The processing time varies for different schemes. Some may provide instant approval, while others might take a few weeks to months. The estimated processing time is usually mentioned in the scheme details. You can also track your application status through our portal.",
    },
    {
      question: "Can I apply for multiple schemes simultaneously?",
      answer:
        "Yes, you can apply for multiple schemes as long as you meet the eligibility criteria for each. However, some schemes may have restrictions on availing benefits from multiple sources, so it's important to read the terms and conditions carefully.",
    },
    {
      question: "What should I do if my application is rejected?",
      answer:
        "If your application is rejected, you will receive a notification explaining the reason. You can review the rejection reason and reapply if you think there was an error or if you can provide additional information. If you need assistance, you can contact our support team for guidance on the next steps.",
    },
  ];

  return (
    <section className="px-4 flex flex-col  items-center sm:px-6 md:px-12 py-12 ">
      {/* Title */}
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900">
          Frequently Asked Questions
        </h2>
      </div>

      {/* FAQ Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-4xl mx-auto bg-gray-100 shadow-md rounded-xl p-4 sm:p-6 md:p-6 divide-y divide-gray-100">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
};

export default FAQ;
