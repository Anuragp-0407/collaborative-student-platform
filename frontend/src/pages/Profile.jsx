import { useEffect, useState } from "react";

import {
  Award,
  ExternalLink,
  Check,
  GraduationCap,
  Plus,
  Save,
  UserRound,
  X,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";

import { getCurrentUser, updateProfile } from "../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);

  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUser();

        const currentUser = data.user;

        setUser(currentUser);

        setBio(currentUser?.bio || "");
        setCollege(currentUser?.college || "");
        setGithub(currentUser?.github || "");
        setLinkedin(currentUser?.linkedin || "");

        setSkills(currentUser?.skills || []);
        setInterests(currentUser?.interests || []);
      } catch (error) {
        console.error("Failed to load profile:", error.message);

        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      return;
    }

    const alreadyExists = skills.some(
      (item) => item.toLowerCase() === skill.toLowerCase(),
    );

    if (alreadyExists) {
      setSkillInput("");
      return;
    }

    setSkills([...skills, skill]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addInterest = () => {
    const interest = interestInput.trim();

    if (!interest) {
      return;
    }

    const alreadyExists = interests.some(
      (item) => item.toLowerCase() === interest.toLowerCase(),
    );

    if (alreadyExists) {
      setInterestInput("");
      return;
    }

    setInterests([...interests, interest]);
    setInterestInput("");
  };

  const removeInterest = (interestToRemove) => {
    setInterests(interests.filter((interest) => interest !== interestToRemove));
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  const handleInterestKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addInterest();
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const data = await updateProfile({
        bio,
        college,
        skills,
        interests,
        github,
        linkedin,
      });

      setUser(data.user);

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error.message);

      setError(
        error?.response?.data?.message || "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-[1100px]">
          <div className="h-52 animate-pulse rounded-3xl border border-white/[0.06] bg-white/[0.02]" />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="h-72 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />

            <div className="h-72 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1100px]">
        {/* Header */}
        <section className="animate-fade-up">
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-br from-violet-500/[0.08] via-white/[0.02] to-fuchsia-500/[0.04] p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Avatar */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/[0.08] text-2xl font-black text-violet-300 shadow-lg shadow-violet-950/20">
                {user?.name?.charAt(0)?.toUpperCase() || (
                  <UserRound size={28} />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                    {user?.name || "Student"}
                  </h1>

                  <span className="rounded-full border border-violet-400/15 bg-violet-500/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-300/70">
                    {user?.role || "student"}
                  </span>
                </div>

                <p className="mt-1 text-xs text-white/30">{user?.email}</p>

                {user?.college && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-white/35">
                    <GraduationCap size={13} />

                    {user.college}
                  </p>
                )}
              </div>

              <div className="sm:ml-auto">
                <div className="rounded-xl border border-emerald-400/10 bg-emerald-500/[0.05] px-5 py-3 text-center">
                  <p className="text-lg font-black text-emerald-300">
                    {user?.experiencePoints || 0}
                  </p>

                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25">
                    Experience Points
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Messages */}
        {error && (
          <div className="mt-5 rounded-xl border border-red-400/10 bg-red-500/[0.05] px-4 py-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-500/[0.05] px-4 py-3 text-xs text-emerald-300">
            <Check size={14} />

            {success}
          </div>
        )}

        <form onSubmit={handleSave} className="mt-6 space-y-6">
          {/* About + Education */}
          <section className="grid gap-6 lg:grid-cols-2">
            {/* About */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-400/60">
                  About
                </p>

                <h2 className="mt-1 text-lg font-bold">About You</h2>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-white/50">
                  Bio
                </span>

                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  placeholder="Tell other students a little about yourself..."
                  rows={6}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs leading-5 text-white/75 outline-none transition-all placeholder:text-white/20 focus:border-violet-400/25 focus:bg-violet-500/[0.025]"
                />

                <span className="mt-1.5 block text-right text-[9px] text-white/20">
                  {bio.length}/500
                </span>
              </label>
            </div>

            {/* Education */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
              <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-fuchsia-400/60">
                  Education
                </p>

                <h2 className="mt-1 text-lg font-bold">Academic Information</h2>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-white/50">
                  College / University
                </span>

                <div className="relative">
                  <GraduationCap
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                  />

                  <input
                    type="text"
                    value={college}
                    onChange={(event) => setCollege(event.target.value)}
                    placeholder="Enter your college or university"
                    className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] py-3 pl-11 pr-4 text-xs text-white/75 outline-none transition-all placeholder:text-white/20 focus:border-violet-400/25 focus:bg-violet-500/[0.025]"
                  />
                </div>
              </label>

              <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                  Account
                </p>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-xs text-white/35">Email</span>

                  <span className="truncate text-xs font-medium text-white/55">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-400/60">
                Skills
              </p>

              <h2 className="mt-1 text-lg font-bold">Technical Skills</h2>

              <p className="mt-1 text-xs text-white/25">
                Add technologies and skills you can contribute to projects.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={skillInput}
                onChange={(event) => setSkillInput(event.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="e.g. Java, React, MongoDB"
                className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/75 outline-none transition-all placeholder:text-white/20 focus:border-cyan-400/25 focus:bg-cyan-500/[0.025]"
              />

              <button
                type="button"
                onClick={addSkill}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/15 bg-cyan-500/[0.06] px-5 py-3 text-xs font-bold text-cyan-300 transition-all hover:border-cyan-400/25 hover:bg-cyan-500/[0.1]"
              >
                <Plus size={15} />
                Add Skill
              </button>
            </div>

            <div className="mt-5 flex min-h-12 flex-wrap gap-2">
              {skills.length > 0 ? (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="group flex items-center gap-2 rounded-lg border border-cyan-400/10 bg-cyan-500/[0.05] px-3 py-2 text-xs font-semibold text-cyan-300/80"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="cursor-pointer text-cyan-300/30 transition-colors hover:text-red-300"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="py-2 text-xs text-white/20">
                  No skills added yet.
                </p>
              )}
            </div>
          </section>

          {/* Interests */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-fuchsia-400/60">
                Interests
              </p>

              <h2 className="mt-1 text-lg font-bold">Areas of Interest</h2>

              <p className="mt-1 text-xs text-white/25">
                Add areas you'd like to explore or build projects around.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={interestInput}
                onChange={(event) => setInterestInput(event.target.value)}
                onKeyDown={handleInterestKeyDown}
                placeholder="e.g. AI, Web Development, Cybersecurity"
                className="flex-1 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/75 outline-none transition-all placeholder:text-white/20 focus:border-fuchsia-400/25 focus:bg-fuchsia-500/[0.025]"
              />

              <button
                type="button"
                onClick={addInterest}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-fuchsia-400/15 bg-fuchsia-500/[0.06] px-5 py-3 text-xs font-bold text-fuchsia-300 transition-all hover:border-fuchsia-400/25 hover:bg-fuchsia-500/[0.1]"
              >
                <Plus size={15} />
                Add Interest
              </button>
            </div>

            <div className="mt-5 flex min-h-12 flex-wrap gap-2">
              {interests.length > 0 ? (
                interests.map((interest) => (
                  <span
                    key={interest}
                    className="group flex items-center gap-2 rounded-lg border border-fuchsia-400/10 bg-fuchsia-500/[0.05] px-3 py-2 text-xs font-semibold text-fuchsia-300/80"
                  >
                    {interest}

                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="cursor-pointer text-fuchsia-300/30 transition-colors hover:text-red-300"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))
              ) : (
                <p className="py-2 text-xs text-white/20">
                  No interests added yet.
                </p>
              )}
            </div>
          </section>

          {/* Social Links */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="mb-5">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-violet-400/60">
                Connect
              </p>

              <h2 className="mt-1 text-lg font-bold">Social Profiles</h2>

              <p className="mt-1 text-xs text-white/25">
                Add your professional profiles so teammates can learn more about
                you.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/50">
                  <ExternalLink size={14} />
                  GitHub
                </span>

                <input
                  type="url"
                  value={github}
                  onChange={(event) => setGithub(event.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/75 outline-none transition-all placeholder:text-white/20 focus:border-violet-400/25 focus:bg-violet-500/[0.025]"
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/50">
                  <ExternalLink size={14} />
                  LinkedIn
                </span>

                <input
                  type="url"
                  value={linkedin}
                  onChange={(event) => setLinkedin(event.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs text-white/75 outline-none transition-all placeholder:text-white/20 focus:border-violet-400/25 focus:bg-violet-500/[0.025]"
                />
              </label>
            </div>
          </section>

          {/* Achievements */}
          <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-400/10 bg-amber-500/[0.05]">
                <Award size={18} className="text-amber-300/70" />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-amber-400/60">
                  Achievements
                </p>

                <h2 className="mt-1 text-lg font-bold">Your Achievements</h2>
              </div>
            </div>

            {user?.achievements?.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {user.achievements.map((achievement) => (
                  <span
                    key={achievement}
                    className="rounded-lg border border-amber-400/10 bg-amber-500/[0.05] px-3 py-2 text-xs font-semibold text-amber-300/70"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.015] px-4 py-5 text-center">
                <p className="text-xs text-white/25">No achievements yet.</p>

                <p className="mt-1 text-[10px] text-white/15">
                  Achievements and milestones will appear here as you
                  participate in projects.
                </p>
              </div>
            )}
          </section>

          {/* Save */}
          <div className="sticky bottom-4 z-20 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-violet-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
