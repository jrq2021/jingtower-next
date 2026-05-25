import { MathCurveLoader } from "@/components/MathCurveLoader";

export default function Loading() {
  return (
    <div className="error-page-wrapper">
      <main className="error-page">
        <MathCurveLoader
          variant="rose"
          size={180}
          label="正在进入牌室"
          tone="gold"
        />
        <p
          style={{
            color: "var(--text-light-muted)",
            marginTop: 20,
            fontSize: 14,
          }}
        >
          牌面正在排列中...
        </p>
      </main>
    </div>
  );
}
