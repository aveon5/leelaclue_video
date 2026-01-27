import "./index.css";
import { Composition } from "remotion";
import { VideoFabric, taskSchema } from "./VideoFabric";
import defaultTask from "../tasks/task-de-1.json";
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
    </>
  );
};
