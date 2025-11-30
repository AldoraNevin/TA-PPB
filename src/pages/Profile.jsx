import React, { useEffect, useState } from "react";
import supabase from "../services/supabaseClient";
import { getGuestId } from "../services/guestId";
import "../styles/profile.css";

export default function Profile() {
  const USER_ID = getGuestId();
  console.log("USER_ID =", USER_ID);

  const [profile, setProfile] = useState(null);
  const [builds, setBuilds] = useState([]);
  const [tierlists, setTierlists] = useState([]);
  const [editName, setEditName] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
    loadBuilds();
    loadTierlists();
  }, []);

  async function loadProfile() {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", USER_ID)
      .maybeSingle();

    if (!data) {
      await supabase.from("profiles").insert({
        id: USER_ID,
        username: "Guest Player",
        avatar_url: null,
      });
      return loadProfile();
    }

    setProfile(data);
    setEditName(data.username);
  }

  async function loadBuilds() {
    const { data } = await supabase
      .from("builder_saves")
      .select("*")
      .eq("guest_id", USER_ID)
      .order("created_at", { ascending: false });

    setBuilds(data || []);
  }

  async function loadTierlists() {
  console.log("LOAD TIERLISTS — Query for:", USER_ID);

  const { data, error } = await supabase
    .from("tierlists")
    .select("*")
    .eq("guest_id", USER_ID)
    .order("created_at", { ascending: false });

  console.log("TIERLIST RESULT:", data);
  console.log("TIERLIST ERROR:", error);

  setTierlists(data || []);
}

  async function uploadAvatar(file) {
    const ext = file.name.split(".").pop();
    const fileName = `avatar_${Date.now()}.${ext}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from("profile_assets")
      .upload(filePath, file, { upsert: true });

    if (error) return null;

    const { data: url } = supabase.storage
      .from("profile_assets")
      .getPublicUrl(filePath);

    return url.publicUrl;
  }

  async function saveChanges() {
    setSaving(true);
    let avatar_url = profile?.avatar_url;

    if (avatarFile) {
      const uploaded = await uploadAvatar(avatarFile);
      if (uploaded) avatar_url = uploaded;
    }

    await supabase
      .from("profiles")
      .update({ username: editName, avatar_url })
      .eq("id", USER_ID);

    setSaving(false);
    loadProfile();
    alert("Profile updated!");
  }

  async function postBuildToMeta(build) {
    const { error } = await supabase.from("metaread_posts").insert({
      title: build.name,
      type: "builder",
      guest_id: USER_ID,
      created_at: new Date().toISOString(),
      data: build.data,
      thumbnail: null
    });

    alert(error ? "Failed to post" : "Posted to MetaRead!");
  }

  async function postTierlistToMeta(tier) {
    const { error } = await supabase.from("metaread_posts").insert({
      title: tier.title,
      type: "tierlist",
      guest_id: USER_ID,
      created_at: new Date().toISOString(),
      data: tier.data,
      thumbnail: null
    });

    alert(error ? "Failed to post" : "Posted to MetaRead!");
  }

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header">
        <label className="avatar-upload">
          <img
            src={profile?.avatar_url || "/default-avatar.png"}
            alt="avatar"
            className="profile-avatar"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>

        <div>
          <input
            className="profile-edit-name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <p>Guest Profile</p>
        </div>

        <button className="save-btn" onClick={saveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {/* STATS */}
      <div className="profile-stats">
        <div className="stat-box">
          <div className="stat-number">{builds.length}</div>
          <div className="stat-label">Saved Builds</div>
        </div>

        <div className="stat-box">
          <div className="stat-number">{tierlists.length}</div>
          <div className="stat-label">Saved Tierlists</div>
        </div>
      </div>

      {/* BUILDS */}
      <h2 className="section-title">Your Builds</h2>
      <div className="build-list">
        {builds.map((b) => (
          <div key={b.id} className="build-card">
            <div className="build-name">{b.name}</div>
            <div className="build-date">
              {new Date(b.created_at).toLocaleString()}
            </div>

            <button
              className="build-view-btn"
              onClick={() => {
                localStorage.setItem("loadedBuild", JSON.stringify(b.data));
                window.location.href = "/builder";
              }}
            >
              Load Build
            </button>

            <button
              className="build-meta-btn"
              onClick={() => postBuildToMeta(b)}
            >
              Post to MetaRead
            </button>
          </div>
        ))}
      </div>

      {/* TIERLISTS */}
      <h2 className="section-title">Your Tierlists</h2>
      <div className="build-list">
        {tierlists.map((t) => (
          <div key={t.id} className="build-card">
            <div className="build-name">{t.title}</div>
            <div className="build-date">
              {new Date(t.created_at).toLocaleString()}
            </div>

            <button
              className="build-view-btn"
              onClick={() => {
                localStorage.setItem("loadedTierlist", JSON.stringify(t.data));
                window.location.href = "/tierlist-maker";
              }}
            >
              Load Tierlist
            </button>

            <button
              className="build-meta-btn"
              onClick={() => postTierlistToMeta(t)}
            >
              Post to MetaRead
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
