            src={c.photoUrl}
            alt={`${c.name} profile`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={e => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.style.display = "flex";
            }}
          />
        )}
        <div className={`c-photo-fallback ${c.photoUrl ? "with-photo" : ""}`}>{initials(c.name)}</div>
      </div>
      <div className="c-info">
        <div className="c-name">{c.name}</div>
        {c.age && <div className="c-age">Age {c.age}{c.hometown ? ` · ${c.hometown}` : ""}</div>}
        {c.occupation && <div className="c-occ">{c.occupation}</div>}
        <div className="c-row">
          <span style={{ fontSize: "0.65rem", color: c.tribe === "Toka" ? "#e8c45b" : c.tribe === "Savu" ? "#c49be8" : "#aaa" }}>{c.tribe}</span>
          <span className={`c-tag ${c.eliminationOrder ? "eliminated" : "alive"}`}>{c.eliminationOrder ? "Out · Week 1" : "In the game"}</span>
        </div>
        {c.eliminationOrder && <div className="hint" style={{ marginTop: "0.4rem" }}>21st place · 0 fantasy points</div>}
      </div>
    </div>
  );
}

// ─── Week 1 ───────────────────────────────────────────────────────────────────
function WeekOne({ compact = false }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      {!compact && <>
        <div className="page-title">Week 1</div>
        <div className="page-subtitle">Permanent Uncertainty · September 23, 2026</div>
      </>}
      <div className="section-title">Week 1 Results</div>
      <div className="panel">
        <div style={{ fontSize: "1rem", marginBottom: "0.6rem" }}>Aaliyah Puglia was voted out first.</div>
        <p className="hint">21st place · Toka · 0 fantasy points under your league rules.</p>
        <ul className="hint" style={{ paddingLeft: "1.2rem", marginTop: "0.8rem", lineHeight: 1.9 }}>
          <li>Savu won the first immunity challenge.</li>
          <li>Rob found a hidden immunity idol.</li>
          <li>Lewis spent the premiere on Exile Island and remains in the game.</li>
          <li>Aaliyah and Jenna played unsuccessful Shots in the Dark.</li>
        </ul>
        <a className="hint" style={{ color: "#6a9fd8", display: "inline-block", marginTop: "0.8rem" }} href="https://www.paramountplus.com/sneak-peak/survivor-season-51-episode-1-recap/" target="_blank" rel="noopener noreferrer">Official Week 1 recap ↗</a>
      </div>
    </div>
  );
}

// ─── History page ─────────────────────────────────────────────────────────────
function History({ historySeason, setHistorySeason }) {
  const data = HISTORICAL[historySeason];
  const champs = getChampionshipsThrough(historySeason);
  const sorted = data ? [...data.teamScores].sort((a,b) => (b.score||0)-(a.score||0)) : [];

  return (
    <div>
      <div className="page-title">History</div>
      <div className="page-subtitle">Past season results</div>
      <div className="season-bar">
        <span className="season-label">Season</span>
        {[50,49,48,47,46,45,44,43].map(id => (
          <button key={id} className={`season-btn ${historySeason === id ? "active" : ""}`} onClick={() => setHistorySeason(id)}>{id}</button>
        ))}
      </div>

      {data ? (
        <>
          <div className="section-title">Season {historySeason} — Team Scores</div>
          <div className="hist-grid">
            {sorted.map((t, i) => (
              <div key={t.name} className={`hist-card ${t.winner ? "champ" : ""}`}>
                <div style={{ fontSize: "0.62rem", color: t.winner ? "#5aaa72" : "#777", marginBottom: "0.25rem" }}>
                  {t.winner ? "🏆 Champion" : ordinal(i+1) + " Place"}
                </div>
                <div className="hist-score" style={{ color: t.na ? "#444" : t.color }}>{t.na ? "—" : t.score}{!t.na && <span style={{ fontSize: "0.7rem", color: "#777", marginLeft: "0.35rem" }}>pts</span>}</div>
                <div style={{ fontSize: "0.82rem", color: t.color, marginTop: "0.25rem", fontWeight: 500 }}>{t.name}</div>
                <div style={{ fontSize: "0.62rem", color: "#777" }}>{t.members}</div>
                {(champs[t.name]||0) > 0 && <div style={{ fontSize: "0.6rem", color: "#5aaa72", marginTop: "0.3rem", letterSpacing: "0.08em" }}>{"★".repeat(champs[t.name])}</div>}
                {t.na && <div style={{ fontSize: "0.6rem", color: "#555", marginTop: "0.25rem" }}>Did not participate</div>}
              </div>
            ))}
          </div>

          <div className="section-title">Placement Results — Season {historySeason}</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 4, overflow: "hidden" }}>
            <table className="hist-table">
              <thead><tr><th>Finish</th><th>Castaway</th><th>Team</th><th style={{ textAlign:"right" }}>Pts</th></tr></thead>
              <tbody>
                {[...data.placements].sort((a,b) => b.place - a.place).map(p => {
                  const total = SEASONS.find(s => s.id === historySeason)?.totalCastaways || 18;
                  const finishPos = total - p.place + 1;
                  return (
                    <tr key={p.place}>
                      <td style={{ color:"#f0ebe0", fontFamily:"'Playfair Display',serif", fontWeight:900 }}>{ordinal(finishPos)}</td>
                      <td style={{ color:"#f0ebe0" }}>{p.player}</td>
                      <td style={{ color: p.team==="NA" ? "#555" : p.teamColor }}>{p.team==="NA" ? "—" : p.team}</td>
                      <td style={{ color:"#5aaa72", textAlign:"right", fontFamily:"'Playfair Display',serif", fontWeight:900 }}>{p.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="hint">No data for this season.</div>
      )}
    </div>
  );
}
