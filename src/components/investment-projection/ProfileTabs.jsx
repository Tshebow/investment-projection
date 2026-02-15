import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PROFILE_TEMPLATES } from "./constants.js";
import { createProfile, deleteProfile, switchProfile, renameProfile } from "./investmentSlice.js";
import { colors, fonts } from "./theme.js";

export default function ProfileTabs() {
  const dispatch = useDispatch();
  const { activeProfileId, profileOrder, profiles } = useSelector(s => s.investment);
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const pickerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!showPicker) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) setShowPicker(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showPicker]);

  useEffect(() => {
    if (editingId && inputRef.current) inputRef.current.focus();
  }, [editingId]);

  const startRename = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const commitRename = () => {
    if (editingId && editName.trim()) {
      dispatch(renameProfile({ id: editingId, name: editName.trim() }));
    }
    setEditingId(null);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 20, flexWrap: "wrap" }}>
      {profileOrder.map(id => {
        const profile = profiles[id];
        const isActive = id === activeProfileId;

        return (
          <div
            key={id}
            onClick={() => dispatch(switchProfile(id))}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 14px",
              background: isActive ? colors.accent.tealBg : "transparent",
              border: `1px solid ${isActive ? colors.accent.tealBorder : colors.border.subtle}`,
              borderRadius: 10,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {editingId === id ? (
              <input
                ref={inputRef}
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setEditingId(null); }}
                onClick={e => e.stopPropagation()}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  color: colors.text.bright, fontFamily: fonts.body,
                  fontSize: 13, fontWeight: 600, width: 120,
                }}
              />
            ) : (
              <span
                onDoubleClick={(e) => { e.stopPropagation(); startRename(id, profile.name); }}
                style={{
                  fontSize: 13, fontWeight: 600,
                  color: isActive ? colors.accent.tealLight : colors.text.secondary,
                }}
              >
                {profile.name}
              </span>
            )}
            {profileOrder.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); dispatch(deleteProfile(id)); }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: colors.text.muted, fontSize: 14, lineHeight: 1,
                  padding: "0 2px", borderRadius: 4,
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.target.style.color = colors.danger}
                onMouseLeave={e => e.target.style.color = colors.text.muted}
              >
                &times;
              </button>
            )}
          </div>
        );
      })}

      {/* Add profile button */}
      <div style={{ position: "relative" }} ref={pickerRef}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{
            width: 34, height: 34, borderRadius: 10,
            background: "transparent",
            border: `1px dashed ${colors.border.subtle}`,
            color: colors.text.muted, fontSize: 18, lineHeight: 1,
            cursor: "pointer", transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = colors.accent.teal; e.currentTarget.style.color = colors.accent.tealLight; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = colors.border.subtle; e.currentTarget.style.color = colors.text.muted; }}
        >
          +
        </button>

        {showPicker && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 10,
            background: colors.bg.secondary,
            border: `1px solid ${colors.border.subtle}`,
            borderRadius: 12, padding: 6,
            minWidth: 200,
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          }}>
            <div style={{ fontSize: 11, color: colors.text.muted, padding: "6px 10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Choose template
            </div>
            {PROFILE_TEMPLATES.map(t => (
              <button
                key={t.key}
                onClick={() => { dispatch(createProfile({ name: t.name, defaults: t.defaults })); setShowPicker(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "8px 10px", background: "transparent",
                  border: "none", borderRadius: 8, cursor: "pointer",
                  color: colors.text.primary, fontFamily: fonts.body,
                  fontSize: 13, transition: "background 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = colors.accent.tealBg}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
