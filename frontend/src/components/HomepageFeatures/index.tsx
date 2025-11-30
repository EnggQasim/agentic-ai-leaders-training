import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({id: 'homepage.feature1.title', message: 'Industry-Standard Tools'}),
    icon: '/img/icons/industry-tools-icon.svg',
    description: (
      <Translate id="homepage.feature1.description">
        Learn ROS2, the foundation of modern robotics used by companies worldwide.
        Build real robot applications with battle-tested frameworks.
      </Translate>
    ),
  },
  {
    title: translate({id: 'homepage.feature2.title', message: 'GPU-Accelerated Simulation'}),
    icon: '/img/icons/gpu-simulation-icon.svg',
    description: (
      <Translate id="homepage.feature2.description">
        Master NVIDIA Isaac Sim for photorealistic simulation, synthetic data
        generation, and seamless sim-to-real transfer.
      </Translate>
    ),
  },
  {
    title: translate({id: 'homepage.feature3.title', message: 'Cutting-Edge AI'}),
    icon: '/img/icons/cutting-edge-ai-icon.svg',
    description: (
      <Translate id="homepage.feature3.description">
        Implement Vision-Language-Action models to control robots with natural
        language commands and multimodal understanding.
      </Translate>
    ),
  },
];

function Feature({title, icon, description}: FeatureItem) {
  const iconUrl = useBaseUrl(icon);
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>
          <img src={iconUrl} alt={title} width="64" height="64" />
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
