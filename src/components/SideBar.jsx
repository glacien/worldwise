import Logo from './Logo';
import AppNav from './AppNav';
import styles from './SideBar.module.css';
import { Outlet } from 'react-router-dom';

function SideBar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          {' '}
          &copy; Copyright by{' '}
          <a
            className={styles.link}
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/jonasschmedtman"
          >
            Jonas Schmedtmann
          </a>
          . Use for learning or your portfolio. Don't use to teach. Don't claim
          as your own.{' '}
        </p>
      </footer>
    </div>
  );
}

export default SideBar;
