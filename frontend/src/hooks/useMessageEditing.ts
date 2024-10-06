import { useCallback, useState } from "react";
import { Message } from "../types";
import { omit } from "lodash";

export function useMessageEditing(
  threadId: string | undefined,
  onSuccess: () => void,
) {
  const [editing, setEditing] = useState<Record<string, Message>>({});

  const recordEdits = useCallback((msg: Message) => {
    setEditing((current) => ({ ...current, [msg.id]: msg }));
  }, []);
  const commitEdits = useCallback(async () => {
    if (!threadId) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}//threads/${threadId}/state`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", "Authorization": `Bearer ${localStorage.getItem("token")}`
      },

      body: JSON.stringify({ values: Object.values(editing) }),
    })
      .then((res) => {
        if (res.ok) {
          setEditing({});
          onSuccess();
        } else {
          return Promise.reject(res.statusText);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }, [threadId, editing, onSuccess]);
  const abandonEdits = useCallback((msg?: Message) => {
    if (msg) {
      setEditing((current) => {
        return omit(current, msg.id);
      });
    } else {
      setEditing({});
    }
  }, []);

  return {
    editing,
    recordEdits,
    commitEdits: threadId ? commitEdits : undefined,
    abandonEdits,
  };
}
