import {
  HandThumbDownIcon,
  HandThumbUpIcon,
  EllipsisHorizontalIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export function LangSmithActions(props: { runId: string }) {
  const [state, setState] = useState<{
    score: number;
    inflight: boolean;
  } | null>(null);
  const sendFeedback = async (score: number) => {
    setState({ score, inflight: true });
    await fetch(`${process.env.VITE_BACKEND_URL}//runs/feedback`, {
      method: "POST",
      body: JSON.stringify({
        run_id: props.runId,
        key: "user_score",
        score: score,
      }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setState({ score, inflight: false });
  };
  return (
    <div className="flex flex-row gap-2 mt-2">
      <button
        type="button"
        className="p-1 text-gray-900 rounded-full shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => sendFeedback(1)}
      >
        {state?.score === 1 ? (
          state?.inflight ? (
            <EllipsisHorizontalIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <CheckIcon className="w-5 h-5" aria-hidden="true" />
          )
        ) : (
          <HandThumbUpIcon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
      <button
        type="button"
        className="p-1 text-gray-900 rounded-full shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => sendFeedback(0)}
      >
        {state?.score === 0 ? (
          state?.inflight ? (
            <EllipsisHorizontalIcon className="w-5 h-5" aria-hidden="true" />
          ) : (
            <CheckIcon className="w-5 h-5" aria-hidden="true" />
          )
        ) : (
          <HandThumbDownIcon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
