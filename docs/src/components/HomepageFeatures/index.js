import clsx from "clsx";
import Heading from "@theme/Heading";
import {
  CodeBracketIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: "Streamlined Soroban Development",
    Icon: CodeBracketIcon,
    description: (
      <>
        Sora simplifies Soroban smart contract development with an intuitive
        interface, making it easier to create, deploy, and manage your projects.
      </>
    ),
  },
  {
    title: "AI-Powered Assistance",
    Icon: CpuChipIcon,
    description: (
      <>
        Leverage AI for command generation and get instant help with development
        questions. Sora's AI features accelerate your Soroban learning curve.
      </>
    ),
  },
  {
    title: "Comprehensive Toolkit",
    Icon: WrenchScrewdriverIcon,
    description: (
      <>
        From project management to identity handling and contract interactions,
        Sora provides all the tools you need in one unified platform.
      </>
    ),
  },
];

function Feature({ Icon, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Icon className={styles.featureIcon} aria-hidden="true" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
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
