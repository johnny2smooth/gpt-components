'use client';
import React, { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

interface TypingEffectProps {
  textContent: string;
  typingSpeed?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({
  textContent,
  typingSpeed = 50,
}) => {
  const outputTextRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState<boolean>(false);
  let originalText = textContent;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInViewport(true);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the element is visible
      }
    );

    const container = containerRef.current;

    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);

  useEffect(() => {
    if (isInViewport) {
      let index = 0;

      (function typeText() {
        if (index < textContent.length && outputTextRef.current) {
          outputTextRef.current.textContent += textContent[index];
          index++;
          setTimeout(typeText, typingSpeed);
        } else if (
          outputTextRef.current &&
          outputTextRef.current.parentElement
        ) {
          outputTextRef.current.parentElement.insertAdjacentHTML(
            'afterend',
            `<div class=${styles.cursor}></div>`
          );
        }
      })();
    }
  }, [isInViewport, textContent, typingSpeed]);

  useEffect(() => {
    if (outputTextRef.current) {
      outputTextRef.current.textContent = textContent[0];
    }
  }, [textContent]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col items-center justify-center w-[90vw] min-h-[8vh] px-6 mt-4`}
    >
      <span
        ref={outputTextRef}
        className={`text-white  ${styles.hiddenText}`}
      ></span>
    </div>
  );
};

export default TypingEffect;
