import type {ReactNode} from 'react';
import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import * as THREE from 'three';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    const loadVanta = async () => {
      if (!vantaEffect && vantaRef.current) {
        try {
          const VANTA = await import('vanta/dist/vanta.net.min');
          const effect = VANTA.default({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0xffffff,
            backgroundColor: 0x1e88e5, // Blue for healthcare
            points: 10.0,
            maxDistance: 20.0,
            spacing: 16.0,
            showDots: true,
          });
          setVantaEffect(effect);
        } catch (error) {
          console.error('Failed to load Vanta effect:', error);
        }
      }
    };
    loadVanta();

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)} ref={vantaRef}>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <Heading as="h1" className="hero__title">
              {siteConfig.title}
            </Heading>
            <p className="hero__subtitle">{siteConfig.tagline}</p>
            <p className={styles.heroDescription}>
              A 3-day intensive training program for SIEHS healthcare leaders on AI,
              automation, and deployment strategies.
            </p>
            <div className={styles.buttons}>
              <Link
                className={clsx("button button--secondary button--lg", styles.startButton)}
                to="/docs/day1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.buttonIcon}
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Start Training
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.arrowIcon}
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className={styles.heroImage}>
            <svg
              viewBox="0 0 200 200"
              width="280"
              height="280"
              className={styles.siehsIcon}
            >
              {/* Healthcare AI Icon */}
              <circle cx="100" cy="100" r="90" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="2"/>
              {/* Cross symbol */}
              <rect x="85" y="50" width="30" height="100" rx="5" fill="white"/>
              <rect x="50" y="85" width="100" height="30" rx="5" fill="white"/>
              {/* AI nodes */}
              <circle cx="40" cy="40" r="10" fill="rgba(255,255,255,0.8)"/>
              <circle cx="160" cy="40" r="10" fill="rgba(255,255,255,0.8)"/>
              <circle cx="40" cy="160" r="10" fill="rgba(255,255,255,0.8)"/>
              <circle cx="160" cy="160" r="10" fill="rgba(255,255,255,0.8)"/>
              {/* Connection lines */}
              <line x1="50" y1="50" x2="85" y2="85" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
              <line x1="150" y1="50" x2="115" y2="85" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
              <line x1="50" y1="150" x2="85" y2="115" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
              <line x1="150" y1="150" x2="115" y2="115" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

interface DayInfo {
  day: number;
  title: string;
  description: string;
  topics: string[];
  deliverable: string;
  link: string;
  color: string;
}

function DayCard({day}: {day: DayInfo}): ReactNode {
  return (
    <div className="col col--4 margin-bottom--lg">
      <div className={clsx(styles.dayCard)} style={{borderTopColor: day.color}}>
        <div className={styles.dayNumber} style={{backgroundColor: day.color}}>
          Day {day.day}
        </div>
        <Heading as="h3">{day.title}</Heading>
        <p className={styles.dayDescription}>{day.description}</p>
        <ul className={styles.topicList}>
          {day.topics.map((topic, idx) => (
            <li key={idx}>{topic}</li>
          ))}
        </ul>
        <div className={styles.deliverable}>
          <strong>Deliverable:</strong> {day.deliverable}
        </div>
        <Link className="button button--primary button--sm" to={day.link}>
          View Day {day.day}
        </Link>
      </div>
    </div>
  );
}

function TrainingDays(): ReactNode {
  const days: DayInfo[] = [
    {
      day: 1,
      title: 'Prompt Engineering',
      description: 'Master the art of communicating with AI systems effectively.',
      topics: [
        'Understanding LLMs & Generative AI',
        'Zero-shot & Few-shot Prompting',
        'Chain of Thought Reasoning',
        'Role-based Prompting',
        'SIEHS Use Case Workshop'
      ],
      deliverable: 'Personal Prompt Library (5+ templates)',
      link: '/docs/day1',
      color: '#1e88e5', // Blue
    },
    {
      day: 2,
      title: 'n8n Workflow Automation',
      description: 'Build automated workflows without writing code.',
      topics: [
        'Introduction to No-Code Automation',
        'n8n Interface Mastery',
        'Google Sheets Integration',
        'Gmail Automation',
        'Error Handling & Monitoring'
      ],
      deliverable: 'Working Email Automation Workflow',
      link: '/docs/day2',
      color: '#43a047', // Green
    },
    {
      day: 3,
      title: 'AI Deployment & SDD',
      description: 'Deploy AI chatbots and learn strategic development.',
      topics: [
        'Auto Email Responder with AI',
        'OpenAI AgentKit Configuration',
        'ChatKit Widget Building',
        'Vercel Deployment',
        'Spec-Driven Development'
      ],
      deliverable: 'Live Deployed SIEHS Chatbot',
      link: '/docs/day3',
      color: '#e53935', // Red
    },
  ];

  return (
    <section className={styles.trainingDays}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          3-Day Training Program
        </Heading>
        <p className="text--center margin-bottom--xl">
          A progressive journey from AI fundamentals to deploying production-ready solutions
        </p>
        <div className="row">
          {days.map((day) => (
            <DayCard key={day.day} day={day} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Audience(): ReactNode {
  const audiences = [
    {
      title: 'Healthcare Leaders',
      icon: '🏥',
      description: 'Directors, managers, and supervisors responsible for healthcare delivery and operations.'
    },
    {
      title: 'Emergency Services',
      icon: '🚑',
      description: 'Emergency response coordinators and 1122 service managers seeking efficiency improvements.'
    },
    {
      title: 'IT & Digital Teams',
      icon: '💻',
      description: 'Technology leads looking to implement AI solutions across SIEHS departments.'
    },
    {
      title: 'Administrative Staff',
      icon: '📋',
      description: 'Operations and administrative personnel who want to automate routine tasks.'
    },
  ];

  return (
    <section className={styles.audience}>
      <div className="container">
        <Heading as="h2" className="text--center margin-bottom--lg">
          Who Is This Training For?
        </Heading>
        <div className="row">
          {audiences.map((item, idx) => (
            <div key={idx} className="col col--3 margin-bottom--lg">
              <div className={styles.audienceCard}>
                <div className={styles.audienceIcon}>{item.icon}</div>
                <Heading as="h4">{item.title}</Heading>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SIEHSContext(): ReactNode {
  return (
    <section className={styles.siehsContext}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <Heading as="h2">About SIEHS</Heading>
            <p>
              <strong>Sindh Integrated Emergency & Health Services (SIEHS)</strong> is Pakistan's
              leading emergency healthcare provider serving the Sindh province.
            </p>
            <ul>
              <li><strong>1122 Emergency:</strong> 24/7 emergency response services</li>
              <li><strong>Tele Tabeeb 1123:</strong> Telemedicine and remote healthcare</li>
              <li><strong>RDE Training:</strong> Rescue & disaster emergency training</li>
            </ul>
            <p>
              This training program equips SIEHS leaders with AI skills to improve
              emergency response times, patient communication, and operational efficiency.
            </p>
          </div>
          <div className="col col--6">
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>3</div>
                <div className={styles.statLabel}>Training Days</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>24</div>
                <div className={styles.statLabel}>Hours Total</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>15+</div>
                <div className={styles.statLabel}>Modules</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>5+</div>
                <div className={styles.statLabel}>Deliverables</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="SIEHS Agentic AI Training"
      description="3-day intensive training program for healthcare leaders on prompt engineering, n8n automation, and AI deployment">
      <HomepageHeader />
      <main>
        <SIEHSContext />
        <TrainingDays />
        <Audience />
      </main>
    </Layout>
  );
}
