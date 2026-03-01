import { useState, useCallback, useEffect } from "react";

// ...keep ALL your existing code above (calcPoints, TEAMS, SEASONS, styles, etc.)

const STORAGE_KEY = "survivor-fantasy:v1";

function loadAppState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAppState(state) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota / blocked storage errors
  }
}

export default function App() {
  // Load once (lazy) so the first render uses persisted state
  const initial = loadAppState();

  const [page, setPage] = useState(initial?.page ?? "leaderboard");
  const [selectedSeason, setSelectedSeason] = useState(initial?.selectedSeason ?? 50);

  const [castawaysBySeason, setCastawaysBySeason] = useState(
    initial?.castawaysBySeason ?? {
      50: buildCastaways(50),
      46: buildCastaways(46),
      45: buildCastaways(45),
    }
  );

  const [nextElimBySeason, setNextElimBySeason] = useState(
    initial?.nextElimBySeason ?? { 50: 1, 46: 19, 45: 19 }
  );

  const [draftStateBySeason, setDraftStateBySeason] = useState(
    initial?.draftStateBySeason ?? {
      50: { randomOrder: null, draftPositions: {} },
      46: { randomOrder: null, draftPositions: {} },
      45: { randomOrder: null, draftPositions: {} },
    }
  );

  const [toast, setToast] = useState(null);
  const [showOdds, setShowOdds] = useState(initial?.showOdds ?? false);

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState(false);

  const [historySeason, setHistorySeason] = useState(null);

  // Persist everything together, every time something changes
  useEffect(() => {
    saveAppState({
      page,
      selectedSeason,
      castawaysBySeason,
      nextElimBySeason,
      draftStateBySeason,
      showOdds,
    });
  }, [page, selectedSeason, castawaysBySeason, nextElimBySeason, draftStateBySeason, showOdds]);

  const season = SEASONS.find((s) => s.id === selectedSeason);
  const castaways = castawaysBySeason[selectedSeason];
  const nextElimOrder = nextElimBySeason[selectedSeason];
  const draftState = draftStateBySeason[selectedSeason];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const setCastaways = useCallback(
    (updater) => {
      setCastawaysBySeason((prev) => ({
        ...prev,
        [selectedSeason]:
          typeof updater === "function" ? updater(prev[selectedSeason]) : updater,
      }));
    },
    [selectedSeason]
  );

  const setDraftState = useCallback(
    (updater) => {
      setDraftStateBySeason((prev) => ({
        ...prev,
        [selectedSeason]:
          typeof updater === "function" ? updater(prev[selectedSeason]) : updater,
      }));
    },
    [selectedSeason]
  );

  const resetSeason = () => {
    setCastawaysBySeason((prev) => ({
      ...prev,
      [selectedSeason]: buildCastaways(selectedSeason),
    }));
    setNextElimBySeason((prev) => ({
      ...prev,
      [selectedSeason]: selectedSeason !== 50 ? 19 : 1,
    }));
    setDraftStateBySeason((prev) => ({
      ...prev,
      [selectedSeason]: { randomOrder: null, draftPositions: {} },
    }));
    showToast(`Season ${selectedSeason} has been reset.`);
  };

  const buildDraftOrder = () => {
    const pos = draftState.draftPositions;
    if (Object.keys(pos).length < TEAMS.length) return TEAMS.map((t) => t.id);
    return [...TEAMS]
      .sort((a, b) => (pos[a.id] || 99) - (pos[b.id] || 99))
      .map((t) => t.id);
  };

  const undoLastDraftPick = () => {
    const picked = castaways.filter((c) => c.draftedBy !== null);
    if (picked.length === 0) {
      showToast("No picks to undo.");
      return;
    }

    const draftOrder = buildDraftOrder();
    const sequence = [];
    for (let round = 1; round <= season.picksPerTeam; round++) {
      const ro = round % 2 === 0 ? [...draftOrder].reverse() : draftOrder;
      ro.forEach((tid) => sequence.push({ teamId: tid, round }));
    }

    const pickedCount = picked.length;
    const lastPickTeamId =
      pickedCount > 0 ? sequence[pickedCount - 1]?.teamId : null;

    if (!lastPickTeamId) {
      showToast("Nothing to undo.");
      return;
    }

    const teamPicks = castaways.filter((c) => c.draftedBy === lastPickTeamId);
    const lastPick = teamPicks[teamPicks.length - 1];

    if (!lastPick) {
      showToast("Nothing to undo.");
      return;
    }

    setCastaways((prev) =>
      prev.map((c) => (c.id === lastPick.id ? { ...c, draftedBy: null } : c))
    );
    showToast(`Undid: ${lastPick.name} returned to draft pool.`);
  };

  const eliminate = (id) => {
    const c = castaways.find((c) => c.id === id);
    const pts = calcPoints(nextElimOrder, season.totalCastaways);
    setCastaways((prev) =>
      prev.map((cc) => (cc.id === id ? { ...cc, eliminationOrder: nextElimOrder } : cc))
    );
    setNextElimBySeason((prev) => ({
      ...prev,
      [selectedSeason]: prev[selectedSeason] + 1,
    }));
    showToast(`${c.name} eliminated (#${nextElimOrder}) — ${pts} pts`);
  };

  const restore = (id) => {
    const c = castaways.find((c) => c.id === id);
    const order = c.eliminationOrder;

    setCastaways((prev) =>
      prev.map((cc) => {
        if (cc.id === id) return { ...cc, eliminationOrder: null };
        if (cc.eliminationOrder !== null && cc.eliminationOrder > order)
          return { ...cc, eliminationOrder: cc.eliminationOrder - 1 };
        return cc;
      })
    );

    setNextElimBySeason((prev) => ({
      ...prev,
      [selectedSeason]: prev[selectedSeason] - 1,
    }));
    showToast(`${c.name} restored`);
  };

  const randomizeOrder = () => {
    const order = shuffleArray(TEAMS.map((t) => t.id));
    setDraftState({ randomOrder: order, draftPositions: {} });
    showToast(
      `Randomizer rolled! ${
        TEAMS.find((t) => t.id === order[0]).name
      } picks their draft position first.`
    );
  };

  const selectPosition = (teamId, position) => {
    const taken = Object.values(draftState.draftPositions).includes(position);
    if (taken) return;

    setDraftState((prev) => {
      const updated = {
        ...prev,
        draftPositions: { ...prev.draftPositions, [teamId]: position },
      };
      const allPicked = TEAMS.every((t) => updated.draftPositions[t.id] !== undefined);
      if (allPicked) showToast("All teams have chosen their draft positions! Draft order locked.");
      return updated;
    });

    const team = TEAMS.find((t) => t.id === teamId);
    showToast(`${team.name} takes pick position ${position}!`);
  };

  const scores = TEAMS.map((team) => {
    const picks = castaways.filter((c) => c.draftedBy === team.id);
    const total = picks.reduce(
      (sum, c) => sum + (c.eliminationOrder ? calcPoints(c.eliminationOrder, season.totalCastaways) : 0),
      0
    );
    return { ...team, picks, total };
  }).sort((a, b) => b.total - a.total);

  return (
    <>
      <style>{styles}</style>

      <div className="app">
        <header className="header">
          <div className="logo">
            SURVIVOR<span>FANTASY</span>
          </div>

          <nav className="nav">
            {["leaderboard", "castaways", "draft", "admin"].map((p) => (
              <button
                key={p}
                className={`nav-btn ${page === p ? "active" : ""}`}
                onClick={() => {
                  setPage(p);
                  setHistorySeason(null);
                }}
              >
                {p}
              </button>
            ))}
          </nav>

          <div className="header-commissioner">Commissioner</div>
        </header>

        <div className="container">
          <div className="season-bar">
            <span className="season-label">Season</span>

            {SEASONS.map((s) => (
              <button
                key={s.id}
                className={`season-btn ${selectedSeason === s.id && !historySeason ? "active" : ""}`}
                onClick={() => {
                  setSelectedSeason(s.id);
                  setHistorySeason(null);
                }}
              >
                {s.id}
                {s.current && <span className="live-pill">live</span>}
              </button>
            ))}

            <button className={`season-btn ${historySeason === 49 ? "active" : ""}`} onClick={() => { setHistorySeason(49); setPage("leaderboard"); }}>49</button>
            <button className={`season-btn ${historySeason === 48 ? "active" : ""}`} onClick={() => { setHistorySeason(48); setPage("leaderboard"); }}>48</button>
            <button className={`season-btn ${historySeason === 47 ? "active" : ""}`} onClick={() => { setHistorySeason(47); setPage("leaderboard"); }}>47</button>
            <button className={`season-btn ${historySeason === 46 ? "active" : ""}`} onClick={() => { setHistorySeason(46); setPage("leaderboard"); }}>46</button>
            <button className={`season-btn ${historySeason === 45 ? "active" : ""}`} onClick={() => { setHistorySeason(45); setPage("leaderboard"); }}>45</button>
            <button className={`season-btn ${historySeason === 44 ? "active" : ""}`} onClick={() => { setHistorySeason(44); setPage("leaderboard"); }}>44</button>
            <button className={`season-btn ${historySeason === 43 ? "active" : ""}`} onClick={() => { setHistorySeason(43); setPage("leaderboard"); }}>43</button>
          </div>

          {page === "leaderboard" && !historySeason && (
            <Leaderboard scores={scores} season={season} castaways={castaways} showOdds={showOdds} />
          )}
          {page === "leaderboard" && historySeason && (
            <SeasonHistory season={historySeason} onBack={() => setHistorySeason(null)} />
          )}
          {page === "castaways" && <Castaways castaways={castaways} season={season} showOdds={showOdds} />}

          {page === "draft" && (
            <Draft
              castaways={castaways}
              season={season}
              draftState={draftState}
              randomizeOrder={randomizeOrder}
              selectPosition={selectPosition}
              buildDraftOrder={buildDraftOrder}
              setCastaways={setCastaways}
              showToast={showToast}
              undoLastDraftPick={undoLastDraftPick}
              showOdds={showOdds}
              resetSeason={resetSeason}
            />
          )}

          {page === "admin" && !adminUnlocked && (
            <div
              style={{
                maxWidth: "340px",
                margin: "4rem auto",
                padding: "2rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 900, marginBottom: "0.4rem" }}>
                Commissioner Access
              </div>

              <div style={{ fontSize: "0.68rem", color: "#999", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                Enter password to continue
              </div>

              <input
                type="password"
                value={adminPassword}
                onChange={(e) => {
                  setAdminPassword(e.target.value);
                  setAdminError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (adminPassword === "Ottffsse9") {
                      setAdminUnlocked(true);
                      setAdminPassword("");
                      setAdminError(false);
                    } else {
                      setAdminError(true);
                      setAdminPassword("");
                    }
                  }
                }}
                placeholder="Password"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${adminError ? "#cc6060" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "3px",
                  padding: "0.6rem 0.75rem",
                  color: "#f0ebe0",
                  fontFamily: "'DM Mono',monospace",
                  fontSize: "16px",
                  marginBottom: "0.75rem",
                  outline: "none",
                }}
                autoFocus
              />

              {adminError && <div style={{ fontSize: "0.65rem", color: "#cc6060", marginBottom: "0.75rem" }}>Incorrect password</div>}

              <button
                className="action-btn primary"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => {
                  if (adminPassword === "Ottffsse9") {
                    setAdminUnlocked(true);
                    setAdminPassword("");
                    setAdminError(false);
                  } else {
                    setAdminError(true);
                    setAdminPassword("");
                  }
                }}
              >
                Unlock
              </button>

              <button
                className="action-btn"
                style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", marginBottom: 0 }}
                onClick={() => {
                  setPage("leaderboard");
                  setAdminPassword("");
                  setAdminError(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}

          {page === "admin" && adminUnlocked && (
            <Admin
              castaways={castaways}
              nextElimOrder={nextElimOrder}
              season={season}
              eliminate={eliminate}
              restore={restore}
              resetSeason={resetSeason}
              showOdds={showOdds}
              setShowOdds={setShowOdds}
            />
          )}
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
