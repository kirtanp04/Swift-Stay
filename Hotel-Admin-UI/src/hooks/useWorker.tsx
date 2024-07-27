import React from "react";
import { WorkerManager } from "src/service/WorkerManager";

export default function useWorker(filePath: string) {
  const [worker, setWorker] = React.useState<WorkerManager | null>(null);

  React.useEffect(() => {
    async function init() {
      const WorkerModule = await import(`${filePath}?worker`);
      const newWorker = new WorkerModule.default();
      const _WorkerManager = new WorkerManager(newWorker);
      setWorker(_WorkerManager);

      return () => {
        worker?.terminate();
      };
    }

    init();
  }, []);

  const GetStateOfCountry = (
    countryCode: string,
    onSuccess: (res: any) => void,
    onloading?: (isloading: boolean) => void
  ) => {
    debugger;
    if (worker) {
      if (onloading !== undefined) {
        onloading(true);
      }
      worker.postMessage({ countryCode: countryCode });

      worker.onMessage((e: MessageEvent) => {
        onSuccess(e.data);
        if (onloading !== undefined) {
          onloading(false);
        }
      });
    }
  };

  const GetAllCityOfState = (
    StateCode: string,
    onSuccess: (res: any) => void,
    onloading?: (isloading: boolean) => void
  ) => {
    debugger;
    if (worker) {
      if (onloading !== undefined) {
        onloading(true);
      }
      worker.postMessage({ StateCode: StateCode });

      worker.onMessage((e: MessageEvent) => {
        onSuccess(e.data);
        if (onloading !== undefined) {
          onloading(false);
        }
      });
    }
  };

  return { GetStateOfCountry, GetAllCityOfState };
}
