export function Background() {
  return (
    <>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="blob"
          style={{ width: 520, height: 520, background: "#c8ff3d", top: -120, left: -120 }}
        />
        <div
          className="blob"
          style={{
            width: 420,
            height: 420,
            background: "#b5d4ff",
            bottom: -100,
            right: -80,
            animationDelay: "3s",
          }}
        />
        <div
          className="blob"
          style={{
            width: 380,
            height: 380,
            background: "#d6c1ff",
            top: "40%",
            left: "55%",
            animationDelay: "6s",
            opacity: 0.18,
          }}
        />
      </div>
    </>
  );
}
