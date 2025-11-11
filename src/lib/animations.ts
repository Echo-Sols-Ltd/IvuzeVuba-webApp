// Animation variants for consistent animations across the app

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 }
};

export const slideInFromLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideInFromRight = {
  initial: { x: 20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const slideInFromBottom = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.4, ease: "easeOut" }
};

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const cardHover = {
  rest: { scale: 1, boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    transition: { duration: 0.2 }
  }
};
