declare module 'handtrackjs' {
    interface HandtrackOptions {
        flipHorizontal?: boolean;
        outputStride?: number;
        boundingBox?: number;
        maxNumBoxes?: number;
        iouThreshold?: number;
        scoreThreshold?: number;
    }

    interface HandtrackPrediction {
        bbox: [number, number, number, number];
        class: number;
        score: number;
    }

    interface HandtrackModel {
        load(modelParams?: HandtrackOptions): Promise<HandtrackModel>;
        detect(video: HTMLVideoElement | HTMLImageElement): Promise<HandtrackPrediction[]>;
        startVideo(video: HTMLVideoElement): Promise<any>;
    }

    const handTrack: HandtrackModel;
    export = handTrack;
}
