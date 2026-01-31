import "./index.css";
import { Composition } from "remotion";
import { VideoFabric, taskSchema } from "./VideoFabric";
import { LeelaInMotion, leelaInMotionSchema } from "./LeelaInMotion";
import defaultTask from "../tasks/task-de-1.json";
import defaultMotionTask from "../tasks_motion/motion-task-de-1.json";
import { loadFont } from "@remotion/google-fonts/Philosopher";

const { fontFamily } = loadFont();

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoFabric"
        component={VideoFabric}
        durationInFrames={690}
        fps={30}
        width={1080}
        height={1920}
        schema={taskSchema}
        defaultProps={defaultTask as any}
      />
      <Composition
        id="LeelaInMotion"
        component={LeelaInMotion}
        durationInFrames={768}
        fps={24}
        width={1080}
        height={1920}
        schema={leelaInMotionSchema}
        defaultProps={defaultMotionTask as any}
      />
    </>
  );
};
