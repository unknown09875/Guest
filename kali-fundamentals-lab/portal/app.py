"""Kali Fundamentals Lab - instruction portal (Flask)."""

from __future__ import annotations

import os
import re

import content
import flags
from flask import Flask, jsonify, render_template, request, session

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get("SECRET_KEY", "kali-fundamentals-lab-dev-key-change-me"),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    JSON_SORT_KEYS=False,
)


class TargetUnavailable(RuntimeError):
    """Raised when the flag file cannot be read from linux-target."""


# --------------------------------------------------------------------------
# helpers
# --------------------------------------------------------------------------
def as_text(value) -> str:
    """Coerce any JSON value to a safe string (never raise on odd payloads)."""
    if isinstance(value, str):
        return value
    if value is None:
        return ""
    return str(value)


def normalise_answer(raw: str) -> str:
    """Collapse whitespace and strip the things a copy/paste usually drags in."""
    text = (raw or "").replace("\r", " ").replace("\n", " ").replace("\t", " ")
    text = " ".join(text.split()).strip()
    text = text.strip("`")
    if text.lower().startswith("$ "):
        text = text[2:].strip()
    if text.lower().startswith("sudo "):
        text = text[5:].strip()
    return re.sub(r"\s*;\s*$", "", text)


def solved_set() -> set[str]:
    return set(session.get("solved", []))


def solved_flags() -> list[str]:
    return list(session.get("flags", []))


def progress_payload() -> dict:
    solved = solved_set()
    tasks = []
    for task in content.TASKS:
        ids = [q["id"] for q in task["questions"]]
        tasks.append(
            {
                "id": task["id"],
                "solved": len([q for q in ids if q in solved]),
                "total": len(ids),
                "complete": all(q in solved for q in ids),
            }
        )

    flag_keys = {slot["key"] for slot in content.FLAG_SLOTS}
    found_flags = solved_flags()
    return {
        "tasks": tasks,
        "solved": len([q for q in solved if q in content.QUESTION_INDEX]),
        "total": content.TOTAL_QUESTIONS,
        "flags_found": len([f for f in found_flags if f in flag_keys]),
        "flags_total": len(content.FLAG_SLOTS),
        "captured_flags": [f for f in found_flags if f in flag_keys],
        "complete": len([q for q in solved if q in content.QUESTION_INDEX]) == content.TOTAL_QUESTIONS,
    }


def public_room() -> dict:
    """Room JSON without hints or answers (those are fetched on demand)."""
    public_tasks = []
    for task in content.TASKS:
        questions = []
        for question in task["questions"]:
            questions.append(
                {
                    "id": question["id"],
                    "prompt": question["prompt"],
                    "placeholder": question.get("placeholder", ""),
                    "mono": bool(question.get("mono")),
                    "hint_available": bool(question.get("hint")),
                    "kind": "flag" if question.get("validator") == "flag" else "text",
                }
            )
        public_tasks.append(
            {
                "id": task["id"],
                "number": task["number"],
                "title": task["title"],
                "subtitle": task.get("subtitle", ""),
                "questions": questions,
            }
        )

    return {
        "name": content.ROOM["name"],
        "code": content.ROOM["code"],
        "difficulty": content.ROOM["difficulty"],
        "author": content.ROOM["author"],
        "description": content.ROOM["description"],
        "tags": content.ROOM["tags"],
        "access": content.ACCESS_CODE,
        "target_ip": content.TARGET_IP,
        "tasks": public_tasks,
        "total_questions": content.TOTAL_QUESTIONS,
        "duration_minutes": 60,
    }


def check_answer(question: dict, answer: str) -> tuple[bool, str | None]:
    """Return (correct, optional flag key that was captured)."""
    validator = question.get("validator")
    cleaned = normalise_answer(answer)

    if not cleaned:
        return False, None

    if validator == "command":
        for pattern in question.get("patterns", []):
            if re.match(pattern, cleaned):
                return True, None
        return False, None

    if validator == "target_ip":
        return cleaned == content.TARGET_IP, None

    if validator == "flag":
        key = question["flag"]
        slot = next((s for s in content.FLAG_SLOTS if s["key"] == key), None)
        if slot is None:
            return False, None
        try:
            expected = flags.get_flag(slot["path"])
        except Exception as exc:  # noqa: BLE001 - target not running
            raise TargetUnavailable(str(exc)) from exc
        if cleaned and cleaned == expected:
            return True, key
        return False, None

    return False, None


