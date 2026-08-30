(() => {
    "use strict";

    let arSystem = null;
    let arStarted = false;
    let arStarting = false;
    let stopRequested = false;
    let markerDetected = false;
    let initialized = false;

    // 教材配布時は false。発展課題でのみ true に変更します。
    const ENABLE_AR_OVERLAY = false;
    const markerNames = ["spot_01", "spot_02", "spot_03"];

    function initializeWebAR() {
        const scene = document.querySelector("#ar-scene");
        if (!scene) {
            console.error("AR Sceneが見つかりません。");
            return;
        }

        const setup = () => {
            if (initialized) return;

            arSystem = scene.systems["mindar-image-system"];
            if (!arSystem) {
                console.error("MindAR Systemが見つかりません。");
                return;
            }

            initialized = true;
            setupTargetEvents();
            setupCloseButton();
            resetAllOverlays();
            console.log("WebAR initialized.");
        };

        if (scene.hasLoaded) setup();
        else scene.addEventListener("loaded", setup, { once: true });
    }

    function setupTargetEvents() {
        markerNames.forEach((markerName, index) => {
            const target = document.getElementById("target-" + index);
            if (!target) {
                console.warn("target-" + index + " が見つかりません。");
                return;
            }

            target.addEventListener("targetFound", () => {
                if (markerDetected || !arStarted) return;

                markerDetected = true;
                console.log("Marker detected: " + markerName);
                sendMarkerToUnity(markerName);

                if (ENABLE_AR_OVERLAY) showOverlay(index);
                else stopWebAR();
            });
        });
    }

    function showOverlay(index) {
        resetAllOverlays();
        const overlay = document.getElementById("overlay-" + index);
        if (overlay) overlay.setAttribute("visible", true);
        else console.warn("overlay-" + index + " が見つかりません。");
    }

    function resetAllOverlays() {
        markerNames.forEach((_, index) => {
            const overlay = document.getElementById("overlay-" + index);
            if (overlay) overlay.setAttribute("visible", false);
        });
    }

    function setupCloseButton() {
        const closeButton = document.getElementById("ar-close-button");
        if (closeButton) closeButton.addEventListener("click", stopWebAR);
    }

    window.webARStart = async function () {
        if (!arSystem) {
            console.error("WebARの初期化が完了していません。");
            return;
        }
        if (arStarted || arStarting) return;

        arStarting = true;
        stopRequested = false;
        markerDetected = false;
        resetAllOverlays();
        setARContainerVisible(true);

        try {
            await arSystem.start();
            arStarted = true;
            if (stopRequested) stopWebAR();
        } catch (error) {
            console.error("WebARの起動に失敗しました。", error);
            setARContainerVisible(false);
        } finally {
            arStarting = false;
        }
    };

    window.webARStop = stopWebAR;

    function stopWebAR() {
        stopRequested = true;
        resetAllOverlays();

        if (arSystem && arStarted) {
            try {
                arSystem.stop();
            } catch (error) {
                console.error("WebARの停止時にエラーが発生しました。", error);
            }
        }

        arStarted = false;
        setARContainerVisible(false);
    }

    function setARContainerVisible(visible) {
        const container = document.getElementById("ar-container");
        if (!container) return;
        container.classList.toggle("active", visible);
        container.setAttribute("aria-hidden", visible ? "false" : "true");
    }

    function sendMarkerToUnity(markerName) {
        if (!window.unityGameInstance) {
            console.error("Unity Instanceがまだ利用できません。");
            return;
        }

        window.unityGameInstance.SendMessage("WebARBridge", "OnMarkerDetected", markerName);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeWebAR, { once: true });
    } else {
        initializeWebAR();
    }
})();
