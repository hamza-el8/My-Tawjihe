export default function AIEcosystem({
  t,
  onSignup,
}: any) {
  return (
    <section
      id="features"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top,#1e1b4b 0%,#020617 45%,#000000 100%)",
        padding: "130px 24px",
      }}
    >
      {/* GRID */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "70px 70px",
          opacity: 0.35,
        }}
      />

      {/* PURPLE LIGHT */}
      <div
        style={{
          position: "absolute",
          top: "-220px",
          left: "-180px",
          width: "550px",
          height: "550px",
          borderRadius: "9999px",
          background: "#7c3aed",
          filter: "blur(180px)",
          opacity: 0.22,
          animation: "float1 12s ease-in-out infinite",
        }}
      />

      {/* CYAN LIGHT */}
      <div
        style={{
          position: "absolute",
          bottom: "-220px",
          right: "-180px",
          width: "550px",
          height: "550px",
          borderRadius: "9999px",
          background: "#06b6d4",
          filter: "blur(180px)",
          opacity: 0.16,
          animation: "float2 14s ease-in-out infinite",
        }}
      />

      {/* PARTICLES */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        {[...Array(45)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              borderRadius: "9999px",
              background:
                i % 2 === 0
                  ? "rgba(192,132,252,0.8)"
                  : "rgba(34,211,238,0.8)",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.5,
              animation: `particle ${
                7 + Math.random() * 12
              }s linear infinite`,
              boxShadow:
                i % 2 === 0
                  ? "0 0 12px rgba(192,132,252,0.9)"
                  : "0 0 12px rgba(34,211,238,0.9)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* TOP */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "110px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(20px)",
              color: "#c084fc",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            {t.aiEcosystem.badge}
          </div>

          <h1
            style={{
              fontSize: "66px",
              fontWeight: 900,
              lineHeight: 1,
              marginTop: "30px",
              color: "white",
              letterSpacing: "-4px",
            }}
          >
            {t.aiEcosystem.title1}

            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(to right,#c084fc,#f472b6,#22d3ee)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              {t.aiEcosystem.title2}
            </span>
          </h1>

          <p
            style={{
              maxWidth: "720px",
              margin: "28px auto 0",
              color: "#94a3b8",
              fontSize: "15px",
              lineHeight: 1.9,
            }}
          >
            {t.aiEcosystem.subtitle}
          </p>
        </div>

        {/* AI CORE */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "120px",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "300px",
              height: "300px",
              borderRadius: "9999px",
              background:
                "linear-gradient(135deg,rgba(139,92,246,0.25),rgba(59,130,246,0.1))",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(35px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 120px rgba(139,92,246,0.45)",
              animation: "pulse 6s ease-in-out infinite",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "-28px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.08)",
                animation: "spin 22s linear infinite",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: "18px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,255,255,0.05)",
                animation: "spinReverse 16s linear infinite",
              }}
            />

            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: "10px",
                  height: "10px",
                  borderRadius: "9999px",
                  background:
                    i % 2 === 0 ? "#c084fc" : "#22d3ee",
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 36}deg) translate(170px)`,
                  boxShadow:
                    i % 2 === 0
                      ? "0 0 18px #c084fc"
                      : "0 0 18px #22d3ee",
                }}
              />
            ))}

            <div style={{ textAlign: "center" }}>
              <h2
                style={{
                  fontSize: "46px",
                  fontWeight: 900,
                  color: "white",
                  letterSpacing: "-3px",
                }}
              >
                MYTAWJEH
              </h2>

              <p
                style={{
                  marginTop: "10px",
                  color: "#cbd5e1",
                  fontSize: "8px",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                {t.aiEcosystem.core}
              </p>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(340px,1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              title: t.aiEcosystem.student.title,
              subtitle: t.aiEcosystem.student.subtitle,
              color: "#c084fc",
              glow: "rgba(168,85,247,0.45)",
              button:
                "linear-gradient(to right,#9333ea,#ec4899)",
              buttonText: t.aiEcosystem.student.button,
              features: t.aiEcosystem.student.features,
            },

            {
              title: t.aiEcosystem.parent.title,
              subtitle: t.aiEcosystem.parent.subtitle,
              color: "#6ee7b7",
              glow: "rgba(16,185,129,0.45)",
              button:
                "linear-gradient(to right,#10b981,#14b8a6)",
              buttonText: t.aiEcosystem.parent.button,
              features: t.aiEcosystem.parent.features,
            },

            {
              title: t.aiEcosystem.teacher.title,
              subtitle: t.aiEcosystem.teacher.subtitle,
              color: "#7dd3fc",
              glow: "rgba(59,130,246,0.45)",
              button:
                "linear-gradient(to right,#2563eb,#06b6d4)",
              buttonText: t.aiEcosystem.teacher.button,
              features: t.aiEcosystem.teacher.features,
            },
          ].map((card, index) => (
            <div
              key={index}
              style={{
                position: "relative",
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "34px",
                padding: "36px",
                backdropFilter: "blur(22px)",
                transition: "0.7s",
                cursor: "pointer",
                animation: `floatCard ${
                  5 + index
                }s ease-in-out infinite`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(135deg,${card.glow},transparent)`,
                  opacity: 0.45,
                }}
              />

              <div
                style={{
                  position: "relative",
                  zIndex: 5,
                }}
              >
                {/* ICON */}
                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "20px",
                    background: card.button,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                    boxShadow: `0 0 40px ${card.glow}`,
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "9999px",
                      background: "white",
                    }}
                  />
                </div>

                {/* TITLE */}
                <h3
                  style={{
                    color: "white",
                    fontSize: "30px",
                    fontWeight: 800,
                    marginBottom: "14px",
                  }}
                >
                  {card.title}
                </h3>

                {/* SUBTITLE */}
                <p
                  style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    lineHeight: 1.8,
                    marginBottom: "26px",
                  }}
                >
                  {card.subtitle}
                </p>

                {/* FEATURES */}
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {card.features.map(
                    (item: string, i: number) => (
                      <div
                        key={i}
                        style={{
                          padding: "15px 16px",
                          borderRadius: "16px",
                          background:
                            "rgba(255,255,255,0.04)",
                          border:
                            "1px solid rgba(255,255,255,0.06)",
                          color: "#e2e8f0",
                          fontSize: "13px",
                        }}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>

                {/* BUTTON */}
                {/* BUTTON */}
<button onClick={() => onSignup(index === 0 ? "eleve" : index === 1 ? "parent" : "professeur")} style={{
    marginTop: "30px",
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: card.button,
    color: "white",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: `0 0 40px ${card.glow}`,
  }}
>
  {card.buttonText}
</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.04); }
            100% { transform: scale(1); }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes spinReverse {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }

          @keyframes float1 {
            0% { transform: translateY(0px); }
            50% { transform: translateY(45px); }
            100% { transform: translateY(0px); }
          }

          @keyframes float2 {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-45px); }
            100% { transform: translateY(0px); }
          }

          @keyframes floatCard {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-14px); }
            100% { transform: translateY(0px); }
          }

          @keyframes particle {
            0% {
              transform: translateY(0px);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-140px);
              opacity: 0;
            }
          }
        `}
      </style>
    </section>
  );
}