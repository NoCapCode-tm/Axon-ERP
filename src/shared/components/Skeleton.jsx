import styles from '../CSS/Skeleton.module.css';

export default function Skeleton({ width, height, variant = 'rectangular', style }) {
  const classNames = [
    styles.skeleton,
    variant === 'circular' ? styles.circular : '',
    variant === 'rounded' ? styles.rounded : '',
  ].join(' ');

  return (
    <div
      className={classNames}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}