import { useGlobalStore } from "@store/global-store";

export default function PlanPrice({ plan }) {
  const { isYearly } = useGlobalStore();
  return (
    <div className="flex flex-row justify-center items-center">
      <p className="text-4xl font-bold">
        {isYearly ? ` ${plan.yearlyPlan}` : `${plan.price}`}
        <span className="text-sm">/{isYearly ? "year" : "month"}</span>
      </p>
    </div>
  );
}