def mark_solved(question_id: str, flag_key: str | None = None, answer: str = "") -> None:
    solved = solved_set()
    solved.add(question_id)
    session["solved"] = sorted(solved)

    if flag_key:
        found = set(solved_flags())
        found.add(flag_key)
        session["flags"] = sorted(found)

    # Keep the submitted command so a reload can show it again. Flag values are
    # deliberately not stored, so they never end up in the page source.
    question = content.QUESTION_INDEX.get(question_id, {})
    answers = dict(session.get("answers", {}))
    if question.get("validator") == "flag":
        answers[question_id] = "correct flag submitted"
    elif answer:
        answers[question_id] = answer[:200]
    session["answers"] = answers
    session.modified = True


# --------------------------------------------------------------------------
# routes
# --------------------------------------------------------------------------
@app.get("/")
def index():
    return render_template(
        "index.html",
        room=content.ROOM,
        tasks=content.TASKS,
        access=content.ACCESS_CODE,
        target_ip=content.TARGET_IP,
        total_questions=content.TOTAL_QUESTIONS,
        flag_slots=content.FLAG_SLOTS,
        solved=solved_set(),
        answers=session.get("answers", {}),
        flags_found=len(solved_flags()),
        captured_flags=[slot["key"] for slot in content.FLAG_SLOTS if slot["key"] in solved_flags()],
        solved_count=len(solved_set()),
    )


@app.get("/api/room")
def api_room():
    return jsonify(
        {
            "room": public_room(),
            "progress": progress_payload(),
            "target": flags.docker_status(),
        }
    )


@app.get("/api/progress")
def api_progress():
    return jsonify({"progress": progress_payload(), "solved": sorted(solved_set())})


@app.post("/api/answer")
def api_answer():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        payload = {}
    question_id = as_text(payload.get("question_id"))
    answer = as_text(payload.get("answer"))

    question = content.QUESTION_INDEX.get(question_id)
    if question is None:
        return jsonify({"ok": False, "error": "unknown question"}), 404

    try:
        correct, flag_key = check_answer(question, answer)
    except TargetUnavailable:
        return jsonify(
            {
                "ok": True,
                "correct": False,
                "target_down": True,
                "message": "Cannot read the flag from linux-target. Is the container running?",
                "progress": progress_payload(),
            }
        )
    if not correct:
        return jsonify(
            {
                "ok": True,
                "correct": False,
                "message": "Incorrect answer. Try again.",
                "progress": progress_payload(),
            }
        )

    mark_solved(question_id, flag_key, normalise_answer(answer))
    return jsonify(
        {
            "ok": True,
            "correct": True,
            "message": "Correct answer",
            "progress": progress_payload(),
            "solved": sorted(solved_set()),
        }
    )


@app.post("/api/hint")
def api_hint():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        payload = {}
    question = content.QUESTION_INDEX.get(as_text(payload.get("question_id")))
    if question is None:
        return jsonify({"ok": False, "error": "unknown question"}), 404
    return jsonify({"ok": True, "hint": question.get("hint", "")})


@app.post("/api/submit-flag")
def api_submit_flag():
    """The room-level Submit Flag box - accepts any flag on the target."""
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        payload = {}
    submitted = normalise_answer(as_text(payload.get("flag")))

    if not submitted:
        return jsonify({"ok": True, "correct": False, "message": "Enter a flag first."})

    read_errors = []
    for slot in content.FLAG_SLOTS:
        try:
            expected = flags.get_flag(slot["path"])
        except Exception as exc:  # noqa: BLE001 - target not running
            read_errors.append(str(exc))
            continue

        if submitted == expected:
            question_id = slot["question"]
            mark_solved(question_id, slot["key"])
            return jsonify(
                {
                    "ok": True,
                    "correct": True,
                    "message": f"{slot['label']} accepted - nice work!",
                    "flag_label": slot["label"],
                    "progress": progress_payload(),
                    "solved": sorted(solved_set()),
                }
            )

    if len(read_errors) == len(content.FLAG_SLOTS):
        return jsonify(
            {
                "ok": True,
                "correct": False,
                "target_down": True,
                "message": "Cannot read the flags from linux-target. Is the container running?",
                "target": flags.docker_status(),
            }
        )

    return jsonify(
        {
            "ok": True,
            "correct": False,
            "message": "Incorrect flag. Flags look like FLAG{...}.",
            "progress": progress_payload(),
        }
    )


@app.post("/api/reset")
def api_reset():
    session.pop("solved", None)
    session.pop("flags", None)
    session.pop("answers", None)
    session.modified = True
    return jsonify({"ok": True, "progress": progress_payload()})


@app.get("/healthz")
def healthz():
    return jsonify({"ok": True, "target": flags.docker_status()})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")), debug=False)
