import React from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="faq-item">
      <div className="faq-question">
        <span>▼</span> &nbsp; {question}
      </div>
      <div
        className="faq-answer"
        dangerouslySetInnerHTML={{ __html: answer }}
      />
    </div>
  );
}