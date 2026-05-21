import { useState } from "react";

export default function SmartChatbot({
  language,
  onSignup,
}: any) {
  const [selected, setSelected] = useState<any>(null);

  const data = {
    fr: {
      badge: "ASSISTANT IA MYTAWJEH",

      title1: "Découvrez",

      title2: "Votre assistant intelligent",

      subtitle:
        "Explorez les fonctionnalités IA de MyTawjeh et obtenez des réponses instantanées sur votre orientation, vos exercices intelligents et votre roadmap personnalisée.",

      typing: "MyTawjeh AI réfléchit...",

      cta: "Créer mon compte gratuitement",

      placeholder:
        "Cliq uez sur une question pour découvrir l’univers intelligent de MyTawjeh.",

      questions: [
        {
          q: "Comment choisir ma filière ?",
          a: "MyTawjeh analyse votre profil, vos compétences et vos objectifs afin de vous recommander les meilleures filières adaptées à votre avenir.",
        },

        {
          q: "Quels exercices intelligents proposez-vous ?",
          a: "Notre plateforme propose des exercices IA personnalisés selon votre niveau afin d’améliorer rapidement vos compétences.",
        },

        {
          q: "Comment fonctionne la roadmap IA ?",
          a: "L’intelligence artificielle génère une roadmap complète pour guider votre évolution académique étape par étape.",
        },

        {
          q: "Pourquoi créer un compte ?",
          a: "Créer un compte vous permet d’accéder au dashboard intelligent, aux recommandations IA, aux concours, aux notes et à votre assistant personnel.",
        },

        {
          q: "Les parents peuvent-ils suivre les élèves ?",
          a: "Oui. Les parents disposent d’un espace intelligent pour suivre les notes, les progrès et l’évolution des élèves.",
        },

        {
          q: "Puis-je discuter avec un vrai chatbot IA ?",
          a: "Oui , Après inscription, vous aurez accès à un véritable assistant IA avancé intégré dans MyTawjeh.",
        },
      ],
    },

    ar: {
      badge: "المساعد الذكي MYTAWJEH",

      title1: "اكتشف",

      title2: "مساعدك الذكي",

      subtitle:
        "استكشف مميزات الذكاء الاصطناعي داخل MyTawjeh واحصل على إجابات فورية حول التوجيه والتمارين الذكية وخارطة الطريق الخاصة بك.",

      typing: "ذكاء MyTawjeh يفكر...",

      cta: "إنشاء حساب مجاني",

      placeholder:
        " اضغط على سؤال لاكتشاف عالم MyTawjeh الذكي.",

      questions: [
        {
          q: "كيف أختار تخصصي الدراسي؟",
          a: "يقوم MyTawjeh بتحليل ملفك الدراسي ومهاراتك وأهدافك من أجل اقتراح أفضل التخصصات المناسبة لك.",
        },

        {
          q: "ما هي التمارين الذكية المتوفرة؟",
          a: "توفر المنصة تمارين ذكية مخصصة حسب مستواك لمساعدتك على التطور بسرعة وفعالية.",
        },

        {
          q: "كيف تعمل خارطة الطريق الذكية؟",
          a: "يقوم الذكاء الاصطناعي بإنشاء خارطة طريق متكاملة لمساعدتك على تطوير مسارك الدراسي خطوة بخطوة.",
        },

        {
          q: "لماذا يجب إنشاء حساب؟",
          a: "إنشاء حساب يمنحك الوصول إلى لوحة تحكم ذكية، مساعد IA، تمارين ذكية، توصيات مخصصة وتتبع تطورك الدراسي.",
        },

        {
          q: "هل يمكن للأولياء متابعة التلاميذ؟",
          a: "نعم، توفر المنصة فضاءً خاصاً بالأولياء لتتبع النقط والتطور الدراسي للأبناء.",
        },

        {
          q: "هل يوجد شات بوت حقيقي داخل المنصة؟",
          a: "نعم 😍 بعد التسجيل ستتمكن من استعمال مساعد ذكي متطور داخل منصة MyTawjeh.",
        },
      ],
    },
  };

  const t = language === "ar" ? data.ar : data.fr;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "160px 24px",
        background:
          "linear-gradient(135deg,#eef2ff 0%,#f5f3ff 25%,#ecfeff 60%,#dbeafe 100%)",
      }}
    >
      {/* LIGHTS */}
      <div
        style={{
          position: "absolute",
          top: "-250px",
          left: "-200px",
          width: "700px",
          height: "700px",
          borderRadius: "999px",
          background:
          "radial-gradient(circle,#c084fc 0%,transparent 70%)",
          opacity: 0.45,
          filter: "blur(90px)",
          animation: "float1 8s ease-in-out infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "-300px",
          right: "-250px",
          width: "700px",
          height: "700px",
          borderRadius: "999px",
         background:
         "radial-gradient(circle,#38bdf8 0%,transparent 70%)",
          opacity: 0.35,
          filter: "blur(100px)",
          animation: "float2 10s ease-in-out infinite",
        }}
      />

      {/* GRID */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.4,
        }}
      />

      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          position: "relative",
          zIndex: 5,
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "90px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 24px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              color: "#6d28d9",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              boxShadow: "0 0 35px rgba(124,58,237,0.25)",
            }}
          >
            ✨ {t.badge}
          </div>

          <h1
            style={{
              marginTop: "32px",
              fontSize: "65px",
              fontWeight: 900,
              lineHeight: 1,
              color: "#312e81",
              letterSpacing: "-5px",
            }}
          >
            {t.title1}

            <span
              style={{
                display: "block",
                background:
                  "linear-gradient(to right,#8b5cf6,#38bdf8,#22d3ee)",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow:
                  "0 0 30px rgba(192,132,252,0.35)",
              }}
            >
              {t.title2}
            </span>
          </h1>

          <p
            style={{
              maxWidth: "820px",
              margin: "30px auto 0",
              color: "#5b21b6",
              lineHeight: 2,
              fontSize: "16px",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        {/* MAIN */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 430px",
            gap: "38px",
          }}
        >
          {/* LEFT */}
          <div
            style={{
              background: "rgba(255,255,255,0.45)",
              border: "1px solid rgba(255,255,255,0.6)",
              borderRadius: "42px",
              padding: "42px",
              backdropFilter: "blur(25px)",
              boxShadow:
                "0 10px 40px rgba(139,92,246,0.15)",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
                marginBottom: "38px",
              }}
            >
              <div
                style={{
                  width: "74px",
                  height: "74px",
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg,#8b5cf6,#22d3ee)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  boxShadow:
                    "0 0 50px rgba(139,92,246,0.45)",
                }}
              >
                🤖
              </div>

              <div>
                <h3
                  style={{
                    color: "#312e81",
                    fontSize: "24px",
                    fontWeight: 800,
                  }}
                >
                  MyTawjeh AI
                </h3>

                <p
                  style={{
                    color: "#4ade80",
                    fontSize: "13px",
                  }}
                >
                  ● Online & Intelligent
                </p>
              </div>
            </div>

            {/* QUESTIONS */}
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {t.questions.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelected(item)}
                  style={{
                    padding: "22px",
                    borderRadius: "24px",
                    border:
                      selected?.q === item.q
                        ? "1px solid rgba(255,255,255,0.25)"
                        : "1px solid rgba(255,255,255,0.08)",
                    background:
                      selected?.q === item.q
                        ? "linear-gradient(135deg,#8b5cf6,#06b6d4)"
                        : "rgba(255,255,255,0.04)",
                    color: "#4c1d95",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "0.45s",
                    transform:
                    selected?.q === item.q
                    ? "scale(1.03)"
                    : "scale(1)",
                    fontSize: "14px",
                    fontWeight: 700,
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      selected?.q === item.q
                        ? "0 0 45px rgba(139,92,246,0.35)"
                        : "none",
                  }}
                >
                  ✨ {item.q}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{ 
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "42px",
              padding: "42px",
              backdropFilter: "blur(25px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow:
                "0 0 60px rgba(6,182,212,0.12)",
            }}
          >
            <div>
              {/* STATUS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "30px",
                }}
              >
                <div
                  style={{
                    width: "13px",
                    height: "13px",
                    borderRadius: "999px",
                    background: "#4ade80",
                    boxShadow: "0 0 20px #4ade80",
                  }}
                />

                <span
                  style={{
                    color: "#5b21b6",
                    fontSize: "13px",
                  }}
                >
                  {t.typing}
                </span>
              </div>

              {/* RESPONSE */}
              <div
                style={{
                  minHeight: "340px",
                  padding: "32px",
                  borderRadius: "30px",
                  background: "rgba(255,255,255,0.04)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  color: "#312e81",
                  lineHeight: 2,
                  fontSize: "15px",
                  boxShadow:
                    "inset 0 0 25px rgba(255,255,255,0.03)",
                }}
              >
                {selected ? (
                  <div>
                    <div
                      style={{
                        marginBottom: "18px",
                        fontWeight: 800,
                        color: "#67e8f9",
                      }}
                    >
                      ✨ {selected.q}
                    </div>

                    {selected.a}
                  </div>
                ) : (
                  <span style={{ color: "#6d28d9" }}>
                    {t.placeholder}
                  </span>
                )}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onSignup}
              style={{
                marginTop: "34px",
                width: "100%",
                padding: "20px",
                borderRadius: "24px",
                border: "none",
                background:
                  "linear-gradient(135deg,#8b5cf6,#38bdf8)",
                color: "#4c1d95",
                fontWeight: 900,
                fontSize: "15px",
                cursor: "pointer",
                letterSpacing: "0.5px",
                boxShadow:
                  "0 0 55px rgba(139,92,246,0.35)",
                transition: "0.4s",
              }}
            >
              🚀 {t.cta}
            </button>
          </div>
        </div>
      </div>
      <style>
{`
@keyframes float1 {
0% {
transform: translateY(0px) translateX(0px);
}
50% {
transform: translateY(40px) translateX(20px);
}
100% {
transform: translateY(0px) translateX(0px);
}
}

@keyframes float2 {
0% {
transform: translateY(0px) translateX(0px);
}
50% {
transform: translateY(-40px) translateX(-20px);
}
100% {
transform: translateY(0px) translateX(0px);
}
}
`}
</style>
    </section>
  );
}