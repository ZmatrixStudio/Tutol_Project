export default function LoadingScreen() {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        @keyframes loading {
          0% {
            transform: translate3d(-120%, 0, 0);
          }
          100% {
            transform: translate3d(380%, 0, 0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(255,255,255,.15));
          }
          50% {
            filter: drop-shadow(0 0 40px rgba(255,255,255,.35));
          }
        }

        @keyframes blob1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, -50px) scale(1.2);
          }
        }

        @keyframes blob2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, 40px) scale(1.25);
          }
        }

        @keyframes stars {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-20px);
          }
        }

        .logo-animation {
          animation:
            float 3s ease-in-out infinite,
            pulseGlow 3s ease-in-out infinite;
          will-change: transform, filter;
        }

        .blob-1 {
          animation: blob1 10s ease-in-out infinite;
          filter: blur(20px);
          will-change: transform;
        }

        .blob-2 {
          animation: blob2 12s ease-in-out infinite;
          filter: blur(20px);
          will-change: transform;
        }

        .loading-bar::before {
          content: "";
          position: absolute;
          inset: 0;
          width: 40%;
          border-radius: 9999px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.95),
            transparent
          );
          animation: loading 1.6s ease-in-out infinite;
          will-change: transform;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: rgba(255,255,255,.5);
          animation: stars 2s ease-in-out infinite alternate;
        }
      `}</style>

      <div className="min-h-screen overflow-hidden flex justify-center items-center relative bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700">

        {/* Glow background */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Animated blobs */}
        <div className="absolute -top-24 -left-24 w-[320px] h-[320px] rounded-full bg-cyan-400/10 blob-1" />

        <div className="absolute -bottom-24 -right-24 w-[280px] h-[280px] rounded-full bg-blue-300/10 blob-2" />

        {/* Particles */}
        <div className="particle top-[15%] left-[20%]" />
        <div className="particle top-[30%] left-[80%]" />
        <div className="particle top-[75%] left-[15%]" />
        <div className="particle top-[60%] left-[90%]" />
        <div className="particle top-[85%] left-[50%]" />
        <div className="particle top-[25%] left-[45%]" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <img
            className="w-[240px] mx-auto logo-animation"
            src="https://scontent.fsgn1-1.fna.fbcdn.net/v/t1.15752-9/731441522_1670613317352519_3566367649403755495_n.png?stp=dst-png_s480x480&_nc_cat=107&ccb=1-7&_nc_sid=0024fc&_nc_eui2=AeHapLDRCVDZ_IXz9Fgn_qp0nxhclFK41-afGFyUUrjX5trhD2BZIwLLoCn1OHdt1oWuszOOhkiHnx0HnK4-5daM&_nc_ohc=yH3WDMqypCcQ7kNvwHtU20D&_nc_oc=Adq-IXFUcTRY3vGD-lERPcu82-b-5-fU5SUmI-Q_tQ9cYDq7v-zdnaKo3acRXyKwTXE&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent.fsgn1-1.fna&_nc_ss=7a22e&oh=03_Q7cD5wH0sQ3E4SI7yQEEefz-6owTKRHpodLkDv8yzyc2BIWNHg&oe=6A73EE75"
            alt="Logo ET"
          />

          <h2 className="mt-5 text-white text-2xl font-bold tracking-wide">
            TuToroo Application
          </h2>

          <p className="mt-2 text-white/70 text-sm">
            Initializing resources...
          </p>

          {/* Loading Bar */}
          <div className="loading-bar relative overflow-hidden w-[260px] h-[8px] mx-auto mt-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/10" />

          <p className="mt-4 text-xs text-white/50 tracking-widest uppercase">
            Please wait...
          </p>
        </div>
      </div>
    </>
  );
}