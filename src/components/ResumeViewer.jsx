import React, { useState, useEffect } from 'react';
import LinkPromptDialog from './LinkPromptDialog';

const SECTIONS = [
  {
    id: 'experience',
    label: 'Experience',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      </svg>
    )
  },
  {
    id: 'education',
    label: 'Education',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
      </svg>
    )
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  },
  {
    id: 'awards',
    label: 'Awards',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    )
  }
];

const EXPERIENCE = [
  {
    role: 'Software Engineering Intern',
    company: 'Google',
    period: 'Jun 2024 – Sep 2024',
    location: 'Remote / Accra',
    points: [
      'Developed microservice for internal tooling serving 40k+ engineers',
      'Reduced API latency by 34% through caching and query optimization',
      'Contributed to open-source tooling under Apache 2.0 license'
    ]
  },
  {
    role: 'Backend Engineering Intern',
    company: 'Infosys',
    period: 'Jan 2024 – Apr 2024',
    location: 'Remote',
    points: [
      'Built REST APIs using Python FastAPI with automated testing pipeline',
      'Integrated AWS Lambda for serverless event-driven data processing',
      'Delivered a 60% improvement in database query throughput'
    ]
  },
  {
    role: 'Freelance Full-Stack Developer',
    company: 'Self-Employed',
    period: '2022 – Present',
    location: 'Accra, Ghana',
    points: [
      'Delivered 12+ production-grade web and mobile applications',
      'Clients spanning fintech, e-commerce, and education sectors',
      'Maintained 100% on-time delivery and 5-star client satisfaction'
    ]
  }
];

const EDUCATION = [
  {
    degree: 'B.Sc. Information Technology',
    institution: 'Ghana Communication Technology University (GCTU)',
    period: '2022 – 2026',
    detail: 'GPA: 3.8 / 4.0  |  Class of 2026  |  Dean\'s List every semester'
  },
  {
    degree: 'AWS Certified Solutions Architect – Associate',
    institution: 'Amazon Web Services',
    period: '2023',
    detail: 'Validation No: AWS-SAA-2023-JE | Cloud infrastructure design at scale'
  },
  {
    degree: 'Google Cloud Professional Developer',
    institution: 'Google Cloud',
    period: '2024',
    detail: 'Containerized application development, Cloud Run, GKE orchestration'
  },
  {
    degree: 'Certified Kubernetes Administrator (CKA)',
    institution: 'CNCF / Linux Foundation',
    period: '2024',
    detail: 'Cluster administration, workload scheduling, RBAC security'
  },
  {
    degree: 'Meta Frontend Developer Professional Certificate',
    institution: 'Meta / Coursera',
    period: '2023',
    detail: 'React.js, advanced JavaScript, accessibility, and UI architecture'
  }
];

const SKILLS_DATA = [
  { category: 'Frontend', skills: ['React.js', 'Next.js', 'TypeScript', 'CSS / Tailwind', 'Redux'] },
  { category: 'Backend', skills: ['Node.js', 'Python (FastAPI)', 'Go', 'GraphQL', 'WebSockets'] },
  { category: 'Cloud & DevOps', skills: ['AWS', 'Google Cloud', 'Kubernetes', 'Docker', 'Terraform'] },
  { category: 'Databases', skills: ['PostgreSQL', 'MongoDB', 'Redis', 'InfluxDB', 'DynamoDB'] },
  { category: 'AI / ML', skills: ['PyTorch', 'TensorFlow Lite', 'OpenCV', 'YOLOv8', 'Edge ML'] },
];

const SKILL_BARS = [
  { name: 'React / Next.js', level: 95 },
  { name: 'Node.js / Express', level: 90 },
  { name: 'Python / FastAPI', level: 85 },
  { name: 'AWS / GCP', level: 82 },
  { name: 'Kubernetes / Docker', level: 80 },
  { name: 'PostgreSQL / MongoDB', level: 88 },
  { name: 'TypeScript', level: 87 },
];

