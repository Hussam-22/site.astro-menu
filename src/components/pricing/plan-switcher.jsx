import { useGlobalStore } from "@store/global-store";

export default function PlanSwitcher() {
  const { isYearly, togglePlan } = useGlobalStore();

  return (
    <div className="flex items-center gap-3 pb-6 text-2xl font-light">
      <span className={!isYearly ? "font-bold text-orange-500" : ""}>
        Monthly
      </span>
      <button
        onClick={togglePlan}
        className="w-12 h-6 rounded-full bg-gray-300 relative"
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            isYearly ? "translate-x-6" : ""
          }`}
        />
      </button>
      <span className={isYearly ? "font-bold text-orange-500" : ""}>
        Yearly (Save 240 AED)
      </span>
    </div>
  );
}
