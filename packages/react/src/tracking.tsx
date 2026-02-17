"use client";

import { useEffect, useState } from "react";
import {
  init,
  getClickId,
  reset,
  type RefportTrackingOptions,
  type RefportTrackingResult,
} from "refport-js";

export { getClickId, reset };

const INITIAL_RESULT: RefportTrackingResult = {
  tracked: false,
  clickId: null,
  source: null,
};

export function useRefportTracking(
  options?: RefportTrackingOptions,
): RefportTrackingResult {
  const [result, setResult] = useState<RefportTrackingResult>(INITIAL_RESULT);

  useEffect(() => {
    setResult(init(options));
  }, []);

  return result;
}

export function RefportTracker(props: {
  options?: RefportTrackingOptions;
  onTrack?: (result: RefportTrackingResult) => void;
}): null {
  const result = useRefportTracking(props.options);

  useEffect(() => {
    if (result.clickId && props.onTrack) {
      props.onTrack(result);
    }
  }, [result, props.onTrack]);

  return null;
}
