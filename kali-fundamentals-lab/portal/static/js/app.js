/* Kali Fundamentals Lab - front-end logic */
(function () {
  "use strict";

  var LAB = window.LAB || { solved: [], total: 0, flagsTotal: 0 };
  var solved = new Set(LAB.solved);
  var flagSlots = Array.prototype.slice.call(document.querySelectorAll("[data-flag-slot]"));
  var completionAnnounced = !!(LAB.total && LAB.solved.length >= LAB.total);
  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  /* ------------------------------------------------------------ helpers */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function toast(message, kind) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = "toast show " + (kind || "");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = "toast"; }, 2600);
  }

  function api(path, payload) {
    return fetch(path, {
      method: payload ? "POST" : "GET",
      headers: payload ? { "Content-Type": "application/json" } : {},
      body: payload ? JSON.stringify(payload) : undefined,
      credentials: "same-origin"
    }).then(function (res) {
      return res.text().then(function (body) {
        var data;
        try {
          data = body ? JSON.parse(body) : {};
        } catch (err) {
          data = {};
        }
        if (!res.ok) {
          throw new Error(data.error || "Request failed (" + res.status + ")");
        }
        return data;
      });
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(area);
      }
    });
  }

  /* ---------------------------------------------------------- progress */
  function renderProgress(progress) {
    if (!progress) return;

    var pct = progress.total ? Math.round((progress.solved / progress.total) * 100) : 0;
    var fill = $("#progressFill");
    var bar = $("#progressBar");
    var text = $("#progressText");
    if (fill) fill.style.width = pct + "%";
    if (bar) bar.setAttribute("aria-valuenow", String(progress.solved));
    if (text) text.textContent = progress.solved + " / " + progress.total;

    var pill = $("#solvedPill");
    if (pill) pill.textContent = progress.solved + "/" + progress.total;

    var flagsFound = $("#flagsFound");
    if (flagsFound) flagsFound.textContent = String(progress.flags_found);
    var machineFlags = $("#machineFlags");
    if (machineFlags) machineFlags.textContent = progress.flags_found + " / " + progress.flags_total;

    (progress.tasks || []).forEach(function (task) {
      var section = document.getElementById(task.id);
      if (section) section.classList.toggle("is-complete", task.complete);

      var status = $('[data-task-status="' + task.id + '"]');
      if (status) {
        status.innerHTML = task.complete
          ? '<span class="pill pill--done">Completed</span>'
          : task.solved + "/" + task.total;
      }

      var meta = $('[data-task-link="' + task.id + '"] .task-list__meta');
      if (meta) meta.textContent = task.solved + "/" + task.total + " answered";

      var link = $('[data-task-link="' + task.id + '"]');
      if (link) {
        var tick = link.querySelector(".tick");
        if (task.complete && !tick) {
          tick = document.createElement("span");
          tick.className = "tick";
          tick.setAttribute("aria-label", "Task complete");
          tick.textContent = "\u2713";
          link.appendChild(tick);
        } else if (!task.complete && tick) {
          tick.remove();
        }
      }
    });

    renderFlags(progress.captured_flags || []);

    if (progress.complete && !completionAnnounced) {
      completionAnnounced = true;
      toast("Room complete - all questions answered. Nice work!", "ok");
    }
  }

  function renderFlags(captured) {
    var found = captured || [];
    flagSlots.forEach(function (slot) {
      var key = slot.getAttribute("data-flag-slot");
      var isCaptured = found.indexOf(key) !== -1;
      slot.classList.toggle("is-captured", isCaptured);
      var state = slot.querySelector(".flag-slot__state");
      if (state) state.textContent = isCaptured ? "captured" : "not captured";
    });
  }

  function markQuestionSolved(id) {
    solved.add(id);
    var question = $('[data-question="' + id + '"]');
    if (!question) return;
    question.classList.add("is-solved");
    question.classList.remove("is-wrong");

    var input = $('[data-input="' + id + '"]');
    if (input) {
      if (!input.value) input.value = "correct";
      input.disabled = true;
    }
    var button = $('[data-submit="' + id + '"]');
    if (button) button.disabled = true;

    var feedback = $('[data-feedback="' + id + '"]');
    if (feedback) {
      feedback.className = "question__feedback ok";
      feedback.textContent = "\u2713 Correct answer";
    }
    var hintBox = $('[data-hint-box="' + id + '"]');
    if (hintBox) hintBox.hidden = true;
    var hintButton = $('[data-hint="' + id + '"]');
    if (hintButton) hintButton.hidden = true;
  }

  /* ------------------------------------------------------------ answers */
  function submitAnswer(id) {
    var input = $('[data-input="' + id + '"]');
    var button = $('[data-submit="' + id + '"]');
    var feedback = $('[data-feedback="' + id + '"]');
    var question = $('[data-question="' + id + '"]');
    if (!input || input.disabled) return;

    var value = input.value.trim();
    if (!value) {
      if (feedback) {
        feedback.className = "question__feedback bad";
        feedback.textContent = "Enter an answer first.";
      }
      input.focus();
      return;
    }

    if (button) button.disabled = true;
    if (feedback) {
      feedback.className = "question__feedback loading";
      feedback.textContent = "Checking...";
    }

    api("/api/answer", { question_id: id, answer: value })
      .then(function (data) {
        if (data.correct) {
          markQuestionSolved(id);
          renderProgress(data.progress);
          toast("Correct answer", "ok");
        } else {
          question.classList.remove("is-wrong");
          void question.offsetWidth;
          question.classList.add("is-wrong");
          if (feedback) {
            feedback.className = "question__feedback bad";
            feedback.textContent = data.message || "Incorrect answer. Try again.";
          }
          if (button) button.disabled = false;
          input.select();
        }
      })
      .catch(function (err) {
        if (feedback) {
          feedback.className = "question__feedback bad";
          feedback.textContent = err.message || "Something went wrong.";
        }
        if (button) button.disabled = false;
      });
  }

  /* ------------------------------------------------------------- hints */
  function setHintOpen(button, open) {
    var id = button.getAttribute("data-hint");
    var box = $('[data-hint-box="' + id + '"]');
    if (!box) return;
    box.hidden = !open;
    button.setAttribute("aria-expanded", open ? "true" : "false");
    var label = button.querySelector("[data-hint-label]");
    if (label) label.textContent = open ? "Hide hint" : "Show hint";
  }

  function toggleHint(button) {
    var id = button.getAttribute("data-hint");
    var box = $('[data-hint-box="' + id + '"]');
    var text = $('[data-hint-text="' + id + '"]');
    if (!box || !text) return;

    if (!box.hidden) {
      setHintOpen(button, false);
      return;
    }
    if (text.textContent) {
      setHintOpen(button, true);
      return;
    }

    button.disabled = true;
    api("/api/hint", { question_id: id })
      .then(function (data) {
        text.textContent = data.hint || "No hint for this question.";
        setHintOpen(button, true);
      })
      .catch(function () {
        toast("Could not load hint", "bad");
      })
      .then(function () { button.disabled = false; });
  }

  /* ------------------------------------------------------ instructions */
  // Instructions are always collapsed when the page loads: nothing is revealed
  // unless the user clicks "Show instructions" for that task.
  function setInstructionsOpen(taskId, open) {
    var panel = $('[data-instructions="' + taskId + '"]');
    if (!panel) return;
    panel.hidden = !open;

    $$('[data-instructions-toggle="' + taskId + '"]').forEach(function (button) {
      button.setAttribute("aria-expanded", open ? "true" : "false");
      var label = button.querySelector("[data-instructions-label]");
      if (label) label.textContent = open ? "Hide instructions" : "Show instructions";
    });
  }

  $$("[data-instructions-toggle]").forEach(function (button) {
    setInstructionsOpen(button.getAttribute("data-instructions-toggle"), false);
  });

  document.addEventListener("click", function (event) {
    var submit = event.target.closest("[data-submit]");
    if (submit) {
      submitAnswer(submit.getAttribute("data-submit"));
      return;
    }

    var instrToggle = event.target.closest("[data-instructions-toggle]");
    if (instrToggle) {
      var openTask = instrToggle.getAttribute("data-instructions-toggle");
      var panel = $('[data-instructions="' + openTask + '"]');
      if (panel) setInstructionsOpen(openTask, panel.hidden);
      return;
    }

    var instrClose = event.target.closest("[data-instructions-close]");
    if (instrClose) {
      setInstructionsOpen(instrClose.getAttribute("data-instructions-close"), false);
      return;
    }

    var hint = event.target.closest("[data-hint]");
    if (hint) {
      toggleHint(hint);
      return;
    }

    var copyBlock = event.target.closest("[data-copy-block]");
    if (copyBlock) {
      var block = copyBlock.closest(".codeblock");
      var code = block ? block.querySelector("pre code") : null;
      if (code) {
        copyText(code.textContent)
          .then(function () { toast("Copied to clipboard", "ok"); })
          .catch(function () { toast("Copy failed - select it manually", "bad"); });
      }
      return;
    }

    var copyBtn = event.target.closest("[data-copy]");
    if (copyBtn) {
      copyText(copyBtn.getAttribute("data-copy"))
        .then(function () { toast("Copied to clipboard", "ok"); })
        .catch(function () { toast("Copy failed - select it manually", "bad"); });
    }
  });

  document.addEventListener("input", function (event) {
    var input = event.target.closest("[data-input]");
    if (!input) return;
    var id = input.getAttribute("data-input");
    var question = $('[data-question="' + id + '"]');
    if (question) question.classList.remove("is-wrong");
    var feedback = $('[data-feedback="' + id + '"]');
    if (feedback && feedback.classList.contains("bad")) {
      feedback.className = "question__feedback";
      feedback.textContent = "";
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") return;
    var input = event.target.closest("[data-input]");
    if (input && !input.disabled) {
      event.preventDefault();
      submitAnswer(input.getAttribute("data-input"));
    }
  });

  /* ------------------------------------------------------------- accordion */
  $$(".task__head").forEach(function (head) {
    var body = document.getElementById(head.getAttribute("aria-controls"));
    var taskId = head.closest(".task").id;

    try {
      if (localStorage.getItem("kfl-collapsed-" + taskId) === "1") {
        head.setAttribute("aria-expanded", "false");
        if (body) body.classList.add("is-collapsed");
      }
    } catch (err) { /* storage disabled */ }

    head.addEventListener("click", function () {
      var expanded = head.getAttribute("aria-expanded") === "true";
      head.setAttribute("aria-expanded", expanded ? "false" : "true");
      if (body) body.classList.toggle("is-collapsed", expanded);
      try {
        localStorage.setItem("kfl-collapsed-" + taskId, expanded ? "1" : "0");
      } catch (err) { /* ignore */ }
    });
  });

  /* --------------------------------------------------------- task nav */
  var links = $$("[data-task-link]");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      links.forEach(function (other) { other.classList.remove("is-active"); });
      link.classList.add("is-active");
      var sidebar = $("#taskNav");
      if (sidebar && window.innerWidth <= 860) {
        sidebar.classList.remove("is-open");
        var toggle = $("#navToggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  if ("IntersectionObserver" in window && links.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        links.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("data-task-link") === id);
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });

    $$(".task").forEach(function (task) { observer.observe(task); });
  }

  var navToggle = $("#navToggle");
  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var sidebar = $("#taskNav");
      if (!sidebar) return;
      var open = sidebar.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* --------------------------------------------------- room level flag */
  var flagForm = $("#flagForm");
  if (flagForm) {
    flagForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("#flagInput");
      var feedback = $("#flagFeedback");
      var value = input ? input.value.trim() : "";
      if (!value) {
        if (feedback) {
          feedback.className = "submit-flag__feedback bad";
          feedback.textContent = "Enter a flag first.";
        }
        return;
      }

      if (feedback) {
        feedback.className = "submit-flag__feedback";
        feedback.textContent = "Checking against the target container...";
      }

      api("/api/submit-flag", { flag: value })
        .then(function (data) {
          if (data.correct) {
            if (feedback) {
              feedback.className = "submit-flag__feedback ok";
              feedback.textContent = "\u2713 " + data.message;
            }
            renderProgress(data.progress);
            toast(data.message, "ok");
            if (input) input.value = "";
            if (data.solved) {
              data.solved.forEach(function (id) {
                if (!solved.has(id)) markQuestionSolved(id);
              });
            }
            var section = $("#submit-flag");
            if (section) section.classList.add("is-correct");
          } else {
            if (feedback) {
              feedback.className = "submit-flag__feedback bad";
              feedback.textContent = data.message || "Incorrect flag.";
            }
            toast("Incorrect flag", "bad");
          }
        })
        .catch(function (err) {
          if (feedback) {
            feedback.className = "submit-flag__feedback bad";
            feedback.textContent = err.message || "Could not check the flag.";
          }
        });
    });
  }

  /* ------------------------------------------------------------ reset */
  function resetProgress() {
    if (!window.confirm("Reset all answers and flags on this portal? The target machine is not touched.")) return;
    api("/api/reset", {})
      .then(function (data) {
        window.location.reload();
        void data;
      })
      .catch(function () { toast("Reset failed", "bad"); });
  }

  var resetTop = $("#resetProgress");
  if (resetTop) resetTop.addEventListener("click", resetProgress);
  var resetBottom = $("#resetProgressBottom");
  if (resetBottom) resetBottom.addEventListener("click", resetProgress);

  /* ------------------------------------------------------- target panel */
  var targetStatus = $("#targetStatus");
  function paintStatus(target) {
    if (!targetStatus) return;
    if (target && target.ok) {
      targetStatus.className = "status-dot is-up";
      targetStatus.innerHTML = '<span></span>running';
    } else {
      targetStatus.className = "status-dot is-down";
      targetStatus.innerHTML = '<span></span>offline';
      targetStatus.title = (target && (target.error || target.status)) || "Target not reachable";
    }
  }

  api("/api/room")
    .then(function (data) {
      paintStatus(data.target);
      renderProgress(data.progress);
    })
    .catch(function () { paintStatus(null); });

  /* ------------------------------------------------------------- timer */
  var timerEl = $("#timer");
  var timerSeconds = 60 * 60;
  var terminated = false;
  var interval = null;

  function paintTimer() {
    if (!timerEl) return;
    if (terminated) {
      timerEl.textContent = "Terminated";
      timerEl.className = "timer is-terminated";
      return;
    }
    var minutes = Math.floor(timerSeconds / 60);
    var seconds = timerSeconds % 60;
    timerEl.textContent = String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
    timerEl.className = "timer" + (timerSeconds <= 300 ? " is-low" : "");
  }

  function startTimer() {
    clearInterval(interval);
    interval = setInterval(function () {
      if (terminated) return;
      timerSeconds = Math.max(0, timerSeconds - 1);
      paintTimer();
      if (timerSeconds === 0) {
        clearInterval(interval);
        toast("Time is up (UI only) - add an hour to keep going.", "bad");
      }
    }, 1000);
  }

  paintTimer();
  startTimer();

  var addHour = $("#addHour");
  if (addHour) {
    addHour.addEventListener("click", function () {
      terminated = false;
      timerSeconds += 3600;
      paintTimer();
      startTimer();
      var terminateBtn = $("#terminate");
      if (terminateBtn) terminateBtn.textContent = "Terminate";
      paintStatus({ ok: true });
      toast("1 hour added", "ok");
    });
  }

  var terminate = $("#terminate");
  if (terminate) {
    terminate.addEventListener("click", function () {
      if (terminated) {
        terminated = false;
        timerSeconds = 3600;
        paintTimer();
        startTimer();
        terminate.textContent = "Terminate";
        paintStatus({ ok: true });
        toast("Target redeployed at 10.10.10.5", "ok");
        return;
      }
      if (!window.confirm("Terminate the target machine? This is UI only and does not stop Docker.")) return;
      terminated = true;
      clearInterval(interval);
      paintTimer();
      terminate.textContent = "Redeploy";
      paintStatus({ ok: false, error: "terminated" });
      toast("Machine terminated (UI only)", "bad");
    });
  }

  /* ------------------------------------------------------------- misc */
  if (solved.size) {
    solved.forEach(function (id) { markQuestionSolved(id); });
  }
})();
