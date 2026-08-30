#!/usr/bin/env node

// MindAR 1.2.5 の OfflineCompiler と同じ処理を、ネイティブ canvas に
// 依存せず実行する教材アセット再生成用ツールです。
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [mindArRoot, outputPath, ...imagePaths] = process.argv.slice(2);
if (!mindArRoot || !outputPath || imagePaths.length === 0) {
    console.error("Usage: node compile-mindar-targets.mjs <mind-ar-root> <output.mind> <image.png> [...]");
    process.exit(2);
}

const moduleUrl = relativePath => pathToFileURL(path.join(mindArRoot, relativePath)).href;
const nodeModules = path.dirname(mindArRoot);
const pngModuleUrl = pathToFileURL(path.join(nodeModules, "pngjs", "lib", "png.js")).href;

const [{ CompilerBase }, { buildTrackingImageList }, { extractTrackingFeatures }, pngModule] =
    await Promise.all([
        import(moduleUrl("src/image-target/compiler-base.js")),
        import(moduleUrl("src/image-target/image-list.js")),
        import(moduleUrl("src/image-target/tracker/extract-utils.js")),
        import(pngModuleUrl)
    ]);

await import(moduleUrl("src/image-target/detector/kernels/cpu/index.js"));
const { PNG } = pngModule.default || pngModule;

class PngCompiler extends CompilerBase {
    createProcessCanvas(image) {
        return {
            width: image.width,
            height: image.height,
            getContext: () => ({
                drawImage: () => {},
                getImageData: () => ({ data: image.data })
            })
        };
    }

    compileTrack({ progressCallback, targetImages, basePercent }) {
        const percentPerImage = (100 - basePercent) / targetImages.length;
        let percent = 0;
        const list = [];

        for (const targetImage of targetImages) {
            const imageList = buildTrackingImageList(targetImage);
            const percentPerAction = percentPerImage / imageList.length;
            const trackingData = extractTrackingFeatures(imageList, () => {
                percent += percentPerAction;
                progressCallback(basePercent + percent);
            });
            list.push(trackingData);
        }

        return Promise.resolve(list);
    }
}

const images = imagePaths.map(imagePath => PNG.sync.read(fs.readFileSync(imagePath)));
const compiler = new PngCompiler();
let lastReported = -10;

await compiler.compileImageTargets(images, percent => {
    const rounded = Math.floor(percent / 10) * 10;
    if (rounded >= lastReported + 10) {
        lastReported = rounded;
        console.log(`Compiling: ${Math.min(rounded, 100)}%`);
    }
});

const data = compiler.exportData();
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, data);
console.log(`Wrote ${outputPath} (${data.byteLength} bytes, ${images.length} targets)`);
