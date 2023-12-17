import { useEffect, useRef } from "react";

export default function useUpdateEffect(
  callback: () => void,
  dependencies: any[]
) {
  const renderRef = useRef(false);

  useEffect(() => {
    if (!renderRef.current) {
      renderRef.current = true;
      return;
    }

    return callback();
  }, dependencies);
}