const AWARDS = [
  { title: 'Smart Ghana Hackathon Winner', year: '2024', org: 'Ghana Innovation Hub', detail: '1st place out of 200+ teams. Built AgriAI — crop disease detection for rural farmers.' },
  { title: 'HackMIT Finalist', year: '2023', org: 'MIT', detail: 'Top 20 out of 1,400 global participants. Presented EcoSense IoT monitoring platform.' },
  { title: 'Best Innovation Award', year: '2023', org: 'GCTU Tech Fest', detail: 'Recognized for AgriAI edge ML solution with Raspberry Pi and TensorFlow Lite.' },
  { title: "Dean's List — All Semesters", year: '2022–2026', org: 'GCTU', detail: 'Maintained GPA 3.8 across all academic terms. Consistent top 5% of cohort.' },
];

function SkillBar({ name, level, animate }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setWidth(level), 200);
      return () => clearTimeout(timer);
    }
  }, [animate, level]);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: '#1a1a2e' }}>{name}</span>
        <span style={{ color: '#0066cc', fontWeight: 'bold' }}>{level}%</span>
      </div>
      <div style={{ height: 10, background: '#d4d0c8', borderRadius: 2, overflow: 'hidden', border: '1px solid #aba899' }}>
        <div style={{
          height: '100%',
          width: `${width}%`,
          background: 'linear-gradient(90deg, #0066cc, #003f7f)',
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
          borderRadius: 2
        }} />
      </div>
    </div>
  );
}

