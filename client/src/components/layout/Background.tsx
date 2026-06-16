export function Background() {
  return (
    <>
      <div className="fixed inset-0 grid-bg pointer-events-none z-0" />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="blob"
          style={{ width: 520, height: 520, background: "var(--blob-a)", top: -120, left: -120 }}
        />
        <div
          className="blob"
          style={{
            width: 420,
            height: 420,
            background: "var(--blob-b)",
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
            background: "var(--blob-c)",
            top: "40%",
            left: "55%",
            animationDelay: "6s",
          }}
        />
      </div>
    </>
  );
}
