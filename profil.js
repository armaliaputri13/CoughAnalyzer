document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "coughAnalyzerProfile";

    const form = document.getElementById("profileForm");
    const continueButton = document.getElementById("continueButton");

    const userName = document.getElementById("userName");
    const userAge = document.getElementById("userAge");

    const previewGenderIcon =
        document.getElementById("previewGenderIcon");

    const previewName =
        document.getElementById("previewName");

    const previewAge =
        document.getElementById("previewAge");

    const previewGender =
        document.getElementById("previewGender");

    const previewCough =
        document.getElementById("previewCough");

    const previewFrequency =
        document.getElementById("previewFrequency");

    const previewDuration =
        document.getElementById("previewDuration");


    function getRadioValue(name) {

        const checked = document.querySelector(
            `input[name="${name}"]:checked`
        );

        return checked ? checked.value : "";
    }


    /* =========================================
       GENDER AVATAR
    ========================================= */

    function setGenderPreview(gender) {

        if (!previewGenderIcon) {
            return;
        }


        /* =========================
           LAKI-LAKI
        ========================== */

        if (gender === "Laki-laki") {

            previewGenderIcon.innerHTML = `
                <svg
                    viewBox="0 0 96 96"
                    role="img"
                    aria-label="Ikon laki-laki"
                >

                    <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="rgba(76,190,255,.10)"
                    />

                    <circle
                        cx="48"
                        cy="34"
                        r="14"
                        fill="#f3c9a9"
                    />

                    <path
                        d="
                            M33 34
                            c1-13 8-20 16-20
                            11 0 17 8 16 20
                            -4-5-8-8-14-8
                            -6 0-12 3-18 8Z
                        "
                        fill="#263b58"
                    />

                    <path
                        d="
                            M27 77
                            c2-17 10-25 21-25
                            s19 8 21 25
                        "
                        fill="#248fda"
                    />

                    <circle
                        cx="43"
                        cy="35"
                        r="1.7"
                        fill="#18304a"
                    />

                    <circle
                        cx="53"
                        cy="35"
                        r="1.7"
                        fill="#18304a"
                    />

                    <path
                        d="
                            M44 42
                            c3 2 5 2 8 0
                        "
                        fill="none"
                        stroke="#b46f63"
                        stroke-width="2"
                        stroke-linecap="round"
                    />

                </svg>
            `;


        /* =========================
           PEREMPUAN
        ========================== */

        } else if (gender === "Perempuan") {

            previewGenderIcon.innerHTML = `
                <svg
                    viewBox="0 0 96 96"
                    role="img"
                    aria-label="Ikon perempuan"
                >

                    <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="rgba(255,100,126,.09)"
                    />

                    <path
                        d="
                            M31 37
                            c-1-14 6-24 17-24
                            12 0 19 10 17 24
                            v20H31Z
                        "
                        fill="#6e4b78"
                    />

                    <circle
                        cx="48"
                        cy="36"
                        r="14"
                        fill="#f3c9a9"
                    />

                    <path
                        d="
                            M34 33
                            c2-12 8-18 15-18
                            9 0 15 7 16 18
                            -4-5-8-8-15-8
                            -6 0-11 3-16 8Z
                        "
                        fill="#5b3d68"
                    />

                    <path
                        d="
                            M27 77
                            c2-17 10-25 21-25
                            s19 8 21 25
                        "
                        fill="#e85f7d"
                    />

                    <circle
                        cx="43"
                        cy="36"
                        r="1.7"
                        fill="#18304a"
                    />

                    <circle
                        cx="53"
                        cy="36"
                        r="1.7"
                        fill="#18304a"
                    />

                    <path
                        d="
                            M44 43
                            c3 2 5 2 8 0
                        "
                        fill="none"
                        stroke="#b46f63"
                        stroke-width="2"
                        stroke-linecap="round"
                    />

                </svg>
            `;


        /* =========================
           DEFAULT
        ========================== */

        } else {

            previewGenderIcon.innerHTML = `
                <svg
                    viewBox="0 0 96 96"
                    role="img"
                    aria-label="Avatar profil"
                >

                    <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="rgba(91,206,255,.08)"
                    />

                    <circle
                        cx="48"
                        cy="34"
                        r="13"
                        fill="rgba(225,237,248,.75)"
                    />

                    <path
                        d="
                            M25 78
                            c2-17 11-26 23-26
                            s21 9 23 26
                        "
                        fill="rgba(91,206,255,.68)"
                    />

                    <path
                        d="M40 39h16"
                        stroke="#6ed0ff"
                        stroke-width="2.5"
                        stroke-linecap="round"
                        opacity=".8"
                    />

                </svg>
            `;
        }
    }


    /* =========================================
       UPDATE PREVIEW
    ========================================= */

    function updatePreview() {

        const name =
            userName
                ? userName.value.trim()
                : "";

        const age =
            userAge
                ? userAge.value.trim()
                : "";

        const gender =
            getRadioValue("gender");

        const cough =
            getRadioValue("coughCondition");

        const frequency =
            document
                .getElementById("coughFrequency")
                ?.value || "";

        const duration =
            getRadioValue("coughDuration");


        setGenderPreview(gender);


        if (previewName) {

            previewName.textContent =
                name || "Nama pengguna";
        }


        if (previewAge) {

            previewAge.textContent =
                age
                    ? `${age} tahun`
                    : "—";
        }


        if (previewGender) {

            previewGender.textContent =
                gender || "—";
        }


        if (previewCough) {

            previewCough.textContent =
                cough || "—";
        }


        if (previewFrequency) {

            previewFrequency.textContent =
                frequency || "—";
        }


        if (previewDuration) {

            previewDuration.textContent =
                duration || "—";
        }
    }


    /* =========================================
       CLEAR ERRORS
    ========================================= */

    function clearErrors() {

        document
            .querySelectorAll(".field-error")
            .forEach((element) => {

                element.textContent = "";
            });


        document
            .querySelectorAll(
                ".input-error, .radio-group-error, .select-error"
            )
            .forEach((element) => {

                element.classList.remove(
                    "input-error",
                    "radio-group-error",
                    "select-error"
                );
            });
    }


    /* =========================================
       SHOW ERROR
    ========================================= */

    function showError(message) {

        let errorBox =
            document.getElementById(
                "profileFormError"
            );


        if (!errorBox) {

            errorBox =
                document.createElement("div");

            errorBox.id =
                "profileFormError";

            errorBox.setAttribute(
                "role",
                "alert"
            );

            errorBox.style.marginTop =
                "14px";

            errorBox.style.padding =
                "12px 14px";

            errorBox.style.borderRadius =
                "12px";

            errorBox.style.background =
                "rgba(255, 77, 109, 0.12)";

            errorBox.style.border =
                "1px solid rgba(255, 77, 109, 0.35)";

            errorBox.style.color =
                "#ff8fa3";


            if (
                continueButton &&
                continueButton.parentElement
            ) {

                continueButton.parentElement.appendChild(
                    errorBox
                );

            } else if (form) {

                form.appendChild(
                    errorBox
                );
            }
        }


        errorBox.textContent =
            message;
    }


    /* =========================================
       VALIDATE PROFILE
    ========================================= */

    function validateProfile() {

        clearErrors();


        const name =
            userName
                ? userName.value.trim()
                : "";

        const age =
            userAge
                ? userAge.value.trim()
                : "";

        const gender =
            getRadioValue("gender");

        const coughCondition =
            getRadioValue("coughCondition");

        const coughFrequency =
            document
                .getElementById("coughFrequency")
                ?.value || "";

        const coughDuration =
            getRadioValue("coughDuration");


        if (!name) {

            showError(
                "Nama wajib diisi terlebih dahulu."
            );

            userName?.focus();

            return null;
        }


        if (
            !age ||
            Number(age) < 1 ||
            Number(age) > 120
        ) {

            showError(
                "Usia wajib diisi dengan angka yang valid."
            );

            userAge?.focus();

            return null;
        }


        if (!gender) {

            showError(
                "Silakan pilih jenis kelamin."
            );

            return null;
        }


        if (!coughCondition) {

            showError(
                "Silakan pilih apakah sedang batuk."
            );

            return null;
        }


        if (!coughFrequency) {

            showError(
                "Silakan pilih seberapa sering batuk."
            );

            document
                .getElementById("coughFrequency")
                ?.focus();

            return null;
        }


        if (!coughDuration) {

            showError(
                "Silakan pilih sudah berapa lama batuk."
            );

            return null;
        }


        return {
            name,
            age,
            gender,
            coughCondition,
            coughFrequency,
            coughDuration
        };
    }


    /* =========================================
       RESTORE PROFILE
    ========================================= */

    function restoreProfile() {

        const saved =
            sessionStorage.getItem(
                STORAGE_KEY
            );


        if (!saved) {

            updatePreview();

            return;
        }


        try {

            const profile =
                JSON.parse(saved);


            if (userName) {

                userName.value =
                    profile.name || "";
            }


            if (userAge) {

                userAge.value =
                    profile.age || "";
            }


            document
                .querySelectorAll(
                    'input[name="gender"]'
                )
                .forEach((input) => {

                    input.checked =
                        input.value ===
                        profile.gender;
                });


            document
                .querySelectorAll(
                    'input[name="coughCondition"]'
                )
                .forEach((input) => {

                    input.checked =
                        input.value ===
                        profile.coughCondition;
                });


            const frequency =
                document.getElementById(
                    "coughFrequency"
                );


            if (frequency) {

                frequency.value =
                    profile.coughFrequency || "";
            }


            document
                .querySelectorAll(
                    'input[name="coughDuration"]'
                )
                .forEach((input) => {

                    input.checked =
                        input.value ===
                        profile.coughDuration;
                });


        } catch (error) {

            console.warn(
                "Profil sementara tidak dapat dipulihkan:",
                error
            );
        }


        updatePreview();
    }


    /* =========================================
       LIVE UPDATE
    ========================================= */

    document
        .querySelectorAll("input, select")
        .forEach((element) => {

            element.addEventListener(
                "input",
                updatePreview
            );

            element.addEventListener(
                "change",
                updatePreview
            );
        });


    /* =========================================
       FORM SUBMIT
    ========================================= */

    if (form) {

        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const profile =
                    validateProfile();


                if (!profile) {
                    return;
                }


                sessionStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(profile)
                );


                if (continueButton) {

                    continueButton.disabled =
                        true;

                    continueButton.classList.add(
                        "loading"
                    );

                    continueButton.innerHTML =
                        "Menyiapkan rekaman...";
                }


                setTimeout(() => {

                    window.location.href =
                        "rekam.html";

                }, 350);
            }
        );
    }


    restoreProfile();

});