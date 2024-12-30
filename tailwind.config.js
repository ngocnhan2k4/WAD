module.exports = {
  content: ["./src/**/*.{html,js,hbs}"],

  theme: {
   
    screen: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      maxsm: "576.99px",
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        primary: "#fd3d57",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
     
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
