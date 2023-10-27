import React, { useRef, useEffect } from "react";

const UploadTrigger = ({ onTriggerShown }) => {
  const targetRef = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const intersectionObserver = new IntersectionObserver(
      handleIntersection,
      options
    );

    if (targetRef.current) intersectionObserver.observe(targetRef.current);
    return () => {
      if (targetRef.current) {
        intersectionObserver.unobserve(targetRef.current);
      }
    };
  }, []);

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) onTriggerShown();
    });
  };

  return <div ref={targetRef} />;
};

export default UploadTrigger;
