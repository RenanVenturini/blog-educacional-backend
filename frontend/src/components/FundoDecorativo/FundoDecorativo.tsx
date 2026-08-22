import "./FundoDecorativo.css";

function FundoDecorativo() {
  return (
    <svg
      className="fundo"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path className="fundo__forma" d="M1920 0 H1582 A340 340 0 0 0 1920 300 Z" />
      <path className="fundo__forma" d="M0 0 H135 A170 170 0 0 1 0 207 Z" />
      <path
        className="fundo__forma fundo__forma--clara"
        d="M0 905 C 420 845, 980 1010, 1920 862 L1920 1080 L0 1080 Z"
      />
      <path
        className="fundo__forma"
        d="M0 1012 C 560 952, 1240 1068, 1920 985 L1920 1080 L0 1080 Z"
      />
    </svg>
  );
}

export default FundoDecorativo;
