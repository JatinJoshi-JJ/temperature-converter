/* ============================================================
       FILE: script.js (Modular JavaScript Architecture)
       ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* 1. STATE MANAGEMENT */
  const state = {
    celsius: 24.0,
    theme:
      localStorage.getItem("tempera_theme") ||
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"),
    weather: {
      tempC: 28.0,
      condition: "Clear Sky",
      city: "Pune, Maharashtra, IN",
    },
    speechSupported:
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window,
  };

  /* 2. DOM ELEMENT CACHE */
  const el = {
    inputCelsius: document.getElementById("inputCelsius"),
    inputFahrenheit: document.getElementById("inputFahrenheit"),
    inputKelvin: document.getElementById("inputKelvin"),
    validationAlert: document.getElementById("validationAlert"),
    validationMsg: document.getElementById("validationMsg"),
    clearBtn: document.getElementById("clearBtn"),
    swapUnitsBtn: document.getElementById("swapUnitsBtn"),
    copyResultBtn: document.getElementById("copyResultBtn"),
    resetDefaultBtn: document.getElementById("resetDefaultBtn"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeIcon: document.getElementById("themeIcon"),
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    navMenu: document.getElementById("navMenu"),
    presetChips: document.querySelectorAll(".preset-chip"),
    copyFormulaBtns: document.querySelectorAll(".copy-formula-btn"),
    heroVisualCard: document.getElementById("heroVisualCard"),
    heroDialTemp: document.getElementById("heroDialTemp"),
    heroDialPill: document.getElementById("heroDialPill"),
    heroDialProgress: document.getElementById("heroDialProgress"),
    heroDialF: document.getElementById("heroDialF"),
    heroDialK: document.getElementById("heroDialK"),
    spectrumMarker: document.getElementById("spectrumMarker"),
    mouseFollower: document.getElementById("mouseFollower"),
    ambientDynamicOrb: document.getElementById("ambientDynamicOrb"),
    intelCategoryTitle: document.getElementById("intelCategoryTitle"),
    intelCategoryDesc: document.getElementById("intelCategoryDesc"),
    ruleConfidenceBadge: document.getElementById("ruleConfidenceBadge"),
    intelFitBar: document.getElementById("intelFitBar"),
    intelFitPercent: document.getElementById("intelFitPercent"),
    clothingTitle: document.getElementById("clothingTitle"),
    clothingDesc: document.getElementById("clothingDesc"),
    hydrationTitle: document.getElementById("hydrationTitle"),
    hydrationDesc: document.getElementById("hydrationDesc"),
    comfortTitle: document.getElementById("comfortTitle"),
    comfortDesc: document.getElementById("comfortDesc"),
    environmentTitle: document.getElementById("environmentTitle"),
    environmentDesc: document.getElementById("environmentDesc"),
    statRankine: document.getElementById("statRankine"),
    statDeltaK: document.getElementById("statDeltaK"),
    statSpeedSound: document.getElementById("statSpeedSound"),
    statWaterState: document.getElementById("statWaterState"),
    weatherLiveTemp: document.getElementById("weatherLiveTemp"),
    weatherCondition: document.getElementById("weatherCondition"),
    weatherCityName: document.getElementById("weatherCityName"),
    weatherComparisonBanner: document.getElementById("weatherComparisonBanner"),
    detectLocationBtn: document.getElementById("detectLocationBtn"),
    useWeatherAsInputBtn: document.getElementById("useWeatherAsInputBtn"),
    aiMessageContainer: document.getElementById("aiMessageContainer"),
    regenerateInsightBtn: document.getElementById("regenerateInsightBtn"),
    voiceMicBtn: document.getElementById("voiceMicBtn"),
    voiceFeedbackText: document.getElementById("voiceFeedbackText"),
    globalToast: document.getElementById("globalToast"),
  };

  const Converter = {
    celsiusToFahrenheit: (c) => (c * 9) / 5 + 32,
    fahrenheitToCelsius: (f) => ((f - 32) * 5) / 9,
    celsiusToKelvin: (c) => c + 273.15,
    kelvinToCelsius: (k) => k - 273.15,
    fahrenheitToKelvin: (f) => ((f - 32) * 5) / 9 + 273.15,
    kelvinToFahrenheit: (k) => ((k - 273.15) * 9) / 5 + 32,
    celsiusToRankine: (c) => ((c + 273.15) * 9) / 5,

    speedOfSoundInAir: (c) => {
      if (c < -273.15) return 0;
      return 331.3 * Math.sqrt(1 + c / 273.15);
    },

    format: (num, decimals = 2) => {
      if (num === null || isNaN(num)) return "";
      return Number(
        Math.round(Number(num + "e" + decimals)) + "e-" + decimals,
      ).toString();
    },
  };

  /* VALIDATION ENGINE (ABSOLUTE ZERO CHECK) */
  function validateTemperature(celsiusVal) {
    if (isNaN(celsiusVal)) {
      showError("Please enter a valid numeric value.");
      return false;
    }
    if (celsiusVal < -273.15) {
      showError(
        "Temperature cannot be below Absolute Zero (-273.15°C / 0 K / -459.67°F).",
      );
      return false;
    }
    hideError();
    return true;
  }

  function showError(msg) {
    el.validationMsg.textContent = msg;
    el.validationAlert.classList.add("active");
  }

  function hideError() {
    el.validationAlert.classList.remove("active");
  }

  function showToast(msg) {
    el.globalToast.textContent = msg;
    el.globalToast.classList.add("visible");
    setTimeout(() => {
      el.globalToast.classList.remove("visible");
    }, 2200);
  }

  function updateTemperatureMood(c) {
    const root = document.documentElement;

    if (c < 0) {
      root.style.setProperty("--temp-primary", "#38BDF8");
      root.style.setProperty("--temp-secondary", "#BAE6FD");
      root.style.setProperty("--temp-glow", "rgba(56, 189, 248, 0.35)");
      root.style.setProperty(
        "--temp-gradient",
        "linear-gradient(135deg, #1E3A8A 0%, #38BDF8 100%)",
      );
    } else if (c >= 0 && c < 16) {
      root.style.setProperty("--temp-primary", "#2563EB");
      root.style.setProperty("--temp-secondary", "#93C5FD");
      root.style.setProperty("--temp-glow", "rgba(37, 99, 235, 0.32)");
      root.style.setProperty(
        "--temp-gradient",
        "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)",
      );
    } else if (c >= 16 && c <= 26) {
      root.style.setProperty("--temp-primary", "#8B5CF6");
      root.style.setProperty("--temp-secondary", "#C4B5FD");
      root.style.setProperty("--temp-glow", "rgba(139, 92, 246, 0.30)");
      root.style.setProperty(
        "--temp-gradient",
        "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #F97316 100%)",
      );
    } else if (c > 26 && c <= 35) {
      root.style.setProperty("--temp-primary", "#F97316");
      root.style.setProperty("--temp-secondary", "#FED7AA");
      root.style.setProperty("--temp-glow", "rgba(249, 115, 22, 0.32)");
      root.style.setProperty(
        "--temp-gradient",
        "linear-gradient(135deg, #8B5CF6 0%, #F97316 100%)",
      );
    } else {
      root.style.setProperty("--temp-primary", "#EF4444");
      root.style.setProperty("--temp-secondary", "#FECACA");
      root.style.setProperty("--temp-glow", "rgba(239, 68, 68, 0.38)");
      root.style.setProperty(
        "--temp-gradient",
        "linear-gradient(135deg, #F97316 0%, #EF4444 100%)",
      );
    }
  }

  const IntelligenceEngine = {
    classify: (c) => {
      if (c < -10)
        return {
          category: "Deep Freeze",
          desc: "Extreme sub-zero environment. Prolonged exposure causes rapid frostbite and hypothermia.",
          clothing: {
            title: "Heavy Arctic Gear",
            desc: "Down parka, thermal balaclava, insulated gloves, and fleece boots.",
          },
          hydration: {
            title: "Warm Liquids",
            desc: "Warm broths or teas to maintain core metabolic energy.",
          },
          comfort: {
            title: "Critical Hazard",
            desc: "Severe thermal risk. Limit outdoor exposure to minutes.",
          },
          env: {
            title: "Sub-Zero Freeze",
            desc: "Liquid water freezes instantaneously on contact.",
          },
          confidence: 99,
        };
      if (c >= -10 && c < 5)
        return {
          category: "Cold",
          desc: "Winter temperatures requiring substantial insulation and barrier against wind chill.",
          clothing: {
            title: "Winter Overcoat",
            desc: "Wool coat, scarf, thermal undergarments, and gloves.",
          },
          hydration: {
            title: "Moderate Hydration",
            desc: "Body loses water via breathing dry winter air; maintain steady intake.",
          },
          comfort: {
            title: "Chilly Discomfort",
            desc: "Shivering response triggered without adequate apparel.",
          },
          env: {
            title: "Near-Frost State",
            desc: "Possible road icing and plant dormancy.",
          },
          confidence: 96,
        };
      if (c >= 5 && c < 18)
        return {
          category: "Cool",
          desc: "Brisk autumnal or spring climate. Crisp atmospheric air with mild cooling effect.",
          clothing: {
            title: "Layered Outwear",
            desc: "Cardigan, windbreaker, light jacket, or sweater.",
          },
          hydration: {
            title: "Standard Intake",
            desc: "Regular water intake; minimal sweat dissipation.",
          },
          comfort: {
            title: "Crisp & Energizing",
            desc: "Pleasantly cool for cardiovascular running and brisk walks.",
          },
          env: {
            title: "Temperate Zone",
            desc: "Comfortable outdoor conditions.",
          },
          confidence: 94,
        };
      if (c >= 18 && c <= 26)
        return {
          category: "Comfortable",
          desc: "Optimal room temperature and biological homeostasis. Minimal thermal regulation needed.",
          clothing: {
            title: "Light Casual Wear",
            desc: "T-shirt, lightweight trousers, linen, or summer dresses.",
          },
          hydration: {
            title: "Baseline Hydration",
            desc: "Standard 2 liters per day maintains total cellular balance.",
          },
          comfort: {
            title: "Perfect Equilibrium",
            desc: "Peak cognitive stamina and lowest metabolic stress.",
          },
          env: {
            title: "Ideal Microclimate",
            desc: "Optimal for indoor work, learning, and outdoor recreation.",
          },
          confidence: 97,
        };
      if (c > 26 && c <= 34)
        return {
          category: "Warm",
          desc: "Summer warmth. Perspiration begins active evaporative cooling on human skin.",
          clothing: {
            title: "Breathable Fabrics",
            desc: "Loose linen, moisture-wicking synthetic fabrics, and sunglasses.",
          },
          hydration: {
            title: "Elevated Intake",
            desc: "Increase fluid intake to 2.5–3 Liters/day to balance sweat loss.",
          },
          comfort: {
            title: "Mild Thermal Load",
            desc: "Noticeable heat; shade and adequate ventilation recommended.",
          },
          env: {
            title: "Active Heat Cycle",
            desc: "Elevated solar ultraviolet radiation during midday.",
          },
          confidence: 95,
        };
      if (c > 34 && c <= 42)
        return {
          category: "Hot",
          desc: "Intense heat wave conditions. Heat cramps and exhaustion become acute risks.",
          clothing: {
            title: "Protective Sunwear",
            desc: "Wide-brim hat, UV-protective garments, and sunscreen.",
          },
          hydration: {
            title: "Critical Electrolytes",
            desc: "Consume water enriched with sodium and potassium regularly.",
          },
          comfort: {
            title: "High Strain",
            desc: "Limit strenuous outdoor workouts during peak sunlight.",
          },
          env: {
            title: "Extreme Ambient Load",
            desc: "High ground ozone and intensified surface thermal retention.",
          },
          confidence: 98,
        };
      return {
        category: "Extreme Heat",
        desc: "Hazardous heat dome. Heatstroke is imminent without air conditioning and shelter.",
        clothing: {
          title: "Minimal/Indoor Wear",
          desc: "Stay indoors under active mechanical refrigeration.",
        },
        hydration: {
          title: "Urgent Fluid Intake",
          desc: "Continuous electrolyte replacement every 20 minutes.",
        },
        comfort: {
          title: "Severe Life Hazard",
          desc: "Core body temperature can spike dangerously.",
        },
        env: {
          title: "Dangerous Heat Index",
          desc: "Risk of infrastructure buckling and power grid surges.",
        },
        confidence: 99,
      };
    },
  };

  function updateAllDisplays(celsiusValue, source = null) {
    if (!validateTemperature(celsiusValue)) return;

    state.celsius = celsiusValue;
    const fahrenheitValue = Converter.celsiusToFahrenheit(celsiusValue);
    const kelvinValue = Converter.celsiusToKelvin(celsiusValue);
    const rankineValue = Converter.celsiusToRankine(celsiusValue);

    if (source !== "celsius") {
      el.inputCelsius.value = Converter.format(celsiusValue);
    }
    if (source !== "fahrenheit") {
      el.inputFahrenheit.value = Converter.format(fahrenheitValue);
    }
    if (source !== "kelvin") {
      el.inputKelvin.value = Converter.format(kelvinValue);
    }

    updateTemperatureMood(celsiusValue);

    el.heroDialTemp.textContent = Converter.format(celsiusValue, 1);
    el.heroDialF.textContent = `${Converter.format(fahrenheitValue, 1)}°F`;
    el.heroDialK.textContent = `${Converter.format(kelvinValue, 1)} K`;

    const dialPercent = Math.min(Math.max((celsiusValue + 30) / 90, 0), 1);
    const circumference = 2 * Math.PI * 120;
    el.heroDialProgress.style.strokeDashoffset =
      circumference - dialPercent * circumference;

    const intel = IntelligenceEngine.classify(celsiusValue);
    el.heroDialPill.textContent = intel.category.toUpperCase();
    el.intelCategoryTitle.textContent = intel.category;
    el.intelCategoryDesc.textContent = intel.desc;
    el.ruleConfidenceBadge.textContent = `Confidence: ${intel.confidence}%`;
    el.intelFitPercent.textContent = `${intel.confidence}%`;
    el.intelFitBar.style.width = `${intel.confidence}%`;

    el.clothingTitle.textContent = intel.clothing.title;
    el.clothingDesc.textContent = intel.clothing.desc;
    el.hydrationTitle.textContent = intel.hydration.title;
    el.hydrationDesc.textContent = intel.hydration.desc;
    el.comfortTitle.textContent = intel.comfort.title;
    el.comfortDesc.textContent = intel.comfort.desc;
    el.environmentTitle.textContent = intel.environment.title;
    el.environmentDesc.textContent = intel.environment.desc;

    const spectrumPercent =
      Math.min(Math.max((celsiusValue + 50) / 125, 0), 1) * 100;
    el.spectrumMarker.style.left = `${spectrumPercent}%`;

    el.statRankine.textContent = Converter.format(rankineValue);
    el.statDeltaK.textContent = Converter.format(kelvinValue);

    const soundSpeed = Converter.speedOfSoundInAir(celsiusValue);
    el.statSpeedSound.textContent =
      soundSpeed > 0 ? `${Converter.format(soundSpeed, 1)} m/s` : "N/A";

    if (celsiusValue <= 0) {
      el.statWaterState.textContent = "Solid (Ice)";
    } else if (celsiusValue >= 100) {
      el.statWaterState.textContent = "Gas (Steam)";
    } else {
      el.statWaterState.textContent = "Liquid Water";
    }

    updateWeatherComparison();
    triggerAITypingResponse(intel.category, celsiusValue);
  }

  el.inputCelsius.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      clearOutputsExcept("celsius");
      return;
    }
    updateAllDisplays(val, "celsius");
  });

  el.inputFahrenheit.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      clearOutputsExcept("fahrenheit");
      return;
    }
    const c = Converter.fahrenheitToCelsius(val);
    updateAllDisplays(c, "fahrenheit");
  });

  el.inputKelvin.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (isNaN(val)) {
      clearOutputsExcept("kelvin");
      return;
    }
    const c = Converter.kelvinToCelsius(val);
    updateAllDisplays(c, "kelvin");
  });

  function clearOutputsExcept(active) {
    if (active !== "celsius") el.inputCelsius.value = "";
    if (active !== "fahrenheit") el.inputFahrenheit.value = "";
    if (active !== "kelvin") el.inputKelvin.value = "";
    hideError();
  }

  el.clearBtn.addEventListener("click", () => {
    el.inputCelsius.value = "";
    el.inputFahrenheit.value = "";
    el.inputKelvin.value = "";
    hideError();
    showToast("All fields cleared");
  });

  el.resetDefaultBtn.addEventListener("click", () => {
    updateAllDisplays(24.0);
    showToast("Reset to baseline (24°C)");
  });

  el.swapUnitsBtn.addEventListener("click", () => {
    const currentC = state.celsius;
    const currentF = Converter.celsiusToFahrenheit(currentC);
    updateAllDisplays(currentF);
    showToast("Swapped C & F values");
  });

  el.copyResultBtn.addEventListener("click", () => {
    const text = `TEMPERA Reading: ${Converter.format(state.celsius)}°C | ${Converter.format(Converter.celsiusToFahrenheit(state.celsius))}°F | ${Converter.format(Converter.celsiusToKelvin(state.celsius))} K`;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => showToast("Conversion copied ✓"));
    }
  });

  el.presetChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const c = parseFloat(chip.dataset.celsius);
      updateAllDisplays(c);
      showToast(`Loaded: ${chip.textContent}`);
    });
  });

  el.copyFormulaBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const formula = btn.dataset.formula;
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(formula)
          .then(() => showToast("Formula copied ✓"));
      }
    });
  });

  async function fetchLocalWeather(
    lat = 18.52,
    lon = 73.85,
    city = "Pune, Maharashtra, IN",
  ) {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      );
      if (!res.ok) throw new Error("Network error");
      const data = await res.json();
      if (data && data.current_weather) {
        state.weather.tempC = Math.round(data.current_weather.temperature);
        state.weather.city = city;

        const code = data.current_weather.weathercode;
        state.weather.condition =
          code <= 3
            ? "Clear to Partly Cloudy"
            : code <= 67
              ? "Rain / Drizzle"
              : "Overcast";

        el.weatherLiveTemp.textContent = `${state.weather.tempC}°C`;
        el.weatherCondition.textContent = state.weather.condition;
        el.weatherCityName.textContent = state.weather.city;
        updateWeatherComparison();
      }
    } catch (e) {
      console.warn("Weather fallback active:", e);
      updateWeatherComparison();
    }
  }

  function updateWeatherComparison() {
    const diff = Math.round(state.celsius - state.weather.tempC);
    let note = "";
    if (diff === 0) {
      note = `Your active converter temperature matches your local weather in ${state.weather.city} (${state.weather.tempC}°C).`;
    } else if (diff > 0) {
      note = `Your active converter temperature (${state.celsius}°C) is <strong>${diff}°C warmer</strong> than your local weather (${state.weather.tempC}°C).`;
    } else {
      note = `Your active converter temperature (${state.celsius}°C) is <strong>${Math.abs(diff)}°C cooler</strong> than your local weather (${state.weather.tempC}°C).`;
    }
    el.weatherComparisonBanner.innerHTML = note;
  }

  el.detectLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported");
      return;
    }
    el.detectLocationBtn.textContent = "Syncing...";
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        await fetchLocalWeather(
          lat,
          lon,
          `${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E`,
        );
        el.detectLocationBtn.textContent = "📍 Synced Live";
        showToast("Local coordinates synchronized");
      },
      () => {
        el.detectLocationBtn.textContent = "📍 Location Denied (Default: Pune)";
        showToast("Using Pune baseline weather");
      },
    );
  });

  el.useWeatherAsInputBtn.addEventListener("click", () => {
    updateAllDisplays(state.weather.tempC);
    showToast(`Loaded ${state.weather.tempC}°C from weather`);
  });

  let typingTimeout = null;
  function triggerAITypingResponse(category, temp) {
    if (typingTimeout) clearTimeout(typingTimeout);

    const responses = {
      "Deep Freeze": `${temp}°C represents extreme sub-zero conditions. Ensure heavy cold insulation and limit direct exposure to avoid frostbite.`,
      Cold: `At ${temp}°C, conditions are cold. Thermal layers and warm jackets are recommended to avoid hypothermia.`,
      Cool: `At ${temp}°C, the ambient atmosphere is brisk and crisp. Great for exercise and outdoor walking with light outerwear.`,
      Comfortable: `${temp}°C is directly inside the human comfort zone. Ideal for high cognitive focus, light clothing, and indoor productivity.`,
      Warm: `At ${temp}°C, mild heat is present. Maintain steady hydration and wear breathable cotton or linen fabrics.`,
      Hot: `${temp}°C is very hot. Stay properly hydrated with electrolytes and avoid high sun intensity during midday hours.`,
      "Extreme Heat": `Warning: ${temp}°C is dangerously hot. Seek air-conditioned shelter immediately and drink plenty of water.`,
    };

    const targetText =
      responses[category] || `Temperature analyzed at ${temp}°C.`;
    el.aiMessageContainer.textContent = "";
    let index = 0;

    function typeNext() {
      if (index < targetText.length) {
        el.aiMessageContainer.textContent += targetText.charAt(index);
        index++;
        typingTimeout = setTimeout(typeNext, 22);
      }
    }
    typeNext();
  }

  el.regenerateInsightBtn.addEventListener("click", () => {
    const intel = IntelligenceEngine.classify(state.celsius);
    triggerAITypingResponse(intel.category, state.celsius);
    showToast("Insight refreshed");
  });

  function initializeVoice() {
    if (!state.speechSupported) {
      el.voiceFeedbackText.textContent =
        "Voice recognition is not supported in this browser (Try Google Chrome or Microsoft Edge).";
      el.voiceMicBtn.style.opacity = "0.5";
      return;
    }

    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.lang = "en-US";

    function speak(text) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
      }
    }

    el.voiceMicBtn.addEventListener("click", () => {
      try {
        recognition.start();
        el.voiceMicBtn.classList.add("listening");
        el.voiceFeedbackText.textContent = "Listening... Speak now.";
      } catch (e) {
        recognition.stop();
      }
    });

    recognition.onresult = (event) => {
      const raw = event.results[0][0].transcript.toLowerCase().trim();
      el.voiceFeedbackText.textContent = `Recognized: "${raw}"`;

      if (raw.includes("dark mode")) {
        applyTheme("dark");
        speak("Switched to dark mode");
      } else if (raw.includes("light mode")) {
        applyTheme("light");
        speak("Switched to light mode");
      } else if (raw.includes("clear")) {
        el.clearBtn.click();
        speak("Converter cleared");
      } else if (raw.includes("reset")) {
        el.resetDefaultBtn.click();
        speak("Reset to default temperature");
      } else {
        const match = raw.match(
          /(-?\d+(\.\d+)?)\s*(celsius|centigrade|fahrenheit|kelvin)/,
        );
        if (match) {
          const num = parseFloat(match[1]);
          const unit = match[3];

          if (unit.includes("celsius") || unit.includes("centigrade")) {
            updateAllDisplays(num);
            speak(
              `${num} degrees Celsius is ${Converter.format(Converter.celsiusToFahrenheit(num), 1)} Fahrenheit`,
            );
          } else if (unit.includes("fahrenheit")) {
            const c = Converter.fahrenheitToCelsius(num);
            updateAllDisplays(c);
            speak(
              `${num} degrees Fahrenheit is ${Converter.format(c, 1)} Celsius`,
            );
          } else if (unit.includes("kelvin")) {
            const c = Converter.kelvinToCelsius(num);
            updateAllDisplays(c);
            speak(`${num} Kelvin is ${Converter.format(c, 1)} Celsius`);
          }
        } else {
          speak("Command recognized but no conversion parameters detected.");
        }
      }
    };

    recognition.onend = () => {
      el.voiceMicBtn.classList.remove("listening");
    };

    recognition.onerror = () => {
      el.voiceMicBtn.classList.remove("listening");
      el.voiceFeedbackText.textContent =
        "Voice error. Please try speaking again.";
    };
  }

  let themeTransitionTimeout = null;

  function applyTheme(t, isAnimated = true) {
    state.theme = t;
    localStorage.setItem("tempera_theme", t);

    if (isAnimated) {
      document.documentElement.classList.add("theme-transitioning");
      if (themeTransitionTimeout) clearTimeout(themeTransitionTimeout);

      if (el.themeIcon) {
        el.themeIcon.classList.add("theme-icon-spin");
        setTimeout(() => {
          el.themeIcon.textContent = t === "dark" ? "☀️" : "🌙";
          el.themeIcon.classList.remove("theme-icon-spin");
        }, 180);
      }

      document.documentElement.setAttribute("data-theme", t);

      themeTransitionTimeout = setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 450);
    } else {
      document.documentElement.setAttribute("data-theme", t);
      if (el.themeIcon) {
        el.themeIcon.textContent = t === "dark" ? "☀️" : "🌙";
      }
    }
  }

  el.themeToggleBtn.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark", true);
  });

  /* 3D TILT & Z-AXIS MODEL PHYSICS FOR 24°C COMFORTABLE CARD */
  const heroCard =
    el.heroVisualCard || document.querySelector(".hero-visual-card");
  if (heroCard) {
    let glareEl = heroCard.querySelector(".hero-card-glare");
    if (!glareEl) {
      glareEl = document.createElement("div");
      glareEl.className = "hero-card-glare";
      heroCard.appendChild(glareEl);
    }

    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetZ = 0;
    let currentZ = 0;
    let isHovered = false;
    let rafId = null;
    let cardRect = null;

    function render3DCard() {
      const ease = 0.12;
      currentRotX += (targetRotX - currentRotX) * ease;
      currentRotY += (targetRotY - currentRotY) * ease;
      currentZ += (targetZ - currentZ) * ease;

      heroCard.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(${currentZ.toFixed(2)}px)`;

      // Dynamic reactive elevation shadow
      const shadowX = (-currentRotY * 1.4).toFixed(1);
      const shadowY = (currentRotX * 1.4 + 16 + currentZ * 0.4).toFixed(1);
      const shadowBlur = (26 + currentZ * 0.7).toFixed(1);
      heroCard.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.35), 0 0 ${20 + currentZ * 0.5}px var(--temp-glow)`;

      const shouldContinue =
        isHovered ||
        Math.abs(targetRotX - currentRotX) > 0.05 ||
        Math.abs(targetRotY - currentRotY) > 0.05 ||
        Math.abs(targetZ - currentZ) > 0.05;

      if (shouldContinue) {
        rafId = requestAnimationFrame(render3DCard);
      } else {
        heroCard.style.transform = "";
        heroCard.style.boxShadow = "";
        rafId = null;
      }
    }

    heroCard.addEventListener("mouseenter", () => {
      isHovered = true;
      targetZ = 28; // Pop forward on Z axis
      cardRect = heroCard.getBoundingClientRect();
      heroCard.classList.add("is-hovered");
      if (glareEl) glareEl.style.opacity = "1";
      if (!rafId) {
        rafId = requestAnimationFrame(render3DCard);
      }
    });

    heroCard.addEventListener("mousemove", (e) => {
      if (!cardRect) cardRect = heroCard.getBoundingClientRect();
      const x = e.clientX - cardRect.left;
      const y = e.clientY - cardRect.top;
      const centerX = cardRect.width / 2;
      const centerY = cardRect.height / 2;

      // Realistic 3D tilt angles
      const maxTilt = 18;
      targetRotX = -((y - centerY) / centerY) * maxTilt;
      targetRotY = ((x - centerX) / centerX) * maxTilt;

      // Update surface glare reflection point
      const glareXPct = (x / cardRect.width) * 100;
      const glareYPct = (y / cardRect.height) * 100;
      heroCard.style.setProperty("--glare-x", `${glareXPct.toFixed(1)}%`);
      heroCard.style.setProperty("--glare-y", `${glareYPct.toFixed(1)}%`);

      if (!rafId) {
        rafId = requestAnimationFrame(render3DCard);
      }
    });

    heroCard.addEventListener("mouseleave", () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      targetZ = 0;
      cardRect = null;
      heroCard.classList.remove("is-hovered");
      if (glareEl) glareEl.style.opacity = "0";
      if (!rafId) {
        rafId = requestAnimationFrame(render3DCard);
      }
    });
  }

  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      el.mouseFollower.style.left = `${e.clientX}px`;
      el.mouseFollower.style.top = `${e.clientY}px`;
    });
  }

  el.mobileMenuBtn.addEventListener("click", () => {
    const isActive = el.navMenu.classList.toggle("active");
    el.mobileMenuBtn.classList.toggle("active");
    el.mobileMenuBtn.setAttribute("aria-expanded", isActive);
  });

  document.querySelectorAll(".nav-item-link").forEach((link) => {
    link.addEventListener("click", () => {
      el.navMenu.classList.remove("active");
      el.mobileMenuBtn.classList.remove("active");
      el.mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });

  applyTheme(state.theme, false);
  updateAllDisplays(state.celsius);
  fetchLocalWeather();
  initializeVoice();
});
