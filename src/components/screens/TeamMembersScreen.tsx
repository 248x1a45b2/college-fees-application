import React, { useState } from 'react';
import { useCollegeFees } from '../../context/CollegeFeesContext';
import { TopAppBar, BottomNavBar } from '../common/AppNavigation';
import { 
  Users, 
  UserCheck, 
  Award, 
  GraduationCap, 
  Mail, 
  Phone, 
  Github, 
  Linkedin, 
  Plus, 
  Edit3, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { TeamMember } from '../../types';

export const TeamMembersScreen: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, collegeInfo, goBack } = useCollegeFees();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [role, setRole] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState(3);
  const [section, setSection] = useState('A');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contributionsText, setContributionsText] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [isGuide, setIsGuide] = useState(false);
  const [designation, setDesignation] = useState('');

  const openAddModal = () => {
    setEditingMember(null);
    setName('');
    setRollNumber('');
    setRole('Mobile Developer');
    setBranch('Computer Science & Engineering');
    setYear(3);
    setSection('A');
    setEmail('');
    setPhone('');
    setContributionsText('Frontend UI Components\nTesting & Documentation');
    setGithub('');
    setLinkedin('');
    setIsGuide(false);
    setDesignation('');
    setIsModalOpen(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRollNumber(member.rollNumber);
    setRole(member.role);
    setBranch(member.branch);
    setYear(member.year);
    setSection(member.section);
    setEmail(member.email);
    setPhone(member.phone || '');
    setContributionsText(member.contributions.join('\n'));
    setGithub(member.github || '');
    setLinkedin(member.linkedin || '');
    setIsGuide(!!member.isGuide);
    setDesignation(member.designation || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) return;

    const contributions = contributionsText
      .split('\n')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (editingMember) {
      updateTeamMember(editingMember.id, {
        name,
        rollNumber: rollNumber.toUpperCase(),
        role,
        branch,
        year: Number(year),
        section,
        email,
        phone,
        contributions,
        github,
        linkedin,
        isGuide,
        designation: isGuide ? designation : undefined
      });
    } else {
      addTeamMember({
        name,
        rollNumber: rollNumber.toUpperCase(),
        role,
        branch,
        year: Number(year),
        section,
        email,
        phone,
        contributions: contributions.length > 0 ? contributions : ['Feature Engineering & Verification'],
        github,
        linkedin,
        isGuide,
        designation: isGuide ? designation : undefined
      });
    }

    setIsModalOpen(false);
  };

  const guides = teamMembers.filter((m) => m.isGuide);
  const students = teamMembers.filter((m) => !m.isGuide);

  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <TopAppBar
        title="Project Development Team"
        subtitle={collegeInfo.name}
        showBack
        onBack={goBack}
        rightAction={
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 rounded-lg text-white hover:bg-white/10"
              title="Print Team Credits"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={openAddModal}
              className="p-1.5 rounded-lg text-white hover:bg-white/10"
              title="Add Team Member"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-6">
        {/* Project Header Banner */}
        <div className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span>Department of Computer Science & Engineering</span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              {collegeInfo.name} (KHIT)
            </h2>
            <p className="text-xs text-blue-100/90 mt-1 max-w-xl">
              Major Project: <strong>College Fees Management System (College Fees Manager)</strong>
            </p>

            <div className="mt-4 pt-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-4 text-blue-100">
                <span>Academic Session: <strong>2026-2027</strong></span>
                <span>Affiliation: <strong>JNTUK & AICTE</strong></span>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="px-3 py-1.5 rounded-lg bg-white text-blue-900 font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-blue-50 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>
          </div>
        </div>

        {/* Project Mentors / Faculty Guides */}
        {guides.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Project Guide & Institutional Mentor
              </h3>
            </div>

            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-amber-200 dark:border-amber-900/50 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 font-bold text-base flex items-center justify-center shrink-0 border border-amber-300/50">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {guide.name}
                      </h4>
                      <span className="text-[10px] font-semibold bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">
                        Faculty Guide
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                      {guide.designation || guide.role}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {guide.branch} · {guide.email}
                    </p>

                    <div className="mt-2 space-y-1">
                      {guide.contributions.map((c, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                          <CheckCircle2 className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => openEditModal(guide)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400"
                    title="Edit Guide Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Student Developers Team */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Student Engineers & Contributors ({students.length})
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">B.Tech Major Project</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {students.map((member) => (
              <div
                key={member.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div>
                  {/* Top Row: Avatar & Identity */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                          {member.name}
                        </h4>
                        <span className="font-mono font-semibold text-[11px] text-blue-600 dark:text-blue-400 block">
                          {member.rollNumber}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Edit member"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      {students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => deleteTeamMember(member.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Role Title */}
                  <div className="mb-2.5">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold text-[10px] border border-blue-200/60 dark:border-blue-800/60">
                      {member.role}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {member.branch} · Year {member.year} (Sec {member.section})
                    </p>
                  </div>

                  {/* Key Contributions */}
                  <div className="space-y-1 mb-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Core Contributions:
                    </span>
                    {member.contributions.map((c, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Socials Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2 truncate max-w-[200px]">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate text-[11px]">{member.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        title="GitHub Profile"
                      >
                        <Github className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-blue-600"
                        title="LinkedIn Profile"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Acknowledgement Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Project Declaration & Institutional Credit</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
            This project, titled <strong>&ldquo;College Fees Management System&rdquo;</strong>, was engineered by the undergraduate students of the <strong>Department of Computer Science & Engineering</strong> at <strong>Kallam Haranadha Reddy Institute of Technology (KHIT), Guntur</strong> under the mentorship of the faculty guide. All digital payment integrations, electronic receipts, database structures, and Flutter/Dart Android source implementations are authentically verified for academic and practical institutional deployment.
          </p>
        </div>
      </div>

      <BottomNavBar />

      {/* Add / Edit Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingMember ? 'Edit Team Member' : 'Add Project Team Member'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3 overflow-y-auto text-xs">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="guideCheckbox"
                  checked={isGuide}
                  onChange={(e) => setIsGuide(e.target.checked)}
                  className="rounded-xs text-blue-600"
                />
                <label htmlFor="guideCheckbox" className="text-xs font-semibold text-blue-900 dark:text-blue-200 cursor-pointer">
                  Is Faculty Mentor / Project Guide?
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Indla"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Roll Number / ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. 24CS089"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Team Lead / Flutter Developer"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              {isGuide && (
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Faculty Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Professor & HOD (CSE), KHIT"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Branch / Dept
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Mechanical Engineering">Mechanical</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">Civil</option>
                    <option value="Artificial Intelligence & DS">AI & DS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Year & Section
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    >
                      <option value={1}>1st Yr</option>
                      <option value={2}>2nd Yr</option>
                      <option value={3}>3rd Yr</option>
                      <option value={4}>4th Yr</option>
                    </select>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    >
                      <option value="A">Sec A</option>
                      <option value="B">Sec B</option>
                      <option value="C">Sec C</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@khitguntur.ac.in"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98..."
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Key Project Contributions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={contributionsText}
                  onChange={(e) => setContributionsText(e.target.value)}
                  placeholder="Flutter UI Components&#10;Payment Gateway Handshake&#10;Digital Receipt PDF"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingMember ? 'Save Changes' : 'Add Team Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
