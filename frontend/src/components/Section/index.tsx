import clsx from 'clsx';
import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

const SectionWrapper: React.FC<Props> = (props) => {
  const { title, subtitle, className, children } = props;

  return (
    <section className={clsx('section-wrapper', className)}>
      <h3 className="section-wrapper__title">{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      <hr />
      <div className="section-wrapper__body">{children}</div>
    </section>
  );
};

export default SectionWrapper;