export default function ResumeViewer() {
  const [activeSection, setActiveSection] = useState('experience');
  const [animateBars, setAnimateBars] = useState(false);
  const [dialogUrl, setDialogUrl] = useState(null);

  const handleOpenIE = (url) => {
    window.dispatchEvent(new CustomEvent('open-in-ie', { detail: { url } }));
  };

  useEffect(() => {
    if (activeSection === 'skills') {
      const t = setTimeout(() => setAnimateBars(true), 100);
      return () => clearTimeout(t);
    } else {
      setAnimateBars(false);
    }
  }, [activeSection]);

  return (
    <>
      {dialogUrl && (
        <LinkPromptDialog
          url={dialogUrl}
          onClose={() => setDialogUrl(null)}
          onOpenIE={handleOpenIE}
        />
      )}
      <div style={{
        display: 'flex',
        height: '100%',
        background: '#f0ece4',
        fontFamily: 'Tahoma, sans-serif',
        fontSize: 12,
        overflow: 'hidden'
      }}>
      {/* Left sidebar */}
      <div style={{
        width: 200,
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        padding: '20px 0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        {/* Avatar / Name */}
        <div style={{ textAlign: 'center', padding: '0 16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'linear-gradient(135deg, #0066cc, #00aaff)',
            margin: '0 auto 10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 'bold', color: '#fff',
            border: '3px solid rgba(255,255,255,0.25)'
          }}>JE</div>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>Justice Entsie</div>
          <div style={{ color: '#90b8d8', fontSize: 10, marginTop: 3 }}>Full-Stack Developer</div>
          <div style={{ color: '#90b8d8', fontSize: 10 }}>Accra, Ghana</div>
        </div>

        {/* Nav items */}
        <nav style={{ marginTop: 12 }}>
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '10px 16px',
                background: activeSection === s.id ? 'rgba(0,102,204,0.4)' : 'transparent',
                border: 'none',
                borderLeft: activeSection === s.id ? '3px solid #00aaff' : '3px solid transparent',
                color: activeSection === s.id ? '#fff' : '#90b8d8',
                cursor: 'pointer', fontSize: 12, textAlign: 'left',
                transition: 'all 0.15s'
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </nav>

        {/* Contact footer */}
        <div style={{ marginTop: 'auto', padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: 10, color: '#6a8eae' }}>
          <button onClick={() => setDialogUrl('mailto:Entise4561@gmail.com')} style={{ display: 'block', marginBottom: 4, color: '#6a8eae', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Tahoma, sans-serif', fontSize: 10, textAlign: 'left' }}>Entise4561@gmail.com</button>
          <button onClick={() => setDialogUrl('https://github.com/entsie')} style={{ display: 'block', marginBottom: 4, color: '#6a8eae', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Tahoma, sans-serif', fontSize: 10, textAlign: 'left' }}>github.com/entsie</button>
          <button onClick={() => setDialogUrl('https://linkedin.com/in/entsier')} style={{ display: 'block', color: '#6a8eae', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'Tahoma, sans-serif', fontSize: 10, textAlign: 'left' }}>linkedin.com/in/entsier</button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

        {/* Experience */}
        {activeSection === 'experience' && (
          <div>
            <h2 style={{ margin: '0 0 16px', color: '#1a1a2e', fontSize: 16, borderBottom: '2px solid #0066cc', paddingBottom: 6 }}>
              Work Experience
            </h2>
            {EXPERIENCE.map((exp, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #ccc', borderRadius: 3,
                padding: '12px 14px', marginBottom: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 13 }}>{exp.role}</div>
                    <div style={{ color: '#0066cc', fontSize: 12, marginTop: 1 }}>{exp.company}</div>
                  </div>
                  <div style={{ textAlign: 'right', color: '#666', fontSize: 11 }}>
                    <div>{exp.period}</div>
                    <div>{exp.location}</div>
                  </div>
                </div>
                <ul style={{ margin: '8px 0 0', paddingLeft: 16, color: '#444', lineHeight: 1.7 }}>
                  {exp.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeSection === 'education' && (
          <div>
            <h2 style={{ margin: '0 0 16px', color: '#1a1a2e', fontSize: 16, borderBottom: '2px solid #0066cc', paddingBottom: 6 }}>
              Education & Certifications
            </h2>
            {EDUCATION.map((edu, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #ccc', borderRadius: 3,
                padding: '12px 14px', marginBottom: 10,
                display: 'flex', gap: 12, alignItems: 'flex-start',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: i === 0 ? '#0066cc' : '#e8f0f8',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid #cce0f5'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? '#fff' : '#0066cc'} strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 12 }}>{edu.degree}</div>
                  <div style={{ color: '#0066cc', fontSize: 11, marginTop: 2 }}>{edu.institution} · {edu.period}</div>
                  <div style={{ color: '#555', fontSize: 11, marginTop: 3 }}>{edu.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <div>
            <h2 style={{ margin: '0 0 16px', color: '#1a1a2e', fontSize: 16, borderBottom: '2px solid #0066cc', paddingBottom: 6 }}>
              Technical Skills
            </h2>
            <div style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '14px 16px', marginBottom: 14 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 12, color: '#1a1a2e' }}>Proficiency</div>
              {SKILL_BARS.map((s, i) => <SkillBar key={i} {...s} animate={animateBars} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {SKILLS_DATA.map((cat, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #ccc', borderRadius: 3, padding: '10px 12px' }}>
                  <div style={{ fontWeight: 'bold', color: '#0066cc', marginBottom: 6, fontSize: 11 }}>{cat.category}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {cat.skills.map((sk, j) => (
                      <span key={j} style={{
                        background: '#e8f0f8', color: '#1a1a2e', padding: '2px 7px',
                        borderRadius: 2, fontSize: 10, border: '1px solid #c5d8ec'
                      }}>{sk}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards */}
        {activeSection === 'awards' && (
          <div>
            <h2 style={{ margin: '0 0 16px', color: '#1a1a2e', fontSize: 16, borderBottom: '2px solid #0066cc', paddingBottom: 6 }}>
              Awards & Recognition
            </h2>
            {AWARDS.map((aw, i) => (
              <div key={i} style={{
                background: '#fff', border: '1px solid #ccc', borderRadius: 3,
                padding: '12px 14px', marginBottom: 10,
                display: 'flex', gap: 12,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #f9a825, #f57f17)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: 12 }}>{aw.title}</div>
                  <div style={{ color: '#888', fontSize: 11, marginTop: 2 }}>{aw.org} · {aw.year}</div>
                  <div style={{ color: '#555', fontSize: 11, marginTop: 4 }}>{aw.detail}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </>
  );
}
