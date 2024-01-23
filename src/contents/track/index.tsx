import * as handTrack from 'handtrackjs';
import { onMessage, sendMessage } from 'webext-bridge';

// 不能删，要打包 css
import './style.scss';

const modelParams = {
    flipHorizontal: true, // 翻转摄像头
    maxNumBoxes: 20, // 最大检测数量
    iouThreshold: 0.5, // 阈值
    scoreThreshold: 0.6,
    labelMap: {
        1: 'open',
        2: 'closed',
        3: 'pinch',
        4: 'point',
        6: 'pointtip',
        7: 'pinchtip',
    },
    modelType: 'ssd320fpnlite',
};

const video = document.createElement('video');
let status: string;
let timerId: ReturnType<typeof setTimeout> | null = null;
let videoStream: MediaStream | null = null;
let trackingActive = true;

const stopTracking = () => {
    // 停止跟踪逻辑
    trackingActive = false;

    // 停止摄像头使用
    if (videoStream) {
        const videoTracks = videoStream.getTracks();
        videoTracks.forEach((track) => {
            track.stop();
        });
    }
};

const initMytack = (handModel: any, video: HTMLVideoElement) => {
    const runDetection = () => {
        handModel.detect(video).then((predictions: any) => {
            if (!trackingActive) {
                return;
            }
            if (predictions.length > 0) {
                status =
                    predictions[0].label === undefined
                        ? predictions[1]
                            ? predictions[1].label
                            : predictions[0].label
                        : predictions[0].label;
            }
            if (!timerId) {
                timerId = setTimeout(() => {
                    sendMessage('track', { label: status }, 'background');
                    timerId = null;
                }, 600);
            }
            requestAnimationFrame(runDetection);
        });
    };
    runDetection();
    console.log('---start-track---');
};

navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
        videoStream = stream;
        video.srcObject = stream; // 将捕获的视频流传递给video
    })
    .then(() => {
        handTrack.startVideo(video as HTMLVideoElement).then((data: { status: boolean }) => {
            if (data.status) {
                handTrack.load(modelParams).then((model: any) => {
                    initMytack(model, video);
                });
            }
        });
    });

onMessage('stop-track', () => {
    console.log('---stop-track---');
    stopTracking();
});
