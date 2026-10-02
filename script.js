document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */

    const startAnalysisBtn = document.getElementById("startAnalysisBtn");
    const recordButton = document.getElementById("recordButton");
    const recordButtonText = document.getElementById("recordButtonText");
    const recordStatus = document.getElementById("recordStatus");
    const statusIndicator = document.getElementById("statusIndicator");
    const recordTimer = document.getElementById("recordTimer");
    const recordHelper = document.getElementById("recordHelper");
    const micCircle = document.getElementById("micCircle");
    const waveform = document.getElementById("waveform");
    const stepRecord = document.getElementById("stepRecord");
    const stepAnalyze = document.getElementById("stepAnalyze");
    const stepResult = document.getElementById("stepResult");
    const recordingPreview = document.getElementById("recordingPreview");
    const recordedAudio = document.getElementById("recordedAudio");
    const audioPlayButton = document.getElementById("audioPlayButton");
    const audioCurrentTime = document.getElementById("audioCurrentTime");
    const audioTotalTime = document.getElementById("audioTotalTime");
    const previewDuration = document.getElementById("previewDuration");
    const analyzeAudioButton = document.getElementById("analyzeAudioButton");
    const recordAgainButton = document.getElementById("recordAgainButton");
    const audioWavePreview = document.getElementById("audioWavePreview");


    /* =========================
       VARIABLES
    ========================= */

    let mediaRecorder = null;
    let mediaStream = null;
    let audioChunks = [];
    let timerInterval = null;
    let seconds = 0;
    let isRecording = false;
    let recordedBlob = null;
    let recordedAudioURL = null;


    /* =========================
       DATASET SETTINGS
    ========================= */

    const HF_DATASET = "szzs1693/coswara-data";
    const HF_CONFIG = "audio";
    const HF_SPLIT = "train";

    const REFERENCE_COUNT = 12;

    const MODEL_CACHE_KEY =
        "coughReferenceModel_v2";


    /* =========================
       START BUTTON
    ========================= */

    if (startAnalysisBtn) {

        startAnalysisBtn.addEventListener(
            "click",
            (e) => {

                const target =
                    startAnalysisBtn.getAttribute("href");

                /*
                   Jika tombol mengarah ke halaman lain,
                   biarkan browser melakukan navigasi normal.
                */

                if (
                    target &&
                    target !== "#recorder"
                ) {
                    return;
                }

                e.preventDefault();

                const recorderSection =
                    document.getElementById("recorder");

                if (recorderSection) {

                    recorderSection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    }


    /* =========================
       TIME
    ========================= */

    function formatTime(total) {

        if (!Number.isFinite(total)) {
            return "00:00";
        }

        const minute =
            Math.floor(total / 60);

        const second =
            Math.floor(total % 60);

        return (
            String(minute).padStart(2, "0") +
            ":" +
            String(second).padStart(2, "0")
        );

    }


    function startTimer() {

        seconds = 0;

        recordTimer.textContent =
            "00:00";

        timerInterval =
            setInterval(() => {

                seconds++;

                recordTimer.textContent =
                    formatTime(seconds);

            }, 1000);

    }


    function stopTimer() {

        if (timerInterval) {

            clearInterval(timerInterval);

            timerInterval = null;

        }

    }


    /* =========================
       RECORDING UI
    ========================= */

    function updateRecordingUI(recording) {

        if (recording) {

            recordButton.classList.add(
                "recording"
            );

            if (micCircle) {

                micCircle.classList.add(
                    "recording"
                );

            }

            if (waveform) {

                waveform.classList.add(
                    "active"
                );

            }

            if (statusIndicator) {

                statusIndicator.classList.add(
                    "recording"
                );

            }

            recordStatus.textContent =
                "Sedang merekam";

            recordHelper.textContent =
                "Tekan tombol lagi untuk menghentikan rekaman";

            recordButtonText.textContent =
                "STOP REKAM";

        }

        else {

            recordButton.classList.remove(
                "recording"
            );

            if (micCircle) {

                micCircle.classList.remove(
                    "recording"
                );

            }

            if (waveform) {

                waveform.classList.remove(
                    "active"
                );

            }

            if (statusIndicator) {

                statusIndicator.classList.remove(
                    "recording"
                );

            }

        }

    }


    /* =========================
       MIME TYPE
    ========================= */

    function getSupportedMimeType() {

        const types = [

            "audio/webm;codecs=opus",

            "audio/webm",

            "audio/mp4",

            "audio/ogg;codecs=opus",

            "audio/ogg"

        ];

        for (const type of types) {

            if (
                typeof MediaRecorder !== "undefined" &&
                MediaRecorder.isTypeSupported(type)
            ) {

                return type;

            }

        }

        return "";

    }


    /* =========================
       START RECORDING
    ========================= */

    async function startRecording() {

        try {

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                throw new Error(
                    "Browser tidak mendukung akses mikrofon."
                );

            }


            if (
                typeof MediaRecorder === "undefined"
            ) {

                throw new Error(
                    "Browser tidak mendukung MediaRecorder."
                );

            }


            mediaStream =
                await navigator.mediaDevices.getUserMedia({

                    audio: {

                        echoCancellation: true,

                        noiseSuppression: true,

                        autoGainControl: true,

                        channelCount: 1

                    }

                });


            audioChunks = [];


            const mimeType =
                getSupportedMimeType();


            if (mimeType) {

                mediaRecorder =
                    new MediaRecorder(
                        mediaStream,
                        {
                            mimeType: mimeType
                        }
                    );

            }

            else {

                mediaRecorder =
                    new MediaRecorder(
                        mediaStream
                    );

            }


            /* =========================
               AUDIO DATA
            ========================= */

            mediaRecorder.ondataavailable =
                (event) => {

                    if (
                        event.data &&
                        event.data.size > 0
                    ) {

                        audioChunks.push(
                            event.data
                        );

                    }

                };


            /* =========================
               RECORDING ERROR
            ========================= */

            mediaRecorder.onerror =
                (event) => {

                    console.error(
                        "MediaRecorder error:",
                        event.error
                    );

                    recordStatus.textContent =
                        "Terjadi masalah saat merekam";

                    recordHelper.textContent =
                        "Coba izinkan microphone lalu rekam kembali.";

                };


            /* =========================
               STOP RECORDING
            ========================= */

            mediaRecorder.onstop =
                () => {

                    if (
                        !audioChunks.length
                    ) {

                        recordStatus.textContent =
                            "Rekaman tidak tersimpan";

                        recordHelper.textContent =
                            "Tidak ada data audio yang berhasil direkam. Coba lagi.";

                        recordButton.disabled =
                            false;

                        recordButtonText.textContent =
                            "MULAI REKAM";

                        if (mediaStream) {

                            mediaStream
                                .getTracks()
                                .forEach(
                                    track =>
                                        track.stop()
                                );

                        }

                        return;

                    }


                    /* =========================
                       CREATE BLOB
                    ========================= */

                    const type =
                        mediaRecorder.mimeType ||
                        mimeType ||
                        "audio/webm";


                    recordedBlob =
                        new Blob(
                            audioChunks,
                            {
                                type: type
                            }
                        );


                    if (
                        recordedBlob.size < 100
                    ) {

                        recordStatus.textContent =
                            "Rekaman terlalu kosong";

                        recordHelper.textContent =
                            "Audio tidak berhasil tersimpan. Coba rekam lagi.";

                        recordButton.disabled =
                            false;

                        recordButtonText.textContent =
                            "MULAI REKAM";

                        if (mediaStream) {

                            mediaStream
                                .getTracks()
                                .forEach(
                                    track =>
                                        track.stop()
                                );

                        }

                        return;

                    }


                    /* =========================
                       CREATE AUDIO URL
                    ========================= */

                    if (recordedAudioURL) {

                        URL.revokeObjectURL(
                            recordedAudioURL
                        );

                    }


                    recordedAudioURL =
                        URL.createObjectURL(
                            recordedBlob
                        );


                    recordedAudio.src =
                        recordedAudioURL;

                    recordedAudio.preload =
                        "metadata";

                    recordedAudio.load();


                    /* =========================
                       SHOW PREVIEW
                    ========================= */

                    recordingPreview.classList.add(
                        "show"
                    );


                    previewDuration.textContent =
                        recordTimer.textContent;

                    audioTotalTime.textContent =
                        recordTimer.textContent;


                    recordButton.disabled =
                        true;

                    recordButtonText.textContent =
                        "REKAMAN SIAP";

                    recordStatus.textContent =
                        "Rekaman berhasil dibuat";

                    recordHelper.textContent =
                        "Tekan tombol play untuk mendengarkan rekaman.";


                    /* =========================
                       UPDATE STEPS
                    ========================= */

                    stepRecord.classList.remove(
                        "active"
                    );

                    stepRecord.classList.add(
                        "completed"
                    );

                    stepAnalyze.classList.add(
                        "active"
                    );


                    /* =========================
                       STOP MICROPHONE
                    ========================= */

                    if (mediaStream) {

                        mediaStream
                            .getTracks()
                            .forEach(
                                track =>
                                    track.stop()
                            );

                    }

                };


            /* =========================
               START MEDIA RECORDER
            ========================= */

            mediaRecorder.start(250);

            isRecording = true;

            startTimer();

            updateRecordingUI(
                true
            );

        }

        catch (error) {

            console.error(
                "Microphone error:",
                error
            );

            isRecording = false;

            stopTimer();

            updateRecordingUI(
                false
            );

            recordStatus.textContent =
                "Mikrofon tidak dapat digunakan";

            recordHelper.textContent =
                "Pastikan izin mikrofon sudah diberikan dan coba lagi.";

        }

    }


    /* =========================
       STOP RECORDING
    ========================= */

    function stopRecording() {

        if (
            mediaRecorder &&
            mediaRecorder.state ===
                "recording"
        ) {

            mediaRecorder.stop();

        }

        isRecording = false;

        stopTimer();

        updateRecordingUI(
            false
        );

    }


    /* =========================
       RECORD BUTTON
    ========================= */

    if (recordButton) {

        recordButton.addEventListener(
            "click",
            () => {

                if (!isRecording) {

                    startRecording();

                }

                else {

                    stopRecording();

                }

            }
        );

    }


    /* =========================
       AUDIO PLAYER
    ========================= */

    if (audioPlayButton) {

        audioPlayButton.addEventListener(
            "click",
            async () => {

                if (
                    !recordedAudio ||
                    !recordedAudio.src
                ) {

                    return;

                }

                try {

                    if (
                        recordedAudio.paused
                    ) {

                        await recordedAudio.play();

                    }

                    else {

                        recordedAudio.pause();

                    }

                }

                catch (error) {

                    console.error(
                        "Audio playback error:",
                        error
                    );

                    recordHelper.textContent =
                        "Rekaman tidak dapat diputar. Coba Rekam Ulang.";

                }

            }
        );

    }


    /* =========================
       AUDIO EVENTS
    ========================= */

    if (recordedAudio) {

        recordedAudio.addEventListener(
            "play",
            () => {

                audioPlayButton.textContent =
                    "Ⅱ";

                if (audioWavePreview) {

                    audioWavePreview.classList.add(
                        "playing"
                    );

                }

            }
        );


        recordedAudio.addEventListener(
            "pause",
            () => {

                audioPlayButton.textContent =
                    "▶";

                if (audioWavePreview) {

                    audioWavePreview.classList.remove(
                        "playing"
                    );

                }

            }
        );


        recordedAudio.addEventListener(
            "ended",
            () => {

                audioPlayButton.textContent =
                    "▶";

                if (audioWavePreview) {

                    audioWavePreview.classList.remove(
                        "playing"
                    );

                }

            }
        );


        recordedAudio.addEventListener(
            "timeupdate",
            () => {

                audioCurrentTime.textContent =
                    formatTime(
                        recordedAudio.currentTime
                    );

            }
        );


        recordedAudio.addEventListener(
            "loadedmetadata",
            () => {

                if (
                    Number.isFinite(
                        recordedAudio.duration
                    )
                ) {

                    const duration =
                        formatTime(
                            recordedAudio.duration
                        );

                    audioTotalTime.textContent =
                        duration;

                    previewDuration.textContent =
                        duration;

                }

            }
        );


        recordedAudio.addEventListener(
            "error",
            () => {

                console.error(
                    "HTML audio error:",
                    recordedAudio.error
                );

                recordHelper.textContent =
                    "Format rekaman tidak dapat diputar. Coba Rekam Ulang.";

            }
        );

    }


    /* =========================
       RECORD AGAIN
    ========================= */

    if (recordAgainButton) {

        recordAgainButton.addEventListener(
            "click",
            () => {

                if (recordedAudio) {

                    recordedAudio.pause();

                    recordedAudio.currentTime =
                        0;

                    recordedAudio.src =
                        "";

                    recordedAudio.load();

                }


                if (recordedAudioURL) {

                    URL.revokeObjectURL(
                        recordedAudioURL
                    );

                    recordedAudioURL =
                        null;

                }


                recordedBlob =
                    null;

                audioChunks =
                    [];


                recordingPreview.classList.remove(
                    "show"
                );


                recordButton.disabled =
                    false;

                recordButtonText.textContent =
                    "MULAI REKAM";


                recordStatus.textContent =
                    "Siap merekam";

                recordHelper.textContent =
                    "Tekan tombol di bawah untuk mulai merekam";


                recordTimer.textContent =
                    "00:00";

                audioCurrentTime.textContent =
                    "00:00";

                audioTotalTime.textContent =
                    "00:00";


                stepRecord.classList.add(
                    "active"
                );

                stepRecord.classList.remove(
                    "completed"
                );


                stepAnalyze.classList.remove(
                    "active",
                    "completed"
                );


                stepResult.classList.remove(
                    "active",
                    "completed"
                );

            }
        );

    }


    /* =========================
       AUDIO CONTEXT
    ========================= */

    function createAudioContext() {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            throw new Error(
                "Browser tidak mendukung AudioContext."
            );

        }


        return new AudioContext();

    }


    /* =========================
       AUDIO FEATURES
    ========================= */

    function extractAudioFeatures(
        audioBuffer
    ) {

        const data =
            audioBuffer.getChannelData(
                0
            );


        if (!data.length) {

            throw new Error(
                "Data audio kosong."
            );

        }


        let sumSquares =
            0;

        let crossings =
            0;

        let peak =
            0;


        for (
            let i = 0;
            i < data.length;
            i++
        ) {

            const sample =
                data[i];


            sumSquares +=
                sample * sample;


            peak =
                Math.max(
                    peak,
                    Math.abs(sample)
                );


            if (
                i > 0 &&
                (
                    (
                        data[i - 1] < 0 &&
                        sample >= 0
                    )
                    ||
                    (
                        data[i - 1] >= 0 &&
                        sample < 0
                    )
                )
            ) {

                crossings++;

            }

        }


        const rms =
            Math.sqrt(
                sumSquares /
                data.length
            );


        const zcr =
            crossings /
            data.length;


        return {

            rms: rms,

            zcr: zcr,

            peak: peak,

            duration:
                audioBuffer.duration

        };

    }


    /* =========================
       FEATURE KEYS
    ========================= */

    const FEATURE_KEYS = [

        "rms",

        "zcr",

        "peak",

        "duration"

    ];


    /* =========================
       FEATURE STATISTICS
    ========================= */

    function getFeatureStatistics(
        features
    ) {

        const statistics =
            {};


        FEATURE_KEYS.forEach(
            (key) => {

                const values =
                    features

                        .map(
                            item =>
                                Number(
                                    item[key]
                                )
                        )

                        .filter(
                            Number.isFinite
                        );


                statistics[key] = {

                    min:
                        Math.min(
                            ...values
                        ),

                    max:
                        Math.max(
                            ...values
                        )

                };

            }
        );


        return statistics;

    }


    /* =========================
       NORMALIZE FEATURES
    ========================= */

    function normalizeFeatures(
        features,
        statistics
    ) {

        return FEATURE_KEYS.map(
            (key) => {

                const value =
                    Number(
                        features[key]
                    );

                const min =
                    statistics[key].min;

                const max =
                    statistics[key].max;


                if (
                    !Number.isFinite(
                        value
                    )
                ) {

                    return 0;

                }


                if (
                    max === min
                ) {

                    return 0;

                }


                return (
                    value - min
                ) /
                (
                    max - min
                );

            }
        );

    }


    /* =========================
       DISTANCE
    ========================= */

    function calculateDistance(
        vectorA,
        vectorB
    ) {

        let total =
            0;


        for (
            let i = 0;
            i < vectorA.length;
            i++
        ) {

            const difference =
                vectorA[i] -
                vectorB[i];


            total +=
                difference *
                difference;

        }


        return Math.sqrt(
            total
        );

    }


    /* =========================
   HUGGING FACE REFERENCES
========================= */

async function fetchCoughReferences() {

    const BASE_URL =
        "https://datasets-server.huggingface.co/rows";

    const PAGE_SIZE = 100;
    const MAX_PAGES = 30;

    const references = [];
    const usedParticipants = new Set();

    console.log(
        "Mengambil audio cough dari Hugging Face..."
    );

    for (
        let page = 0;
        page < MAX_PAGES;
        page++
    ) {

        const offset =
            page * PAGE_SIZE;

        const url =
            BASE_URL +
            "?dataset=" +
            encodeURIComponent(HF_DATASET) +
            "&config=" +
            encodeURIComponent(HF_CONFIG) +
            "&split=" +
            encodeURIComponent(HF_SPLIT) +
            "&offset=" +
            offset +
            "&length=" +
            PAGE_SIZE;

        console.log(
            `Mengambil data halaman ${page + 1}:`,
            url
        );

        const response =
            await fetch(url);

        if (!response.ok) {

            throw new Error(
                "Hugging Face API error: " +
                response.status
            );

        }

        const data =
            await response.json();

        if (
            !Array.isArray(data.rows)
        ) {

            throw new Error(
                "Data rows tidak ditemukan."
            );

        }

        for (const item of data.rows) {

            const row =
                item.row;

            if (!row) {
                continue;
            }

            const type =
                String(
                    row.audio_type || ""
                ).toLowerCase();

            const isCough =
                type === "cough-heavy" ||
                type === "cough-shallow";

            const quality =
                Number(
                    row.quality_score
                );

            const hasAudio =
                Array.isArray(row.audio) &&
                row.audio[0] &&
                typeof row.audio[0].src === "string";

            const participant =
                row.participant_id;

            if (
                isCough &&
                quality >= 1 &&
                hasAudio &&
                !usedParticipants.has(participant)
            ) {

                references.push(item);

                usedParticipants.add(
                    participant
                );

            }

            if (
                references.length >=
                REFERENCE_COUNT
            ) {

                console.log(
                    "Referensi cough berhasil ditemukan:",
                    references.length
                );

                return references;
            }

        }

        if (
            data.rows.length <
            PAGE_SIZE
        ) {

            break;
        }

    }

    console.log(
        "Audio cough ditemukan:",
        references.length
    );

    if (
        references.length < 4
    ) {

        throw new Error(
            "Audio cough tidak cukup ditemukan dari dataset."
        );

    }

    return references;
}


    /* =========================
       DOWNLOAD REFERENCE AUDIO
    ========================= */

    async function downloadReferenceAudio(
        row
    ) {

        const url =
            row &&
            row.audio &&
            row.audio[0] &&
            row.audio[0].src;


        if (!url) {

            throw new Error(
                "URL audio referensi tidak tersedia."
            );

        }


        const response =
            await fetch(
                url
            );


        if (!response.ok) {

            throw new Error(
                "Gagal mengambil audio referensi: " +
                response.status
            );

        }


        return await response.arrayBuffer();

    }


    /* =========================
       BUILD REFERENCE MODEL
    ========================= */

    async function createReferenceModel() {

        const cached =
            localStorage.getItem(
                MODEL_CACHE_KEY
            );


        if (cached) {

            try {

                const model =
                    JSON.parse(
                        cached
                    );


                if (
                    Array.isArray(
                        model.features
                    )
                    &&
                    model.features.length >= 4
                ) {

                    console.log(
                        "Menggunakan model referensi dari cache."
                    );

                    return model;

                }

            }

            catch (error) {

                console.warn(
                    "Cache model rusak, membuat ulang.",
                    error
                );

            }

        }


        const rows =
            await fetchCoughReferences();


        const audioContext =
            createAudioContext();


        const features =
            [];


        try {

            for (
                let i = 0;
                i < rows.length;
                i++
            ) {

                try {

                    console.log(
                        `Memproses referensi ${i + 1}/${rows.length}`
                    );


                    const buffer =
                        await downloadReferenceAudio(
                            rows[i].row
                        );


                    const audioBuffer =
                        await audioContext.decodeAudioData(
                            buffer
                        );


                    const feature =
                        extractAudioFeatures(
                            audioBuffer
                        );


                    features.push({

                        ...feature,

                        audioType:
                            rows[i].row.audio_type,

                        participant:
                            rows[i].row.participant_id

                    });

                }

                catch (error) {

                    console.warn(
                        "Referensi dilewati:",
                        error
                    );

                }

            }

        }

        finally {

            await audioContext.close();

        }


        if (
            features.length < 4
        ) {

            throw new Error(
                "Audio referensi yang berhasil diproses terlalu sedikit."
            );

        }


        const statistics =
            getFeatureStatistics(
                features
            );


        const normalized =
            features.map(
                (item) => ({

                    ...item,

                    vector:
                        normalizeFeatures(
                            item,
                            statistics
                        )

                })
            );


        const model = {

            features:
                normalized,

            statistics:
                statistics,

            createdAt:
                Date.now()

        };


        localStorage.setItem(
            MODEL_CACHE_KEY,
            JSON.stringify(
                model
            )
        );


        console.log(
            "Model referensi berhasil dibuat:",
            model
        );


        return model;

    }


    /* =========================
       CALCULATE SCORE
    ========================= */

    async function calculateAudioScore(
        blob
    ) {

        if (!blob) {

            throw new Error(
                "Rekaman audio tidak tersedia."
            );

        }


        const arrayBuffer =
            await blob.arrayBuffer();


        const audioContext =
            createAudioContext();


        let userFeatures;


        try {

            const audioBuffer =
                await audioContext.decodeAudioData(
                    arrayBuffer
                );


            userFeatures =
                extractAudioFeatures(
                    audioBuffer
                );

        }

        finally {

            await audioContext.close();

        }


        console.log(
            "Karakteristik audio pengguna:",
            userFeatures
        );


        const model =
            await createReferenceModel();


        const userVector =
            normalizeFeatures(
                userFeatures,
                model.statistics
            );


        const distances =
            model.features

                .map(
                    (reference) => ({

                        distance:
                            calculateDistance(
                                userVector,
                                reference.vector
                            ),

                        audioType:
                            reference.audioType

                    })
                )

                .sort(
                    (a, b) =>
                        a.distance -
                        b.distance
                );


        const nearest =
            distances.slice(
                0,
                Math.min(
                    4,
                    distances.length
                )
            );


        const averageDistance =
            nearest.reduce(
                (
                    sum,
                    item
                ) =>
                    sum +
                    item.distance,
                0
            )
            /
            nearest.length;


        /* =========================
           REFERENCE DISTANCES
        ========================= */

        const referenceDistances =
            [];


        for (
            let i = 0;
            i < model.features.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < model.features.length;
                j++
            ) {

                referenceDistances.push(

                    calculateDistance(

                        model.features[i]
                            .vector,

                        model.features[j]
                            .vector

                    )

                );

            }

        }


        referenceDistances.sort(
            (a, b) =>
                a - b
        );


        const middle =
            Math.floor(
                referenceDistances.length /
                2
            );


        const median =
            referenceDistances.length % 2 === 0

                ? (
                    referenceDistances[
                        middle - 1
                    ]
                    +
                    referenceDistances[
                        middle
                    ]
                ) / 2

                : referenceDistances[
                    middle
                ];


        const scale =
            Math.max(
                median,
                0.05
            );


        /* =========================
           SIMILARITY SCORE
        ========================= */

        let score =
            100 *
            Math.exp(
                -averageDistance /
                scale
            );


        score =
            Math.round(
                Math.max(
                    0,
                    Math.min(
                        100,
                        score
                    )
                )
            );


        /* =========================
           CATEGORY
        ========================= */

        let category =
            1;

        let categoryLabel =
            "Masih cukup jauh";


        if (
            score >= 80
        ) {

            category =
                4;

            categoryLabel =
                "Semakin mendekati";

        }

        else if (
            score >= 60
        ) {

            category =
                3;

            categoryLabel =
                "Cukup mendekati";

        }

        else if (
            score >= 40
        ) {

            category =
                2;

            categoryLabel =
                "Mulai mendekati";

        }


        console.log(
            "Referensi terdekat:",
            nearest
        );


        console.log(
            "Similarity score:",
            score
        );


        console.log(
            "Kategori:",
            categoryLabel
        );


        return {

            score:
                score,

            category:
                category,

            categoryLabel:
                categoryLabel,

            duration:
                formatTime(
                    userFeatures.duration
                )

        };

    }


    /* =========================
       ANALYZE AUDIO BUTTON
    ========================= */

    if (analyzeAudioButton) {

        analyzeAudioButton.addEventListener(
            "click",
            async () => {

                if (!recordedBlob) {

                    return;

                }


                analyzeAudioButton.disabled =
                    true;


                analyzeAudioButton.innerHTML =
                    "<span>◌</span> Menganalisis...";


                recordHelper.textContent =
                    "Audio sedang dibandingkan dengan data referensi...";


                try {

                    const analysisResult =
                        await calculateAudioScore(
                            recordedBlob
                        );


                    const result = {

                        score:
                            analysisResult.score,

                        category:
                            analysisResult.category,

                        categoryLabel:
                            analysisResult.categoryLabel,

                        duration:
                            analysisResult.duration

                    };


                    localStorage.setItem(
                        "coughAnalyzerResult",
                        JSON.stringify(
                            result
                        )
                    );


                    stepAnalyze.classList.remove(
                        "active"
                    );

                    stepAnalyze.classList.add(
                        "completed"
                    );


                    stepResult.classList.add(
                        "active"
                    );


                    setTimeout(
                        () => {

                            window.location.href =
                                "hasil.html";

                        },
                        700
                    );

                }

                catch (error) {

                    console.error(
                        "Analisis audio gagal:",
                        error
                    );


                    analyzeAudioButton.disabled =
                        false;


                    analyzeAudioButton.innerHTML =
                        "<span>✦</span> Analisis Audio <span>→</span>";


                    recordHelper.textContent =
                        "Analisis gagal. Coba lagi atau buka Console (F12) untuk melihat detail error.";

                }

            }
        );

    }


    /* =========================
       MOBILE MENU
    ========================= */

    const mobileMenu =
        document.querySelector(
            ".mobile-menu"
        );


    const desktopMenu =
        document.querySelector(
            ".desktop-menu"
        );


    if (
        mobileMenu &&
        desktopMenu
    ) {

        mobileMenu.addEventListener(
            "click",
            () => {

                desktopMenu.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }

});