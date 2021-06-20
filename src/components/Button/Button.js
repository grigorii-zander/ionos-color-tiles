import styles from './Button.module.css'

export const Button = ({ ...props }) => <button {...props} className={[styles.root, props.className].join(' ')} />
